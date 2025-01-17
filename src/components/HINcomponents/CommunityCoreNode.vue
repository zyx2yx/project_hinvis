<script setup>
import * as d3 from 'd3'
import { onMounted } from 'vue'

let svgWidth, svgHeight, svg_chart, colors, minLength


// 示例数据
const data = 
[

[
    { A: 0, B: 1, C: 1, D: 1, E: 0, F:0, G:1, H:0,I:1 },
    { A: 1, B: 1, C: 1, D: 0, E: 1, F:0, G:1, H:0,I:1 },
    { A: 0, B: 0, C: 1, D: 1, E: 1 , F:0, G:1, H:0,I:1},
    { A: 1, B: 1, C: 0, D: 1, E: 0 , F:0, G:1, H:0,I:1},
],
[
    { A: 0, B: 1, C: 1, D: 1, E: 0, F:0, G:1, H:0,I:1 },
    { A: 1, B: 1, C: 1, D: 0, E: 1, F:0, G:1, H:0,I:1 },
    { A: 1, B: 1, C: 1, D: 0, E: 1, F:0, G:1, H:0,I:1 },
    { A: 0, B: 0, C: 1, D: 1, E: 1 , F:0, G:1, H:0,I:1},
    { A: 0, B: 0, C: 1, D: 1, E: 1 , F:0, G:1, H:0,I:1},
    { A: 1, B: 1, C: 0, D: 1, E: 0 , F:0, G:1, H:0,I:1},
],
[
    { A: 0, B: 1, C: 1, D: 1, E: 0, F:0, G:1, H:0,I:1 },
    { A: 1, B: 1, C: 1, D: 0, E: 1, F:0, G:1, H:0,I:1 },
    { A: 0, B: 0, C: 1, D: 1, E: 1 , F:0, G:1, H:0,I:1},
    { A: 1, B: 1, C: 0, D: 1, E: 0 , F:0, G:1, H:0,I:1},
    { A: 1, B: 1, C: 0, D: 1, E: 0 , F:0, G:1, H:0,I:1},
],
[
    { A: 0, B: 1, C: 1, D: 1, E: 0, F:0, G:1, H:0,I:1 },
    { A: 0, B: 1, C: 1, D: 1, E: 0, F:0, G:1, H:0,I:1 },
    { A: 1, B: 1, C: 1, D: 0, E: 1, F:0, G:1, H:0,I:1 },
    { A: 1, B: 1, C: 1, D: 0, E: 1, F:0, G:1, H:0,I:1 },
    { A: 0, B: 0, C: 1, D: 1, E: 1 , F:0, G:1, H:0,I:1},
    { A: 0, B: 0, C: 1, D: 1, E: 1 , F:0, G:1, H:0,I:1},
    { A: 1, B: 1, C: 0, D: 1, E: 0 , F:0, G:1, H:0,I:1},
],
]

onMounted(async () => {
    svgWidth = document.getElementById('core-nodes-chart').offsetWidth
    svgHeight = document.getElementById('core-nodes-chart').offsetHeight
    let heightScale = 5
    // console.log(svgWidth,svgHeight);
    
    minLength = Math.min(svgWidth, svgHeight)
    svg_chart = d3.select('#core-nodes-svg')
        .attr('width', svgWidth)
        .attr('height', svgHeight * heightScale)
        .attr("viewBox", [0, 0, svgWidth, svgHeight * heightScale])
        // .attr("viewBox", [-svgWidth / 2, -svgHeight / 2, svgWidth, svgHeight])
        // .style("font", "10px Microsoft Yahei");
        // .attr("style", "max-width: 100%; font: 10px sans-serif;")
        .append("g")
        // .attr("transform", `translate(${minLength / 2}, ${minLength / 2})`);
        .attr("transform", `translate(0, 20)`);

    colors = d3.scaleOrdinal(d3.quantize(d3.interpolateYlOrBr, Object.keys(data[0][0]).length + 1))
        .domain(Object.keys(data[0][0]))
    
    // try {
    //     const data2 = await d3.json(`src/HIN_data/Ours/CAG/G2graph.json`)
    //     forceRawData = data2
    //     const data3 = await d3.json(`src/HIN_data/Ours/CAG/G3graph.json`)
    //     draw(data2, data3)
    // } catch (error) {
    //     console.log(error);
    // }

    // 调用绘制函数
    drawRadialStackedBarChart(data);
})

function drawRadialStackedBarChart(data) {
    // console.log('drawRadialStackedBarChart');
    
    let maxNumPerLine = 3
    let itemLen = minLength / maxNumPerLine
    let whiteSpaceNum = 2 // 每个柱子之间的间隔大小系数
    const gaplength = 50
    // const { colors } = config;
    const rectLegth = Math.min(svgWidth, svgHeight) - gaplength
    const innerRadius = 10
    const outerRadius = rectLegth / (2*maxNumPerLine)
    const numSubBars = Object.keys(data[0][0]).length; // 每个柱子的小柱子数量

    // 创建径向条形图
    for (let row = 0; row < data.length; row++) {

        // 动态计算柱子数量和每个柱子的小柱子数量
        let numBars = data[row].length; // 总柱子数量
        let barWidth = (2 * Math.PI) / (numBars+whiteSpaceNum); // 每个柱子的角宽度
        let subBarHeight = (outerRadius - innerRadius) / numSubBars; // 每个小柱子的高度

        // 生成第i个花朵的区域
        let gs = svg_chart.append('g').attr('transform', () => {
            // 得到第i朵花所在的列数和行数 从0 0开始编号
            let column = row % maxNumPerLine
            let r = Math.floor(row / maxNumPerLine)
            return `translate(${column * itemLen + itemLen / 2},${r * itemLen + itemLen / 2})`
        })
        gs
            .append('text')
            // .text(data[i].communityNumber)
            .text(row)
            .attr('x', -4)
            .attr('y', 4)
            .attr('fill', 'brown')

        // let gs = svg_chart.append('g').attr('transform', () => `translate(0,${row * minLength})`)
        data[row].forEach((d, i) => {
            // const angle = i * barWidth; // 当前柱子的角度起点
            // const angle = (i + (i+1)/numBars)* barWidth;
            const angle = i* barWidth + (i+1)*whiteSpaceNum*barWidth/numBars;
    
            Object.entries(d).forEach(([key, value], j) => {
                // 径向位置和高度
                const startRadius = innerRadius + j * subBarHeight;
                const endRadius = startRadius + subBarHeight - 1;
    
                // 如果值为 0，则不填充颜色
                const fillColor = value === 0 ? "none" : colors(key) || "gray";
    
                // 绘制弧形
                const arc = d3.arc()
                    .innerRadius(startRadius)
                    .outerRadius(endRadius)
                    .startAngle(angle)
                    .endAngle(angle + barWidth)
                    .cornerRadius(5)
    
                gs.append("path")
                    .attr("d", arc)
                    .attr("fill", fillColor)
                    .attr("stroke", "gray")
                    .attr("stroke-width", 0.5);
            });
        });
    }
}


</script>

<template>
    <div class="chart-header">核心节点分析</div>
    <div id="core-nodes-chart">
        <svg id="core-nodes-svg"></svg>
    </div>
</template>

<style scoped>
#core-nodes-chart {
    width: 100%;
    height: 100%;
    /* position: relative; */
    overflow-y: hidden;
    overflow-x: hidden;
    /* scrollbar-color: #ff0000 #00ff00; */
    scrollbar-width: thin;
}
#core-nodes-chart:hover{
    overflow-y: scroll;
    scrollbar-color: white #e8e6e2;
    scrollbar-width: thick;
}
.chart-header {
    height: 25px;
    width: 100%;
    font-size: 15px;
    font-weight: bold;
    background-color: #e8e6e2;
    padding-left: 2px;
    border-left: 2px solid white;
    position: absolute;
    top: 0;
    left: 0;
}
</style>