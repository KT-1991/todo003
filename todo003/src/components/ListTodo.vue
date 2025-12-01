<script setup lang="ts">
import { useColorStore } from "@/stores/color.js";
//@ts-ignore
import Firebase from "../firebase_settings/index.js"
import { useTodoStore } from '@/stores/todo';
import { onAuthStateChanged } from 'firebase/auth';
import { computed, onMounted, ref, toDisplayString } from 'vue';
import ButtonMain from "./ButtonMain.vue";
import { BUTTON_SIZE, BUTTON_TYPE, CATEGORY_COLOR_INFO, COLOR_TYPE } from "@/scripts/const.js";

const auth = Firebase.auth
const todoStore = useTodoStore();
const colorStore = useColorStore();

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
    <div class="base">
        <table class="list_table"> 
            <col v-for="value in todoStore.listCategory">
            <thead>
                <tr>
                    <th v-for="category in todoStore.sortedListCategory"
                    :style="{background: CATEGORY_COLOR_INFO[category.colorId]?.heavyColor,
                                        color: CATEGORY_COLOR_INFO[category.colorId]?.textColor}"
                    >
                        <div>{{ category.name }}</div>
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item, i) in todoStore.listTodo">
                    <td
                        v-for="category in todoStore.sortedListCategory"
                        :style="{color: CATEGORY_COLOR_INFO[category.colorId]?.textColor,
                                background: CATEGORY_COLOR_INFO[category.colorId]?.color
                            }"
                        :class="{border_bottom: isLastTodo(category.id, i)}"  
                        >
                        <div class="list_table_item" 
                           >
                            <div :class="{list_item_date_invisible: !isFirstTodo(category.id, i)}">{{ formatDate(todoStore.dataTodo[category.id]![i]?.doAt) }}</div>
                            <div class="list_item_content">{{ todoStore.dataTodo[category.id]![i]?.title }}</div>
                            <ButtonMain
                                :button-type="BUTTON_TYPE.SECONDARY" 
                                :button-size="BUTTON_SIZE.THIN"
                                v-on:click="todoStore.completeTodo(todoStore.dataTodo[category.id]![i]!.id)"
                                v-if="todoStore.dataTodo[category.id]![i]!=null">✔︎</ButtonMain>                               
                        </div>
                     
                    </td>
                </tr>
            </tbody>
        </table>        
    </div>
</template>

<style scoped>
.list_table {
    border-collapse: collapse;
    th{
        border: 1px solid v-bind(colorStyle.border);
    }   
    td{
        border-left: 1px solid v-bind(colorStyle.border);
        border-right: 1px solid v-bind(colorStyle.border);
    }
}
.list_table_item_group {
    border: 1px solid v-bind(colorStyle.border);
}
.list_table_item {
    display: flex;
}
.list_item_date_invisible{
    color: transparent;
}
.list_item_content{
    margin: 0 10px;
    width: 100%;
}
.border_bottom{
    border-bottom: 1px solid v-bind(colorStyle.border);
}
</style>