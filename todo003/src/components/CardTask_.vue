<script setup lang="ts">
import { BUTTON_SIZE, BUTTON_TYPE, COLOR_TYPE } from '@/scripts/const';
import { useColorStore } from '@/stores/color';
import { useTodoStore, type Task } from '@/stores/todo';
import { CATEGORY_COLOR_INFO } from '@/scripts/const';
import { ref } from 'vue';

const colorStore = useColorStore();
const todoStore = useTodoStore();

interface Props {
    task: Task,
    categoryColorId: string,
}

const props = defineProps<Props>()
const emit = defineEmits(['click']);

const isDeleted = ref(false);

const deleteTask = () => {
    isDeleted.value = !isDeleted.value
}

</script>

<template>
    <div class="base_card_task" :class="{base_card_task_deleted: isDeleted}">
        <div class="base_card_task_active" :class="{base_card_task_complete: task.completedAt!=null}">
            <div class="card_task_delete_panel"></div>
            <div class="strikethrough-line"></div>
            <div class="card_task_title">
                <div class="card_task_checkbox" v-on:click="todoStore.completeTodo(task.id)">
                    <div class="card_task_checkbox_background_active"></div>
                    <div class="card_task_checkbox_background_completed"></div>
                </div>
                <div class="card_task_content">{{ task.title }}</div>   
                <div class="card_task_button_container">
                    <div class="card_task_button" v-on:click="deleteTask"></div>    
                </div>
                    
            </div>
        </div>
    </div>
</template>

<style scoped>
.base_card_task{
    position: inherit;
    width: 100%;
    display: grid; /* 高さ方向のアニメーションに必要 */
}
.base_card_task_active {
    position: relative;
    width: 100%;
    height: 100%;
    background-color: v-bind(CATEGORY_COLOR_INFO[categoryColorId]?.color);
    box-shadow: 3px 3px gray;
} 
.base_card_task_complete {
    background-color: v-bind(CATEGORY_COLOR_INFO[categoryColorId]?.heavyColor);
}
.card_task_title{
    padding: 5px;
    display: flex;
    align-items: center; 
    height: 100%;
    width: 100%;
}
/* --- 打ち消し線本体のスタイル --- */
.strikethrough-line {
  /* 初期位置とサイズ（左端から開始、高さは細く） */
  position: absolute;
  top: 50%; /* 垂直方向の中央 */
  left: 10px;
  height: 2px; /* 線の太さ */
  width: 0; /* **アニメーションの開始地点: 幅 0** */
  background-color: rgb(99, 99, 99); /* 線の色 */
  transform: translateY(-50%); /* top: 50% の調整 */

  /* **トランジションの設定** */
  transition: width 0.3s ease-out; /* 0.3秒かけて幅を変化させる */
  transition-delay: 0s;
}

/* --- 完了時の状態 (クラスが付与されたとき) --- */
.base_card_task_complete .strikethrough-line {
  width: calc(100% - 20px); /* **アニメーションの終着点: 幅 100%** */
  transition-delay: 0.3s;
}

.card_task_checkbox{
    height: 20px;
    width: 20px;
    border: 1px solid rgb(99, 99, 99);
    position: relative;
}
.card_task_checkbox_background_active{
    height: 100%;
    width: 100%;
    position: absolute;
    background-color: white;
}
.card_task_checkbox_background_completed{
    height: 0;
    width: 0;
    top: 10px;
    left: 10px;
    position: absolute;
    background-color: rgb(99, 99, 99);
    transition: width 0.3s ease-out, height 0.3s ease-out, top 0.3s ease-out, left 0.3s ease-out;
    transition-delay: 0.3s;
}
.base_card_task_complete .card_task_checkbox_background_completed{
    top: 0;
    left: 0;
    height: 20px;
    width: 20px;
    transition-delay: 0s;
}

.card_task_button{
    height: 0;
    width: 0;
    top: 10px;
    left: 10px;
    position: relative;
    border-width: 0;
    transition: width 0.3s ease-out, height 0.3s ease-out, top 0.3s ease-out, left 0.3s ease-out, border-width 0s;
    transition-delay: 0s;
}
.base_card_task_complete .card_task_button{
    top: 0;
    left: 0;
    height: 20px;
    width: 20px;
    border: 1px solid rgb(99, 99, 99);
    background-color: white;
    transition-delay: 0.6s;
}
.base_card_task_deleted .base_card_task_active{
    height: 0;
    transition: height 0.3s ease-out;
    transition-delay: 0.3s;
    overflow: hidden;
}
.card_task_delete_panel {
    top:0;
    left: 0;
    height: 100%;
    width: 0;
    background-color: rgb(99, 99, 99);
    position: absolute;
    z-index: 10;
}
.base_card_task_deleted .card_task_delete_panel{
    width: 100%;
    transition: width 0.3s ease-out;
    overflow: hidden;
}
.card_task_content{
    flex-grow: 1;
}
.base_card_task_complete .card_task_content{
    color: rgb(99, 99, 99);
}
.card_task_button_container{
    height: 20px;
    width: 20px;
}
.base_card_task_deleted .base_card_task{
    height: 0;
    transition: height 0.3s ease-out;
    transition-delay: 0.3s;
    overflow: hidden;
}
</style>