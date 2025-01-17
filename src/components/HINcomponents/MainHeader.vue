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
    ArrowDown ,
    ArrowDownBold,
} from '@element-plus/icons-vue'

const input3 = ref('')
const select3 = ref('Domain')
const typeOptions = [
  {
    value: 'Domain',
    label: 'Domain',
  },
  {
    value: 'IP',
    label: 'IP',
  },
  {
    value: 'IP_C',
    label: 'IP_C',
  },
  {
    value: 'Cert',
    label: 'Cert',
  },
  {
    value: 'Whois',
    label: 'Whois',
  },
  {
    value: 'ASN',
    label: 'ASN',
  },
]
const input4 = ref('')
const select4 = ref('Industry')
const typeOptions_4 = [
  {
      value: 'Industry',
      label: 'Industry',
    },
]

const showword = ref(true)
const fixedLayout = ref(false)
const fontsize = ref(10)
const baseEdgeLength = ref(1)
const baseNodeSize = ref(1)

const layout = ref('MLSGD(Py)')
const layoutOption = [
    {
        value: 'MLSGD(Py)',
        label: 'MLSGD(Py)',
    },
    {
        value: 'D3-force',
        label: 'D3-force',
    },
    {
        value: 'Circle',
        label: 'Circle',
    },
    {
        value: 'Tree',
        label: 'Tree',
    },
]

const edgeType = [
    'cert', 'subdomain', 'request_jump', 'dns_a', 'whois', 'cert_chain', 'cname', 'asn', 'cidr'
]

const legendValue_virtual = ref([])
const legendColor_virtual = [
  {
    value: '#FF6600',
    label: 'orange',
  },
  {
    value: '#FFDE0A',
    label: 'yellow',
  },
  {
    value: '#1EC79D',
    label: 'green',
  },
  {
    value: '#14CCCC',
    label: 'cyan',
  },
]

legendColor_virtual.forEach((color) => {
    legendValue_virtual.value.push(color.value)
})
</script>

<template>

    <div class="main-header">
        <el-button color="#626aef" size="small">点# {{ 2237 }}</el-button>
        <el-button color="#80d169" size="small">边# {{ 4465 }}</el-button>
        <div class="search-box">
            <div class="search-title">搜索节点</div>
            <el-input v-model="input3" style="max-width: 600px; width: 300px;" placeholder="输入节点" class="input-with-select">
                <template #prepend>
                    <el-select v-model="select3" placeholder="Select" size="small" style="width: 80px;">
                        <el-option v-for="item in typeOptions" 
                            :key="item.value" 
                            :label="item.label" 
                            :value="item.value" 
                            />
                    </el-select>
                </template>
                <template #append>
                    <el-button :icon="Search" />
                </template>
            </el-input>
        </div>
        <div class="search-box">
            <div class="search-title">搜索属性</div>
            <el-input v-model="input4" style="max-width: 600px; width: 300px;" placeholder="输入属性" class="input-with-select">
                <template #prepend>
                    <el-select v-model="select4" placeholder="Select" size="small" style="width: 80px;">
                        <el-option v-for="item in typeOptions_4" 
                            :key="item.value" 
                            :label="item.label" 
                            :value="item.value" 
                            />
                    </el-select>
                </template>
                <template #append>
                    <el-button :icon="Search" />
                </template>
            </el-input>
        </div>
        <div class="search-box">
            <div class="search-title">标签</div>
            <el-switch v-model="showword" style="height: 100%; --el-switch-off-color: #13ce66; --el-switch-on-color: #ffa500;">
                <template #active-action>
                <span class="custom-active-action">字</span>
                </template>
                <template #inactive-action>
                <span class="custom-inactive-action">无</span>
                </template>
            </el-switch>
        </div>
        <div class="search-box">
            <div class="search-title">字体大小</div>
            <el-slider v-model="fontsize" :min="5" :max="20" style="width: 150px;" size="small" />
        </div>

        <el-button color="#80d169" size="small">边# {{ 175 }}</el-button>
        <el-button color="#626aef" size="small">点# {{ 65 }}</el-button>
    </div>
    <div class="main-header">
        <el-button :icon="Histogram" size="small" color="#dba0c0" @click="drawer2 = true" />
        <div class="search-box">
            <div class="search-title">布局算法</div>
            <el-select v-model="layout" placeholder="Select" size="small" style="width: 100px;">
                <el-option v-for="item in layoutOption" 
                    :key="item.value" 
                    :label="item.label" 
                    :value="item.value" 
                    />
            </el-select>
        </div>
        <el-select v-model="edgeType[0]" placeholder="Select" size="small" style="width: 150px;">
                <el-option v-for="item in layoutOption" 
                    :key="item.value" 
                    :label="item.label" 
                    :value="item.value" 
                    />
        </el-select>
        <div class="search-box">
            <div class="search-title">基础边长(HeIN)</div>
            <el-slider v-model="baseEdgeLength" :min="0" :max="10" style="width: 120px;" size="small" />
        </div>
        <div class="search-box">
            <div class="search-title">节点大小</div>
            <el-select v-model="select3" placeholder="Select" size="small" style="width: 80px; background-color: #f5f7fa !important;">
                        <el-option v-for="item in typeOptions" 
                            :key="item.value" 
                            :label="item.label" 
                            :value="item.value" 
                            />
                    </el-select>
            <el-slider v-model="baseNodeSize" :min="0" :max="10" style="width: 120px;" size="small" />
            
        </div>
        <div class="search-box">
            <div class="search-title">节点距离(HoIN)</div>
            <el-slider v-model="baseEdgeLength" :min="0" :max="10" style="width: 120px;" size="small" />
        </div>
        <div class="search-box">
            <div class="search-title">固定布局</div>
            <el-switch v-model="fixedLayout" style="height: 100%;
                --el-switch-off-color: #13ce66;
                --el-switch-on-color: #ffa500;"
                size="small"
                active-text="True"
                >
                <!-- inactive-text="Close" -->

            </el-switch>
        </div>
        <div style="width: 100px; display: flex;">
            <el-tag v-for="color in legendValue_virtual" :key="color" :color="color" />
            <el-button :icon="ArrowDownBold" size="small" color="#fff" style="width: 25px;" />
        </div>
        <el-button :icon="Histogram" size="small" color="#dba0c0" />
    </div>
    <!-- <div v-for="edge in edgeType" style="display: flex;">
        <div>{{ edge }}:</div>
        <el-input-number v-model="num" :min="1" :max="10" @change="handleChange" />
    </div> -->

</template>

<style scoped>
.main-header {
    width: 100%;
    height: 50%;
    display: flex;
    justify-content: space-between;
    /* font-family:'Times New Roman', Times, serif; */
}

.chart-header, .search-title {
    height: 25px;
    line-height: 25px;
    font-size: 13px;
    font-weight: bold;
    /* margin: 0 10px; */
    background-color: #e8e6e2;
    /* font-family:Verdana, Geneva, Tahoma, sans-serif; */
    
}
.search-box {
    display: flex;
}
/* 修改滑动轨道颜色 */
.el-slider__runway {
background-color: white;
}
</style>