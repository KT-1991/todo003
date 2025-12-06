<script setup lang="ts">
import { useTodoStore } from '@/stores/todo';
import CardTask from './CardTask.vue';
import { CATEGORY_COLOR_INFO, COLOR_TYPE, FONT_TYPE } from '@/scripts/const';
import { useColorStore } from '@/stores/color';

const todoStore = useTodoStore();
const colorStore = useColorStore()

</script>

<template>
    <div class="today_base">
        <div class="today_title">本日のタスク</div>
        <div class="today_base_container">
            <div v-for="category in todoStore.sortedListCategory">
                <div class="today_category_container">
                    <div class="today_category_title"
                        :style="{color: CATEGORY_COLOR_INFO[category.colorId]?.textColor,
                        background: CATEGORY_COLOR_INFO[category.colorId]?.heavyColor
                        }"
                    >{{ category.name }}</div>
                    <div class="today_task_container">
                        <div v-show="todoStore.getTodoListAt(new Date(), category.id)?.length == 0"
                            class="today_no_task">タスクなし！</div>
                        <div v-for="item in todoStore.getTodoListAt(new Date(), category.id)">
                            <CardTask 
                                :task="item" 
                                :category-color-id="category.colorId"/>
                        </div>       
                    </div>
                </div>
            </div>
        </div>        
    </div>
</template>

<style scoped>
.today_base{
    height: 100vh;
    width: fit-content;
    padding: 5px;
    margin: auto;
}
.today_title{
    width: fit-content;
    margin: 5px;
    border-bottom: 3px solid black;
    font-size: medium;
    font-family: v-bind(FONT_TYPE.UI_SMALL);
}
.today_category_container {
    margin: 5px;
    border: 2px solid black;
    width: 200px;
    background-color: v-bind(colorStore.getColorBy(COLOR_TYPE.background));
}
.today_category_title{
    padding-left: 10px;
}
.today_task_container{
    padding: 10px;
}
.today_base_container{
    display: flex;
    flex-wrap: wrap;
}
.today_no_task{
    font-size: medium;
    color: v-bind(colorStore.getColorBy(COLOR_TYPE.primary));
    font-family: v-bind(FONT_TYPE.UI_SMALL);
}
</style>