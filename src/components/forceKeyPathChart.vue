<script setup>
import { onMounted, onUpdated, watch } from 'vue'
import * as d3 from 'd3'
import { storeToRefs } from 'pinia'

import { useForceStore } from '../stores/forceStore'
import { useForceConfigStore } from '../stores/forceConfigStore'
import { useKeyGraphStore } from '../stores/keyPathStore'
import { computeArrowPos } from '../utils/computeArrowPos'

import { getShortestPath } from '../stores/coreShortestPath'

let canvasWidth, canvasHeight, ctx, subGraphNodes = [], subGraphEdges = [], coreNodes = []
const forceDataStore = useForceStore()
const forceConfigStore = useForceConfigStore()
const keyGraphStore = useKeyGraphStore()

// const {forceData} = forceDataStore
const { isSimulating, forceData } = storeToRefs(forceDataStore)
// 不写成响应式，即使组件更新，也不会取到新值
const { scaleFactor, simulation } = storeToRefs(forceConfigStore)

// 选中矩形块的数据，包含两个id
const { keyPoints } = storeToRefs(keyGraphStore)

const colorConfig = {
    Domain: 'rgb(3, 251, 251)',
    IP: "rgb(241, 222, 29)",
    Cert: 'rgb(254, 120, 7)',
    Whois_Name: 'rgb(47, 166, 254)',
    Whois_Phone: 'rgb(47, 166, 254)',
    Whois_Email: 'rgb(47, 166, 254)',
    ASN: 'rgb(165, 73, 185)',
    IP_C: 'rgb(165, 73, 185)',
    '核心资产': 'rgb(241, 98, 132)',
}
// 提示框
let promptBox

watch(keyPoints, (curV, preV) => {

    console.log('核心资产点更新');
    

    subGraphNodes = []
    subGraphEdges = []
    coreNodes = []
    if (curV !== null) {
        
        let { id1, id2 } = curV
        // 在原图基础上重新绘制高亮图
        let keyGraph = getKeyGraph(curV, getShortestPath())
        for (let node of keyGraph.nodes) {
            subGraphNodes.push(forceData.value.nodes.find(item => node.numID === item.numID))
        }
        for (let link of keyGraph.edges) {
            subGraphEdges.push(forceData.value.edges.find(item => {
                if (item.source.numID === link.source && item.target.numID === link.target) return true
            }))
        }

        coreNodes.push(forceData.value.nodes.find(item => id1 === item.numID))
        coreNodes.push(forceData.value.nodes.find(item => id2 === item.numID))

        draw(forceData.value)
    }



})

function getAllPath(allPathArr) {
    let nodes = []
    let edges = []
    for (let path of allPathArr) {
        nodes.push(...path.nodes)
        edges.push(...path.edges)
    }
    return { nodes, edges }
}
function getShortestKeyPath(shortestLength, allPathArr) {
    let nodes = []
    let edges = []
    for (let path of allPathArr) {
        if (path.edges.length === shortestLength) {
            nodes.push(...path.nodes)
            edges.push(...path.edges)
        }
    }
    return { nodes, edges }
}

function getKeyGraph(rectData, shortestPath) {
    let { id1, id2, isShortest, totalPathLen, shortestPathLen } = rectData
    let keyStr1 = id1 + '->' + id2
    let keyStr2 = id2 + '->' + id1

    for (let path of Object.keys(shortestPath)) {
        // 找到了矩阵块所对应的核心资产链路
        if (path === keyStr1 || path === keyStr2) {
            // 获取链路的节点和边 
            if (isShortest) {
                return getShortestKeyPath(shortestPathLen, shortestPath[path])
            } else {
                return getAllPath(shortestPath[path])
            }
        }
    }
}

function highlightForceChart() {
    // 绘制线
    ctx.strokeStyle = "rgba(255, 255, 255, 1)"
    ctx.beginPath()
    // console.log('highlightForceChart',subGraphNodes,subGraphEdges,coreNodes);
    for (const d of subGraphEdges) {
        ctx.moveTo(d.source.x, d.source.y);
        ctx.lineTo(d.target.x, d.target.y);
        let [x3, y3, x4, y4] = computeArrowPos(d.source.x, d.source.y, d.target.x, d.target.y)
        ctx.moveTo(x3, y3)
        ctx.lineTo(d.target.x, d.target.y)
        ctx.lineTo(x4, y4)
    }
    ctx.stroke()// 使用当前画线样式 绘制当前或已经存在的笔画的方法

    // 绘制点
    ctx.beginPath()
    ctx.fillStyle = 'rgba(9, 255, 252, 1)'
    for (const d of subGraphNodes) {
        ctx.moveTo(d.x, d.y);
        ctx.arc(d.x, d.y, 3, 0, 2 * Math.PI);
    }
    ctx.fill()

    // 绘制核心节点
    ctx.beginPath()
    ctx.fillStyle = 'rgba(251, 86, 128, 1)'
    for (const d of coreNodes) {
        ctx.moveTo(d.x, d.y);
        ctx.arc(d.x, d.y, 3, 0, 2 * Math.PI);
    }
    ctx.fill()


}

onUpdated(() => {
    if (!isSimulating.value) {
        draw(forceData.value)
    }
})

onMounted(() => {
    promptBox = d3.select('#tooltip')
    canvasWidth = document.getElementById('force-key-path').offsetWidth
    canvasHeight = document.getElementById('force-key-path').offsetHeight

    d3.select('#force-key-path')
        .on('mousemove',function(event){
            let [invertX,invertY] = scaleFactor.value.invert(d3.pointer(event))
            let [posX,posY] = d3.pointer(event,d3.select('body').node())
            let node = simulation.value.find(invertX, invertY, 3)
            if(node instanceof Object){
                promptBox
                    .attr('class', 'prompt-show')
                    .style('font-color', '#fff')
                    .text(node.numID + ':' + node.id)
                    .style('top', posY - 30 + 'px')
                    .style('left', posX + 5 + 'px')
            }else {
                promptBox
                    .attr('class', 'prompt-hide')
            }
        })
})

function drawForceChart(nodes, links) {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    ctx.save();
    ctx.translate(scaleFactor.value.x, scaleFactor.value.y);
    ctx.scale(scaleFactor.value.k, scaleFactor.value.k);
    ctx.strokeStyle = "rgba(163, 163, 163, 0.3)"
    ctx.beginPath();// 开始新笔画
    for (const d of links) {
        ctx.moveTo(d.source.x, d.source.y);
        ctx.lineTo(d.target.x, d.target.y);
        let [x3, y3, x4, y4] = computeArrowPos(d.source.x, d.source.y, d.target.x, d.target.y)
        ctx.moveTo(x3, y3)
        ctx.lineTo(d.target.x, d.target.y)
        ctx.lineTo(x4, y4)
    }
    ctx.stroke()// 使用当前画线样式 绘制当前或已经存在的笔画的方法

    ctx.beginPath()

    ctx.fillStyle = 'rgba(0, 75, 107, 0.8)'
    for (const d of nodes) {
        ctx.moveTo(d.x, d.y);
        ctx.arc(d.x, d.y, 3, 0, 2 * Math.PI);
    }
    ctx.fill()

    highlightForceChart()

    ctx.restore();
}


function draw(rawData) {
    d3.select('#force-canvas-key').attr('width', canvasWidth).attr('height', canvasHeight)
    ctx = document.getElementById('force-canvas-key').getContext('2d')
    const nodes = rawData.nodes // {numID id type} numID对应边 id唯一标识节点
    const links = rawData.edges // {source,target} 

    drawForceChart(nodes, links)
}

</script>

<template>
    <div id="force-key-path" class="image-box">
        <div id="loading-data" v-if="isSimulating">Data is loading...</div>
        <canvas v-else id="force-canvas-key"></canvas>
    </div>
</template>

<style scoped>
#force-key-path {
    /* margin-top: 1%; */
    position: relative;
    width: 100%;
    height: 100%;
    background-color: rgb(16, 12, 42);
    /* background-color: rgb(143, 187, 238); */
}

#loading-data {
    width: 150px;
    height: 40px;
    color: #fff;
    line-height: 40px;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
}
</style>