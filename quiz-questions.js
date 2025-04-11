/**
 * Tableau d'objets contenant les questions pour le quiz de risque rénal.
 * Chaque objet représente une question et contient :
 * - question {string}: Le texte de la question.
 * - image {string}: Le chemin vers l'image illustrative de la question.
 * - choices {Array<Object>}: Un tableau d'objets pour les choix de réponse.
 *      Chaque choix contient :
 *          - text {string}: Le texte de l'option de réponse.
 *          - score {number}: Le score associé à ce choix (0-3).
 * - weight {number}: Le facteur de pondération pour cette question (indique son importance).
 * - advice {Object}: Des conseils spécifiques à cette question selon le niveau de risque final.
 *      Contient les clés 'low', 'medium', 'high'.
 */
const quizQuestions = [
    {
        question: "Quel est votre âge ?",
        image: "Ressources/1_age.png",
        choices: [
            { text: "Moins de 30 ans", score: 0 },
            { text: "30-45 ans", score: 1 },
            { text: "46-60 ans", score: 2 },
            { text: "Plus de 60 ans", score: 3 }
        ],
        weight: 1.5,
        advice: {
            low: "Même jeune, il est important de prendre soin de ses reins.",
            medium: "L'âge augmente les risques, une surveillance régulière est conseillée.",
            high: "À votre âge, un suivi médical régulier est essentiel."
        }
    },
    {
        question: "Avez-vous du diabète ?",
        image: "Ressources/2_Diabete.png",
        choices: [
            { text: "Non", score: 0 },
            { text: "Pré-diabète", score: 1 },
            { text: "Diabète contrôlé", score: 2 },
            { text: "Diabète mal contrôlé", score: 3 }
        ],
        weight: 2.0,
        advice: {
            low: "Continuez à surveiller votre glycémie régulièrement.",
            medium: "Un suivi régulier de votre diabète est important pour vos reins.",
            high: "Le contrôle du diabète est crucial pour protéger vos reins."
        }
    },
    {
        question: "Quelle est votre tension artérielle habituelle ?",
        image: "Ressources/3_AT.png",
        choices: [
            { text: "Normale (inf. à 120/80)", score: 0 },
            { text: "Légèrement élevée (120-139 / 80-89)", score: 1 },
            { text: "Hypertension modérée (140-159 / 90-99)", score: 2 },
            { text: "Hypertension sévère (sup. à 160/100)", score: 3 }
        ],
        weight: 2.0,
        advice: {
            low: "Maintenez une tension artérielle saine avec une bonne hygiène de vie.",
            medium: "Surveillez régulièrement votre tension et consultez si nécessaire.",
            high: "Un suivi médical régulier de votre tension est indispensable."
        }
    },
    {
        question: "Avez-vous des antécédents familiaux de maladie rénale ?",
        image: "Ressources/4_AF.png",
        choices: [
            { text: "Aucun", score: 0 },
            { text: "Parents éloignés (oncles, tantes, cousins...)", score: 1 },
            { text: "Un parent proche (père, mère, frère, sœur)", score: 2 },
            { text: "Plusieurs parents proches", score: 3 }
        ],
        weight: 1.8,
        advice: {
            low: "Restez vigilant malgré l'absence d'antécédents.",
            medium: "Un dépistage régulier est recommandé vu vos antécédents.",
            high: "Un suivi préventif renforcé est nécessaire."
        }
    },
    {
        question: "Quelle est votre consommation quotidienne en eau ?",
        image: "Ressources/5_eau.png",
        choices: [
            { text: "Plus de 1.5L par jour", score: 0 },
            { text: "Entre 1L et 1.5L par jour", score: 1 },
            { text: "Entre 500ml et 1L par jour", score: 2 },
            { text: "Moins de 500ml par jour", score: 3 }
        ],
        weight: 1.2,
        advice: {
            low: "Continuez à bien vous hydrater quotidiennement.",
            medium: "Essayez d'augmenter progressivement votre consommation d'eau.",
            high: "Une meilleure hydratation est essentielle pour vos reins, augmentez votre apport."
        }
    },
    {
        question: "Quelle est votre consommation de sel ?",
        image: "Ressources/7_sel.png",
        choices: [
            { text: "Très faible (vous ne salez presque jamais)", score: 0 },
            { text: "Modérée (vous salez raisonnablement)", score: 1 },
            { text: "Assez élevée (vous aimez les plats bien salés)", score: 2 },
            { text: "Très élevée (vous resalez souvent vos plats)", score: 3 }
        ],
        weight: 1.5,
        advice: {
            low: "Maintenez cette bonne habitude alimentaire.",
            medium: "Réduisez progressivement votre consommation de sel, évitez les plats préparés.",
            high: "Limitez fortement votre consommation de sel et les aliments transformés."
        }
    },
    {
        question: "Pratiquez-vous une activité physique régulière ?",
        image: "Ressources/8_Sport.png",
        choices: [
            { text: "Intensive (plus de 3h par semaine)", score: 0 },
            { text: "Modérée (1-3h par semaine)", score: 1 },
            { text: "Faible (moins d'1h par semaine)", score: 2 },
            { text: "Aucune", score: 3 }
        ],
        weight: 1.2,
        advice: {
            low: "Continuez votre activité physique régulière, c'est excellent !",
            medium: "Essayez d'augmenter un peu votre activité physique chaque semaine.",
            high: "Commencez une activité physique douce et adaptée, même 30 min par jour aident."
        }
    },
    {
        question: "Avez-vous déjà eu des problèmes rénaux connus ?",
        image: "Ressources/9_prc.png",
        choices: [
            { text: "Jamais", score: 0 },
            { text: "Infections urinaires fréquentes", score: 1 },
            { text: "Calculs rénaux", score: 2 },
            { text: "Maladie rénale chronique diagnostiquée", score: 3 }
        ],
        weight: 1.8,
        advice: {
            low: "Continuez à surveiller votre santé rénale lors de vos bilans.",
            medium: "Un suivi médical régulier est recommandé.",
            high: "Un suivi néphrologique spécialisé est indispensable."
        }
    },
    {
        question: "Quel est votre indice de masse corporelle (IMC) ?",
        image: "Ressources/10_IMC.png",
        choices: [
            { text: "Normal (18.5 - 24.9)", score: 0 },
            { text: "Surpoids (25 - 29.9)", score: 1 },
            { text: "Obésité modérée (30 - 34.9)", score: 2 },
            { text: "Obésité sévère ou morbide (≥ 35)", score: 3 }
        ],
        weight: 1.3,
        advice: {
            low: "Maintenez un poids santé grâce à une alimentation équilibrée et de l'exercice.",
            medium: "Une perte de poids progressive serait bénéfique pour votre santé globale.",
            high: "Une perte de poids encadrée par un professionnel est recommandée."
        }
    },
    {
        question: "Prenez-vous régulièrement des anti-inflammatoires non stéroïdiens (AINS) ?",
        image: "Ressources/11_ains.png",
        choices: [
            { text: "Jamais ou très rarement", score: 0 },
            { text: "Occasionnellement (quelques fois par mois)", score: 1 },
            { text: "Fréquemment (plusieurs fois par semaine)", score: 2 },
            { text: "Quotidiennement ou presque", score: 3 }
        ],
        weight: 1.6,
        advice: {
            low: "C'est une bonne habitude. Évitez l'automédication prolongée.",
            medium: "Limitez leur usage. Parlez-en à votre médecin si la douleur persiste.",
            high: "Consultez votre médecin pour évaluer les risques et alternatives."
        }
    }
]; 