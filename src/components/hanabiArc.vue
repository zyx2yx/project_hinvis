<script setup>
import * as d3 from 'd3'
import { onMounted,watch } from 'vue'
import {storeToRefs} from 'pinia'

import { colorConfig } from '../utils/colorConfig'
import {useGroupInfo} from '../stores/groupInfoStore'

const groupInforStore = useGroupInfo()
const {groupInfo} = storeToRefs(groupInforStore)
const {getGroupInfo} = groupInforStore

// 读入数据
// import { chordData } from '../testData/chordData'

// 提示框
let promptBox

watch(groupInfo,curV => {
    clearSvg()
    draw(curV)
})

onMounted(async () => {
    promptBox = d3.select('#tooltip')
    // draw(getGroupInfo())
})

function clearSvg(){
    d3.select('#hanabi-arc-svg>g').remove()
}

function controlPromptBox(selection){
    selection
        .on('mouseover', function (_, d) {
            promptBox
                .attr('class', 'prompt-show')
                .style('font-color', '#fff')
                .text(d.type + ':' + d.number)
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
    const width = document.getElementById('hanabi-arc').offsetWidth
    const height = document.getElementById('hanabi-arc').offsetHeight
    const radius = width > height ? 0.4 * height : 0.4 * width
    const pos = 0.5 * radius * Math.sqrt(2)
    //                    Domain 0     IP  1     Cert 2    whoisname 3 whoisphone 4 whoisemail 5 ipc 6    asn 7
    const coordinates = [[0, -radius], [pos, -pos], [radius, 0], [pos, pos], [0, radius], [-pos, pos], [-radius, 0], [-pos, -pos]]
    const line = d3.line().x(d => d[0]).y(d => d[1]).curve(d3.curveBundle.beta(0.5))
    // 起点 中间点 终点  <-----类型 总数
    const links = [
        { type: 'r_cert', pos: [[0, -radius], [0, 0], [radius, 0]], },
        { type: 'r_dns_a', pos: [[0, -radius], [0, 0], [pos, -pos]] },
        { type: 'r_whois_name', pos: [[0, -radius], [0, 0], [pos, pos]] },
        { type: 'r_whois_email', pos: [[0, -radius], [0, 0], [-pos, pos]] },
        { type: 'r_whois_phone', pos: [[0, -radius], [0, 0], [0, radius]] },
        { type: 'r_asn', pos: [[pos, -pos], [0, 0], [-pos, -pos]] },
        { type: 'r_cidr', pos: [[pos, -pos], [0, 0], [-radius, 0]] },
    ]

    links.forEach(d => {
        data.edge.forEach(k => {
            if (d.type === k.type) d.number = k.number
        })
    })

    const chart = d3.select('#hanabi-arc-svg')
        .attr('width', width)
        .attr('height', height)
        .append('g')
    // console.log(data.node)
    const pathG = chart.append('g').selectAll().data(links).join('g')

    pathG.append('path')
        .attr('d', (d, i) => line(d.pos))
        .attr('stroke', d => {
            if (d.type === 'r_asn' || d.type === 'r_cidr') return 'rgb(241, 222, 29)'
            else return 'rgb(3, 251, 251)'
        })
        .attr('stroke-opacity', 0.6)
        .attr('stroke-width', d => 4 + d.number / 100 > 25 ? 25 : 4 + d.number / 100)
        .attr('fill', 'none')
        .call(controlPromptBox)
        

    const circleG = chart.attr('transform', `translate(${width / 2},${height / 2})`)
        .append('g')
        .selectAll()
        .data(data.node)
        .join('g')

    circleG.append('circle')
        .attr('fill', d => colorConfig[d.type])
        .attr('r', d => 8 + d.number / 50 > 20 ? 20 : 8 + d.number / 50)
        .attr('cx', (_, i) => coordinates[i][0])
        .attr('cy', (_, i) => coordinates[i][1])
        .call(controlPromptBox)
        
    // 绘制文本
    circleG.append('text')
        .text(d => d.type)
        .attr('x', (d, i) => {
            let dx = 15
            if (d.type == 'ASN' || d.type == 'IP_C' || d.type == 'Whois_Email') {
                dx = -dx
            }
            return coordinates[i][0] + dx
        })
        .attr('y', (d, i) => coordinates[i][1] + 5)
        .attr('text-anchor', d => {
            if (d.type == 'ASN' || d.type == 'IP_C' || d.type == 'Whois_Email') return 'end'
            return 'start'
        })
        .attr('font-size', 12)
        .attr('fill', 'rgb(238, 241, 250)')
    // 绘制标题
    chart.append('g').append('text').text('烟花弦图')
        .attr('font-size', 16)
        .attr('fill', 'rgb(238, 241, 250)')
        .attr('x', -width / 2 + 10)
        .attr('y', -height / 2 + 30)
        .attr('font-family', 'sans-serif')
        .attr('font-weight', 'bolder')
}

</script>

<template>
    <div id="hanabi-arc" class="image-box">
        <svg id="hanabi-arc-svg"></svg>
        <div class="prompt-hide"><text>dsdsda</text></div>
    </div>
</template>

<style scoped>
#hanabi-arc {
    background-color: rgb(16, 12, 42);
    width: 50%;
    height: 100%;
}
</style>