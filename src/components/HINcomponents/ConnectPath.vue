<!-- 详情页的平行坐标轴图 -->
<script setup>
import * as echarts from 'echarts';
import { onMounted,watch } from 'vue'
import { json } from 'd3';


let myChart, option

onMounted(async () => {
    let chartDom = document.getElementById('sankey-chart');
    myChart = echarts.init(chartDom, null, {renderer: 'svg'});

    const data = await json(`src/testData/sanky_product.json`)
    draw(data)
    // 请求数据
    // const data = await requestData()
    // draw(groupPoints.value)
})

async function requestData() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(paraLineData)
        }, 1000)
    })
}

function draw(data) {

    option = option = {
    //   title: {
    //     text: 'Sankey Diagram'
    //   },
      tooltip: {
        trigger: 'item',
        triggerOn: 'mousemove'
      },
      series: [
        {
          type: 'sankey',
          data: data.nodes,
          links: data.links,
          emphasis: {
            focus: 'adjacency'
          },
          levels: [
            {
              depth: 0,
              itemStyle: {
                color: '#fbb4ae'
              },
              lineStyle: {
                color: 'source',
                opacity: 0.6
              }
            },
            {
              depth: 1,
              itemStyle: {
                color: '#b3cde3'
              },
              lineStyle: {
                color: 'source',
                opacity: 0.6
              }
            },
            {
              depth: 2,
              itemStyle: {
                color: '#ccebc5'
              },
              lineStyle: {
                color: 'source',
                opacity: 0.6
              }
            },
            {
              depth: 3,
              itemStyle: {
                color: '#decbe4'
              },
              lineStyle: {
                color: 'source',
                opacity: 0.6
              }
            }
          ],
          lineStyle: {
            curveness: 0.5
          }
        }
      ]
    }
    myChart.setOption(option);

}

</script>

<template>
    <div id="sankey-container">
        <div class="chart-header">链路分析</div>
        <div id="sankey-chart">
    </div>
        <!-- <router-link to="/about">Go to detail page</router-link> -->
    </div>
</template>

<style scoped>
#sankey-container{
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
}
#sankey-chart {
    width: 100%;
    height: calc(100% - 25px) !important;
    flex-grow: 0;
    /* position: relative; */
}
.chart-header {
    height: 25px;
    width: 100%;
    font-size: 15px;
    font-weight: bold;
    background-color: #e8e6e2;
    padding-left: 2px;
    border-left: 2px solid white;
    /* position: absolute;
    top: 0;
    left: 0; */
}
</style>