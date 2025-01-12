<script setup>
import { ref } from 'vue'
const handleClick = () => {
    console.log('click')
}

const tableData = [
    {
        idx: 1,
        date: '2016-05-03',
        name: 'Tom',
        state: 'California',
        city: 'Los Angeles',
        address: 'No. 189, Grove St, Los Angeles',
        zip: 'CA 90036',
        tag: 'Home',
    },
    {
        idx: 2,
        date: '2016-05-02',
        name: 'Tom',
        state: 'California',
        city: 'Los Angeles',
        address: 'No. 189, Grove St, Los Angeles',
        zip: 'CA 90036',
        tag: 'Office',
    },
    {
        idx: 3,
        date: '2016-05-04',
        name: 'Tom',
        state: 'California',
        city: 'Los Angeles',
        address: 'No. 189, Grove St, Los Angeles',
        zip: 'CA 90036',
        tag: 'Home',
    },
    {
        idx: 4,
        date: '2016-05-01',
        name: 'Tom',
        state: 'California',
        city: 'Los Angeles',
        address: 'No. 189, Grove St, Los Angeles',
        zip: 'CA 90036',
        tag: 'Office',
    },
    {
        idx: 5,
        date: '2016-05-01',
        name: 'Tom',
        state: 'California',
        city: 'Los Angeles',
        address: 'No. 189, Grove St, Los Angeles',
        zip: 'CA 90036',
        tag: 'Office',
    },
    {
        idx: 5,
        date: '2016-05-01',
        name: 'Tom',
        state: 'California',
        city: 'Los Angeles',
        address: 'No. 189, Grove St, Los Angeles',
        zip: 'CA 90036',
        tag: 'Office',
    },
    {
        idx: 5,
        date: '2016-05-01',
        name: 'Tom',
        state: 'California',
        city: 'Los Angeles',
        address: 'No. 189, Grove St, Los Angeles',
        zip: 'CA 90036',
        tag: 'Office',
    },
    {
        idx: 5,
        date: '2016-05-01',
        name: 'Tom',
        state: 'California',
        city: 'Los Angeles',
        address: 'No. 189, Grove St, Los Angeles',
        zip: 'CA 90036',
        tag: 'Office',
    },
    {
        idx: 5,
        date: '2016-05-01',
        name: 'Tom',
        state: 'California',
        city: 'Los Angeles',
        address: 'No. 189, Grove St, Los Angeles',
        zip: 'CA 90036',
        tag: 'Office',
    },
    {
        idx: 5,
        date: '2016-05-01',
        name: 'Tom',
        state: 'California',
        city: 'Los Angeles',
        address: 'No. 189, Grove St, Los Angeles',
        zip: 'CA 90036',
        tag: 'Office',
    },
]

const value = ref('MAHE-IM')
const options = [
  {
    value: 'MAHE-IM',
    label: 'MAHE-IM',
  },
  {
    value: 'PageRank',
    label: 'PageRank',
  },
  {
    value: 'Degree',
    label: 'Degree',
  },
  {
    value: 'Betweenness',
    label: 'Betweenness',
  },
  {
    value: 'Closeness',
    label: 'Closeness',
  },
]

const valueNodeType = ref('Author')
const typeOptions = [
  {
    value: 'Author',
    label: 'Author',
  },
  {
    value: 'Paper',
    label: 'Paper',
  },
  {
    value: 'Venue',
    label: 'Venue',
  },
  {
    value: 'Topic',
    label: 'Topic',
  },
]
</script>

<template>
    <el-row :gutter="20" justify="space-between" class="chart-header">
        <el-col :span="8">
            <div class="chart-header">节点推荐</div>
        </el-col>
        <el-col :span="16" style="display: flex; justify-content:flex-end">
            <span style="font-size: 12px; line-height: 25px;">nodeType：</span>
            <el-select v-model="valueNodeType" placeholder="Select" size="small" style="width: 80px; height: 20px;"> 
                <el-option v-for="item in typeOptions" 
                    :key="item.value" 
                    :label="item.label" 
                    :value="item.value" 
                />
            </el-select>
            <span style="width: 5px;"></span>
            <span style="font-size: 12px; line-height: 25px;">Sort by：</span>
            <el-select v-model="value" placeholder="Select" size="small" style="width: 90px; height: 20px;"> 
                <el-option v-for="item in options" 
                    :key="item.value" 
                    :label="item.label" 
                    :value="item.value" 
                />
            </el-select>
            <!-- <span style="font-size: 12px; line-height: 25px;">Top 100 nodes</span> -->
        </el-col>
    </el-row>

    <el-table :data="tableData" style="width: 100%; height: calc(100% - 25px);" size="small">
        <el-table-column fixed prop="idx" label="#id" width="50" />
        <el-table-column prop="date" label="Date" width="100" />
        <el-table-column prop="name" label="Name" width="70" />
        <el-table-column prop="state" label="State" width="100" />
        <el-table-column prop="city" label="City" width="120" />
        <el-table-column prop="address" label="Address" width="600" />
        <el-table-column prop="zip" label="Zip" width="120" />
        <el-table-column fixed="right" label="操作" min-width="60">
            <template #default>
                <el-button link type="primary" size="small" @click="handleClick">
                    Add
                </el-button>
                <!-- <el-button link type="primary" size="small">Edit</el-button> -->
            </template>
        </el-table-column>
    </el-table>

</template>

<style>

.el-row:last-child {
    margin-bottom: 0;
}

.el-col {
    border-radius: 4px;
}

.grid-content {
    border-radius: 4px;
    min-height: 36px;
}

.chart-header {
    height: 25px;
    font-size: 15px;
    font-weight: bold;
    background-color: #e8e6e2;
}
</style>