<!-- 首页的平行坐标轴图 -->
<script setup>
import { RouterLink, useRouter } from 'vue-router'
import * as echarts from 'echarts';
import { onMounted } from 'vue'
// 读入数据
import { paraLineData } from '../testData/paraLineChart'
import {useKeyPointsStore} from '../stores/keyPointsStore'

let myChart
const router = useRouter()
const {updataPointsID,updataParaSelectedLen} = useKeyPointsStore()
// 坐标配置
const schema = [
    { name: '度中心性', index: 0, text: '度中心性' },
    { name: '重要性', index: 1, text: 'PR' },
    { name: '统治性', index: 2, text: 'DS' },
    { name: 'index', index: 3, text: ' 索引' },
    { name: 'type', index: 4, text: '类型' },
];
let option = {
    // backgroundColor: '#333',
    title: {
        left: 'left',
        text: '潜在线索探索视图',
        subtext: ''
    },
    brush:{
        brushLink: 'all',
        toolbox:['clear'],
        xAxisIndex:'all,',
        yAxisIndex:'all,',
        inBrush:{
            opacity:1,
        },
        throttleType:'debounce',
        throttleDelay:500,
        // brushMode:'single',
        // removeOnClick:true,
    },
    tooltip: { // 提示框
        padding: 10,
        backgroundColor: '#222',
        borderColor: '#777',
        borderWidth: 1
    },
    toolbox: { // 工具框
        top: 10,
        right: 10,
        itemSize: 20,
        feature: {
            mytool1: {
                show: true,
                title: "子图细节探索",
                icon: 'path://M432.45,595.444c0,2.177-4.661,6.82-11.305,6.82c-6.475,0-11.306-4.567-11.306-6.82s4.852-6.812,11.306-6.812C427.841,588.632,432.452,593.191,432.45,595.444L432.45,595.444z M421.155,589.876c-3.009,0-5.448,2.495-5.448,5.572s2.439,5.572,5.448,5.572c3.01,0,5.449-2.495,5.449-5.572C426.604,592.371,424.165,589.876,421.155,589.876L421.155,589.876z M421.146,591.891c-1.916,0-3.47,1.589-3.47,3.549c0,1.959,1.554,3.548,3.47,3.548s3.469-1.589,3.469-3.548C424.614,593.479,423.062,591.891,421.146,591.891L421.146,591.891zM421.146,591.891',
                onclick: function () {
                    // router.push(`/about/${row.id}`)
                    router.push(`/about/idtest`)
                }
            },
        }
    },
    parallelAxis: [
        {
            dim: 0,
            name: schema[0].text,
            type: 'value',
            max:function(value){
                return (value.max + (value.max-value.min)*0.10).toFixed(4)
            }
        },
        {
            dim: 1,
            name: schema[1].text,
            type: 'value',
            max:function(value){
                return (value.max + (value.max-value.min)*0.10).toFixed(4)
            }
            // max:0.1
        },
        {
            dim: 2,
            name: schema[2].text,
            inverse: true,
            nameLocation: 'start',
            type: 'value',
            // max:0,
            // min:-500000
        },
        {
            dim: 3,
            name: schema[3].text,
            type: 'value',
            // max:7000
        },
        {
            dim: 4,
            name: schema[4].text,
            type: 'category',
            data: ['ASN', 'IP_C', 'Whois_Email', 'Whois_Phone', 'Whois_Name', 'Cert', 'IP', 'Domain'],
            axisTick:{
                show:true,
                alignWithLabel:true
            }
        }
    ],
    parallel: {
        top: '20%',
        left: '5%',
        right: '20%',
        bottom: '5%',
    },
};

onMounted(async () => {
    let chartDom = document.getElementById('line-chart');
    myChart = echarts.init(chartDom, 'dark');
    // 请求数据
    const data = await requestData()
    draw(data)
})

async function requestData() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(paraLineData)
        }, 1000)
    })
}

function getMax(dimension, data) {
    let max = data[0][0]

    for (let i = 0; i < data.length; i++) {
        max = max > data[i][dimension] ? max : data[i][dimension]
    }

    return max
}

function draw(rawData) {

    option.series = [{
        name: '类型',
        type: 'parallel',
        smooth: true,
        lineStyle: {
            width: 1,
            opacity: 0.5
        },
        data: rawData
    }]
    const max = getMax(0, rawData)
    option.visualMap = {
        show: true,
        min: 0.25 * max,
        max,
        dimension: 0,
        right: 10,
        bottom:10,
        // range:[0.02,0.04],
        inRange: {
            color: ['#d94e5d', '#eac736', '#50a3ba'].reverse()
            // colorAlpha: [0, 1]
        }
    }
    myChart.setOption(option);

    myChart.on('brushselected', function (params) {
        // 获取被圈选的节点，在左侧列表展示出来
        var brushComponent = params.batch[0]; // 被选择组件
        const selectIndex = brushComponent.selected[0].dataIndex // 数组，值为原数据的数据序号
        // console.log(selectIndex)
        const IDs = selectIndex.map(idx => rawData[idx][5])
        updataParaSelectedLen(IDs.length)
        
    
});
}

</script>

<template>
    <div id="line-chart" class="image-box">
        <!-- <router-link to="/about">Go to detail page</router-link> -->
    </div>
</template>

<style scoped>
#line-chart {
    width: 100%;
    height: 100%;
}
</style>