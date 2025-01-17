<script setup>
import * as d3 from 'd3'
import { onMounted } from 'vue'
let svg_chart
let chordData = [
    [11975, 5871, 8916, 2868],
    [1951, 10048, 2060, 6171],
    [8010, 16145, 8090, 8045],
    [1013, 990, 940, 6907],
]
let colors = ['#000000', '#ffdd89', '#957244', '#f26223']
let names = ['black', 'blond', 'brown', 'red']
let svgWidth, svgHeight



onMounted(async () => {
    svgWidth = document.getElementById('hanabi-arc').offsetWidth
    svgHeight = document.getElementById('hanabi-arc').offsetHeight
    console.log('chord width height', svgWidth, svgHeight);
    
    svg_chart = d3.select('#hanabi-arc-svg')
        .attr('width', svgWidth)
        .attr('height', svgHeight)
        .attr("viewBox", [-svgWidth / 2, -svgHeight / 2, svgWidth, svgHeight])
        // .style("font", "10px Microsoft Yahei");
        .attr("style", "font: 10px sans-serif;");
        
    // try {
    //     const data2 = await d3.json(`src/HIN_data/Ours/CAG/G2graph.json`)
    //     forceRawData = data2
    //     const data3 = await d3.json(`src/HIN_data/Ours/CAG/G3graph.json`)
    //     draw(data2, data3)
    // } catch (error) {
    //     console.log(error);
    // }

    drawChart(chordData)
})

function drawChart(data) {
    // console.log('data:', data)
    let gap_size = 3
    let ring_height = 10
    let outerRadius = Math.min(svgWidth, svgHeight) * 0.5-30;
    let innerRadius = outerRadius - ring_height;
    let sum = d3.sum(data.flat())
    const tickStep = d3.tickStep(0, sum, 100);
    const tickStepMajor = d3.tickStep(0, sum, 20);
    const formatValue = d3.formatPrefix(",.0", tickStep);

    const chord = d3.chord()
        .padAngle(gap_size / innerRadius)
        .sortSubgroups(d3.descending);

    const arc = d3.arc()
        .innerRadius(innerRadius)
        .outerRadius(outerRadius);

    const ribbon = d3.ribbon()
        .radius(innerRadius-20);

    const chords = chord(data);

    const group = svg_chart.append("g")
        .selectAll()
        .data(chords.groups)
        .join("g");

    group.append("path")
        .attr("fill", d => colors[d.index])
        .attr("d", arc)
        .append("title")
        .text(d => `${d.value.toLocaleString("en-US")} ${names[d.index]}`);

    const groupTick = group.append("g")
        .selectAll()
        .data(d => groupTicks(d, tickStep))
        .join("g")
        .attr("transform", d => `rotate(${d.angle * 180 / Math.PI - 90}) translate(${outerRadius},0)`);

    groupTick.append("line")
        .attr("stroke", "currentColor")
        .attr("x2", 6);

    groupTick
        .filter(d => d.value % tickStepMajor === 0)
        .append("text")
        .attr("x", 8)
        .attr("dy", ".35em")
        .attr("transform", d => d.angle > Math.PI ? "rotate(180) translate(-16)" : null)
        // .attr("transform", d => d.angle > Math.PI ? "rotate(180) translate(-10)" : 'translate(-7)')
        .attr("text-anchor", d => d.angle > Math.PI ? "end" : null)
        .text(d => formatValue(d.value));

    svg_chart.append("g")
        .attr("fill-opacity", 0.7)
        .selectAll()
        .data(chords)
        .join("path")
        .attr("d", ribbon)
        .attr("fill", d => colors[d.target.index])
        .attr("stroke", "white")
        .append("title")
        .text(d => `${d.source.value.toLocaleString("en-US")} ${names[d.source.index]} → 
      ${names[d.target.index]}${d.source.index !== d.target.index
                ? `\n${d.target.value.toLocaleString("en-US")} ${names[d.target.index]} → 
      ${names[d.source.index]}` : ``}`);
}

function groupTicks(d, step) {
  const k = (d.endAngle - d.startAngle) / d.value;
  return d3.range(0, d.value, step).map(value => {
    return {value: value, angle: value * k + d.startAngle};
  });
}


</script>

<template>
    <div id="hanabi-arc">
        <div class="chart-header">关联弦图</div>
        <svg id="hanabi-arc-svg"></svg>
    </div>
</template>

<style scoped>
#hanabi-arc {
    width: 100%;
    height: 100%;
    position: relative;
}
.chart-header {
    height: 25px;
    width: 100%;
    font-size: 15px;
    font-weight: bold;
    background-color: #e8e6e2;
    border-left: 2px solid white;
    padding-left: 2px;
    position: absolute;
    top: 0;
    left: 0;
}
</style>