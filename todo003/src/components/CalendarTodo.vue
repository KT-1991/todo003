<script setup lang="ts">
import { useColorStore } from "@/stores/color.js";
//@ts-ignore
import Firebase from "../firebase_settings/index.js"
import { useTodoStore } from '@/stores/todo';
import { onAuthStateChanged } from 'firebase/auth';
import { computed, onMounted } from 'vue';
import { BUTTON_SIZE, BUTTON_TYPE, COLOR_TYPE, CATEGORY_COLOR_INFO } from "@/scripts/const.js";
import ButtonMain from "./ButtonMain.vue";
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
const formatDate = (date: Date) => {

    let workingDay = "";
    switch(date.getDay()){
        case 0: 
            workingDay = "日";
            break;
        case 1:
            workingDay = "月";
            break;
        case 2:
            workingDay = "火";
            break;
        case 3:
            workingDay = "水";
            break;
        case 4:
            workingDay = "木";
            break;
        case 5:
            workingDay = "金";
            break;
        case 6:
            workingDay = "土";
            break;
    }    

    const text: string = (date.getMonth() + 1) + "/" + date.getDate() + "(" + workingDay + ")";
    return text;
}

const isToday = (target: Date): boolean => {
    return target.toDateString() == (new Date()).toDateString();
}
const isSunday = (target: Date): boolean => {
    return target.getDay() == 0;
}
const isSaturday = (target: Date): boolean => {
    return target.getDay() == 6;
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
    <div class="base_calendar">
        <table class="calendar_table">
            <col v-for="i in todoStore.listCategory.length + 1">
            <thead>
                <tr>
                    <th class="calendar_date_column">日</th>
                    <th class="calendar_content_column"
                        v-for="category in todoStore.sortedListCategory"
                        :style="{color: CATEGORY_COLOR_INFO[category.colorId]?.textColor,
                                    background: CATEGORY_COLOR_INFO[category.colorId]?.heavyColor
                                }"
                    >{{ category.name }}</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="date in todoStore.getDateSpan">
                    <td :class="{calendar_today: isToday(date),
                                    calendar_saturday: isSaturday(date),
                                    calendar_sunday: isSunday(date),
                                }">{{ formatDate(date) }}</td>
                    <td v-for="category in todoStore.sortedListCategory"
                        :class="{calendar_today: isToday(date),
                                    calendar_saturday: isSaturday(date),
                                    calendar_sunday: isSunday(date),
                                    }">
                        <div v-for="item in todoStore.getTodoListAt(date, category.id) " class="calendar_item_container">
                            <CardTask 
                                    :task="item" 
                                    :category-color-id="category.colorId"/>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>   
    </div>
</template>

<style scoped>
.base_calendar{
    overflow: auto;
    -webkit-overflow-scrolling: touch;   
    display: flex;
    background-color: v-bind(colorStore.getColorBy(COLOR_TYPE.background));
    overflow: scroll;
    max-width: fit-content;
    height: calc(100vh - v-bind('sizeStore.heightInput') * 1px - v-bind('sizeStore.heightHeader') * 1px);
    margin: 10px;
    border: 1px solid v-bind(colorStyle.border);
}
.calendar_table{
    border-collapse: collapse;
    border-spacing: 0;
    height: 100%;
    table-layout: fixed;
    th{
        border: 1px solid v-bind(colorStyle.border);
        font-size: medium;

        position: sticky;
        top: 0;
        left: 0;
        z-index: 100;
    }   
    td{
        padding: 15px;
        border: 1px solid v-bind(colorStyle.border);
        vertical-align: top;
    }
}
.calendar_date_column{
    width: 75px;
}
.calendar_content_column{
    min-width: 200px;
}
.calendar_item_container{
    display: flex;
}
.calendar_today{
    color: v-bind(colorStore.getColorBy(COLOR_TYPE.onPrimary)); 
    background-color: v-bind(colorStore.getColorBy(COLOR_TYPE.primary));  
}
.calendar_saturday{ 
    color: v-bind(colorStore.getColorBy(COLOR_TYPE.onSecondary)); 
    background-color: v-bind(colorStore.getColorBy(COLOR_TYPE.secondary)); 
}
.calendar_sunday{
    color: v-bind(colorStore.getColorBy(COLOR_TYPE.onSecondaryHeavy)); 
    background-color: v-bind(colorStore.getColorBy(COLOR_TYPE.secondaryHeavy)); 
}
</style>