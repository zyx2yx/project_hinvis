<script setup>
import { onMounted, watch } from 'vue'
import * as echarts from 'echarts'
import {storeToRefs} from 'pinia'
import {useForceStore} from '../stores/forceConfigStore'
import { G1Graph } from '../api/serverDataProvider'

let chartDom
let myChart
let option
const store = useForceStore()
const {selectValue} = storeToRefs(store)

watch(selectValue,(curV,preV) => {
    // 监听selectValue的变化
    console.log(curV)
    G1Graph(curV).then((res) => {
        console.log(res.data)
        draw(res.data)
    });
})

onMounted(() => {
    chartDom = document.getElementById('force-chart')
    myChart = echarts.init(chartDom)
    myChart.showLoading()

    G1Graph('G1').then((res) => {
        console.log(res.data)
        draw(res.data)
    });
})


function draw(data) {
    let tmp
    option = {
        series: [
            {
                type: 'graph',
                layout: 'force',
                animation: false,
                label: {
                    position: 'right',
                    formatter: '{b}'
                },
                draggable: true,
                data: data.nodes.map(function (node) {
                    tmp = node.id
                    node.id = node.numID
                    node.numID = tmp
                    return node
                }),
                // categories: webkitDep.categories,
                force: {
                    edgeLength: 5,
                    repulsion: 20,
                    gravity: 0.2
                },
                edges: data.edges
            }
        ]
    }
    myChart.hideLoading();
    myChart.setOption(option)
}

</script>

<template>
    <div id="force-chart"></div>
</template>

<style scoped>
#force-chart {
    width: 45%;
    height: 100%;
}
</style>