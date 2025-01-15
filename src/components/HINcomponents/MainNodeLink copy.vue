<script setup>
import { onMounted, watch, computed } from 'vue'
import * as d3 from 'd3'
import { storeToRefs } from 'pinia'
import { useForceConfigStore } from '../../stores/forceConfigStore'
import { G1Graph } from '../../api/serverDataProvider'
import { useForceStore } from '../../stores/forceStore'
import { computeArrowPos } from '../../utils/computeArrowPos'
import { colorConfig } from '../../utils/colorConfig'

import G1 from '../../HIN_data/Ours/CAG/G1graph.json'

console.log('G1:', G1);


let canvasWidth
let canvasHeight
let ctx
// 力导向图数据，使用store中的数据计算比较卡，原因未知...
let forceRawData
let transform = d3.zoomIdentity
let promptBox = d3.select("#tooltip");
let nodeControlTooltip = d3.select("#tooltip-node-control");
let body = d3.select("body");
let canvas_chart

const store = useForceConfigStore()
const forceDataStore = useForceStore()
const { selectValue, forceConfig } = storeToRefs(store)
const { forceData } = storeToRefs(forceDataStore)
const { updataRawData, updateSimulating } = forceDataStore
const { updataScaleFactor, updataSimulation } = store


// zoom行为应该只是平移与缩放坐标系，节点原始坐标未发生变化，所以不需要重新计算
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

// watch([selectValue, forceConfig], ([curV, curFC], [preV, preFC]) => {
//     if (curV != preV) {
//         G1Graph(curV).then((res) => {
//             forceRawData = res.data
//             draw(res.data)
//         });

//     }
//     // console.log(curV,preV,curFC,preFC);
//     let str1 = JSON.stringify(curFC)
//     let str2 = JSON.stringify(preFC)
//     // console.log(str1,str2);
//     if (str1 !== str2) {
//         draw(forceRawData)

//     }
// })


onMounted(async () => {
    canvasWidth = document.getElementById('main-nl-chart').offsetWidth
    canvasHeight = document.getElementById('main-nl-chart').offsetHeight
    console.log('canvasWidth:', canvasWidth, 'canvasHeight:', canvasHeight);


    canvas_chart = d3.select('#main-force-canvas').attr('width', canvasWidth).attr('height', canvasHeight)
    ctx = document.getElementById('main-force-canvas').getContext('2d')

    // G1Graph(selectValue.value).then((res) => {
    //     forceRawData = res.data
    //     draw(res.data)
    // });

    try {
        const data2 = await d3.json(`src/HIN_data/Ours/CAG/G2graph.json`)
        forceRawData = data2
        const data3 = await d3.json(`src/HIN_data/Ours/CAG/G3graph.json`)
        draw(data2, data3)
    } catch (error) {
        console.log(error);
    }
})


function ticked(nodes, links, part) {
    ctx.save();
    if(part == 'left'){
        ctx.clearRect(0, 0, canvasWidth/2, canvasHeight);
    }
    else if(part == 'right'){
        ctx.clearRect(canvasWidth/2, 0, canvasWidth, canvasHeight);
    }
    else{
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    }
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
    ticked(forceRawData.nodes, forceRawData.edges)
}

const drag = simulation => {
    function dragStart(event, node) {
        updateSimulating(true)
        if (!event.active) simulation.alphaTarget(0.3).restart();
        event.subject.fx = event.subject.x
        event.subject.fy = event.subject.y
    }
    function draged(event, node) {
        let pos = d3.pointer(event, ctx.canvas)
        let [x, y] = transform.invert(pos)
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

function draw(rawData1, rawData2) {
    updateSimulating(true)
    const {
        collideRadius,
        collideIterations,
        collideStrength,
        manyBodyStrength,
        manyBodyStrengDisMin,
        manyBodyStrengDisMax, } = forceConfig.value

    let nodes = rawData1.nodes // {numID id type} numID对应边 id唯一标识节点
    let links = rawData1.edges // {source,target} 

    const simulation1 = d3.forceSimulation(nodes)
        .alphaDecay(0.05)
        .force('links', d3.forceLink(links).distance(0).strength(1).id(node => node.numID))
        .force('charge', d3.forceManyBody().strength(-30).strength(manyBodyStrength).distanceMin(manyBodyStrengDisMin).distanceMax(manyBodyStrengDisMax))
        .force('collide', d3.forceCollide().radius(collideRadius).strength(collideStrength).iterations(collideIterations))
        .force('center', d3.forceCenter(canvasWidth / 4, canvasHeight / 2))
        .on('tick', () => ticked(nodes, links, 'left'))
        .on('end', () => {
            // updataRawData(rawData)
            updateSimulating(false)
            // updataSimulation(simulation)
        })
    
    let nodes2 = rawData2.nodes
    let links2 = rawData2.edges
    const simulation2 = d3.forceSimulation(nodes2)
        .alphaDecay(0.05)
        .force('links', d3.forceLink(links2).distance(0).strength(1).id(node => node.numID))
        .force('charge', d3.forceManyBody().strength(-30).strength(manyBodyStrength).distanceMin(manyBodyStrengDisMin).distanceMax(manyBodyStrengDisMax))
        .force('collide', d3.forceCollide().radius(collideRadius).strength(collideStrength).iterations(collideIterations))
        .force('center', d3.forceCenter(canvasWidth*3 / 4, canvasHeight / 2))
        .on('tick', () => ticked(nodes2, links2, 'right'))
        .on('end', () => {
            // updataRawData(rawData)
            updateSimulating(false)
            // updataSimulation(simulation)
        })

    d3.select(ctx.canvas)
        // .call(drag(simulation)
        //     // 指定drag事件的目标，因为添加了zoom行为，因此要将获取的坐标x,y转化为原始的未缩放之前的节点坐标
        //     // 节点的坐标是一直不变的。
        // .subject(({ x, y }) => {

        //     let [invertX, invertY] = transform.invert([x, y])
        //     // console.log('{x,y}:',x,y,', [invertX, invertY]:',invertX, invertY);
        //     return simulation.find(invertX, invertY, 3)
        // }))
        // .call(zoomBehaviour)
        // .call(addEvent, simulation)
}

function addEvent(selection, simulation) {
    selection
        .on("mouseover.over", function (event, d) {

        })
        .on("mousemove", function (event) {
            let [posX, posY] = d3.pointer(event, body); // 相对于body的坐标
            let [invertX, invertY] = transform.invert(d3.pointer(event)) // 节点坐标
            let current_node = simulation.find(invertX, invertY, 3)
            if (current_node) {
                promptBox
                    .attr("class", "prompt-show")
                    .text(current_node.numID + ':' + current_node.id)
                    .style("top", posY - 15 + "px")
                    .style("left", posX + 15 + "px")
            }
            else {
                promptBox
                    .attr('class', 'prompt-hide')
            }    
        })
        .on("mouseout.out", function () {
            // promptBox.attr("class", "prompt-hide");
        })
        .on('click',function(event){
            promptBox.attr('class', 'prompt-hide')

            let [posX, posY] = d3.pointer(event, body); // 相对于body的坐标
            let [invertX, invertY] = transform.invert(d3.pointer(event)) // 节点坐标
            let current_node = simulation.find(invertX, invertY, 3)
            if (current_node) {
                nodeControlTooltip
                    .attr("class", "prompt-show")
                    .style("top", posY + "px")
                    .style("left", posX + "px")
                    .html(
                        `
                            <div>numID: ${current_node.numID}</div>
                            <div data-action="addToSet" data-node='${JSON.stringify(current_node)}'>添加至查询</div>
                            <div data-action="expandNode" data-node='${JSON.stringify(current_node)}'>展开节点</div>
                            <div data-action="selectSelfNeighbor" data-node='${JSON.stringify(current_node)}'>选中邻居</div>
                            <div data-action="cancelSelect" data-node='${JSON.stringify(current_node)}'>取消选中</div>
                            <div data-action="copyNodeInfo" data-node='${JSON.stringify(current_node)}'>复制节点名称</div>
                            <div data-action="quitPanel" data-node='${JSON.stringify(nodeControlTooltip)}'>退出</div>
                        `
                    );
            }
            else {
                nodeControlTooltip
                    .attr('class', 'prompt-hide')
            }
        })
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
    <div id="main-nl-chart">
        <canvas id="main-force-canvas"></canvas>
    </div>

</template>

<style scoped>
#main-nl-chart {
    width: 100%;
    height: 100%;
    /* flex-direction: column; */
    /* align-items: center;
    justify-content: center; */
    background-color: white;
}

</style>