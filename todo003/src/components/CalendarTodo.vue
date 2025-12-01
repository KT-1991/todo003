<script setup lang="ts">
import { useColorStore } from "@/stores/color.js";
//@ts-ignore
import Firebase from "../firebase_settings/index.js"
import { useTodoStore } from '@/stores/todo';
import { onAuthStateChanged } from 'firebase/auth';
import { computed, onMounted } from 'vue';
import { BUTTON_SIZE, BUTTON_TYPE, COLOR_TYPE, CATEGORY_COLOR_INFO } from "@/scripts/const.js";
import ButtonMain from "./ButtonMain.vue";


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
const formatDate = (date: Date) => {
    const text: string = (date.getMonth() + 1) + "/" + date.getDate();
    return text;
}


const colorStyle = {
    border: colorStore.getColorBy(COLOR_TYPE.onBackground),
    backgroundLight: colorStore.getColorBy(COLOR_TYPE.primary),
    onBackgroundLight: colorStore.getColorBy(COLOR_TYPE.onPrimary),
    backgroundHeavy: colorStore.getColorBy(COLOR_TYPE.primaryHeavy),
    onBackgroundHeavy: colorStore.getColorBy(COLOR_TYPE.onPrimaryHeavy),
}

onMounted(() => {
})
</script>

<template>
    <table class="calendar_table">
        <col v-for="i in todoStore.listCategory.length + 1">
        <thead>
            <tr>
                <th>date</th>
                <th v-for="category in todoStore.sortedListCategory"
                    :style="{color: CATEGORY_COLOR_INFO[category.colorId]?.textColor,
                                background: CATEGORY_COLOR_INFO[category.colorId]?.heavyColor
                            }"
                >{{ category.name }}</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="date in todoStore.getDateSpan">
                <td>{{ formatDate(date) }}</td>
                <td v-for="category in todoStore.sortedListCategory"
                    :style="{color: CATEGORY_COLOR_INFO[category.colorId]?.textColor,
                                background: CATEGORY_COLOR_INFO[category.colorId]?.color
                            }"
                >
                    <div v-for="item in todoStore.getTodoListAt(date, category.id) " class="calendar_item_container">
                        <span class="calendar_item_content">{{ item.title }}</span>
                        <ButtonMain 
                            :button-type="BUTTON_TYPE.SECONDARY"
                            :button-size="BUTTON_SIZE.THIN"
                            v-on:click="todoStore.completeTodo(item.id)">✔︎</ButtonMain>
                    </div>
                </td>
            </tr>
        </tbody>
    </table>
    <ButtonMain
        :button-type="BUTTON_TYPE.SECONDARY"
        :button-size="BUTTON_SIZE.THIN"
        v-on:click="addTestData">add test data</ButtonMain>
</template>

<style scoped>
.calendar_table{
    border-collapse: collapse;
    th{
        border: 1px solid v-bind(colorStyle.border);
    }   
    td{
        border: 1px solid v-bind(colorStyle.border);
    }
}
.calendar_item_container{
    display: flex;
}
.calendar_item_content{
    width: 100%;
}
</style>