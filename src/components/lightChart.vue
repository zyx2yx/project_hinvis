<script setup>
import * as d3 from 'd3'
import { onMounted, watch } from 'vue'
import { storeToRefs } from 'pinia'

import { useGroupInfo } from '../stores/groupInfoStore'

const groupInforStore = useGroupInfo()
const { groupInfo } = storeToRefs(groupInforStore)

const padding = 50
let promptBox
const applyName = {
    'A': '涉黄',
    'B': '涉赌',
    'C': '涉骗',
    'D': '涉毒',
    'E': '涉枪',
    'F': '黑客',
    'G': '非法交易平台',
    'H': '非法支付平台',
    'I':'其他',
}

onMounted(async () => {
    // 请求数据
    // const data = await requestData()
    // draw(data)
})

watch(groupInfo, curV => {
    clearSvg()
    let industry = curV.blackIndustry.map(production => {
        production.name = applyName[production.type]
        return production
    })
    draw(industry)
})

function clearSvg() {
    d3.select('#light-chart-svg>g').remove()
}


async function requestData() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve([
                { type: 'A', name: '涉黄', number: 0 },
                { type: 'B', name: '涉赌', number: 100 },
                { type: 'C', name: '涉骗', number: 0 },
                { type: 'D', name: '涉毒', number: 200 },
                { type: 'E', name: '涉枪', number: 0 },
                { type: 'F', name: '黑客', number: 0 },
                { type: 'G', name: '非法交易平台', number: 0 },
                { type: 'H', name: '非法支付平台', number: 300 },
                { type: 'I', name: '其他', number: 0 },
            ])
        }, 1000)
    })
}

function getMaxCount(data) {
    let maxCount = 0
    data.forEach(d => {
        if (maxCount < d.number) maxCount = d.number
    })
    return maxCount
}

function controlPromptBox(selection) {
    selection
        .on('mouseover', function (_, d) {
            promptBox
                .attr('class', 'prompt-show')
                .text(d.name + ':' + d.number)
        })
        .on('mousemove', function (event) {
            let [posX,posY] = d3.pointer(event,d3.select('body').node())
            promptBox
                .style('top', posY - 30 + 'px')
                .style('left', posX + 5 + 'px')
        })
        .on('mouseout', function () {
            promptBox
                .attr('class', 'prompt-hide')
        })
}

function draw(data) {
    const width = document.getElementById('light-chart').offsetWidth
    const height = document.getElementById('light-chart').offsetHeight
    const countMax = getMaxCount(data)
    const colorScale = d3.scaleOrdinal().range(d3.schemeSet2).domain(data.map(d => d.type))
    const xScale = d3.scaleBand().domain(['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I']).range([0, width - 2 * padding])
    const yScale = d3.scaleLinear().domain([0, countMax]).range([height - 2 * padding, 0])
    const lineGenerator = d3.line().x(d => d[0]).y(d => d[1])
    const points = [[padding, height - padding], [width - padding, height - padding]]
    promptBox = d3.select('#tooltip')

    const chart = d3.select('#light-chart-svg')
        .attr('width', width)
        .attr('height', height)
        .append('g')

    // 绘制水平线
    chart.append('g').append('path').attr('d', lineGenerator(points)).attr('stroke', 'rgb(3, 142, 192)')

    const circleLineTextG = chart.append('g').selectAll().data(data).join('g')//.attr('transform',`translate(${padding},0)`)//.attr('id','circleLineTextG')
    // 绘制文本
    circleLineTextG.append('text')
        .text(d => d.name)
        // .attr('fill','grey')
        .attr('transform', d => `translate(${2 * padding + xScale(d.type)},${height - padding / 1.5}) rotate(-20)`)
        .attr('text-anchor', 'end')
        .attr('font-size', 12)
        .attr('fill', 'rgb(238, 241, 250)')
    // 绘制竖线
    circleLineTextG.append('path')
        .attr('d', (d, i) => {
            let dx = xScale(d.type)
            let dy = yScale(d.number)
            let points = [[2 * padding + dx, height - padding], [2 * padding + dx, dy + padding]]

            return lineGenerator(points)
        })
        .attr('stroke', d => colorScale(d.type))
        .call(controlPromptBox)
    // 绘制圆
    circleLineTextG.append('circle')
        .attr('cx', d => 2 * padding + xScale(d.type))
        .attr('cy', d => yScale(d.number) + padding)
        // .attr('r', d => 4 + d.number / 50)
        .attr('r', d => 4 + (d.number/countMax)*10)
        .attr('fill', d => colorScale(d.type))
        .call(controlPromptBox)
    // 绘制标题
    chart.append('g').append('text').text('黑灰产指示灯')
        .attr('font-size', 16)
        .attr('fill', 'rgb(238, 241, 250)')
        .attr('y', 25)
        .attr('x', 10)
        .attr('font-family', 'sans-serif')
        .attr('font-weight', 'bolder')
}

</script>

<template>
    <div id="light-chart" class="image-box">
        <svg id="light-chart-svg"></svg>
    </div>
</template>

<style scoped>
#light-chart {
    background-color: rgb(16, 12, 42);
    width: 100%;
    height: 30%;
}
</style>