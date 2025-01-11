<script setup>
import {onMounted,watch} from 'vue'
import {useRouter,useRoute} from 'vue-router'
import {storeToRefs} from 'pinia'
import {json} from 'd3'

import { useForceConfigStore } from '../stores/forceConfigStore'
import {setShortestPath} from '../stores/coreShortestPath'
import {useCorePointsStore} from '../stores/CorePointsStore'
import {useGroupInfo} from '../stores/groupInfoStore'
import {useGroupPoints} from '../stores/groupPointsStore'
import {useKeyGraphStore} from '../stores/keyPathStore'

 
import SourceTable from "../components/sourceTable.vue";
import ForceChart from "../components/forceChart.vue";
import LightChart from "../components/lightChart.vue";
import RectangleChart from "../components/rectangleChart.vue";
// import LineChart from "../components/lineChart.vue";
import ParaLineChart from '../components/paraLineChart.vue'
import HanabiArc from '../components/hanabiArc.vue'
import ForceCoreChart from '../components/forceCoreChart.vue'
import ForceKeyPathChart from '../components/forceKeyPathChart.vue'

const router = useRouter()
const route = useRoute()

const forceConfigStore = useForceConfigStore()
const { selectValue } = storeToRefs(forceConfigStore)

const corePointsStore = useCorePointsStore()
const {updataCoreGraph,updataPoints} = corePointsStore

const groupInfo = useGroupInfo()
const {setGroupInfo} = groupInfo

const groupPointsStore = useGroupPoints()
const {setGroupPoints} = groupPointsStore

const keyGraphStore = useKeyGraphStore()
const {updataKeyPoints,updataKeyGraph} = keyGraphStore

onMounted(() => {
  console.log(route.params.id)
  // 当切换团体时，更新核心资产最短路径文件
  json(`../src/data/${selectValue.value}/core_shortest_paths.json`).then(value => {
    setShortestPath(value)
  })

  // 组件挂载时，更新团体统计数据
  json(`../src/data/${selectValue.value}/${selectValue.value}TypeFrequency.json`).then(value => {
    setGroupInfo(value)
  })

  // 组件挂载时，更新节点统计数据
  json(`../src/data/${selectValue.value}/coreSource.json`).then(value => {
    let result = value.slice(0,7)
    setGroupPoints(handleDetailParaLineData(result))
  })
})

watch(selectValue,curV => {

  // 当切换团体时，更新核心资产最短路径文件
  json(`../src/data/${curV}/core_shortest_paths.json`).then(value => {
    setShortestPath(value)
  })

  // 更新团体时，更新统计数据 
  json(`../src/data/${curV}/${curV}TypeFrequency.json`).then(value => {
    setGroupInfo(value)
  })

  // 更新团体时，更新节点统计数据
  json(`../src/data/${curV}/coreSource.json`).then(value => {
    let result = value.slice(0,7)
    setGroupPoints(handleDetailParaLineData(result))
  })

  // 修改当前选中团伙时，重置选中的核心资产相关信息
  // corePointsStore.$reset() // 使用setup语法创建的store不会存在这个方法
  updataCoreGraph({})
  updataPoints([])

  // 修改当前选中团伙时，重置选中的关键路径相关信息
  updataKeyPoints(null)
  // updataCoreGraph({})
})

function handleDetailParaLineData(objData){

  let arrData = []
  for (let node of objData){
    
      let typeArr = node.id.split('_')
      if(typeArr[1].length<6){
        node.type = typeArr[0]+'_'+typeArr[1]
      }else {
        node.type = typeArr[0]
      }

      arrData.push([node.DC,node.PR,node.DS,node.numID,node.type,node.id])
    }
    
  return arrData
}
 
</script>

<!-- <template>
  <div id="detail-outer">
    <div id="top_div">
      <SourceTable></SourceTable>
      <ForceChart></ForceChart>
      <div id="top_right_div">
        <div id="top_right_inner">
          <HanabiArc></HanabiArc>
          <RectangleChart></RectangleChart>
        </div>
        <div id="top_right_mid">
          <ParaLineChart></ParaLineChart>
        </div>
        <LightChart></LightChart>
      </div>
    </div>
    <div id="bottom_div">
      <div id="bottom_left_div"><ForceCoreChart /></div>
      <div id="bottom_center_div"><ForceKeyPathChart /></div>
    </div>
  </div>
</template> -->

<template>
    <div id="page">
      <div id="page-title">
        此处为标题
      </div>
      <div id="page-content">
        <div id="content-left">
            <div id="cl-node-suggest">节点推荐列表</div>
            <div id="cl-node-search">节点查询列表</div>
            <div id="cl-node-selected">已选择节点</div>
            <div id="cl-search-layout-control">社区搜索与布局参数控制</div>
        </div>
        <div id="content-right">
            <div id="cr-nodelink-chart"></div>
            <div id="cr-community-analysis">
                待定
            </div>
        </div>
      </div>
    </div>
  </template>

<style scoped>

#page{
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
}
#page div{
    border: 1px black solid;
}

#page-title{
    width: 100%;
    height: 20px;
}

#page-content{
    width: 100%;
    display: flex;
    flex-grow: 1;
}

#content-left{
    width: 30%;
    height: 100%;
    display: flex;
    flex-direction: column;
}

#cl-node-suggest, #cl-node-search{
    width: 100%;
    height: 30%;
}

#cl-node-selected{
    width: 100%;
    height: 5%;
}

#cl-search-layout-control{
    width: 100%;
    height: 35%;
}

#content-right{
    width: 70%;
    height: 100%;
    display: flex;
    flex-direction: column;
}

#cr-nodelink-chart{
    width: 100%;
    height: 65%;
}

#cr-community-analysis{
    width: 100%;
    height: 35%;
}

/*  */

#detail-outer{
  width: 100%;
  height: 100%;
}

#top_div {
  width: 100%;
  height: 60%;
  display: flex;
  /* background-color: aqua; */
}

#bottom_div {
  width: 100%;
  height: 60%;
}

#top_right_div {
  width: 40%;
  height: 100%;
  display: flex;
  flex-direction: column;
}
#top_right_inner{
  width: 100%;
  height: 40%;
  display: flex;
}
#top_right_mid{
  width: 100%;
  height: 30%;
}

#bottom_div{
  display: flex;
}
#bottom_left_div {
  width: 50%;
  height: 100%;

}

#bottom_center_div {
  width: 50%;
  height: 100%;
}
</style>
