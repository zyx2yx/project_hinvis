<script setup>
import BetweenCenter from '../components/betweenCenter.vue'
import CloseCenter from '../components/closeCenter.vue'
import DegreeDis from '../components/degreeDis.vue'
import Harmonic from '../components/harmonic.vue'
</script>

<template>
  <div class="image-box" id="community-info">
    <div class="info-item" id="community-info-1"><BetweenCenter /></div>
    <div class="info-item" id="community-info-2"><CloseCenter /></div>
    <div class="info-item" id="community-info-3"><Harmonic /></div>
    <div class="info-item" id="community-info-4"><DegreeDis/></div>
  </div>
</template>

<style scoped>
#community-info{
  width: 100%;
  height: 100%;
  display: flex;
}
.info-item{
  width: 25%;
  height: 100%;
  border-left: 1px solid rgb(3, 140, 189);
  border-right: 1px solid rgb(3, 140, 189);
}
</style>