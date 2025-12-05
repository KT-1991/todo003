<script lang="ts" setup>
import { Transition } from 'vue';
import { COLOR_TYPE } from '@/scripts/const';
import { useColorStore } from '@/stores/color';

const colorStore = useColorStore();

</script>

<template>
    <div class="loader_background"></div>    
    <div class="loader loader_position"></div>      
</template>

<style scoped>
/* HTML: <div class="loader"></div> */
.loader_background{
    background-color: black;
    opacity: 0.5;
    position: absolute;
    height: 100vh;
    width: 100vw;
    z-index: 150;
}
.loader_position {
    position: absolute;
    top: 50%;
    left: 50%;
    margin: -25px 0 0 -25px;
    z-index: 150;
}
.loader {
  width: 50px;
  --b: 8px; 
  aspect-ratio: 1;
  border-radius: 50%;
  padding: 1px;
  background: conic-gradient(#0000 10%,v-bind(colorStore.getColorBy(COLOR_TYPE.secondary))) content-box;
  -webkit-mask:
    repeating-conic-gradient(#0000 0deg,#000 1deg 20deg,#0000 21deg 36deg),
    radial-gradient(farthest-side,#0000 calc(100% - var(--b) - 1px),#000 calc(100% - var(--b)));
  -webkit-mask-composite: destination-in;
          mask-composite: intersect;
  animation:l4 1s infinite steps(10);
}
@keyframes l4 {to{transform: rotate(1turn)}}
</style>