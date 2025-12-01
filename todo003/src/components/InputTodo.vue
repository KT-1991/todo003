<script setup lang="ts">
//@ts-ignore
import Firebase from "../firebase_settings/index.js"
import { useTodoStore } from '@/stores/todo';
import { onAuthStateChanged } from 'firebase/auth';
import { onMounted, ref, type Ref } from 'vue';
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { BUTTON_TYPE, BUTTON_SIZE, COLOR_TYPE, DIALOG_TYPE } from "@/scripts/const.js";
import ButtonMain from "./ButtonMain.vue";
import { useColorStore } from "@/stores/color.js";
import ConfirmDialog from "./ConfirmDialog.vue";
import ToastComponent from "./ToastComponent.vue";
import LoadingAnimationComponent02 from "./LoadingAnimationComponent02.vue";

const auth = Firebase.auth
const todoStore = useTodoStore();
const isLoading = ref(false);
const showDetail = ref(false);
const selectedCategory = ref("");
const title = ref("");
const detail = ref("");
const doAt = ref(new Date());
const colorStore = useColorStore();
const isMalingSuggestions = ref(false);
const confirmDialog: Ref<typeof ConfirmDialog | undefined>= ref();
const toast: Ref<typeof ToastComponent | undefined> = ref();

const register = async () => {
            // 書き込み開始
            isLoading.value = true
            const doAtLocal = new Date();
            const doAtUTC = new Date(doAt.value)
            doAtLocal.setFullYear(doAtUTC.getFullYear());
            doAtLocal.setMonth(doAtUTC.getMonth());
            doAtLocal.setDate(doAtUTC.getDate());

            await todoStore.addTodo(selectedCategory.value as any, title.value, detail.value, doAtLocal);

            //await todoStore.init()
            // 書き込み終了
            isLoading.value = false
            //confirmDialog.value!.openDialog(DIALOG_TYPE.INFO ,"title", "detail")
            toast.value!.sendToast("registered");
}
const getSuggestion = (text: string) => {
    title.value = text;
}
const openDetail = () => {
    showDetail.value = !showDetail.value;
}
const makeSuggestions = async () => {
    //if(isMalingSuggestions.value){
    //    return;
    //}
    isMalingSuggestions.value = true;
    await todoStore.makeSuggestions(title.value);
    isMalingSuggestions.value = false;
}
</script>

<template>
    <div class="input_title" v-on:click="openDetail">
        <div>追加する</div>
        <div class="arrow" :class="{arrow_rotate:showDetail}"> ▼ </div>
    </div>
        <div v-show="showDetail" class="input_container">
            <select v-model="selectedCategory" class="input_item">
                <option disabled value="" >カテゴリー</option>
                <option v-for="item in todoStore.listCategory" 
                    v-bind:value="item.id" 
                    v-bind:key="item.id">
                {{ item.name }}
                </option>
            </select>
            <br>
            <input type="text" 
                    placeholder="title" 
                    v-model="title" 
                    v-on:keyup="makeSuggestions" 
                    class="textArea input_item">
            <br>
            <div>履歴</div>
            <div class="suggestion_container">
                <span v-for="value in todoStore.suggestions">
                    <ButtonMain 
                            :button-type="BUTTON_TYPE.TERTIARY"
                            :button-size="BUTTON_SIZE.SHORT"
                            class="suggestion_button" 
                            v-on:click="getSuggestion(value)">
                        <span class="suggestion" >{{ value }}</span>
                    </ButtonMain>
                </span>                
            </div>
            <textarea class="textArea input_item" v-model="detail" placeholder="detail" ></textarea>
            <br>
            <input class="input_do_at input_item" type="date" placeholder="date" value="0" v-model="doAt">
            <br>
            <ButtonMain 
                :button-type="BUTTON_TYPE.PRIMARY" 
                :button-size="BUTTON_SIZE.SHORT"
                v-on:click="register()">
                <span class="add_button_text">追加</span>
            </ButtonMain>             
        </div>    
    <div class="loading_animation" v-if="isLoading">
        <LoadingAnimationComponent02></LoadingAnimationComponent02>
    </div>
    <ConfirmDialog ref="confirmDialog"/>
    <ToastComponent ref="toast"/>
</template>

<style scoped>
.input_title{
    display: flex;
    align-items: center;
    padding: 10px 4px 10px 4px;
    background-color: v-bind(colorStore.getColorBy(COLOR_TYPE.primaryHeavy));
}
.input_container{
    padding: 10px;
    background-color: v-bind(colorStore.getColorBy(COLOR_TYPE.primary));
}
.arrow{
    transition: 1s;
    display: inline-block;
    margin: 4px
}
.arrow_rotate{
    transform: rotate(180deg);
}
.suggestion_container{
    display: flex;
}
</style>