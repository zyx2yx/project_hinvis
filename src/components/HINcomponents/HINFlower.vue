<script setup>
import * as d3 from 'd3'
import { onMounted } from 'vue'
// 读入数据
// import { communityData } from '../testData/communityData'

// 引入 社区Store
import {useComIdStore} from '../../stores/communityIdStore'
const comIdStore = useComIdStore()
const {updataClubId} = comIdStore
/*
    每一朵花使用一个g标签，绑定一个数据，
    每朵花由1个circle(或1个饼图)+3个饼图+外层的曲线图构成（实现方法未知）
    分别利用绑定数据中的community,node,industry,edge和饼图生成器生成数据，再传入弦图生成器生成path数据绘图
    每一个花的位置由transform属性来设置
*/

const maxNumPerLine = 1
const industryMap = {
    'A': '涉黄',
    'B': '涉赌',
    'C': '涉骗',
    'D': '涉毒',
    'E': '涉枪',
    'F': '黑客',
    'G': '非法交易平台',
    'H': '非法支付平台',
    'I': '其他',
}

onMounted(async () => {
    // 请求数据
    const data = await requestData()
    draw([data[0]])
})

async function requestData() {
    return new Promise((resolve, reject) => {
        // setTimeout(() => {
        //     resolve(communityData)
        // }, 1000)
        d3.json('/src/data/json/community.json').then(data => resolve(data))
    })
}

/**
 * 弧形动画
 * 
 * */
function arcTween(innerR, outerR, factorOut) {
    // 返回的函数作为监听函数，事件响应时执行
    return function () {

        d3.select(this)// 选择path,为其添加动画
            .transition()
            // 设置d属性 值为一个返回插值器的函数，该插值器会在动画的每一帧执行,参数为[0-1]，并将结果设置为属性值
            .attrTween('d', function (d) {
                // let interpolateIn = d3.interpolate(innerR, innerR+factorIn)
                let interpolateOut = d3.interpolate(outerR, outerR + factorOut)
                return function (t) {
                    // 在动画的每一帧都生成不同的d值
                    let arcT = d3.arc().innerRadius(innerR).outerRadius(interpolateOut(t))
                    return arcT(d)
                }
            })
    }
}

function getExtremeValue(communityData) {
    let min1 = 0, max1 = 0, min2 = 0, max2 = 0, min3 = 0, max3 = 0
    let { node, blackIndustry, edge } = communityData
    for (let point of node) {
        let m1 = point.number
        if (m1 < min1) min1 = m1
        else if (m1 > max1) max1 = m1
    }
    if(max1==0) max1=10;

    for (let production of blackIndustry) {
        let m1 = production.number
        if (m1 < min2) min2 = m1
        else if (m1 > max2) max2 = m1
    }
    if(max2==0) max2=10;
    for (let link of edge) {
        let m1 = link.number
        if (m1 < min3) min3 = m1
        else if (m1 > max3) max3 = m1
    }
    if(max3==0) max3=10;
    return {
        nodes: [min1, max1],
        industries: [min2, max2],
        edges: [min3, max3],
    }
}

function draw(data) {

    const width = document.getElementById('community-flower').offsetWidth
    const height = document.getElementById('community-flower').offsetHeight
    // const flowerLength = Math.floor(width / maxNumPerLine)
    const flowerLength = Math.min(width, height)-20
    // 动画缩放系数
    const scale = 10
    // 被选中的社区
    let selectedRect = null
    // hover进入的社区
    let hoverRect = null
    // 提示框
    let promptBox = d3.select('#tooltip')

    const chart = d3.select('#community-flower-svg')
        .attr('width', width)
        // .attr('height', 35 * height)
        .attr('height', height)
    // 弧形生成器，用来生成曲线，需要含有起始终止角度以及其他信息的数据，再结合自身配置的内外半径生成path d信息
    const arc1 = d3.arc().innerRadius(20).outerRadius(35)//.cornerRadius(2)
    const arc2 = d3.arc().innerRadius(39).outerRadius(54)//.cornerRadius(2)
    const arc3 = d3.arc().innerRadius(58).outerRadius(73)//.cornerRadius(2)
    const points = [[-15, 0], [0, -10], [15, 0]] // 绘制花瓣的点
    const line = d3.line().x(d => d[0]).y(d => d[1]).curve(d3.curveCardinal)// 花瓣曲线生成器

    for (let i = 0; i < data.length; i++) {

        // 动态颜色生成比例尺
        const { nodes, industries, edges } = getExtremeValue(data[i])

        const secondColor = d3.scaleSequential(nodes, d3.interpolate('rgb(63, 28, 68)', 'rgb(239, 112, 255)'))
        const thirdColor = d3.scaleSequential(industries, d3.interpolate('rgb(33, 75, 88)', 'rgb(96, 213, 252)'))
        const fourthColor = d3.scaleSequential(edges, d3.interpolate('rgb(39, 78, 29)', 'rgb(130, 254, 93)'))
        const fifthColor = d3.scaleSequential(edges, d3.interpolate('rgb(255, 226, 90)', 'rgb(231, 92, 1)'))

        // 限制饼图元素起始角度和终止角度以及其他信息，这是饼图所特有的。需要将拿到的数据配置成绘制饼图所需要的
        const secondLevel = d3.pie().value(1).padAngle(0.07)(data[i].node)
        const thirdLevel = d3.pie().value(1).padAngle(0.07)(data[i].blackIndustry)
        const fourthLevel = d3.pie().value(1).padAngle(0.07)(data[i].edge)

        // 生成第i个花朵的区域
        const g = chart.append('g').attr('transform', () => {
            // 得到第i朵花所在的列数和行数 从0 0开始编号
            let column = i % maxNumPerLine
            let row = Math.floor(i / maxNumPerLine)
            // return `translate(${column * flowerLength + flowerLength / 2},${row * flowerLength + flowerLength / 2})`
            return `translate(${width / 2},${height / 2})`
        })

        // 添加方框
        const bgRect = g
            .append('rect')
            .attr('x', -flowerLength / 2)
            .attr('y', -flowerLength / 2)
            .attr('width', flowerLength)
            .attr('height', flowerLength)
            .attr('fill', '#fff')
            .attr('fill-opacity', 0)
            .on('mouseover', function () {
                // hoverRect && hoverRect.classed('hover-rect', false)
                // hoverRect = d3.select(this).classed('hover-rect', true)
            })

        // 5
        g.append('g').selectAll().data(fourthLevel).join('path').attr('d', d => {
            // 基准为值域的一半
            let baseLine = (edges[0] + edges[1]) / 2
            // 每朵花瓣的初始高度，不能比它更低
            points[1][1] = -15

            if (d.data.number > baseLine) {
                // 超出baseLine的部分等比例增加至高度 最大高度为-20 
                let add = -(d.data.number - baseLine) / (baseLine / 15)
                points[1][1] += add
            }
            return line(points)
        })
            .attr('transform', (d, i) => `rotate(${i * 33 + 15}) translate(0,-73)`)
            .attr('class', 'flower')
            .attr('fill', (d, i) => fifthColor(d.data.number))
        // 4
        g.append('g').selectAll().data(fourthLevel).join('path')
            .attr('d', d => arc3(d))
            .attr('fill', (d, i) => fourthColor(d.data.number))
            .attr('stroke', 'rgba(15, 96, 137)')
            .attr('stroke-opacity', 0.5)
            .on('mouseover', arcTween(58, 73, scale))
            .on('mouseout', arcTween(58, 73 + scale, -scale))
        // 3
        g.append('g').selectAll().data(thirdLevel).join('path')
            .attr('d', d => arc2(d))
            .attr('fill', (d, i) => thirdColor(d.data.number))
            .attr('stroke', 'rgba(15, 96, 137)')
            .attr('stroke-opacity', 0.5)
            .on('mouseover', arcTween(39, 54, scale))
            .on('mouseout', arcTween(39, 54 + scale, -scale))
        // 2
        g.append('g').selectAll().data(secondLevel).join('path')
            .attr('d', d => arc1(d))
            .attr('fill', (d, i) => secondColor(d.data.number))
            .attr('stroke', 'rgba(15, 96, 137)')
            .attr('stroke-opacity', 0.5)
            .on('mouseover', arcTween(20, 35, scale))
            .on('mouseout', arcTween(20, 35 + scale, -scale))
        // 1
        g
            .append('g')
            .append('circle')
            .attr('r', 18)
            .attr('fill', 'rgba(255, 186, 63,0.5)')
        // 中心文字
        g
            .append('text')
            .text(data[i].communityNumber)
            .attr('x', -8)
            .attr('y', 8)
            .attr('fill', '#fff')

        // 对g下所有元素添加click
        g
            .on('click', function (d) {
                selectedRect && selectedRect.classed('select-rect', false)
                selectedRect = bgRect.classed('select-rect', true)
                updataClubId(data[i].communityNumber)
                console.log(data[i].communityNumber);
            })
        // 对g下所有path添加事件
            .selectAll('path')
            .on('mouseover.over', function (event, d) {
                let [posX,posY] = d3.pointer(event,d3.select('body').node())
                promptBox
                    .attr('class', 'prompt-show')
                    .style('top', posY - 30 + 'px')
                    .style('left', posX + 5 + 'px')
                    .text(d.data.type + ':' + d.data.number)
            })
            .on('mousemove', function (event, d) {
                let posX = event.pageX
                let posY = event.pageY
                promptBox
                    .style('top', posY - 30 + 'px')
                    .style('left', posX + 5 + 'px')
            })
            .on('mouseout.out', function (event, d) {
                promptBox
                    .attr('class', 'prompt-hide')
            })
    }

    return chart.node()
}



</script>

<template>
    <div class="image-box" id="community-flower">
        <svg id="community-flower-svg"></svg>
    </div>
</template>

<style scoped>
#community-flower {
    width: 100%;
    height: 100%;
    /* overflow-y: auto;
    overflow-x: hidden; */
    /* background-color: rgba(54, 45, 46,0.5); */
    /* background-color: rgb(16, 12, 54); */
}

:deep(.select-rect) {
    fill: rgb(156, 222, 224);
    fill-opacity: 0.5;
}

:deep(.common-rect) {
    fill: #fff;
    fill-opacity: 0;
}

:deep(.hover-rect) {
    fill: rgb(156, 222, 224);
    fill-opacity: 0.2;
}
</style>