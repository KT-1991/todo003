<script setup lang="ts">
import { useColorStore } from "@/stores/color.js";
//@ts-ignore
import Firebase from "../firebase_settings/index.js"
import { useTodoStore } from '@/stores/todo';
import { onAuthStateChanged } from 'firebase/auth';
import { computed, onMounted, ref, toDisplayString } from 'vue';
import ButtonMain from "./ButtonMain.vue";
import { BUTTON_SIZE, BUTTON_TYPE, CATEGORY_COLOR_INFO, COLOR_TYPE } from "@/scripts/const.js";
import CardTask from "./CardTask.vue";
import { useSizeStore } from "@/stores/size.js";

const auth = Firebase.auth
const todoStore = useTodoStore();
const colorStore = useColorStore();
const sizeStore = useSizeStore();

const addTestData: any = async () => {
    todoStore.listCategory.forEach(elem => {
        for(let i=0; i < 30; i++){
            console.log(elem.id + " " + i.toString());
            const num = i.toString();
            todoStore.addTodo(elem.id as any, "title" + num, "detail" + num, new Date());            
        }
    })
}
const formatDate = (date: Date | undefined): string => {
    if(date == null){
        return "";
    }
    const text: string = (date.getMonth() + 1) + "/" + date.getDate();
    return text;
}
const isFirstTodo = (categoryId: string, index: number) => {
    const current = todoStore.dataTodo[categoryId]![index]?.doAt;
    const prev = todoStore.dataTodo[categoryId]![index - 1]?.doAt;
    if(current?.getFullYear() == prev?.getFullYear() &&
        current?.getMonth() == prev?.getMonth() &&
        current?.getDate() == prev?.getDate()){
            
        return false;
    }else{
        return true;
    }
}
const isLastTodo = (categoryId: string, index: number): boolean => {
    const current = todoStore.dataTodo[categoryId]![index]?.doAt;
    const next = todoStore.dataTodo[categoryId]![index + 1]?.doAt;
    if(current?.getFullYear() == next?.getFullYear() &&
        current?.getMonth() == next?.getMonth() &&
        current?.getDate() == next?.getDate()){
            
        return false;
    }else{
        return true;
    }
}

const colorStyle = {
    border: colorStore.getColorBy(COLOR_TYPE.onBackground),
    backgroundLight: colorStore.getColorBy(COLOR_TYPE.primary),
    onBackgroundLight: colorStore.getColorBy(COLOR_TYPE.onPrimary),
    backgroundHeavy: colorStore.getColorBy(COLOR_TYPE.primaryHeavy),
    onBackgroundHeavy: colorStore.getColorBy(COLOR_TYPE.onPrimaryHeavy),
}

</script>

<template>
    <div class="base_list">
        <table class="list_table">
            <thead>
                <tr>
                    <th v-for="category in todoStore.sortedListCategory"
                        :style="{backgroundColor: CATEGORY_COLOR_INFO[category.colorId]?.heavyColor}">
                        <div>{{ category.name }}</div>
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td v-for="category in todoStore.sortedListCategory">
                        <div v-for="i in todoStore.dataTodo[category.id]?.length"
                            class="list_table_body">
                            <div v-if="todoStore.dataTodo[category.id]![i-1] != null && isFirstTodo(category.id, i-1)">{{ formatDate(todoStore.dataTodo[category.id]![i-1]!.doAt) }}</div>
                            <CardTask 
                                :task="todoStore.dataTodo[category.id]![i-1]!"
                                :category-color-id="category.colorId"/> 
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<style scoped>
.base_list{
    overflow: auto;
    -webkit-overflow-scrolling: touch;   
    display: flex;
    background-color: v-bind(colorStore.getColorBy(COLOR_TYPE.background));
    overflow: scroll;
    width: fit-content;
    height: calc(100vh - v-bind('sizeStore.heightInput') * 1px - v-bind('sizeStore.heightHeader') * 1px);
    margin: 10px;
    border: 2px solid v-bind(colorStyle.border);
}
.list_table{
    border-collapse: collapse;
    border-spacing: 0;
    height: 100%;
    table-layout: fixed;

    th{
        min-width: 200px;
        text-align: left;
        font-size: medium;
        padding-left: 20px;
        border-left: 1px solid v-bind(colorStyle.border);
    
        position: sticky;
        top: 0;
        left: 0;
        z-index: 100;
    }   
    td{
        vertical-align: top;
        padding: 15px;
        border-left: 1px solid v-bind(colorStyle.border);
    }
}
</style>