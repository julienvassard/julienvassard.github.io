/* js/metrics.js */

// DONNÉES STATIQUES (Modèles)
const DATA_MODELS = {
    good: {
        name: "Modular Functions",
        kpis: ["Low (14)", "85/100", "5 min", "Low", "0%"],
        radar: [90, 85, 95, 80, 90],
        trendBase: 50, trendSlope: 1.5,
        table: [
            { name: "Complexité Cyclomatique", val: "2" },
            { name: "Ratio Commentaires", val: "22%" },
            { name: "Dépendances", val: "1" },
            { name: "Variables Globales", val: "0" },
            { name: "Conformité PEP8", val: "100%" },
            { name: "Couverture Tests", val: "95%" },
            { name: "RAM Peak", val: "45 MB" }
        ]
    },
    bad: {
        name: "Hardcoded Paths",
        kpis: ["High (58)", "42/100", "4h 30m", "High", "28%"],
        radar: [30, 20, 40, 25, 30],
        trendBase: 120, trendSlope: -0.5,
        table: [
            { name: "Complexité Cyclomatique", val: "15" },
            { name: "Ratio Commentaires", val: "2%" },
            { name: "Dépendances", val: "8" },
            { name: "Variables Globales", val: "5" },
            { name: "Conformité PEP8", val: "40%" },
            { name: "Couverture Tests", val: "0%" },
            { name: "RAM Peak", val: "1.2 GB" }
        ]
    },
    neutral: {
        name: "Pandas Usage",
        kpis: ["Med (30)", "65/100", "45 min", "Med", "12%"],
        radar: [60, 60, 60, 60, 60],
        trendBase: 200, trendSlope: 0.2,
        table: [
            { name: "Complexité Cyclomatique", val: "8" },
            { name: "Ratio Commentaires", val: "12%" },
            { name: "Dépendances", val: "3" },
            { name: "Variables Globales", val: "1" },
            { name: "Conformité PEP8", val: "85%" },
            { name: "Couverture Tests", val: "40%" },
            { name: "RAM Peak", val: "200 MB" }
        ]
    }
};

let isCompareMode = false;

// --- FONCTIONS LOGIQUES ---

function updateDashboard() {
    const keyA = document.getElementById('selectA').value;
    const dataA = DATA_MODELS[keyA];
    
    const keyB = document.getElementById('selectB').value;
    const dataB = DATA_MODELS[keyB];

    const colorA = '#3b82f6';
    const colorB = '#f43f5e';

    // 1. UPDATE KPIS
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

    // 2. RADAR CHART (CORRIGÉ POUR LE CENTRAGE)
    const tracesRadar = [{
        type: 'scatterpolar',
        r: [...dataA.radar, dataA.radar[0]],
        theta: ['Lisibilité', 'Performance', 'Sécurité', 'Testabilité', 'Maintenance', 'Lisibilité'],
        fill: 'toself', name: dataA.name,
        line: { color: colorA }
    }];

    if(isCompareMode) {
        tracesRadar.push({
            type: 'scatterpolar',
            r: [...dataB.radar, dataB.radar[0]],
            theta: ['Lisibilité', 'Performance', 'Sécurité', 'Testabilité', 'Maintenance', 'Lisibilité'],
            fill: 'toself', name: dataB.name,
            line: { color: colorB }, opacity: 0.6
        });
    }

    // Configuration spécifique pour centrer le Radar
    const radarLayout = {
        ...PLOTLY_CONFIG,
        // On écrase les marges globales de PLOTLY_CONFIG (qui a l:150)
        // t:30, l:40, r:40, b:60 permet de bien centrer le cercle
        margin: { t: 30, l: 40, r: 40, b: 60 }, 
        polar: { 
            radialaxis: { visible: true, range: [0, 100] } 
        },
        showlegend: isCompareMode,
        // On place la légende EN BAS pour ne pas écraser le graphique latéralement
        legend: {
            orientation: 'h',
            x: 0.5,
            xanchor: 'center',
            y: -0.15
        }
    };

    Plotly.newPlot('radarPlot', tracesRadar, radarLayout);


    // 3. TREND CHART
    const days = Array.from({length: 30}, (_,i) => i+1);
    const trendA = days.map(d => dataA.trendBase + (d * dataA.trendSlope) + (Math.random()*5));
    
    const tracesTrend = [{
        x: days, y: trendA, type: 'scatter', mode: 'lines', name: dataA.name,
        line: { color: colorA, width: 3 }
    }];

    if(isCompareMode) {
        const trendB = days.map(d => dataB.trendBase + (d * dataB.trendSlope) + (Math.random()*5));
        tracesTrend.push({
            x: days, y: trendB, type: 'scatter', mode: 'lines', name: dataB.name,
            line: { color: colorB, width: 3, dash: 'dot' }
        });
    }

    Plotly.newPlot('trendPlot', tracesTrend, { 
        ...PLOTLY_CONFIG, xaxis: {title: 'Jours'}, yaxis: {title: 'Nb Notebooks'}, showlegend: isCompareMode 
    });

    // 4. TABLE UPDATE
    const thead = document.getElementById('tableHeader');
    const tbody = document.getElementById('tableBody');
    
    if(isCompareMode) {
        thead.innerHTML = `
            <th style="width: 40%;">Métrique</th>
            <th class="col-a">${dataA.name}</th>
            <th class="col-b">${dataB.name}</th>
        `;
    } else {
        thead.innerHTML = `
            <th style="width: 40%;">Métrique</th>
            <th style="color:#1e293b">Valeur</th>
        `;
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

// --- INITIALISATION ---
document.addEventListener('DOMContentLoaded', () => {
    // Écouteurs d'événements
    document.getElementById('selectA').addEventListener('change', updateDashboard);
    document.getElementById('selectB').addEventListener('change', updateDashboard);
    document.getElementById('compareToggle').addEventListener('change', toggleCompareMode);

    // Premier rendu
    updateDashboard();
});