<script setup>
import { onMounted, watch, computed } from 'vue'
import * as d3 from 'd3'
import { storeToRefs } from 'pinia'
import { useForceConfigStore } from '../stores/forceConfigStore'
import { G1Graph } from '../api/serverDataProvider'
import { useForceStore } from '../stores/forceStore'
import { computeArrowPos } from '../utils/computeArrowPos'
import { colorConfig } from '../utils/colorConfig'

let canvasWidth
let canvasHeight
let ctx
// 力导向图数据，使用store中的数据计算比较卡，原因未知...
let forceRawData
let transform = d3.zoomIdentity
const store = useForceConfigStore()
const forceDataStore = useForceStore()
const { selectValue, forceConfig } = storeToRefs(store)
const { forceData } = storeToRefs(forceDataStore)
const { updataRawData, updateSimulating } = forceDataStore
const { updataScaleFactor, updataSimulation } = store

const zoomBehaviour = d3.zoom()
    .scaleExtent([-3, 3])
    .on('start', () => {
        updateSimulating(true)
    })
    .on('zoom', event => {
        transform = event.transform
        updataScaleFactor(transform)
        forceZoomed()
    })
    .on('end', () => {
        updateSimulating(false)
    })

watch([selectValue, forceConfig], ([curV,curFC],[preV,preFC]) => {
    if(curV != preV){
        G1Graph(curV).then((res) => {
            forceRawData = res.data
            draw(res.data)
        });
        
    }
    // console.log(curV,preV,curFC,preFC);
    let str1 = JSON.stringify(curFC)
    let str2 = JSON.stringify(preFC)
    // console.log(str1,str2);
    if(str1 !== str2){
        draw(forceRawData)

    }
})


onMounted(() => {
    canvasWidth = document.getElementById('force-chart').offsetWidth
    canvasHeight = document.getElementById('force-chart').offsetHeight

    d3.select('#force-canvas').attr('width', canvasWidth).attr('height', canvasHeight)
    ctx = document.getElementById('force-canvas').getContext('2d')

    G1Graph(selectValue.value).then((res) => {
        forceRawData = res.data
        draw(res.data)
    });
})


function ticked(nodes, links) {
    ctx.save();
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    // 不可以在ctx.save() ctx.restore() 之外绘制或者缩放，会出现未知问题 原因暂时未知
    ctx.translate(transform.x, transform.y);
    ctx.scale(transform.k, transform.k);
    ctx.beginPath();// 开始新笔画
    ctx.strokeStyle = "#aaa"
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
    ctx.strokeStyle = "#fff"
    for (const d of nodes) {
        ctx.moveTo(d.x, d.y);
        ctx.arc(d.x, d.y, 3, 0, 2 * Math.PI);
        ctx.stroke()
        ctx.fillStyle = colorConfig[d.type]
        ctx.fill()
        ctx.beginPath()
    }
    ctx.fill();
    ctx.stroke();
    ctx.beginPath()
    ctx.restore();
    
    drawToolTip()
}

const forceZoomed = () => {
    ticked(forceRawData.nodes,forceRawData.edges)
}

const drag = simulation => {
    function dragStart(event, node) {
        updateSimulating(true)
        if (!event.active) simulation.alphaTarget(0.3).restart();
        event.subject.fx = event.subject.x
        event.subject.fy = event.subject.y
    }
    function draged(event, node) {
        let pos = d3.pointer(event,ctx.canvas)
        let [x,y] = transform.invert(pos)
        event.subject.fx = x
        event.subject.fy = y
    }
    function dragEnd(event, node) {
        if (!event.active) simulation.alphaTarget(0);
        event.subject.fx = null
        event.subject.fy = null
    }
    return d3.drag().on('start', dragStart).on('drag', draged).on('end', dragEnd)
}

function draw(rawData) {
    updateSimulating(true)
    const { 
        collideRadius,
        collideIterations,
        collideStrength,
        manyBodyStrength,
        manyBodyStrengDisMin,
        manyBodyStrengDisMax, } = forceConfig.value

    const nodes = rawData.nodes // {numID id type} numID对应边 id唯一标识节点
    const links = rawData.edges // {source,target} 

    const simulation = d3.forceSimulation(nodes)
        .alphaDecay(0.05)
        .force('links', d3.forceLink(links).distance(0).strength(1).id(node => node.numID))
        .force('charge', d3.forceManyBody().strength(-30).strength(manyBodyStrength).distanceMin(manyBodyStrengDisMin).distanceMax(manyBodyStrengDisMax))
        .force('collide', d3.forceCollide().radius(collideRadius).strength(collideStrength).iterations(collideIterations))
        .force('center', d3.forceCenter(canvasWidth / 2, canvasHeight / 2))
        .on('tick', () => ticked(nodes, links))
        .on('end', () => {
            updataRawData(rawData)
            updateSimulating(false)
            updataSimulation(simulation)
        })

    d3.select(ctx.canvas)
        .call(drag(simulation)
        .subject(({ x, y }) => {
            let [invertX,invertY] = transform.invert([x,y])
            return simulation.find(invertX, invertY, 3)
        }))
        .call(zoomBehaviour)
}

function drawToolTip() {

    let currentRow = 1
    let lineheight = 14
    let cx
    let cy

    for (const key of Object.keys(colorConfig)) {
        cx = canvasWidth * 0.85
        cy = (currentRow++) * lineheight

        ctx.beginPath()
        ctx.moveTo(cx, cy);
        ctx.arc(cx, cy, 3, 0, 2 * Math.PI)
        ctx.fillStyle = colorConfig[key]
        ctx.fill()
        ctx.font = `${lineheight}px serif`
        ctx.fillText(key, cx + 16, cy + 5)
    }
}

</script>

<template>
    <div id="force-chart" class="image-box"><canvas id="force-canvas"></canvas></div>
</template>

<style scoped>
#force-chart {
    width: 45%;
    height: 100%;
    background-color: rgb(16, 12, 42);
}
</style>