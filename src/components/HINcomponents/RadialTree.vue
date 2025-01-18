<script setup>
import { onMounted, watch, computed, ref } from 'vue'
import * as d3 from 'd3'
import { storeToRefs } from 'pinia'
import { useForceConfigStore } from '../../stores/forceConfigStore'
import { G1Graph } from '../../api/serverDataProvider'
import { useForceStore } from '../../stores/forceStore'
import { computeArrowPos } from '../../utils/computeArrowPos'
import { convertToHierarchy } from '../../utils/Utils'
import { colorConfig, HINColorConfig, HINEdgeColorConfig } from '../../utils/colorConfig'

import G1 from '../../HIN_data/Ours/CAG/G1graph.json'

// console.log('G1:', G1);


let svgWidth
let svgHeight
let ctx
// 力导向图数据，使用store中的数据计算比较卡，原因未知...
let forceRawData
let transform = d3.zoomIdentity
let promptBox = d3.select("#tooltip");
let nodeControlTooltip
let body = d3.select("body");
let svg_chart, firstExpandDepth, expandDepth, radius, selectNumID 
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
        // forceZoomed()
        svg_chart.selectAll('g').attr('transform', transform);
    })
    .on('end', () => {
        updateSimulating(false)
    })


onMounted(async () => {
    selectNumID = 850
    firstExpandDepth = 3
    expandDepth = 2 // 设置点击后展开的最大层数
    nodeControlTooltip = d3.select("#tree-tooltip");

    svgWidth = document.getElementById('tree-chart').offsetWidth
    svgHeight = document.getElementById('tree-chart').offsetHeight

    svg_chart = d3.select('#radial-tree-svg')
        .attr('width', svgWidth)
        .attr('height', svgHeight)
        .attr("style", "font: 8px sans-serif;")
        .attr("viewBox", [-svgWidth/2, -svgHeight/2, svgWidth, svgHeight])
        // .append('g')
        // .attr('transform', `translate(${svgWidth / 2}, ${svgHeight / 2})`);

    const data = await d3.json(`src/HIN_data/Ours/CAG/G3graph.json`)
    
    drawRadialTree(convertToHierarchy(data, selectNumID, firstExpandDepth))
})



// 绘制环形树图
function drawRadialTree(data) {
  // Specify the chart’s dimensions.
//   const width = Math.min(svgWidth, svgHeight);
//   const height = width;
//   const cx = width * 0.5; // adjust as needed to fit
//   const cy = height * 0.5; // adjust as needed to fit
  const radius = Math.max(svgWidth, svgHeight) / 2;

  // Create a radial tree layout. The layout’s first dimension (x)
  // is the angle, while the second (y) is the radius.
  const tree = d3.tree()
      .size([2 * Math.PI, radius])
      .separation((a, b) => (a.parent == b.parent ? 1 : 2) / a.depth);

  // Sort the tree and apply the layout.
  const root = tree(d3.hierarchy(data)
      .sort((a, b) => d3.ascending(a.data.name, b.data.name)));

  // Creates the SVG container.
//   const svg = d3.create("svg")
//       .attr("width", width)
//       .attr("height", height)
//       .attr("viewBox", [-cx, -cy, width, height])
//       .attr("style", "width: 100%; height: auto; font: 10px sans-serif;");

  // Append links.
  svg_chart.append("g")
      .attr("fill", "none")
      .attr("stroke", "#555")
      .attr("stroke-opacity", 0.4)
      .attr("stroke-width", 1.5)
    .selectAll()
    .data(root.links())
    .join("path")
      .attr("d", d3.linkRadial()
          .angle(d => d.x)
          .radius(d => d.y));

  // Append nodes.
  svg_chart.append("g")
    .selectAll()
    .data(root.descendants())
    .join("circle")
      .attr("transform", d => `rotate(${d.x * 180 / Math.PI - 90}) translate(${d.y},0)`)
      .attr("fill", d => colorConfig[d.data.type])
      .attr("r", 3)
    //   .attr("stroke", d => colorConfig[d.data.type])
    //   .attr("fill", d => !d.children ? 'none' : colorConfig[d.data.type]);

  // Append labels.
  svg_chart.append("g")
      .attr("stroke-linejoin", "round")
      .attr("stroke-width", 3)
    .selectAll()
    .data(root.descendants())
    .join("text")
      .attr("transform", d => `rotate(${d.x * 180 / Math.PI - 90}) translate(${d.y},0) rotate(${d.x >= Math.PI ? 180 : 0})`)
      .attr("dy", "0.31em")
      .attr("x", d => d.x < Math.PI === !d.children ? 6 : -6)
      .attr("text-anchor", d => d.x < Math.PI === !d.children ? "start" : "end")
      .attr("paint-order", "stroke")
      .attr("stroke", "white")
      .attr("fill", "currentColor")
      .text(d => d.data.numID);

  svg_chart
   .call(zoomBehaviour)
   .call(addEvent2Svg)
    

  // 绘制路径（每个扇形区域）
//   svg_chart.selectAll('path')
//         .data(root.descendants())
//         .enter()
//         .append('path')
//         .attr('d', arc)
//         .style('fill', d => {
//             const nodeData = d.data;
//             return HINColorConfig[nodeData.type] || 'gray'; // 根据节点类型设置颜色
//         })
//         .attr('stroke', 'black')
//         .attr('stroke-width', 1)
//         .on('click', function(event, d) {
//             const nodeId = d.data.numID;
//             const subTree = bfs(graphData, nodeId, expandDepth);
//             drawRadialTree(subTree); // 重新绘制树形图
//         });
}
function addEvent2Svg(selection){
    selection
        .on("mouseover.over", function (event, d) {
            
        })
        .on("mousemove", function (event, d) {
            let [posX, posY] = d3.pointer(event, body); // 相对于body的坐标
            // console.log('posX, posY：11111', posX, posY);
            if (event.target.tagName === 'circle') {
                d = d3.select(event.target).datum();
                promptBox
                    .attr("class", "prompt-show")
                    .text(d.data.type + ':' + d.data.id)
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
            // let [posX, posY] = d3.pointer(event, body); // 相对于body的坐标
            
            if (event.target.tagName === 'circle') {
                d = d3.select(event.target).datum();
                console.log('posX, posY：', posX, posY, d.data);
                click_node_data.value = d.data
                nodeControlTooltip
                    .attr("class", "prompt-show")
                    .style("top", posY + svgHeight/2 + "px")
                    .style("left", posX + svgWidth/2 + "px")
            }
            else {
                nodeControlTooltip
                    .attr('class', 'prompt-hide')
            }
        })
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
}
function cancelSelect(){
    console.log(`cancelSelect ${click_node_data.value.id}` );
}
function copyNodeInfo(){
    console.log(`naod name: ${click_node_data.value.id}` );
}
function quitPanel(){
    nodeControlTooltip.attr('class', 'prompt-hide')
}
</script>

<template>
    <div id="tree-chart">
        <svg id="radial-tree-svg"></svg>
        <div id="tree-tooltip" class="prompt-hide">
            <div>{{ click_node_data.numID }}</div>
            <div @click="addToSet">添加至查询</div>
            <div @click="expandNode">展开</div>
            <div @click="selectSelfNeighbor">选中邻居</div>
            <div @click="cancelSelect">取消选中</div>
            <div @click="copyNodeInfo">复制节点名称</div>
            <div @click="quitPanel">退出</div>
        </div>
    </div>

</template>

<style scoped>
#tree-chart {
    width: 100%;
    height: 100%;
    background-color: white;
    position: relative;
}
#tree-tooltip{
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
#tree-tooltip >div:hover{
  background-color: rgba(129, 253, 253, 0.5);
}
</style>