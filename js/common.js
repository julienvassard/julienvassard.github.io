/* js/common.js */

// --- CONFIGURATION GRAPHIQUE COMMUNE ---
const PLOTLY_CONFIG = {
    paper_bgcolor: 'rgba(0,0,0,0)',
    plot_bgcolor: 'rgba(0,0,0,0)',
    font: { color: '#1e293b' },
    margin: { t: 30, l: 150, r: 20, b: 40 }
};

// --- NOMS GÉNÉRIQUES ---
const PATTERN_NAMES = [
    "Pattern 1", "Pattern 2", "Pattern 3", "Pattern 4", 
    "Pattern 5", "Pattern 6", "Pattern 7", "Pattern 8",    
    "Pattern 9", "Pattern 10" 
];

const COLORS = {
    good: '#22c55e',
    bad: '#ef4444',
    neutral: '#eab308',
    blue: '#3b82f6',
    scale: ['#ef4444', '#f97316', '#eab308', '#84cc16', '#22c55e'] 
};

// --- FONCTIONS UTILITAIRES ---
function random(min, max) {
    return Math.random() * (max - min) + min;
}

function generateNotebooksData(count) {
    const notebooks = [];
    for (let i = 0; i < count; i++) {
        const score = Math.random();
        const nbPatterns = [];
        let memory = 50; 

        PATTERN_NAMES.forEach((p, index) => {
            let proba = 0.3;
           
            const isGood = index < 3; 
            const isBad = index >= 3 && index < 6; 

            if (isGood) proba = score > 0.7 ? 0.8 : 0.1;
            else if (isBad) proba = score < 0.4 ? 0.8 : 0.1;

            if (Math.random() < proba) {
                nbPatterns.push(p);
                if (isBad) memory += random(500, 1500);
                else memory += random(10, 100);
            }
        });
        
        memory += random(0, 100);
        notebooks.push({ id: i, score: score, patterns: nbPatterns, memory: memory });
    }
    return notebooks;
}