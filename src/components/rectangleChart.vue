<script setup>
import { storeToRefs } from 'pinia'
import { onMounted, watch } from 'vue'
import * as d3 from 'd3'
import { useCorePointsStore } from '../stores/CorePointsStore'
import { useForceConfigStore } from '../stores/forceConfigStore'
import {useKeyGraphStore} from '../stores/keyPathStore'
import {getShortestPath} from '../stores/coreShortestPath'

const pointStore = useCorePointsStore()
const { selectPoints } = storeToRefs(pointStore)
const { updataCoreGraph } = pointStore

const forceConfigStore = useForceConfigStore()
const { selectValue } = storeToRefs(forceConfigStore)

const keyPathGraph = useKeyGraphStore()
const {updataKeyPoints} = keyPathGraph
// 核心资产子图
let subGraph
let promptBox

// 模拟数据
const virtualData = {
    // 核心资产节点
    coreNodes: [
        { id: 1, type: "Domain" },
        { id: 2, type: "Cert" },
        { id: 3, type: "IP" },
        { id: 4, type: "Domain" },
        { id: 5, type: "Domain" },
        { id: 6, type: "Domain" },
    ],
    // 核心资产间链路信息 条数与跳数 数目应为 1+2+...+n-1 = 
    coreLinks: [
        { id1: 1, id2: 2, totalPathLen: 3, shortestPathLen: 1 },
        { id1: 2, id2: 4, totalPathLen: 3, shortestPathLen: 3 },
        { id1: 1, id2: 3, totalPathLen: 4, shortestPathLen: 2 },
        { id1: 3, id2: 4, totalPathLen: 3, shortestPathLen: 1 },
    ]
}

function arrUnique1(nodes) {
    let idArr = Array.from(new Set(nodes.map(node => node.numID)))
    let uniqueNodeArr = idArr.map(id => {
        let uniqueItem = null
        for (let node of nodes) {
            if (node.numID === id) {
                uniqueItem = node
                break
            }
        }
        return uniqueItem
    })
    return uniqueNodeArr
}
function arrUnique2(links) {
    let uniqueLinks = []
    for (let link of links) {
        if (!uniqueLinks.find(item => {
            if (item.source === link.source && item.target === link.target) return true
        })) {
            uniqueLinks.push(link)
        }
    }
    return uniqueLinks
}

function getTotalPathLen(id1, id2, shortestPath) {
    let totalPathLen = 0
    let keyStr1 = id1 + '->' + id2
    let keyStr2 = id2 + '->' + id1

    for (let path of Object.keys(shortestPath)) {
        if (path === keyStr1 || path === keyStr2) {
            totalPathLen = shortestPath[path].length
            break
        }
    }

    return totalPathLen
}

function getShortestPathLen(id1, id2, shortestPath) {
    let shortestPathLen = 10000
    let keyStr1 = id1 + '->' + id2
    let keyStr2 = id2 + '->' + id1

    for (let path of Object.keys(shortestPath)) {
        if (path === keyStr1 || path === keyStr2) {
            for (let link of shortestPath[path]) {
                shortestPathLen = shortestPathLen > link.edges.length ? link.edges.length : shortestPathLen
                // 将选中的核心资产子图信息保存
                subGraph.nodes.push(...link.nodes)
                subGraph.edges.push(...link.edges)
            }
        }
    }

    return shortestPathLen
}

function getCoreLinks(coreNodes, shortestPath) {
    let coreLinks = []
    let length = coreNodes.length
    for (let i = 0; i < length; i++) {
        for (let j = i + 1; j < length; j++) {
            let link = {}
            link.id1 = coreNodes[i].id
            link.id2 = coreNodes[j].id
            link.totalPathLen = getTotalPathLen(link.id1, link.id2, shortestPath)
            link.shortestPathLen = getShortestPathLen(link.id1, link.id2, shortestPath)

            coreLinks.push(link)
        }
    }

    return coreLinks
}

watch(selectPoints, (curV, preV) => {
    // 重置子图
    subGraph = {
        nodes: [],
        edges: []
    }
    // 当选中的点变化时，处理数据然后绘制
    console.log('选中点更新');

    // 更新点
    virtualData.coreNodes = curV.map(node => {
        node.id = node.numID
        return node
    })

    // 更新链路
    virtualData.coreLinks = getCoreLinks(virtualData.coreNodes, getShortestPath())

    subGraph.nodes = arrUnique1(subGraph.nodes)
    subGraph.edges = arrUnique2(subGraph.edges)

    // 更新去重后的子图
    updataCoreGraph(subGraph)

    clearSvg()
    initChart()
})

/*
    1.数据来源：从subGraphStore中取出数据，其中nodes自动设置矩阵块数，links用不着
    2.数据含义：除对角线矩阵块外，其余矩阵块内部需要显示数字，左下绿色块显示对应两个节点的路径条数，右上蓝色块对应两个节点最短路径跳数
    3.颜色：
        1.矩阵块的颜色编码数目大小，越大越深 2.节点颜色与节点类型对应
    4.交互：每个矩阵块可以被点击
*/
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

onMounted(() => {
    promptBox = d3.select('#tooltip')
})

function getExtremeValue() {
    let min1 = 1, max1 = 1, min2 = 1, max2 = 1
    for (let link of virtualData.coreLinks) {
        let m1 = link.totalPathLen
        if (m1 < min1) min1 = m1
        else if (m1 > max1) max1 = m1

        let m2 = link.shortestPathLen
        if (m2 < min2) min2 = m2
        else if (m2 > max2) max2 = m2
    }
    return {
        totalPathSpace: [min1, max1],
        shortestPathSpace: [min2, max2]
    }
}

function clearSvg() {
    d3.select('#svg_rectangleChart>g').remove()
}

function controlPromptBox(selection) {
    selection
        .on('mouseover', function (_, d) {
            if(this.tagName === 'circle'){
                promptBox
                    .attr('class', 'prompt-show')
                    .text(`${d.type}:[id]${d.id}`)
            }else if(this.tagName === 'rect'){
                promptBox
                    .attr('class', 'prompt-show')
                    .text(`${d.id1}--${d.id2}`)
            }
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

function initChart() {
    const width = document.getElementById("rectangle-chart").offsetWidth
    const height = document.getElementById("rectangle-chart").offsetHeight
    // 左侧容纳矩形框的尺寸（正方形）
    const leftRectSize = height < width ? height : width
    const boxSize = leftRectSize / (virtualData.coreNodes.length + 1)
    const circleRadius = 5
    // 渐变配置
    const gradientColorConfig = [[['5%', "rgb(43, 78, 19)"], ['95%', "rgb(132, 243, 57)"]], [['5%', "rgb(52, 123, 247)"], ['95%', "rgb(20, 45, 88)"]]]
    // 方块颜色配置
    const colorDomain = getExtremeValue()
    const blueScale = d3.scaleSequential(colorDomain.shortestPathSpace, d3.interpolate('rgb(43, 78, 19)', 'rgb(132, 243, 57)'))
    const greenScale = d3.scaleSequential(colorDomain.totalPathSpace, d3.interpolate('rgb(20, 45, 88)', 'rgb(52, 123, 247)'))
    // 获取画布
    const ctx = d3
        .select("#svg_rectangleChart")
        .attr("width", width)
        .attr("height", height)
        .append('g')
    // 画布分块
    const rectCtx = ctx.append('g')
    const colorToolBox = ctx.append('g')

    // 原点坐标比例尺 以点的id为参数
    const posScale = d3.scaleBand().domain(virtualData.coreNodes.map(node => node.id)).range([boxSize, leftRectSize])

    // 绘制横轴点
    rectCtx
        .append("g")
        .selectAll()
        .data(virtualData.coreNodes)
        .join("circle")
        .attr("r", circleRadius)
        .attr("cx", node => posScale(node.id) + boxSize / 2)
        .attr("cy", boxSize / 2)
        .attr("fill", node => colorConfig[node.type])
        .call(controlPromptBox)
    // 绘制纵轴点
    rectCtx
        .append("g")
        .selectAll()
        .data(virtualData.coreNodes)
        .join("circle")
        .attr("r", circleRadius)
        .attr("cx", boxSize / 2)
        .attr("cy", node => posScale(node.id) + boxSize / 2)
        .attr("fill", node => colorConfig[node.type])
        .call(controlPromptBox)

    const coreLinksCopy = JSON.parse(JSON.stringify(virtualData.coreLinks))
    const newCoreLinks = virtualData.coreLinks.concat(coreLinksCopy.map(link => {
        [link.id1, link.id2] = [link.id2, link.id1]
        return link
    }))

    //绘制方块
    rectCtx
        .append('g')
        .selectAll()
        .data(newCoreLinks)
        .join('rect')
        // 第1个id作横坐标 第2个id作纵坐标 
        .attr('x', link => posScale(link.id1))
        .attr('y', link => posScale(link.id2))
        .attr('rx', 0.15 * boxSize)
        .attr('width', boxSize)
        .attr('height', boxSize)
        .attr('fill', link => {
            if (posScale(link.id1) < posScale(link.id2)) {// 位于左下矩阵
                link.isShortest = false
                return greenScale(link.totalPathLen)
            }else{
                link.isShortest = true
                return blueScale(link.shortestPathLen)
            }
        })
        .on('click', function(_, d) {
            // 存入所点击矩阵块的数据
            console.log('rect click', d);
            updataKeyPoints(d)
        })
        .call(controlPromptBox)

    // 绘制文本
    rectCtx
        .append('g')
        .selectAll()
        .data(newCoreLinks)
        .join('text')
        .attr('x', link => posScale(link.id1) + boxSize / 2)
        .attr('y', link => posScale(link.id2) + boxSize / 2)
        .text(link => {
            if (posScale(link.id1) < posScale(link.id2)) {// 位于左下矩阵
                return link.totalPathLen
            }
            return link.shortestPathLen
        })
        .attr('fill', '#fff')
        .style('pointer-events', 'none')
    // .attr('font-size',16)


    // 添加渐变
    d3.select('#svg_rectangleChart')
        .selectAll()
        .data(gradientColorConfig)
        .join('defs')
        .append('linearGradient')
        .attr('id', (_, i) => 'gradient' + i)
        .attr('gradientTransform', "rotate(90)")
        .selectAll()
        .data(d => d)
        .join('stop')
        .attr('offset', d => d[0])
        .attr('stop-color', d => d[1])


    colorToolBox.append('rect')
        .attr('width', 20)
        .attr('height', leftRectSize / 3)
        .attr('x', leftRectSize + boxSize)
        .attr('y', boxSize + leftRectSize / 3)
        .attr('fill', "url('#gradient0')")
    colorToolBox.append('rect')
        .attr('width', 20)
        .attr('height', leftRectSize / 3)
        .attr('x', leftRectSize + boxSize)
        .attr('y', boxSize)
        .attr('fill', "url('#gradient1')")
}
</script>

<template>
    <div id="rectangle-chart" class="image-box">
        <svg id="svg_rectangleChart">
        </svg>
    </div>
</template>

<style scoped>
#rectangle-chart {
    width: 50%;
    height: 100%;
    background-color: rgb(16, 12, 42);
    /* background-color: rgb(20, 45, 88); */
}

#svg_rectangleChart {
    width: 100%;
    height: 100%;
}
</style>