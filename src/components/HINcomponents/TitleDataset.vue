<template>
    <div class="flex flex-wrap gap-4 items-center">
        <el-select v-model="value1" placeholder="选择数据集" style="width: 240px" size="small" clearable>
            <template #label="{ label, value }">
                <!-- <span>{{ label }}: </span> -->
                <span>HIN.DB: </span>
                <span style="font-weight: bold">{{ value }}</span>
            </template>
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"
                :disabled="item.disabled" />
        </el-select>
        <!-- <span style="width: 5px; flex-shrink: 1;"></span> -->
        <el-button :icon="Histogram" size="small" color="#3a3a37" @click="drawer2 = true" />
        <!-- <el-icon><Histogram /></el-icon> -->
    </div>
    <el-drawer v-model="drawer2" title="当前数据集信息" direction="rtl" size="20%">
        <div  class="HINdata-info">
            <span>Hi, there!</span>
        <span>节点数量：xxx</span>
        <span>边数量：xxx</span>
        <span>IP节点数量：xxx</span>
        <span>Domain节点数量：xxx</span>
        </div>
        
    </el-drawer>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import {
    Check,
    Delete,
    Edit,
    Message,
    Search,
    Star,
    Histogram,
} from '@element-plus/icons-vue'

const value1 = ref<string>()
const drawer2 = ref(false)
const options = [
    {
        value: 'CyberAssetGraphData',
        label: 'CyberAssetGraphData',
    },
    {
        value: 'DBLP',
        label: 'DBLP',
    },
    {
        value: 'DBLP-small',
        label: 'DBLP-small',
        disabled: true,
    },
    {
        value: 'IMDB',
        label: 'IMDB',
    },
    {
        value: 'Foursquare',
        label: 'Foursquare',
    },
]


const handleClick = () => {
    console.log('click')
}

</script>

<style scoped>
.HINdata-info{
    color: black;
}
/* .el-drawer__container {
    position: relative;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    height: 50%;
    width: 100%;
} */
/* .el-drawer.ttb { 
    height: 80% !important;
} */

 /* :deep(.open){
    height: 80% !important;
 } */
</style>