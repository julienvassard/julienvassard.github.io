/* js/patterns.js */

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Récupération des données simulées
    const notebooks = generateNotebooksData(200);

    // Préparation des Bins (Tranches de score)
    const binLabels = ['Critique (< 0.2)', 'Mauvais (0.2-0.4)', 'Moyen (0.4-0.6)', 'Bon (0.6-0.8)', 'Excellent (> 0.8)'];
    let dataMap = {};
    PATTERN_NAMES.forEach(p => dataMap[p] = [0, 0, 0, 0, 0]);

    // Remplissage des données
    notebooks.forEach(nb => {
        let binIndex = 0;
        if (nb.score <= 0.2) binIndex = 0;
        else if (nb.score <= 0.4) binIndex = 1;
        else if (nb.score <= 0.6) binIndex = 2;
        else if (nb.score <= 0.8) binIndex = 3;
        else binIndex = 4;

        nb.patterns.forEach(p => { dataMap[p][binIndex]++; });
    });

    // --- CHART 1: TOP VS FLOP ---
    const topCounts = PATTERN_NAMES.map(p => dataMap[p][4]); 
    const flopCounts = PATTERN_NAMES.map(p => dataMap[p][0] + dataMap[p][1]);

    Plotly.newPlot('barCompare', [
        { 
            y: PATTERN_NAMES, 
            x: topCounts, 
            name: 'Excellents (>0.8)', 
            type: 'bar', 
            orientation: 'h', 
            marker: {color: COLORS.good},
            // Tooltip explicite
            hovertemplate: 
                '<b>Pattern :</b> %{y}<br>' +
                '<b>Catégorie :</b> Excellents (>0.8)<br>' +
                '<b>Quantité :</b> %{x} notebooks' +
                '<extra></extra>' 
        },
        { 
            y: PATTERN_NAMES, 
            x: flopCounts, 
            name: 'Médiocres (<0.4)', 
            type: 'bar', 
            orientation: 'h', 
            marker: {color: COLORS.bad},
            // Tooltip explicite
            hovertemplate: 
                '<b>Pattern :</b> %{y}<br>' +
                '<b>Catégorie :</b> Médiocres (<0.4)<br>' +
                '<b>Quantité :</b> %{x} notebooks' +
                '<extra></extra>'
        }
    ], { 
        ...PLOTLY_CONFIG, 
        barmode: 'group', 
        xaxis: {title: 'Nombre de Notebooks', gridcolor: '#e2e8f0'},
        legend: {orientation: 'h', y: 1.1}
    });

    // --- CHART 2: HEATMAP ---
    const zData = PATTERN_NAMES.map(p => dataMap[p]);
    Plotly.newPlot('heatmapFreq', [{ 
        z: zData, 
        x: binLabels, 
        y: PATTERN_NAMES, 
        type: 'heatmap', 
        colorscale: 'Viridis',
        // Tooltip explicite
        hovertemplate: 
            '<b>Pattern :</b> %{y}<br>' +
            '<b>Tranche de Score :</b> %{x}<br>' +
            '<b>Fréquence :</b> %{z} fois' +
            '<extra></extra>'
    }], { 
        ...PLOTLY_CONFIG, 
        xaxis: {side:'top', title: 'Score Global du Notebook'} 
    });

    // --- CHART 3: BUBBLE ---
    const avgScores = [], totalCounts = [], bubbleColors = [];
    PATTERN_NAMES.forEach(p => {
        const nbs = notebooks.filter(nb => nb.patterns.includes(p));
        const count = nbs.length;
        const avg = nbs.reduce((a,c) => a+c.score, 0) / (count||1);
        
        avgScores.push(avg); totalCounts.push(count);
        bubbleColors.push(avg > 0.6 ? COLORS.good : (avg < 0.4 ? COLORS.bad : COLORS.neutral));
    });

    Plotly.newPlot('bubblePlot', [{
        x: avgScores, 
        y: totalCounts, 
        text: PATTERN_NAMES, 
        mode: 'markers+text',
        marker: { size: totalCounts.map(c => Math.sqrt(c)*3), color: bubbleColors },
        // Tooltip explicite
        hovertemplate: 
            '<b>%{text}</b><br>' +
            'Score Moyen : %{x:.2f} / 1.0<br>' +
            'Apparitions Totales : %{y}' +
            '<extra></extra>'
    }], { 
        ...PLOTLY_CONFIG, 
        xaxis: {title: 'Score Moyen des Notebooks', gridcolor: '#e2e8f0', range: [0, 1]}, 
        yaxis: {title: 'Fréquence Totale', gridcolor: '#e2e8f0'} 
    });

    // --- CHART 4: STACKED BAR ---
    const traces = [];
    for(let i=0; i<5; i++) {
        traces.push({
            x: PATTERN_NAMES, 
            y: PATTERN_NAMES.map(p => dataMap[p][i]),
            name: binLabels[i], 
            type: 'bar', 
            marker: { color: COLORS.scale[i] },
            // Tooltip explicite
            hovertemplate: 
                '<b>Pattern :</b> %{x}<br>' +
                '<b>Qualité Notebook :</b> %{data.name}<br>' +
                '<b>Nombre :</b> %{y}' +
                '<extra></extra>'
        });
    }
    Plotly.newPlot('stackPlot', traces, { 
        ...PLOTLY_CONFIG, 
        barmode: 'stack', 
        xaxis: { tickangle: -45 }, 
        yaxis: { title: 'Nombre de Notebooks', gridcolor: '#e2e8f0' }, 
        legend: { orientation: 'h', y: 1.1 }
    });
});