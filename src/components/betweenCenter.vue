<!-- 介数中心性图表 -->
<script setup>
import * as echarts from 'echarts';
import * as d3 from 'd3'
import { storeToRefs } from 'pinia'
import { onMounted, watch } from 'vue'

// 引入 社区Store
import { useComIdStore } from '../stores/communityIdStore'
const { clubId } = storeToRefs(useComIdStore())


var chartDom;
var myChart;
var option;

watch(clubId, async currentId => {
  console.log("currentId", currentId);
  // 读取对应currentId的社区文件数据
  try {
    const data = await d3.json(`src/data/csv/club${currentId}.json`)
    option.series[0].data = data.betweenesscentrality
    option && myChart.setOption(option);
  } catch (error) {
    console.log(error);
  }
})

onMounted(async () => {
  chartDom = document.getElementById('between-center');
  myChart = echarts.init(chartDom, "dark");
  try {
    const data = await d3.json(`src/data/csv/club${clubId.value}.json`)
    option.series[0].data = data.betweenesscentrality
    option && myChart.setOption(option);
  } catch (error) {
    console.log(error);
  }
})

option = {
  title: {
    left: 'left',
    text: '介数中心性分布', // update
    subtext: '',
    textStyle: {
      fontSize: 15,
      color: "#fff"
    },
  },
  grid: {
    top: 40,
    left: 60,
    right: 10,
    bottom: 40,
  },
  xAxis: {
    type: 'value',
    name: 'Value',
    nameLocation: "middle",
    nameTextStyle: {
      fontStyle: 'italic',
      fontSize: 15,
      align: "center",
      verticalAlign: "top"
    },
    splitNumber: 8,// updata
    splitLine: {
      lineStyle: { type: "dashed" }
    },
    nameGap: 21,
    min: 0,
    max: 20,// update
    // max: function (value) {
    //   return (value.max + (value.max - value.min) * 0.10).toFixed(4)
    // },
    position: 'left',
  },
  yAxis: {
    type: 'value',
    name: 'Count',
    nameLocation: "middle",
    nameTextStyle: {
      fontStyle: 'italic',
      fontSize: 15,
      align: "center",
      verticalAlign: "bottom"
    },
    splitLine: {
      lineStyle: { type: "dashed" }
    },
    min: 0,
    max: 20,// update
    // max: function (value) {
    //   return (value.max + (value.max - value.min) * 0.10)
    // },
    positio: 'bottom',
    nameGap: 35,
  },
  series: [
    {
      symbolSize: 20,
      data: [ // update
        [10.0, 8.04],
        [8.07, 6.95],
        [13.0, 7.58],
        [9.05, 8.81],
        [11.0, 8.33],
        [14.0, 7.66],
        [13.4, 6.81],
        [10.0, 6.33],
        [14.0, 8.96],
        [12.5, 6.82],
        [9.15, 7.2],
        [11.5, 7.2],
        [3.03, 4.23],
        [12.2, 7.83],
        [2.02, 4.47],
        [1.05, 3.33],
        [4.05, 4.96],
        [6.03, 7.24],
        [12.0, 6.26],
        [12.0, 8.84],
        [7.08, 5.82],
        [5.02, 5.68]
      ],
      symbolSize: 4,
      itemStyle: {
        opacity: 0.4,
        color: "rgba(255,255,255,1)"
      },
      blendMode: 'lighter',
      type: 'scatter'
    }
  ]
};
</script>
<template>
  <div id="between-center"></div>
</template>
<style scoped>
#between-center {
  width: 100%;
  height: 100%;
}
</style>