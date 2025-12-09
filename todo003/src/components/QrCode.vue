<script setup lang="ts">
import { useColorStore } from "@/stores/color";
import QRCode from "qrcode";
import { ref } from "vue";
import { COLOR_TYPE } from "@/scripts/const";

const src = ref<string>("");
const colorStore = useColorStore;

const handlerTextChange = async () => {
  src.value = await QRCode.toDataURL("https://todo003-2bcd8.web.app");
}
handlerTextChange();

</script>

<template>
    <div class="qrcode_container">
        <div>スマホからの利用はこちらから</div>
        <img :src="src" class="qrcode"/>
    </div>
    
</template>

<style scoped>
.qrcode_container{
    margin: 5px;
    padding: 10px;
    width: fit-content;
    border: 1px solid black;
    background-color: white;
    color: black;
}
.qrcode {
  display: block;
  max-width: 150px;
  margin: 0 auto;
}
</style>