/* js/memory.js */

document.addEventListener('DOMContentLoaded', () => {

    // 1. Récupération des données (via common.js)
    const notebooks = generateNotebooksData(300); // Un peu plus de données pour la mémoire
    const binLabels = ['0-0.2', '0.2-0.4', '0.4-0.6', '0.6-0.8', '0.8-1.0'];

    // --- CHART 1: BOX PLOT ---
    const boxData = PATTERN_NAMES.map(p => ({
        y: notebooks.filter(nb => nb.patterns.includes(p)).map(nb => nb.memory),
        type: 'box', name: p, marker: {color: COLORS.bad}, boxpoints: false
    }));
    Plotly.newPlot('boxPlotMem', boxData, { ...PLOTLY_CONFIG, showlegend: false, yaxis: {title: 'RAM (MB)', gridcolor: '#e2e8f0'} });

    // --- CHART 2: HEATMAP ---
    const zData = PATTERN_NAMES.map(p => {
        return binLabels.map((bin, i) => {
            const min = i * 0.2, max = (i + 1) * 0.2;
            const m = notebooks.filter(nb => nb.patterns.includes(p) && nb.score >= min && nb.score < max);
            return m.length ? m.reduce((s,n)=>s+n.memory,0)/m.length : 0;
        });
    });
    Plotly.newPlot('heatmapMem', [{ 
        z: zData, x: binLabels, y: PATTERN_NAMES, type: 'heatmap', colorscale: 'Hot', reversescale: true 
    }], { ...PLOTLY_CONFIG, xaxis: {side:'top'} });

    // --- CHART 3: SCATTER ---
    const avgScores=[], avgRams=[], sizes=[];
    PATTERN_NAMES.forEach(p => {
        const m = notebooks.filter(nb => nb.patterns.includes(p));
        avgRams.push(m.reduce((s,n)=>s+n.memory,0)/(m.length||1));
        avgScores.push(m.reduce((s,n)=>s+n.score,0)/(m.length||1));
        sizes.push(m.length);
    });
    Plotly.newPlot('scatterMem', [{
        x: avgScores, y: avgRams, mode: 'markers+text', text: PATTERN_NAMES,
        marker: {size: sizes.map(s=>Math.sqrt(s)*3), color: avgRams, colorscale:'Hot', reversescale:true}
    }], { ...PLOTLY_CONFIG, xaxis: {title: 'Score', gridcolor: '#e2e8f0'}, yaxis: {title: 'RAM (MB)', gridcolor: '#e2e8f0'} });

    // --- CHART 4: GROUPED BAR ---
    const memTraces = [];
    for(let i=0; i<5; i++) {
        const yData = PATTERN_NAMES.map(p => {
            const min = i * 0.2, max = (i + 1) * 0.2;
            const matches = notebooks.filter(nb => nb.patterns.includes(p) && nb.score >= min && nb.score < max);
            if (matches.length === 0) return 0;
            return matches.reduce((sum, nb) => sum + nb.memory, 0) / matches.length;
        });
        memTraces.push({
            x: PATTERN_NAMES, y: yData, name: binLabels[i], type: 'bar', marker: { color: COLORS.scale[i] }
        });
    }
    Plotly.newPlot('barMem', memTraces, { 
        ...PLOTLY_CONFIG, barmode: 'group', 
        yaxis: { title: 'RAM Moyenne (MB)', gridcolor: '#e2e8f0' }, 
        xaxis: { tickangle: -45 }, legend: { orientation: 'h', y: 1.1, title: {text: 'Score'} }
    });
});