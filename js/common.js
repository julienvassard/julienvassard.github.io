/* js/common.js */

// --- CONFIGURATION GRAPHIQUE COMMUNE ---
const PLOTLY_CONFIG = {
    paper_bgcolor: 'rgba(0,0,0,0)',
    plot_bgcolor: 'rgba(0,0,0,0)',
    font: { color: '#1e293b' }, // Texte sombre (adapté au thème clair)
    margin: { t: 30, l: 150, r: 20, b: 40 }
};

// --- CONSTANTES ---
const PATTERN_NAMES = [
    "Modular Functions", "Type Hinting", "Clear Markdown", "Version Control", 
    "Hardcoded Paths", "Wildcard Imports", "Huge Cells", "No Description",    
    "Pandas Usage", "Matplotlib" 
];

const COLORS = {
    good: '#22c55e',
    bad: '#ef4444',
    neutral: '#eab308',
    blue: '#3b82f6',
    scale: ['#ef4444', '#f97316', '#eab308', '#84cc16', '#22c55e'] // De rouge à vert
};

// --- FONCTIONS UTILITAIRES ---

// Génère un nombre aléatoire entre min et max
function random(min, max) {
    return Math.random() * (max - min) + min;
}

// Génère des données simulées de notebooks (utilisé par patterns.js et memory.js)
function generateNotebooksData(count) {
    const notebooks = [];
    for (let i = 0; i < count; i++) {
        const score = Math.random();
        const nbPatterns = [];
        let memory = 50; // MB de base

        PATTERN_NAMES.forEach(p => {
            // Logique de probabilité (Bons patterns si score haut, Mauvais si score bas)
            let proba = 0.3;
            const isGood = ["Modular Functions", "Type Hinting", "Clear Markdown"].includes(p);
            const isBad = ["Hardcoded Paths", "Wildcard Imports", "Huge Cells"].includes(p);

            if (isGood) proba = score > 0.7 ? 0.8 : 0.1;
            else if (isBad) proba = score < 0.4 ? 0.8 : 0.1;

            if (Math.random() < proba) {
                nbPatterns.push(p);
                // Impact mémoire simulé
                if (isBad) memory += random(500, 1500);
                else memory += random(10, 100);
            }
        });
        
        // Ajout de bruit
        memory += random(0, 100);
        notebooks.push({ id: i, score: score, patterns: nbPatterns, memory: memory });
    }
    return notebooks;
}