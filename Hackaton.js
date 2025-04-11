document.addEventListener('DOMContentLoaded', () => {
    // ==========================================
    // GESTION DU MENU DÉROULANT
    // ==========================================
    const menuBtn = document.querySelector('.menu-btn');
    const menuDropdown = document.querySelector('.menu-dropdown');
    
    // Afficher/Masquer le menu au clic sur le bouton
    menuBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // Empêche la fermeture immédiate si on clique sur le bouton
        menuDropdown.classList.toggle('active');
    });

    // Fermer le menu si on clique en dehors
    document.addEventListener('click', (e) => {
        if (!menuDropdown.contains(e.target) && !menuBtn.contains(e.target)) {
            if (menuDropdown.classList.contains('active')) {
                menuDropdown.classList.remove('active');
            }
        }
    });

    // Gestion du défilement fluide vers les sections lors du clic sur un item du menu
    document.querySelectorAll('.menu-item').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault(); // Empêche le comportement par défaut du lien
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                menuDropdown.classList.remove('active'); // Ferme le menu
                // Défilement fluide vers la section cible
                targetSection.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // ==========================================
    // ANIMATIONS AU SCROLL (Intersection Observer)
    // ==========================================
    const observerOptions = {
        root: null, // Observe par rapport au viewport
        rootMargin: '0px',
        threshold: 0 // Se déclenche dès qu'un pixel est visible
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            // Si l'élément entre dans le viewport, ajoute la classe 'visible' pour l'animation
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Arrête d'observer cet élément une fois qu'il est visible
            }
        });
    }, observerOptions);

    // Observer tous les éléments avec les classes d'animation
    document.querySelectorAll('.fade-in-up, .fade-in-down').forEach(element => {
        observer.observe(element);
    });

    // ==========================================
    // GESTION DU BOUTON "VOIR PLUS" DANS L'ARTICLE
    // ==========================================
    const expandButton = document.querySelector('.expand-button');
    const hiddenContent = document.querySelector('.hidden-content');

    if (expandButton && hiddenContent) {
        expandButton.addEventListener('click', () => {
            // Basculer les classes pour l'animation et l'état
            expandButton.classList.toggle('expanded');
            hiddenContent.classList.toggle('expanded');
            
            // Mettre à jour le texte du bouton
            const expandText = expandButton.querySelector('.expand-text');
            expandText.textContent = hiddenContent.classList.contains('expanded') ? 'Voir moins' : 'Voir plus';
        });
    }

    // ==========================================
    // GESTION DU QUIZ DE RISQUE
    // ==========================================
    let currentQuestionIndex = 0;
    let totalRiskScore = 0;
    let maxPossibleScore = 0;
    let userSpecificAdvice = []; // Tableau pour stocker les conseils spécifiques
    
    // Éléments du DOM (Quiz)
    const questionText = document.getElementById("question-text");
    const choicesContainer = document.getElementById("choices");
    const questionImage = document.getElementById("question-image");
    
    // Éléments du DOM (Résultat Initial)
    const resultSection = document.querySelector('.result-section');
    const resultText = document.getElementById("result");
    const adviceText = document.getElementById("advice");
    const riskValueSpan = document.getElementById('risk-value');
    const kidneyImageResult = document.getElementById("kidney-image"); // Image dans le résultat initial
    const showDetailsBtn = document.getElementById("show-details-btn");

    // Éléments du DOM (Modale Détails)
    const modal = document.getElementById("result-details-modal");
    const modalOverlay = modal.querySelector('.modal-overlay');
    const modalContent = modal.querySelector('.modal-content');
    const closeModalBtn = document.getElementById("close-modal-btn");
    const modalKidneyImage = document.getElementById("modal-kidney-image");
    const modalResultValue = document.getElementById("modal-result-value");
    const detailedAdviceList = document.getElementById("detailed-advice-list");

    // Préchargement des images
    const preloadImages = () => {
        quizQuestions.forEach(question => {
            const img = new Image();
            img.src = question.image;
        });
    };
    preloadImages();

    // Calculer le score maximum possible
    quizQuestions.forEach(question => { maxPossibleScore += 3 * question.weight; });

    /**
     * Charge et affiche la question actuelle.
     */
    function loadQuestion() {
        // Gérer l'affichage des sections
        document.querySelectorAll('.result-element').forEach(el => el.style.display = 'none');
        document.querySelectorAll('.quiz-element').forEach(el => el.style.display = 'block');

        if (currentQuestionIndex < quizQuestions.length) {
            const currentQuestion = quizQuestions[currentQuestionIndex];
            
            // Mise à jour UI
            questionText.textContent = currentQuestion.question;
            questionImage.src = currentQuestion.image;
            questionImage.alt = `Illustration: ${currentQuestion.question}`;
            choicesContainer.innerHTML = "";

            // Créer les boutons de choix
            currentQuestion.choices.forEach((choice) => {
                const button = document.createElement("button");
                button.textContent = choice.text;
                button.classList.add("choice-btn");
                button.onclick = () => {
                    // Désactiver les boutons
                    choicesContainer.querySelectorAll('.choice-btn').forEach(btn => {
                        btn.disabled = true;
                        btn.style.cursor = 'not-allowed';
                    });

                    // Calcul du score
                    totalRiskScore += choice.score * currentQuestion.weight;

                    // ===> STOCKER LE CONSEIL SPECIFIQUE <===
                    let adviceLevel = 'low'; // Niveau de conseil basé sur le score du *choix*
                    if (choice.score === 2) adviceLevel = 'medium';
                    if (choice.score === 3) adviceLevel = 'high';
                    // Ajoute l'objet conseil avec la question et le texte du conseil correspondant au score
                    userSpecificAdvice.push({
                        question: currentQuestion.question,
                        advice: currentQuestion.advice[adviceLevel]
                    });
                    
                    // Mettre en évidence la sélection
                    button.classList.add('selected');
                    
                    // Question suivante
                    setTimeout(() => {
                        currentQuestionIndex++;
                        loadQuestion();
                    }, 1000);
                };
                choicesContainer.appendChild(button);
            });
        } else {
            showResult();
        }
    }

    /**
     * Détermine le niveau de risque et met à jour l'image du rein.
     * @param {number} riskPercentage
     * @returns {string} Niveau de risque textuel
     */
    function getRiskLevel(riskPercentage) {
        let riskLevel = 'très élevé';
        let kidneyImageSrc = "Ressources/dead_kidney.png";

        if (riskPercentage < 25) {
            riskLevel = "faible";
            kidneyImageSrc = "Ressources/happy_kidney.png";
        } else if (riskPercentage < 50) {
            riskLevel = "modéré";
            kidneyImageSrc = "Ressources/hmm_kidney.png";
        } else if (riskPercentage < 75) {
            riskLevel = "élevé";
            kidneyImageSrc = "Ressources/hurt_kidney.png";
        }
        // Met à jour l'image dans le résultat ET dans la modale
        kidneyImageResult.src = kidneyImageSrc;
        modalKidneyImage.src = kidneyImageSrc;
        return riskLevel;
    }

    /**
     * Affiche le résultat initial (résumé).
     */
    function showResult() {
        // Gérer l'affichage des sections
        document.querySelectorAll('.quiz-element').forEach(el => el.style.display = 'none');
        document.querySelectorAll('.result-element').forEach(el => el.style.display = 'block');

        const riskPercentage = (totalRiskScore / maxPossibleScore) * 100;
        const riskLevel = getRiskLevel(riskPercentage);
        
        // Afficher valeur + couleur
        riskValueSpan.textContent = `${Math.round(riskPercentage)}% (${riskLevel})`;
        riskValueSpan.className = ''; // Reset classes
        if (riskPercentage < 25) riskValueSpan.classList.add('risk-low');
        else if (riskPercentage < 50) riskValueSpan.classList.add('risk-moderate');
        else if (riskPercentage < 75) riskValueSpan.classList.add('risk-high');
        else riskValueSpan.classList.add('risk-very-high');

        // Afficher conseil général
        let generalAdvice = "";
        if (riskPercentage < 25) {
            generalAdvice = "Votre risque est faible. Continuez à prendre soin de votre santé rénale avec une bonne hygiène de vie.";
        } else if (riskPercentage < 50) {
            generalAdvice = "Votre risque est modéré. Il serait bénéfique d'adopter de meilleures habitudes de vie et de consulter régulièrement votre médecin.";
        } else if (riskPercentage < 75) {
            generalAdvice = "Votre risque est élevé. Il est important de consulter un médecin et d'adopter des mesures préventives pour protéger vos reins.";
        } else {
            generalAdvice = "Votre risque est très élevé. Une consultation médicale est fortement recommandée pour évaluer votre santé rénale.";
        }
        adviceText.textContent = generalAdvice;
    }

    /**
     * Ouvre la modale et affiche les détails.
     */
    function openModal() {
        // Copier le résultat dans la modale
        modalResultValue.textContent = riskValueSpan.textContent; // Copie texte ET couleur implicitement via classe
        modalResultValue.className = riskValueSpan.className; // Assure la copie de la classe de couleur

        // Générer la liste des conseils détaillés
        let detailedHTML = '<h5>Conseils personnalisés basés sur vos réponses :</h5><ul>';
        userSpecificAdvice.forEach(item => {
            detailedHTML += `<li><strong>${item.question}:</strong> ${item.advice}</li>`;
        });
        detailedHTML += '</ul>';
        detailedAdviceList.innerHTML = detailedHTML;

        // Afficher la modale
        modal.style.display = 'flex'; // Utiliser flex pour le centrage
    }

    /**
     * Ferme la modale.
     */
    function closeModal() {
        modal.style.display = 'none';
    }

    // Écouteurs d'événements pour la modale
    showDetailsBtn.addEventListener('click', (e) => {
        e.preventDefault(); // Empêche le lien de suivre #
        openModal();
    });
    closeModalBtn.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', closeModal); // Ferme en cliquant sur l'overlay

    // ==========================================
    // GESTION DU FORMULAIRE DE COMMENTAIRE (Footer)
    // ==========================================
    const commentForm = document.querySelector('.comment-form');
    const commentTextarea = document.getElementById('comment-text');

    if (commentForm && commentTextarea) {
        commentForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Empêche la soumission standard du formulaire

            const recipientEmail = 'contact@nephrocare.com';
            const subject = 'Nouveau commentaire - Site Nephrocare';
            const body = commentTextarea.value; // Récupère le texte du commentaire

            // Vérifie si le commentaire n'est pas vide
            if (body.trim() === '') {
                alert('Veuillez écrire votre commentaire avant d\'envoyer.');
                return; // Arrête l'exécution si le commentaire est vide
            }

            // Construit le lien mailto:
            // encodeURIComponent est important pour gérer les caractères spéciaux dans l'URL
            const mailtoLink = `mailto:${recipientEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

            // Ouvre le client mail par défaut de l'utilisateur
            window.location.href = mailtoLink;

            // Optionnel : Vider le textarea après tentative d'envoi
            // commentTextarea.value = ''; 
            
            // Optionnel : Afficher une confirmation (note: l'email n'est pas encore envoyé)
            // alert('Votre application e-mail va s\'ouvrir pour envoyer votre commentaire.');
        });
    }

    // Charger la première question
    loadQuestion();
});
