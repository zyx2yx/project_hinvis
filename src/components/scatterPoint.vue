<script setup>
import * as echarts from 'echarts';
import { onMounted,watch } from 'vue'
import {storeToRefs} from 'pinia'

// 读入数据
import { pointEmbedData } from '../testData/pointEmbed'
// 引入点嵌入Store
import { useEmbedStore } from '../stores/groupEmbedStore'
import {useKeyPointsStore} from '../stores/keyPointsStore'

const { embedData } = storeToRefs(useEmbedStore())
const {updataPointsID} = useKeyPointsStore()


const padding = 30
const color = {
    Domain: 'rgb(0, 229, 228)',
    IP: 'rgb(255, 255, 0)',
    Cert: 'rgb(255, 165, 0)'
}
let option
let chartDom
let myChart

watch(embedData, currentData => {
    myChart.showLoading();
    // option.series[0].data = currentData

    draw(currentData)
})

onMounted(async () => {
    chartDom = document.getElementById('scatter-point');
    myChart = echarts.init(chartDom, 'dark');

    myChart.showLoading();

    // 请求数据
    // const data = await requestData()
    // draw(data)
})

async function requestData() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(pointEmbedData)
        }, 1000)
    })
}


function draw(rawData) {

    myChart.hideLoading();
    option = {
        title: {
            left: 'left',
            text:'节点嵌入视图',
            subtext: ''
        },
        tooltip: {},
        brush:{
            toolbox:['rect', 'polygon', 'clear'],
            seriesIndex:'all',
            xAxisIndex:'all',
            yAxisIndex:'all',
            transformable:true,
            throttleType:'debounce',
            throttleDelay:500,
            removeOnClick:true,
            inBrush:{
                opacity:1,
            }
        },
        toolbox: {
            right: 20,
            feature: {
                dataZoom: {}
            }
        },
        grid: {
            top:30,
            left:30,
            right: 30,
            bottom: 30,
        },
        xAxis: [{
            type: 'value',
            name: '',
            min: -15,
            max: 20,
            position: 'left',
        }],
        yAxis: [{
            type: 'value',
            name: '',
            min: -15,
            max: 20,
            position: 'bottom',
        }],
        dataZoom: [
            {
                type: 'inside'
            },
            {
                type: 'inside',
                showDataShadow: false,
                handleSize: '80%'
            },
            {
                type: 'inside',
                orient: 'vertical'
            },
            {
                type: 'inside',
                orient: 'vertical',
                showDataShadow: false,
                handleSize: '80%'
            }
        ],
        animation: false,
        series: [
            {
                type: 'scatter',
                data: rawData,
                dimensions: ['x', 'y'],
                symbolSize: 3,
                itemStyle: {
                    opacity: 0.4,
                    color: obj => color[obj.data[2]]
                },
                blendMode: 'lighter',
                // large: true,
                largeThreshold: 500
            }
        ]
    };

    myChart.setOption(option);
    myChart.on('brushSelected', function (params) {
        // 获取被圈选的节点，在左侧列表展示出来
        var brushComponent = params.batch[0]; // 被选择组件
        const selectIndex = brushComponent.selected[0].dataIndex // 数组，值为原数据的数据序号
        // console.log(selectIndex)
        // const IDs = selectIndex.map(idx => rawData[idx][5])
        updataPointsID(selectIndex)
});
}
</script>

<template>
    <div id="scatter-point" class="image-box">

    </div>
</template>

<style scoped>
#scatter-point {
    width: 30%;
    height: 100%;
}
</style>