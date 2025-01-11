<script setup>
import { watch, onMounted } from 'vue'
import { storeToRefs } from 'pinia'

import CommunityFlower from '../components/communityFlower.vue'
import LineChart from '../components/lineChart.vue'
import ScatterPoint from '../components/scatterPoint.vue'
import PointInfoList from '../components/pointInfoList.vue'
import CommunityInfo from '../components/communityInfo.vue'

// 引入 社区Store
import { useComIdStore } from '../stores/communityIdStore'
// 引入点嵌入Store
import { useEmbedStore } from '../stores/groupEmbedStore'

const { clubId } = storeToRefs(useComIdStore())
const { asyncGetEmbedData } = useEmbedStore()

watch(clubId, async currentId => {
    asyncGetEmbedData(currentId)
})

onMounted(() => {
    asyncGetEmbedData(clubId.value)
})
</script>

<template>

    <div class="top">
        <div class="top-top">
            <CommunityFlower />
        </div>
        <div class="top-bottom">
            <CommunityInfo />
        </div>
    </div>
    <div class="bottom">
        <ScatterPoint></ScatterPoint>
        <div id="bottom_mid">
            <LineChart></LineChart>
        </div>
        <PointInfoList></PointInfoList>
    </div>
</template>

<style scoped>
.top {
    width: 100%;
    height: 70%;
    display: flex;
    flex-direction: column;
}

.top-top {
    width: 100%;
    height: 65%;
}

.top-bottom {
    width: 100%;
    height: 35%;
}

.bottom {
    width: 100%;
    height: 30%;
    display: flex;
}

#bottom_mid {
    width: 40%;
    height: 100%;
}
</style>