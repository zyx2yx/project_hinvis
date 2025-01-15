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

const value1 = ref(4)
const value2 = ref(0.05)
const value3 = ref(95)
const value4 = ref(100)
const value5 = ref(10)
const value6 = ref(50)

const formatTooltip = (val: number) => {
  return val / 100
}
const formatTooltip_1 = (val: number) => {
  return `${val}-core`
}
const formatTooltip_2 = (val: number) => {
  return `估计误差:${val}`
}
const formatTooltip_3 = (val: number) => {
  return `存在概率:${val}%`
}
const formatTooltip_4 = (val: number) => {
  return `迭代次数:${val}`
}
const formatTooltip_5 = (val: number) => {
  return `社区下界:${val}`
}
const formatTooltip_6 = (val: number) => {
  return `社区上界:${val}`
}
</script>

<template>
    <div class="chart-container">
        <el-row :gutter="20" justify="space-between" class="chart-header">
            <el-col :span="8">
                <div class="chart-header">社区搜索参数</div>
            </el-col>
        </el-row>


        <div class="flex gap-2 chart-content">
            <div style="display: flex; flex-direction: column; flex-grow: 1; width: 90%; flex-shrink: 0;">
                <div class="cc-row">
                    <div class="slider-demo-block">
                        <span class="demonstration">K:</span>
                        <el-slider v-model="value1" size="small" :min="1" :max="10" 
                            :format-tooltip="formatTooltip_1"
                        />
                    </div>
                    <div class="slider-demo-block">
                        <span class="demonstration">ε:</span>
                        <el-slider v-model="value2" size="small" :min="0.01" :max="0.10"
                        :format-tooltip="formatTooltip_2"
                        />
                    </div>
                    <div class="slider-demo-block">
                        <span class="demonstration">β:</span>
                        <el-slider v-model="value3" size="small" :min="90" :max="100"
                        :format-tooltip="formatTooltip_3"
                        />
                    </div>
                </div>

                <div class="cc-row">
                    <div class="slider-demo-block">
                        <span class="demonstration">T:</span>
                        <el-slider v-model="value4" size="small" :min="10" :max="100"
                        :format-tooltip="formatTooltip_4" 
                        />
                    </div>
                    <div class="slider-demo-block">
                        <span class="demonstration">L:</span>
                        <el-slider v-model="value5"  size="small" :min="10" :max="100"
                        :format-tooltip="formatTooltip_5" 
                        />
                    </div>
                    <div class="slider-demo-block">
                        <span class="demonstration">H:</span>
                        <el-slider v-model="value6"  size="small" :min="10" :max="100"
                        :format-tooltip="formatTooltip_6" 
                        />
                    </div>
                </div>
            </div>


            <el-button color="#e8e6e2" size="small" style="align-self: flex-end; margin-bottom: 1px; width: 10%;">Start</el-button>
        </div>
    </div>


</template>

<style scoped>
.chart-container {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    /* align-items: center;
    justify-content: center; */
    background-color: #e8e6e2;
}

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
    display: flex;
    /* align-items: flex-start; */
    /* border: 1px #e8e6e2 solid; */
    /* justify-content: space-around; */
    background-color: white;
    /* flex-direction: column; */
    flex: 1;
}

.cc-row {
    display: flex;
    justify-content: space-around;
    width: 100%;
    height: 25px;

    /* padding: 10px;
    margin: 10px; */

}

.slider-demo-block {
    max-width: 600px;
    width: 120px;
    display: flex;
    align-items: center;
}

.slider-demo-block .el-slider {
    margin-top: 0;
    margin-left: 12px;
}

.slider-demo-block .demonstration {
    font-size: 14px;
    color: black;
    line-height: 44px;
    width: 20px;
    /* flex: 1; */
    /* overflow: hidden; */
    /* text-overflow: ellipsis; */
    /* white-space: nowrap; */
    /* margin-bottom: 0; */
}

/* .slider-demo-block .demonstration+.el-slider {
    flex: 0 0 70%;
} */
</style>