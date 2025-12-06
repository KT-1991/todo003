<script setup lang="ts">
import { RouterLink, RouterView, useRoute } from 'vue-router'
import HelloWorld from './components/HelloWorld.vue'
import { useColorStore } from './stores/color';
import { COLOR_TYPE, FONT_TYPE } from './scripts/const';
import HeaderComponent from './components/HeaderComponent.vue';
const colorStore = useColorStore();
const route = useRoute();

</script>

<template>
  <div v-show="route.path != '/login'">
    <HeaderComponent/>
  </div>
  <div class="base_main">
    <RouterView/>
  </div>
</template>

<style>

.base_main{
  font-family: v-bind(FONT_TYPE.MAIN_SENTENSE);
  background-color: v-bind(colorStore.getColorBy(COLOR_TYPE.gray));
}

@font-face {
  font-family: 'IBMPlexSansJP-Bold';
  src: url('@/assets/fonts/IBMPlexSansJP-Bold.ttf') format('truetype');
}
@font-face {
  font-family: 'IBMPlexSansJP-Medium';
  src: url('@/assets/fonts/IBMPlexSansJP-Medium.ttf') format('truetype');
}
@font-face {
  font-family: 'YDWbananaslipplus';
  src: url('@/assets/fonts/YDWbananaslipplus.otf') format('opentype');
}
@font-face {
  font-family: 'MPLUS1p-Regular';
  src: url('@/assets/fonts/MPLUS1p-Regular.ttf') format('truetype');
}
@font-face {
  font-family: 'NotoSansJP-Regular';
  src: url('@/assets/fonts/NotoSansJP-Regular.ttf') format('truetype');
}
@font-face {
  font-family: 'SawarabiGothic-Regular';
  src: url('@/assets/fonts/SawarabiGothic-Regular.ttf') format('truetype');
}
@font-face {
  font-family: 'Anton-Regular';
  src: url('@/assets/fonts/Anton-Regular.ttf') format('truetype');
}
@font-face {
  font-family: 'Oswald-VariableFont_wght';
  src: url('@/assets/fonts/Oswald-VariableFont_wght.ttf') format('truetype');
}
@font-face {
  font-family: 'komadori-mini';
  src: url('@/assets/fonts/komadori-mini.otf') format('opentype');
}
@font-face {
  font-family: 'YDWaosagi';
  src: url('@/assets/fonts/YDWaosagi.otf') format('opentype');
}
@font-face {
  font-family: 'YDWyadewanoji';
  src: url('@/assets/fonts/YDWyadewanoji.otf') format('opentype');
}
@font-face {
  font-family: 'canarymini';
  src: url('@/assets/fonts/canarymini.otf') format('opentype');
}

</style>
