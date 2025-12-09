<script setup lang="ts">
import { useColorStore } from "@/stores/color";
import { onMounted, ref } from "vue";
import { COLOR_TYPE, FONT_TYPE } from "@/scripts/const";
import { useTodoStore } from "@/stores/todo";
import { useSizeStore } from "@/stores/size";
import ButtonToggle from "./ButtonToggle.vue";

const colorStore = useColorStore();
const todoStore = useTodoStore();
const sizeStore = useSizeStore();

const buttonSuggestion: any = ref();

const initSetting = () => {
    buttonSuggestion.value.changeEnabled(todoStore.hasSuggestion);
}

const switchSuggest = () => {
    const hasSuggest = todoStore.hasSuggestion;
    if(!hasSuggest){
        todoStore.initTodoForSuggestions();
    }
    todoStore.saveSuggestSetting(!hasSuggest);
    buttonSuggestion.value.changeEnabled(!hasSuggest);
}

onMounted(() => {
    initSetting();
    console.log("test")
})
</script>

<template>
    <div class="setting_base">
        <div class="setting_container2">
            <div class="setting_title">設定</div>
            <div class="setting_container">
                <div class="setting_item">
                    <div class="setting_item_title">タスク入力履歴の表示</div>
                    <ButtonToggle v-on:click="switchSuggest" ref="buttonSuggestion"/>
                </div>
            </div>            
        </div>


    </div>
    
</template>

<style scoped>
.setting_base{
    height: calc(100vh - v-bind('sizeStore.heightHeader') * 1px);
    padding: 10px;

}
.setting_title{
    width: 100%;
    font-size: medium;
    padding-left: 10px;
    font-family: v-bind(FONT_TYPE.UI_SMALL);
    color: v-bind(colorStore.getColorBy(COLOR_TYPE.onPrimaryHeavy));  
    background-color: v-bind(colorStore.getColorBy(COLOR_TYPE.primaryHeavy)); 
}
.setting_container2{
    width: fit-content;
    margin: 0 auto;
    border: 2px solid black;
}
.setting_container{
    width: fit-content;
    padding: 10px;
    
    color: v-bind(colorStore.getColorBy(COLOR_TYPE.onBackground));  
    background-color: v-bind(colorStore.getColorBy(COLOR_TYPE.background));  
}
.setting_item{
    display: flex;
}
.setting_item_title{
    margin-right: 10px;
}
</style>