<script setup lang="ts">
import { useColorStore } from "@/stores/color";
import { reactive, ref } from "vue";
import { COLOR_TYPE, FONT_TYPE } from "@/scripts/const";
import { useTodoStore } from "@/stores/todo";
import { useSizeStore } from "@/stores/size";

const colorStore = useColorStore();
const todoStore = useTodoStore();
const sizeStore = useSizeStore();

const isEnabled = ref(false);
const backOff = ref();
const backOn = ref();

const naviPosition = reactive({
    top: 0,
    left: 0,
    height: 0,
    width: 0,
})

const getOpacity = (isTransparent: boolean): number => {
    if(isTransparent){
        return 0;
    }else{
        return 1;
    }
}

const changeEnabled = (newValue: boolean) => {
    isEnabled.value = newValue;
}

defineExpose({changeEnabled})

</script>

<template>
    <div class="toggle_base">
        <div class="toggle_back_base">
            <div class="toggle_back_off" ref="backOff">
                <div class="toggle_back_off_text">off</div>
            </div>
            <div class="toggle_back_on" ref="backOn">
                <div class="toggle_back_on_text">on</div>
            </div>
        </div>
    </div>
    
</template>

<style scoped>
.toggle_back_base{
    display: flex;
    border: 1px solid gray;
}
.toggle_back_on{
    width: 30px;
    text-align: center;
    color: v-bind(colorStore.getColorBy(COLOR_TYPE.onPrimaryHeavy));  
    background-color: v-bind(colorStore.getColorBy(COLOR_TYPE.primaryHeavy));
}
.toggle_back_off{
    width: 30px;
    text-align: center;
    color: v-bind(colorStore.getColorBy(COLOR_TYPE.primaryHeavy));  
    background-color: v-bind(colorStore.getColorBy(COLOR_TYPE.onPrimaryHeavy)); 
}
.toggle_back_off_text{
    opacity: v-bind(getOpacity(isEnabled));
    transition: opacity 0.3s ease-out;
}
.toggle_back_on_text{
    opacity: v-bind(getOpacity(!isEnabled));
    transition: opacity 0.3s ease-out;
}

</style>