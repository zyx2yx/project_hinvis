<script setup>
// import {onMounted,watch} from 'vue'
// import {useRouter,useRoute} from 'vue-router'
// import {storeToRefs} from 'pinia'
// import {json} from 'd3'

// import { useForceConfigStore } from '../stores/forceConfigStore'
// import {setShortestPath} from '../stores/coreShortestPath'
// import {useCorePointsStore} from '../stores/CorePointsStore'
// import {useGroupInfo} from '../stores/groupInfoStore'
// import {useGroupPoints} from '../stores/groupPointsStore'
// import {useKeyGraphStore} from '../stores/keyPathStore'

 
// import SourceTable from "../components/sourceTable.vue";
// import ForceChart from "../components/forceChart.vue";
// import LightChart from "../components/lightChart.vue";
// import RectangleChart from "../components/rectangleChart.vue";
// // import LineChart from "../components/lineChart.vue";
// import ParaLineChart from '../components/paraLineChart.vue'
// import HanabiArc from '../components/hanabiArc.vue'
// import ForceCoreChart from '../components/forceCoreChart.vue'
// import ForceKeyPathChart from '../components/forceKeyPathChart.vue'

// HIN
import NodeSuggest from '../components/HINcomponents/NodeSuggest.vue'
import TitleDataset from '../components/HINcomponents/TitleDataset.vue'
import NodeSearch from '../components/HINcomponents/NodeSearch.vue'
import NodesSelect from '../components/HINcomponents/NodesSelect.vue'
import SearchLayoutControl from '../components/HINcomponents/SearchLayoutControl.vue'
import LocalNodeLink from '../components/HINcomponents/LocalNodeLink.vue'
import MainNodeLink from '../components/HINcomponents/MainNodeLink.vue'
import MainHeader from '../components/HINcomponents/MainHeader.vue'
import NodeChordChart from '../components/HINcomponents/NodeChordChart.vue'
import HINFlower from '../components/HINcomponents/HINFlower.vue'
import CommunityCoreNode from '../components/HINcomponents/CommunityCoreNode.vue'
import rectangleChart from '../components/HINcomponents/rectangleChart.vue'
import ConnectPath from '../components/HINcomponents/ConnectPath.vue'
import RadialTree from '../components/HINcomponents/RadialTree.vue'

// HIN

// const router = useRouter()
// const route = useRoute()

// const forceConfigStore = useForceConfigStore()
// const { selectValue } = storeToRefs(forceConfigStore)

// const corePointsStore = useCorePointsStore()
// const {updataCoreGraph,updataPoints} = corePointsStore

// const groupInfo = useGroupInfo()
// const {setGroupInfo} = groupInfo

// const groupPointsStore = useGroupPoints()
// const {setGroupPoints} = groupPointsStore

// const keyGraphStore = useKeyGraphStore()
// const {updataKeyPoints,updataKeyGraph} = keyGraphStore

// onMounted(() => {
//   console.log(route.params.id)
//   // 当切换团体时，更新核心资产最短路径文件
//   json(`../src/data/${selectValue.value}/core_shortest_paths.json`).then(value => {
//     setShortestPath(value)
//   })

//   // 组件挂载时，更新团体统计数据
//   json(`../src/data/${selectValue.value}/${selectValue.value}TypeFrequency.json`).then(value => {
//     setGroupInfo(value)
//   })

//   // 组件挂载时，更新节点统计数据
//   json(`../src/data/${selectValue.value}/coreSource.json`).then(value => {
//     let result = value.slice(0,7)
//     setGroupPoints(handleDetailParaLineData(result))
//   })
// })

// watch(selectValue,curV => {

//   // 当切换团体时，更新核心资产最短路径文件
//   json(`../src/data/${curV}/core_shortest_paths.json`).then(value => {
//     setShortestPath(value)
//   })

//   // 更新团体时，更新统计数据 
//   json(`../src/data/${curV}/${curV}TypeFrequency.json`).then(value => {
//     setGroupInfo(value)
//   })

//   // 更新团体时，更新节点统计数据
//   json(`../src/data/${curV}/coreSource.json`).then(value => {
//     let result = value.slice(0,7)
//     setGroupPoints(handleDetailParaLineData(result))
//   })

//   // 修改当前选中团伙时，重置选中的核心资产相关信息
//   // corePointsStore.$reset() // 使用setup语法创建的store不会存在这个方法
//   updataCoreGraph({})
//   updataPoints([])

//   // 修改当前选中团伙时，重置选中的关键路径相关信息
//   updataKeyPoints(null)
//   // updataCoreGraph({})
// })

// function handleDetailParaLineData(objData){

//   let arrData = []
//   for (let node of objData){
    
//       let typeArr = node.id.split('_')
//       if(typeArr[1].length<6){
//         node.type = typeArr[0]+'_'+typeArr[1]
//       }else {
//         node.type = typeArr[0]
//       }

//       arrData.push([node.DC,node.PR,node.DS,node.numID,node.type,node.id])
//     }
    
//   return arrData
// }
 
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

      <div id="page-title">大规模异构网络可视分析系统
        <div id="title-dataset"><TitleDataset /></div>
        <!-- <div id="title-name">大规模异构网络可视分析系统</div> -->
      </div>

      <div id="page-content">

        <div id="content-left">

            <div id="cl-node-suggest">
              <NodeSuggest />
            </div>

            <div id="cl-node-search">
              <NodeSearch />
            </div>

            <div id="cl-node-selected">
              <NodesSelect />
            </div>

            <div id="cl-local-nodelink">
              <!-- <LocalNodeLink /> -->
              <RadialTree />
            </div>

            <div id="cl-search-layout-control">
              <SearchLayoutControl />
            </div>

        </div>

        <div id="content-right">
            <div id="cr-nodelink-chart">
              <div id="nc-header">
                <MainHeader />
              </div>
              <div id="nc-body">
                <MainNodeLink />
              </div>
            </div>
            <div id="cr-community-analysis">
                <div id="ca-left">
                  <!-- <div id="ca-left-flower">
                    <HINFlower />
                  </div>
                  <div id="ca-left-chord"> 
                    <NodeChordChart /> 
                  </div> -->
                  <NodeChordChart /> 
                </div>
                <div id="ca-core-node">
                  <CommunityCoreNode />
                </div>
                <div id="ca-node-matrix">
                  <rectangleChart />
                </div>
                <div id="ca-node-path">
                  <ConnectPath />
                </div>
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
    /* border: 1px black solid; */
    font-size: inherit;
}

#page-title{
    width: 100%;
    height: 25px;
    /* height: 3%; */
    vertical-align: middle;
    text-align: center;
    background-color: #3a3a37;
    font-size: 14px;
    color: white;
    /* display: flex; */
    position: relative;
}

#title-dataset{
  /* width: 100px; */
  height: 100%;
  position: absolute;
  right: 10px;
  top: 0px;
}
#title-name{
  flex-grow: 1;
}

#page-content{
    width: 100%;
    /* height: 96%; */
    height: calc(100% - 25px) !important;
    display: flex;
    flex-grow: 0; /**项目最开始时担心不自动填满设置成了1，结果后续总是出现页面填满时父元素被撑大的bug
    困扰很久浪费很多时间，艹
    */
}

#content-left{
    width: 25%;
    height: 100%;
    display: flex;
    flex-direction: column;
}

#cl-node-suggest{
    width: 100%;
    height: 30%;
    /* height: 20%; */
    display: flex;
    flex-direction: column;
}
#cl-node-search{
    width: 100%;
    height: 12%;
}

#cl-node-selected{
    width: 100%;
    height: 8%;
    display: flex;
    flex-direction: column;
}

#cl-local-nodelink{
  width: 100%;
  height: 40%;
  background-color: #e8e6e2;
}

#cl-search-layout-control{
    width: 100%;
    height: 10%;
}

#content-right{
    width: 75%;
    height: 100%;
    display: flex;
    flex-direction: column;
    /* margin: 0 10px; */
    /* border-left: 2px solid white; */
    /* border-right: 2px solid white; */

}

#cr-nodelink-chart{
    width: 100%;
    height: 65%;
    display: flex;
    flex-direction: column;
}

#nc-header{
  width: 100%;
  height: 50px;
  /* height: 10%; */
  border-left: 2px solid white;
  background-color: #e8e6e2;
  flex-shrink: 0;
}
#nc-body{
  width: 100%;
  height: 90%;
  flex-grow: 1;
}

#cr-community-analysis{
    width: 100%;
    height: 35%;
    display: flex;
    /* flex-grow: 0; */
}
#ca-left{
  width: 15%;
  height: 100%;
}
#ca-core-node{
  width: 25%;
  height: 100%;
  flex-grow: 0;
  position: relative;
}
#ca-node-matrix{
  width: 20%;
  height: 100%;
}
#ca-node-path{
  width: 40%;
  height: 100%;
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
