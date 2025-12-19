/* js/metrics.js */

// --- 1. DONNÉES ENRICHIES ---
const DATA_MODELS = {
    good: {
        name: "Modular Functions",
        kpis: ["Low (1.4)", "85/100", "5 min", "Low", "0%"],
        radar: [90, 85, 95, 80, 90],
        distributions: {
            complexity:      [60, 25, 10, 5, 0], 
            maintainability: [0, 5, 10, 35, 50], 
            debt:            [80, 15, 5, 0, 0],  
            cognitive:       [70, 20, 10, 0, 0], 
            duplication:     [95, 5, 0, 0, 0]    
        },
        table: [
            { name: "Complexité Cyclomatique", val: "2" },
            { name: "Ratio Commentaires", val: "22%" },
            { name: "Dépendances", val: "1" },
            { name: "Conformité PEP8", val: "100%" },
            { name: "Couverture Tests", val: "95%" }
        ]
    },
    bad: {
        name: "Hardcoded Paths",
        kpis: ["High (15.8)", "42/100", "4h 30m", "High", "28%"],
        radar: [30, 20, 40, 25, 30],
        distributions: {
            complexity:      [5, 10, 20, 35, 30], 
            maintainability: [40, 30, 20, 10, 0], 
            debt:            [10, 20, 30, 25, 15],
            cognitive:       [10, 20, 30, 40, 0], 
            duplication:     [50, 20, 15, 10, 5]  
        },
        table: [
            { name: "Complexité Cyclomatique", val: "15" },
            { name: "Ratio Commentaires", val: "2%" },
            { name: "Dépendances", val: "8" },
            { name: "Conformité PEP8", val: "40%" },
            { name: "Couverture Tests", val: "0%" }
        ]
    },
    neutral: {
        name: "Pandas Usage",
        kpis: ["Med (5.5)", "65/100", "45 min", "Med", "12%"],
        radar: [60, 60, 60, 60, 60],
        distributions: {
            complexity:      [20, 40, 30, 8, 2],
            maintainability: [10, 20, 40, 20, 10],
            debt:            [30, 40, 20, 10, 0],
            cognitive:       [30, 40, 20, 10, 0],
            duplication:     [60, 20, 10, 5, 5]
        },
        table: [
            { name: "Complexité Cyclomatique", val: "8" },
            { name: "Ratio Commentaires", val: "12%" },
            { name: "Dépendances", val: "3" },
            { name: "Conformité PEP8", val: "85%" },
            { name: "Couverture Tests", val: "40%" }
        ]
    }
};

// --- 2. CONFIGURATIONS ---
const METRIC_DEFINITIONS = {
    complexity: {
        title: "Distribution de la Complexité Cyclomatique",
        labels: ['Trivial', 'Simple', 'Moyen', 'Élevé', 'Critique'],
        yAxis: '% de Code'
    },
    maintainability: {
        title: "Score de Maintenabilité (MI)",
        labels: ['E (<20)', 'D (20-40)', 'C (40-60)', 'B (60-80)', 'A (>80)'],
        yAxis: '% de Modules'
    },
    debt: {
        title: "Estimation de la Dette Technique",
        labels: ['Négligeable', 'Faible', 'Moyenne', 'Élevée', 'Critique'],
        yAxis: '% de Fonctions'
    },
    cognitive: {
        title: "Charge Cognitive",
        labels: ['Intuitive', 'Légère', 'Modérée', 'Lourde', 'Surcharge'],
        yAxis: '% de Code'
    },
    duplication: {
        title: "Blocs Dupliqués",
        labels: ['Unique', '< 5%', '5-10%', '10-20%', '> 20%'],
        yAxis: 'Fréquence'
    }
};

// État Global
let isCompareMode = false;
let currentMetric = 'complexity';

// --- FONCTIONS ---

// Appelée quand on clique sur une carte KPI
function changeMetric(metricKey) {
    currentMetric = metricKey;
    // Visuel
    document.querySelectorAll('.kpi-card').forEach(card => card.classList.remove('active'));
    document.getElementById(`card-${metricKey}`).classList.add('active');
    // Mise à jour du graph
    updateBarChart();
}

function updateBarChart() {
    const keyA = document.getElementById('selectA').value;
    const dataA = DATA_MODELS[keyA];
    const keyB = document.getElementById('selectB').value;
    const dataB = DATA_MODELS[keyB];

    const config = METRIC_DEFINITIONS[currentMetric];
    const colorA = '#3b82f6';
    const colorB = '#f43f5e';

    const traces = [{
        x: config.labels,
        y: dataA.distributions[currentMetric],
        type: 'bar',
        name: dataA.name,
        marker: { color: colorA },
        hovertemplate: `<b>${dataA.name}</b><br>%{x}<br>Volume: %{y}%<extra></extra>`
    }];

    if(isCompareMode) {
        traces.push({
            x: config.labels,
            y: dataB.distributions[currentMetric],
            type: 'bar',
            name: dataB.name,
            marker: { color: colorB },
            hovertemplate: `<b>${dataB.name}</b><br>%{x}<br>Volume: %{y}%<extra></extra>`
        });
    }

    Plotly.newPlot('trendPlot', traces, { 
        ...PLOTLY_CONFIG, 
        title: config.title, 
        barmode: isCompareMode ? 'group' : 'relative',
        xaxis: {title: 'Catégories'}, 
        yaxis: {title: config.yAxis}, 
        showlegend: isCompareMode 
    });
}

function updateDashboard() {
    const keyA = document.getElementById('selectA').value;
    const dataA = DATA_MODELS[keyA];
    const keyB = document.getElementById('selectB').value;
    const dataB = DATA_MODELS[keyB];

    const colorA = '#3b82f6';
    const colorB = '#f43f5e';

    // 1. UPDATE KPIS TEXTE
    for(let i=0; i<5; i++) {
        const container = document.getElementById(`kpi-box-${i+1}`);
        if(isCompareMode) {
            container.innerHTML = `
                <span class="kpi-val" style="color:${colorA}">${dataA.kpis[i]}</span>
                <span class="kpi-sep">vs</span>
                <span class="kpi-val-b" style="color:${colorB}">${dataB.kpis[i]}</span>
            `;
        } else {
            container.innerHTML = `<span class="kpi-val" style="color:#1e293b">${dataA.kpis[i]}</span>`;
        }
    }

    // 2. RADAR CHART (Centré)
    const tracesRadar = [{
        type: 'scatterpolar',
        r: [...dataA.radar, dataA.radar[0]],
        theta: ['Lisibilité', 'Performance', 'Sécurité', 'Testabilité', 'Maintenance', 'Lisibilité'],
        fill: 'toself', name: dataA.name, line: { color: colorA },
        hovertemplate: `<b>${dataA.name}</b><br>%{theta}: %{r}/100<extra></extra>`
    }];

    if(isCompareMode) {
        tracesRadar.push({
            type: 'scatterpolar',
            r: [...dataB.radar, dataB.radar[0]],
            theta: ['Lisibilité', 'Performance', 'Sécurité', 'Testabilité', 'Maintenance', 'Lisibilité'],
            fill: 'toself', name: dataB.name, line: { color: colorB }, opacity: 0.6,
            hovertemplate: `<b>${dataB.name}</b><br>%{theta}: %{r}/100<extra></extra>`
        });
    }

    const radarLayout = {
        ...PLOTLY_CONFIG,
        // Marges optimisées pour le centrage
        margin: { t: 30, l: 40, r: 40, b: 60 }, 
        polar: { radialaxis: { visible: true, range: [0, 100] } },
        showlegend: isCompareMode,
        // Légende en bas
        legend: { orientation: 'h', x: 0.5, xanchor: 'center', y: -0.15 }
    };

    Plotly.newPlot('radarPlot', tracesRadar, radarLayout);

    // 3. BAR CHART INTERACTIF
    updateBarChart();

    // 4. TABLEAU
    const thead = document.getElementById('tableHeader');
    const tbody = document.getElementById('tableBody');
    
    if(isCompareMode) {
        thead.innerHTML = `<th style="width: 40%;">Métrique</th><th class="col-a">${dataA.name}</th><th class="col-b">${dataB.name}</th>`;
    } else {
        thead.innerHTML = `<th style="width: 40%;">Métrique</th><th style="color:#1e293b">Valeur</th>`;
    }

    tbody.innerHTML = '';
    dataA.table.forEach((rowA, idx) => {
        let rowHTML = `<td><span style="font-weight:600">${rowA.name}</span></td>`;
        if(isCompareMode) {
            const rowB = dataB.table[idx];
            rowHTML += `<td class="col-a">${rowA.val}</td><td class="col-b">${rowB.val}</td>`;
        } else {
            rowHTML += `<td style="font-family:monospace; font-size:1rem;">${rowA.val}</td>`;
        }
        tbody.innerHTML += `<tr>${rowHTML}</tr>`;
    });
}

function toggleCompareMode() {
    isCompareMode = document.getElementById('compareToggle').checked;
    document.getElementById('groupB').style.display = isCompareMode ? 'flex' : 'none';
    updateDashboard();
}

// --- INIT ---
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('selectA').addEventListener('change', updateDashboard);
    document.getElementById('selectB').addEventListener('change', updateDashboard);
    document.getElementById('compareToggle').addEventListener('change', toggleCompareMode);
    
    updateDashboard(); // Premier affichage
});