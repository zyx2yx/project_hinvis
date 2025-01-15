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
const handleClick = () => {
    console.log('click')
    isSearch.value = !isSearch.value
}

const value = ref([])
const input = ref('')
const isSearch = ref(false)

const props = {
    expandTrigger: 'hover' as const,
}

const handleChange = (value) => {
    console.log(value)
}

// 注意表格长度，当左侧填满是，会导致页面出现bug，原因难以找出
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
        idx: 6,
        date: '2016-05-01',
        name: 'Tom',
        state: 'California',
        city: 'Los Angeles',
        address: 'No. 189, Grove St, Los Angeles',
        zip: 'CA 90036',
        tag: 'Office',
    },
]

const options = [
    {
        value: 'guide',
        label: 'Guide',
        children: [
            {
                value: 'disciplines',
                label: 'Disciplines',
                children: [
                    {
                        value: 'consistency',
                        label: 'Consistency',
                    },
                    {
                        value: 'feedback',
                        label: 'Feedback',
                    },
                    {
                        value: 'efficiency',
                        label: 'Efficiency',
                    },
                    {
                        value: 'controllability',
                        label: 'Controllability',
                    },
                ],
            },
            {
                value: 'navigation',
                label: 'Navigation',
                children: [
                    {
                        value: 'side nav',
                        label: 'Side Navigation',
                    },
                    {
                        value: 'top nav',
                        label: 'Top Navigation',
                    },
                ],
            },
        ],
    },
    {
        value: 'component',
        label: 'Component',
        children: [
            {
                value: 'basic',
                label: 'Basic',
                children: [
                    {
                        value: 'layout',
                        label: 'Layout',
                    },
                    {
                        value: 'color',
                        label: 'Color',
                    },
                    {
                        value: 'typography',
                        label: 'Typography',
                    },
                    {
                        value: 'icon',
                        label: 'Icon',
                    },
                    {
                        value: 'button',
                        label: 'Button',
                    },
                ],
            },
            {
                value: 'form',
                label: 'Form',
                children: [
                    {
                        value: 'radio',
                        label: 'Radio',
                    },
                    {
                        value: 'checkbox',
                        label: 'Checkbox',
                    },
                    {
                        value: 'input',
                        label: 'Input',
                    },
                    {
                        value: 'input-number',
                        label: 'InputNumber',
                    },
                    {
                        value: 'select',
                        label: 'Select',
                    },
                    {
                        value: 'cascader',
                        label: 'Cascader',
                    },
                    {
                        value: 'switch',
                        label: 'Switch',
                    },
                    {
                        value: 'slider',
                        label: 'Slider',
                    },
                    {
                        value: 'time-picker',
                        label: 'TimePicker',
                    },
                    {
                        value: 'date-picker',
                        label: 'DatePicker',
                    },
                    {
                        value: 'datetime-picker',
                        label: 'DateTimePicker',
                    },
                    {
                        value: 'upload',
                        label: 'Upload',
                    },
                    {
                        value: 'rate',
                        label: 'Rate',
                    },
                    {
                        value: 'form',
                        label: 'Form',
                    },
                ],
            },
            {
                value: 'data',
                label: 'Data',
                children: [
                    {
                        value: 'table',
                        label: 'Table',
                    },
                    {
                        value: 'tag',
                        label: 'Tag',
                    },
                    {
                        value: 'progress',
                        label: 'Progress',
                    },
                    {
                        value: 'tree',
                        label: 'Tree',
                    },
                    {
                        value: 'pagination',
                        label: 'Pagination',
                    },
                    {
                        value: 'badge',
                        label: 'Badge',
                    },
                ],
            },
            {
                value: 'notice',
                label: 'Notice',
                children: [
                    {
                        value: 'alert',
                        label: 'Alert',
                    },
                    {
                        value: 'loading',
                        label: 'Loading',
                    },
                    {
                        value: 'message',
                        label: 'Message',
                    },
                    {
                        value: 'message-box',
                        label: 'MessageBox',
                    },
                    {
                        value: 'notification',
                        label: 'Notification',
                    },
                ],
            },
            {
                value: 'navigation',
                label: 'Navigation',
                children: [
                    {
                        value: 'menu',
                        label: 'Menu',
                    },
                    {
                        value: 'tabs',
                        label: 'Tabs',
                    },
                    {
                        value: 'breadcrumb',
                        label: 'Breadcrumb',
                    },
                    {
                        value: 'dropdown',
                        label: 'Dropdown',
                    },
                    {
                        value: 'steps',
                        label: 'Steps',
                    },
                ],
            },
            {
                value: 'others',
                label: 'Others',
                children: [
                    {
                        value: 'dialog',
                        label: 'Dialog',
                    },
                    {
                        value: 'tooltip',
                        label: 'Tooltip',
                    },
                    {
                        value: 'popover',
                        label: 'Popover',
                    },
                    {
                        value: 'card',
                        label: 'Card',
                    },
                    {
                        value: 'carousel',
                        label: 'Carousel',
                    },
                    {
                        value: 'collapse',
                        label: 'Collapse',
                    },
                ],
            },
        ],
    },
    {
        value: 'resource',
        label: 'Resource',
        children: [
            {
                value: 'axure',
                label: 'Axure Components',
            },
            {
                value: 'sketch',
                label: 'Sketch Templates',
            },
            {
                value: 'docs',
                label: 'Design Documentation',
            },
        ],
    },
]

</script>

<template>
    <div style="width: 100%; height: 100%; display: flex; flex-direction: column; flex: 0;">

            <el-row :gutter="20" justify="start" class="chart-header">
                <el-col :span="8">
                    <div class="chart-header">节点查询</div>
                </el-col>

                <el-col :span="16" style="display: flex; justify-content:flex-end; padding: 0;">
                    <!-- <span style="font-size: 12px; line-height: 25px;">nodeType&Attr：</span> -->
                    <el-cascader v-model="value" :options="options" :props="props" @change="handleChange"
                        placeholder="nodeType&Attr" style="height: 20px; width: 150px;" size="small" />
                    <el-input v-model="input" style="width: 150px;height: 24px;" placeholder="Please input" />
                    <el-button :icon="Search" size="small" color="#e8e6e2" @click="handleClick" />
                </el-col>
            </el-row>

            <el-table v-if="isSearch" :data="tableData" size="small" style="height: 180px;">
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
                    </template>
                </el-table-column>
            </el-table>
            <el-empty v-else description="There Is No Data" class="chart-content" :image-size="50" style="height: 180px;"/>
            <!-- <el-table :data="tableData" size="small" style="width: 100%; flex: 1;">
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
                    </template>
                </el-table-column>
            </el-table> -->

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
    /* flex: 0; */
    /* height: calc(100% - 25px); */
}
</style>