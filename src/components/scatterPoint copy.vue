<script setup>
import * as d3 from 'd3'
import { onMounted } from 'vue'

// 读入数据
import { pointEmbedData } from '../testData/pointEmbed'

const padding = 30
const color = {
    Domain:'rgb(0, 229, 228)',
    IP:'yellow',
    Cert:'orange'
}

onMounted(async () => {
    // 请求数据
    const data = await requestData()
    draw(data)
})

async function requestData(){
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(pointEmbedData)
        },1000)
    })
}

function draw(data) {
    const width = document.getElementById('scatter-point').offsetWidth - 2*padding
    const height = document.getElementById('scatter-point').offsetHeight - 2*padding

    const svg = d3.select('#scatter-point-svg')
        .attr('width', width)
        .attr('height', height)
        .attr('transform',`translate(${padding},${padding})`)
        .style('background-color','rgba(255, 0, 0,0.2)')

    const xScale = d3.scaleLinear().domain([-15,20]).range([0,width - 2*padding])
    const yScale = d3.scaleLinear().domain([-15,20]).range([height - 2*padding,0])
    const xAxis = d3.axisBottom(xScale)
    const yAxis = d3.axisLeft(yScale)
    
    const chart = svg.append('g')

    chart.append('g').attr('transform',`translate(${padding},${height - padding})`).call(xAxis)
    chart.append('g').attr('transform',`translate(${padding},${padding})`).call(yAxis)
    chart.append('g').selectAll()
            .data(data)
        .join('circle')
            .attr('cx',d => xScale(d.x)+padding)
            .attr('cy',d => yScale(d.y)+padding)
            .attr('r',5)
            .attr('fill',d => color[d.type])
}
</script>

<template>
    <div id="scatter-point">
        <svg id="scatter-point-svg"></svg>
    </div>
</template>

<style scoped>

#scatter-point{
    width: 30%;
    height: 100%;
}
</style>