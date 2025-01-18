<script setup>
import { onMounted, watch, computed, ref } from 'vue'
import * as d3 from 'd3'
import { storeToRefs } from 'pinia'
import { useForceConfigStore } from '../../stores/forceConfigStore'
import { G1Graph } from '../../api/serverDataProvider'
import { useForceStore } from '../../stores/forceStore'
import { computeArrowPos } from '../../utils/computeArrowPos'
import { colorConfig, HINColorConfig, HINEdgeColorConfig } from '../../utils/colorConfig'

import G1 from '../../HIN_data/Ours/CAG/G1graph.json'

console.log('G1:', G1);


let svgWidth, svgHeight, ctx, svg_chart, nodes1, links1, nodes2, links2
// 力导向图数据，使用store中的数据计算比较卡，原因未知...
let forceRawData={}
let transform = d3.zoomIdentity
let promptBox = d3.select("#tooltip");
let nodeControlTooltip
let container
let body = d3.select("body");
let click_node_data = ref({})

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
        svg_chart.selectAll('g').attr('transform', transform);
        // console.log('transform', transform);
        
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
    svgWidth = document.getElementById('main-nl-chart').offsetWidth
    svgHeight = document.getElementById('main-nl-chart').offsetHeight
    nodeControlTooltip = d3.select("#main-tooltip");
    container = d3.select('#main-nl-chart')
    // console.log('svgWidth:', svgWidth, 'svgHeight:', svgHeight);


    svg_chart = d3.select('#main-force-canvas')
        .attr('width', svgWidth)
        .attr('height', svgHeight)
        .attr("viewBox", [0, 0, svgWidth, svgHeight])
        .style("font", "10px Microsoft Yahei");
    // ctx = document.getElementById('main-force-canvas').getContext('2d')

    // G1Graph(selectValue.value).then((res) => {
    //     forceRawData = res.data
    //     draw(res.data)
    // });


    const data2 = await d3.json(`src/HIN_data/Ours/CAG/G2graph.json`)
    const data3 = await d3.json(`src/HIN_data/Ours/CAG/G3graph.json`)
    // draw(data2, data3)
    draw(data2, JSON.parse(JSON.stringify(data2)))

})


function ticked(nodes, links, part) {
    ctx.save();
    if(part == 'left'){
        ctx.clearRect(0, 0, svgWidth/2, svgHeight);
    }
    else if(part == 'right'){
        ctx.clearRect(svgWidth/2, 0, svgWidth, svgHeight);
    }
    else{
        ctx.clearRect(0, 0, svgWidth, svgHeight);
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

function svg_ticked(nodes, links){
    nodes
    .attr('cx', d => d.x)
    .attr('cy', d => d.y);
    
    links
        .attr('x1', d => {
            // console.log('d', d);
            return d.source.x
        })
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y);
}

const forceZoomed = () => {
    // ticked(forceRawData.nodes, forceRawData.edges)
    // svg_ticked(svg_chart.selectAll('g').selectAll('circle'), svg_chart.selectAll('g').selectAll('line'))
    // console.log(svg_chart.selectAll('circle'), svg_chart.selectAll('line'));
    
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

    nodes1 = rawData1.nodes // {numID id type} numID对应边 id唯一标识节点
    links1 = rawData1.edges // {source,target} 

    const simulation1 = d3.forceSimulation(nodes1)
        .alphaDecay(0.05)
        .force('links', d3.forceLink(links1).distance(0).strength(1).id(node => node.numID))
        .force('charge', d3.forceManyBody().strength(-30).strength(manyBodyStrength).distanceMin(manyBodyStrengDisMin).distanceMax(manyBodyStrengDisMax))
        .force('collide', d3.forceCollide().radius(collideRadius).strength(collideStrength).iterations(collideIterations))
        .force('center', d3.forceCenter(svgWidth / 4, svgHeight / 2))
        // .on('tick', () => ticked(node1, links1, 'left'))
        .on('end', () => {
            // updataRawData(rawData)
            updateSimulating(false)
            // updataSimulation(simulation)
        })
    
    nodes2 = rawData2.nodes
    links2 = rawData2.edges
    const simulation2 = d3.forceSimulation(nodes2)
        .alphaDecay(0.05)
        .force('links', d3.forceLink(links2).distance(0).strength(1).id(node => node.numID))
        .force('charge', d3.forceManyBody().strength(-30).strength(manyBodyStrength).distanceMin(manyBodyStrengDisMin).distanceMax(manyBodyStrengDisMax))
        .force('collide', d3.forceCollide().radius(collideRadius).strength(collideStrength).iterations(collideIterations))
        .force('center', d3.forceCenter(svgWidth*3 / 4, svgHeight / 2))
        // .on('tick', () => ticked(nodes2, links2, 'right'))
        .on('end', () => {
            // updataRawData(rawData)
            updateSimulating(false)
            // updataSimulation(simulation)
        })
    
    const nodelink_1gs = svg_chart.append('g')    
    // 绘制链接
    const linklist1 = nodelink_1gs.selectAll('line')
        .data(links1)
        .enter().append('line')
        .attr('stroke', '#ccc')
        .attr('stroke-width', 2);

    // 绘制节点
    const nodelist1 = nodelink_1gs.selectAll('circle')
        .data(nodes1)
        .enter().append('circle')
        .attr('r', 5)
        .attr('fill', d => colorConfig[d.type]);

    const nodelink_2gs = svg_chart.append('g')
    // 绘制链接
    const linklist2 = nodelink_2gs.selectAll('line')
        .data(links2)
        .enter().append('line')
        .attr('stroke', '#ccc')
        .attr('stroke-width', 2);

    // 绘制节点
    const nodelist2 = nodelink_2gs.selectAll('circle')
        .data(nodes2)
        .enter().append('circle')
        .attr('r', 5)
        .attr('fill', d => colorConfig[d.type]);

    simulation1.on('tick', () => svg_ticked(nodelist1, linklist1));  
    simulation2.on('tick', () => svg_ticked(nodelist2, linklist2));  
    // forceRawData.nodes = nodes1.concat(nodes2)
    // forceRawData.links = links1.concat(links2)

    // d3.select(ctx.canvas)
    svg_chart
        // .call(drag(simulation)
        //     // 指定drag事件的目标，因为添加了zoom行为，因此要将获取的坐标x,y转化为原始的未缩放之前的节点坐标
        //     // 节点的坐标是一直不变的。
        // .subject(({ x, y }) => {

        //     let [invertX, invertY] = transform.invert([x, y])
        //     // console.log('{x,y}:',x,y,', [invertX, invertY]:',invertX, invertY);
        //     return simulation.find(invertX, invertY, 3)
        // }))
        .call(zoomBehaviour)
        // .call(addEvent, simulation)
        .call(addEvent2Svg)
}

function addEvent2Svg(selection){
    selection
        .on("mouseover.over", function (event, d) {
            
        })
        .on("mousemove", function (event, d) {
            let [posX, posY] = d3.pointer(event, body); // 相对于body的坐标
            if (event.target.tagName === 'circle') {
                d = d3.select(event.target).datum();
                promptBox
                    .attr("class", "prompt-show")
                    .text(d.numID + ':' + d.id)
                    .style("top", posY - 15 + "px")
                    .style("left", posX + 15 + "px")
                // console.log(data);  // 输出绑定的数据
            }
            else {
                promptBox
                    .attr('class', 'prompt-hide')
            }    
        })
        .on("mouseout.out", function () {

        })
        .on('click',function(event, d){
            promptBox.attr('class', 'prompt-hide')

            let [posX, posY] = d3.pointer(event); // 相对于container的坐标
            if (event.target.tagName === 'circle') {
                d = d3.select(event.target).datum();
                click_node_data.value = d
                nodeControlTooltip
                    .attr("class", "prompt-show")
                    .style("top", posY + "px")
                    .style("left", posX + "px")
            }
            else {
                nodeControlTooltip
                    .attr('class', 'prompt-hide')
            }
        })
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
        cx = svgWidth * 0.85
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

function addLine(selection, lineDatum){
    selection.append('g')
    .attr('id', lineDatum.edgeID)
    .selectAll('line')
        .data([lineDatum])
        .enter().append('line')
        .attr('stroke', '#f26223')
        .attr('stroke-width', 4)
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y);
}


function addToSet(){
    console.log(`add ${click_node_data.value.id} to search set` , click_node_data);
}
function expandNode(){
    console.log(`expand ${click_node_data.value.id}` );
}
function selectSelfNeighbor(){
    console.log(`selectSelfNeighbor ${click_node_data.value.id}` );
}
function selectSelf(){
    console.log(`selectSelfNeighbor ${click_node_data.value.id}` );
    let selectNumID = click_node_data.value.numID
    // 在nodes1,2中查找相同numID的node
    let n1 = nodes1.find(n => n.numID === selectNumID)
    let n2 = nodes2.find(n => n.numID === selectNumID)
    let lineDatum = {source:{x:n1.x, y:n1.y},target:{x:n2.x, y:n2.y},edgeID:'id'+selectNumID}
    // console.log('lineDatum:',lineDatum)

    svg_chart.call(addLine, lineDatum)
    nodeControlTooltip.attr('class', 'prompt-hide')
}
function cancelSelect(){
    console.log(`cancelSelect ${click_node_data.value.id}` );
    d3.select(`#main-force-canvas>#id${click_node_data.value.numID}`).remove()
    nodeControlTooltip.attr('class', 'prompt-hide')
}
function copyNodeInfo(){
    console.log(`naod name: ${click_node_data.value.id}` );
}
function quitPanel(){
    nodeControlTooltip.attr('class', 'prompt-hide')
}


</script>

<template>
    <div id="main-nl-chart">
        <!-- <canvas id="main-force-canvas"></canvas> -->
        <svg id="main-force-canvas"></svg>
        <div id="main-tooltip" class="prompt-hide">
            <div>{{ click_node_data.numID }}</div>
            <div @click="selectSelf">选中节点</div>
            <div @click="cancelSelect">取消选中</div>
            <div @click="selectSelfNeighbor">选中邻居</div>
            <div @click="addToSet">添加至查询</div>
            <div @click="copyNodeInfo">复制节点名称</div>
            <div @click="quitPanel">退出</div>
        </div>
        <div id="nodelink-tooltip">
            <div>节点类型</div>
            <div class="legend">
                <div class="legend-item" v-for="n in HINColorConfig">
                    <!-- <el-tag :key="n.color" :color="n.color" size="small" round="true"/> -->
                     <div class="legend-circle" :style="{'background':n.color}"></div>
                    <span>{{ n.nodetype }}</span>
                </div>
            </div>
            <div>边类型</div>
            <div class="legend">
                <div class="legend-item" v-for="n in HINEdgeColorConfig">
                    <!-- <el-tag :key="n.color" :color="n.color" size="small" style="width: 50px; height: 5px;"/> -->
                    <div class="legend-rect" :style="{'background':n.color}"></div>
                    <span>{{ n.edgetype }}</span>
                </div>
            </div>

        </div>

    </div>

</template>

<style scoped>
#main-nl-chart {
    width: 100%;
    height: 100%;
    position: relative;
    /* flex-direction: column; */
    /* align-items: center;
    justify-content: center; */
    background-color: white;
}
#main-tooltip{
    width: 100px;
  font-size: 10px;
  font-family: 'Microsoft Yahei';
  border: none;
  color: white;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  background-color: rgba(0, 0, 0, 0.5);
  cursor: pointer;
}
#main-tooltip >div:hover{
  background-color: rgba(129, 253, 253, 0.5);
}

#nodelink-tooltip{
    width: 150px;
    height: 330px;
    background-color: rgba(232, 230, 226,.5);
    position: absolute;
    top: 0;
    right: 0;
}

.legend{
    display: flex;
    width: 100%;
    flex-wrap: wrap;
    font-size: 11px;
}
.legend-item{
    /* width: 50%; */
    min-width: 50%;
    flex-grow: 1;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    /* justify-content: space-around; */
}
.legend-circle{
    width: 10px;
    height: 10px;
    margin: 0 5px;
    flex-shrink: 0;
    border-radius: 50%;
}
.legend-rect{
    width: 50px; 
    height: 3px;
    margin: 0 5px;
}
/* .edge-lable{

} */

</style>