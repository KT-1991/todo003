<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import HelloWorld from './components/HelloWorld.vue'
import { useColorStore } from './stores/color';
import { COLOR_TYPE } from './scripts/const';

const colorStore = useColorStore();


</script>

<template>
  <RouterView />
</template>

<style>

.test_class{
  background-color: red;
}

</style>
