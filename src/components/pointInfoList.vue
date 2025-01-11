<script setup>
import {json,range} from 'd3'
import { RouterLink, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { watch, ref } from 'vue'

import {useKeyPointsStore} from '../stores/keyPointsStore'
// 引入 社区Store
import { useComIdStore } from '../stores/communityIdStore'

const store = useKeyPointsStore()
const { selectPointsID,paraSelectedLen } = storeToRefs(store)

const { clubId } = storeToRefs(useComIdStore())

const tableData = ref([])
const router = useRouter()

const tableColor = {
    "background-color":"rgba(16, 12, 42, 1)",
    color:"#fff",
    "font-color":"#fff",
}

const fakeIndustry = [
['C', 'E', 'A', 'B'],
['C', 'E', 'A', 'B'],
['C', 'A', 'B'],
['A'],
['B'],
['C'],
[],
['A','B','C'],
['C', 'F', 'D', 'B'],
['C', 'F', 'B'],
['B', 'F', 'D'],
['A', 'F', 'C'],
['A', 'E', 'D'],
['B', 'E', 'F'],
]

watch(paraSelectedLen, (curV, preV) => {
    let nodearr
    // 利用新的ID去找点
    // console.log('dadsda');
    json(`src/data/json/Clube${clubId.value}.json`).then(data => {
        let clubNodes = data.nodes
        nodearr = []
        for(let i of range(curV)){
            for (let node of clubNodes){
                if(selectPointsID.value[i] === node.numID) 
                {
                    node.industry = fakeIndustry[Math.round(Math.random()*14)]
                    nodearr.push(node)
                }
            }
        }
        tableData.value = nodearr
    })
    // tableData.value = curV.map(id => ({ id, name: 'xxx', type: 'yyy', industry: 'A' }))
})

function gotoDetail(row,column,event) {
    // console.log(row,column,event);
    // const selectedId =  row.id
    router.push(`/about/${row.id}`)
}
</script>

<template>
    <div id="point-info-list" class="image-box">
        <text id="title">节点信息表</text>
        <el-table :data="tableData" border style="width: 100%; height: 90%;" :row-style="tableColor" :header-cell-style="tableColor"  >
            <el-table-column prop="numID" label="ID" width="150" align="center" >
            </el-table-column>
            <el-table-column prop="id" label="name" width="150" align="center">
            </el-table-column>
            <el-table-column prop="type" label="type" align="center">
            </el-table-column>
            <el-table-column prop="industry" label="industry" align="center">
            </el-table-column>
            <!-- <el-table-column prop="detail" label="操作" align="center">
                <text id="explore">探索</text>
            </el-table-column> -->
        </el-table>
    </div>
</template>

<style scoped>
#point-info-list {
    width: 30%;
    height: 100%;
    padding: 0 20px;
}

#title {
    font-weight: bold;
    font-size: 18px;
    color: #fff;
}
text{
    cursor: pointer;
}
#explore:hover{
    color: aqua;
}
/* :deep(.el-table .el-table__body tr:hover td ){
    color: #000;
} */
:deep(.el-table tbody tr:hover>td) { 
    color:#000!important
}
</style>