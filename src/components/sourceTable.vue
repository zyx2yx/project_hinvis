<script setup>
import { ref, watch, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useForceConfigStore } from '../stores/forceConfigStore'

const store = useForceConfigStore()
// const router = useRouter()
const { updataForceConfig } = store
const { selectValue } = storeToRefs(store)
const forceConfig = reactive({
    collideRadius: 5,
    collideIterations: 1,
    collideStrength: 1, 
    manyBodyStrength: -30,
    manyBodyStrengDisMin: 1,
    manyBodyStrengDisMax: 300,
})

onMounted(() => {
    // options.push({
    //     value: "GX",
    //     label: "自由探索",
    // },)
})

const options = [
    {
        value: "G1",
        label: "团伙1",
    },
    {
        value: "G2",
        label: "团伙2",
    },
    {
        value: "G3",
        label: "团伙3",
    },
    {
        value: "G4",
        label: "团伙4",
    },
    {
        value: "G5",
        label: "团伙5",
    },
    {
        value: "G6",
        label: "团伙6",
    },
    {
        value: "G7",
        label: "团伙7",
    },
    {
        value: "G8",
        label: "团伙8",
    },
    {
        value: "G9",
        label: "团伙9",
    },
    {
        value: "G10",
        label: "团伙10",
    },
]

function upload() {
    // 这里要转化为非ref对象，否则表单数据直接和store中的数据进行类似于v-model模式绑定，不好触发更新
    updataForceConfig(JSON.parse(JSON.stringify(forceConfig)))
}

</script>

<template>
    <div id="source-table" class="image-box">
        <div id="chead">
            <el-select id="select" v-model="selectValue" placeholder="请选择">
                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
            </el-select>
        </div>
        <div id="c1" class="cell">
            <el-tooltip class="title_item2" effect="dark" content="节点间相互影响的力" placement="right">
                <el-link type="primary">力</el-link>
            </el-tooltip>
            <div class="i_slider">
                <span class="slider_iteam">
                    <font color="#409EFF">力的大小(斥力):{{ forceConfig.manyBodyStrength }}</font>
                </span>
                <el-slider v-model="forceConfig.manyBodyStrength" :max="0" :min="-50"></el-slider>
            </div>
            <div class="i_slider">
                <span class="slider_iteam">
                    <font color="#409EFF">力的最小距离:{{ forceConfig.manyBodyStrengDisMin }}</font>
                </span>
                <el-slider v-model="forceConfig.manyBodyStrengDisMin" :min="1" :max="50"></el-slider>
            </div>
            <div class="i_slider">
                <span class="slider_iteam">
                    <font color="#409EFF">力的最大距离:{{ forceConfig.manyBodyStrengDisMax }}</font>
                </span>
                <el-slider v-model="forceConfig.manyBodyStrengDisMax" :min="50" :max="500"></el-slider>
            </div>
        </div>
        <div id="c2" class="cell">
            <el-tooltip class="title_item2" effect="dark" content="节点间的碰撞参数" placement="right">
                <el-link type="primary">碰撞</el-link>
            </el-tooltip>
            <div class="i_slider">
                <span class="slider_iteam">
                    <font color="#409EFF">力的大小:{{ forceConfig.collideStrength }}</font>
                </span>
                <el-slider v-model="forceConfig.collideStrength" :max="10" :min="0"></el-slider>
            </div>
            <div class="i_slider">
                <span class="slider_iteam">
                    <font color="#409EFF">半径:{{ forceConfig.collideRadius }}</font>
                </span>
                <el-slider v-model="forceConfig.collideRadius" :max="30" :min="5"></el-slider>
            </div>
            <div class="i_slider">
                <span class="slider_iteam">
                    <font color="#409EFF">迭代次数:{{ forceConfig.collideIterations }}</font>
                </span>
                <el-slider v-model="forceConfig.collideIterations" :max="5" :min="1"></el-slider>
            </div>
        </div>
        <el-button type="primary" class="upload" @click="upload()">
            确认<i class="el-icon-upload el-icon--right"></i>
        </el-button>
    </div>
</template>

<style scoped>
#source-table {
    width: 15%;
    height: 100%;
    padding: 10px;
    overflow-y: scroll;
    overflow-x: hidden;
}

.cell {
    border-style: solid;
    border-width: 0.5px;
    border-radius: 15px;
    padding: 10px;
    margin: 1px;
    box-shadow: 0 2px 12px 0 rgba(5, 2, 233, 0.1);
}

#chead {
    width: 97%;
    height: 7%;
    margin-left: 2px;
}

.title_item2 {
    margin-left: 40%;
    margin-top: 4px;
    font-size: 20px;
    font-family: Arial;
}

.upload {
    width: 100%;
    margin-top: 10%;
}
</style>