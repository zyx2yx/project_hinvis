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
    CircleClose,
    Close,
    CircleCloseFilled
} from '@element-plus/icons-vue'
import type { TagProps } from 'element-plus'
// import { isDark } from '~/composables/dark'

interface TagsItem {
    name: string
    type: TagProps['type']
}

const dynamicTags = ref<TagsItem[]>([
    { name: 'Node 1', type: 'primary' },
    { name: 'Node 2', type: 'success' },
    { name: 'Node 3', type: 'info' },
    { name: 'Node 4', type: 'warning' },
])

const handleClick = () => {
    console.log('click')

}
const handleClose = (tag: string) => {
    dynamicTags.value.splice(dynamicTags.value.indexOf(tag), 1)
}

const showNodeInfo = () => {
    console.log('showNodeInfo')
}

</script>

<template>
    <el-row :gutter="20" justify="space-between" class="chart-header">
        <el-col :span="8">
            <div class="chart-header">节点集合</div>
        </el-col>

        <!-- <el-col :span="3" style="padding: 0;"> -->
            <el-button :icon="Delete" size="small" color="#e8e6e2" @click="handleClick" />
        <!-- </el-col> -->
    </el-row>


    <div class="flex gap-2 chart-content">

        <el-popover v-for="tag in dynamicTags" :key="tag.name" placement="right" :width="400" trigger="click">
            <template #reference>
                <el-tag closable :type="tag.type"
                    :disable-transitions="false" @close="handleClose(tag)">
                    {{ tag.name }}
                </el-tag>
            </template>
            <el-table :data="gridData">
                <el-table-column width="150" property="date" label="date" />
                <el-table-column width="100" property="name" label="name" />
                <el-table-column width="300" property="address" label="address" />
            </el-table>
        </el-popover>

        
        <el-button color="#e8e6e2" size="small" style="align-self: flex-end; margin-bottom: 1px;">Search</el-button>
    </div>

</template>

<style scoped>
.chart-header {
    height: 25px;
    font-size: 15px;
    font-weight: bold;
    background-color: #e8e6e2;
    margin-right: 0 !important;
}

.chart-content {
    width: 100%;
    /* height: calc(100% - 25px); */
    flex: 1;
    display: flex;
    /* align-items: flex-start; */
    /* border: 1px #e8e6e2 solid; */
    justify-content: space-between;
    padding-top: 10px;
}

.chart-content>span {
    margin: 0 5px;
    width: 75px;
    cursor: pointer;
}
</style>