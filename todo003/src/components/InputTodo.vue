<script setup lang="ts">
//@ts-ignore
import Firebase from "../firebase_settings/index.js"
import { useTodoStore } from '@/stores/todo';
import { onAuthStateChanged } from 'firebase/auth';
import { nextTick, onMounted, ref, type Ref } from 'vue';
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { BUTTON_TYPE, BUTTON_SIZE, COLOR_TYPE, DIALOG_TYPE, FONT_TYPE } from "@/scripts/const.js";
import ButtonMain from "./ButtonMain.vue";
import { useColorStore } from "@/stores/color.js";
import ConfirmDialog from "./ConfirmDialog.vue";
import ToastComponent from "./ToastComponent.vue";
import LoadingAnimationComponent02 from "./LoadingAnimationComponent02.vue";
import { useSizeStore } from "@/stores/size.js";

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
const elemInputContainer = ref();
const sizeStore = useSizeStore();

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
const openDetail = async () => {
    showDetail.value = !showDetail.value;
    await nextTick();
    sizeStore.heightInput = elemInputContainer.value.offsetHeight;
}
const makeSuggestions = async () => {
    //if(isMalingSuggestions.value){
    //    return;
    //}
    isMalingSuggestions.value = true;
    await todoStore.makeSuggestions(title.value);
    isMalingSuggestions.value = false;
}
onMounted(() => {
    sizeStore.heightInput = elemInputContainer.value.offsetHeight;
})
</script>

<template>
    <div ref="elemInputContainer" class="input_base">
        <div class="input_container">
            <ButtonMain 
                :button-type="BUTTON_TYPE.PRIMARY" 
                :button-size="BUTTON_SIZE.SHORT"
                v-on:click="register()">
                <span class="add_button_text">追加</span>
            </ButtonMain>       
            <input class="input_do_at input_item" type="date" placeholder="date" value="0" v-model="doAt">
            <select v-model="selectedCategory" class="input_item">
                <option disabled value="" >カテゴリー</option>
                <option v-for="item in todoStore.listCategory" 
                    v-bind:value="item.id" 
                    v-bind:key="item.id">
                {{ item.name }}
                </option>
            </select>
            <input type="text" 
                    placeholder="タスク" 
                    v-model="title" 
                    v-on:keyup="makeSuggestions" 
                    class="text_area input_item">
            <textarea class="text_area input_item" v-model="detail" placeholder="詳細" ></textarea>       
        </div> 
            <div v-show="todoStore.suggestions.length != 0">履歴</div>
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
    </div>
    <div class="loading_animation" v-if="isLoading">
        <LoadingAnimationComponent02></LoadingAnimationComponent02>
    </div>
    <ConfirmDialog ref="confirmDialog"/>
    <ToastComponent ref="toast"/>
</template>

<style scoped>
.input_base{
    margin: 10px;
    border: 2px solid black;
    width: fit-content;
}
.input_title{
    display: flex;
    align-items: center;
    padding: 10px 4px 10px 4px;
    display: block;
    color: v-bind(colorStore.getColorBy(COLOR_TYPE.onPrimaryHeavy));
    background-color: v-bind(colorStore.getColorBy(COLOR_TYPE.primaryHeavy));
}
.input_title:hover{
        color: v-bind(colorStore.getColorBy(COLOR_TYPE.onPrimary));
        background-color: v-bind(colorStore.getColorBy(COLOR_TYPE.primary));
        display: block;
}

.input_container{
    padding: 10px;
    display: flex;
    flex-wrap: wrap;
    vertical-align: top;
    color: v-bind(colorStore.getColorBy(COLOR_TYPE.onBackground));
    background-color: v-bind(colorStore.getColorBy(COLOR_TYPE.background));
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
.input_item {
    margin-left: 5px;
    padding-left: 5px;
    max-width: 200px;
    background: white;
    border: 2px solid black;
    outline:0;
    font-size: medium;
    font-family: v-bind(FONT_TYPE.UI_SMALL);;
}
.input_item:focus{
    border: 3px solid v-bind(colorStore.getColorBy(COLOR_TYPE.primary)); 
}
.text_area{
    field-sizing: content;
    min-height: min-content;
    min-width: 200px;
    vertical-align: top;
    font-family: v-bind(FONT_TYPE.MAIN_SENTENSE);
}
.text_area::placeholder{
   font-family: v-bind(FONT_TYPE.UI_SMALL); 
}
</style>