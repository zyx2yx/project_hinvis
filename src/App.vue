<script setup>

import { RouterView } from 'vue-router'
import { onMounted } from 'vue';
import { select } from 'd3';

let nodeControlTooltip

// 为tooltip-node-control添加事件监听
onMounted(() => {
  document.getElementById('tooltip-node-control').addEventListener('click', function(event) {
    
    const target = event.target;
      // const current_node = target.dataset.node; // 假设 current_node 通过 data- 属性传递
      console.log("target.dataset.node:",target.dataset.node);
      const current_node = JSON.parse(target.dataset.node);  // 获取并解析存储在 data-node 中的对象
      
  
      if (target.matches('[data-action="addToSet"]')) {
          addToSet(current_node);
      } else if (target.matches('[data-action="expandNode"]')) {
          expandNode(current_node);
      } else if (target.matches('[data-action="selectSelfNeighbor"]')) {
          selectSelfNeighbor(current_node);
      } else if (target.matches('[data-action="cancelSelect"]')) {
          cancelSelect(current_node);
      } else if (target.matches('[data-action="copyNodeInfo"]')) {
          copyNodeInfo(current_node);
      } else if (target.matches('[data-action="quitPanel"]')) {
          quitPanel();
      }
  
  })
  nodeControlTooltip = select("#tooltip-node-control");
})


function addToSet(node){
    console.log(`add ${node.id} to search set` );
}
function expandNode(node){
    console.log(`expand ${node.id}` );
}
function selectSelfNeighbor(node){
    console.log(`selectSelfNeighbor ${node.id}` );
}
function cancelSelect(node){
    console.log(`cancelSelect ${node.id}` );
}
function copyNodeInfo(node){
    console.log(`naod name: ${node.id}` );
}
function quitPanel(){
    nodeControlTooltip.attr('class', 'prompt-hide')
}


</script>

<template>
  <RouterView />
  <div id="tooltip" class="prompt-hide"></div>
  <div id="tooltip-node-control" class="prompt-hide"></div>
</template>

<style scoped>

</style>
