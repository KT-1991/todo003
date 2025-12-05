<script setup lang="ts">
import router from "@/router/index.js";
//@ts-ignore
import Firebase from "../firebase_settings/index.js"
import { useTodoStore } from '@/stores/todo';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { nextTick, onBeforeUpdate, onMounted, onUpdated, ref, type Ref } from 'vue';
import { useRoute } from "vue-router";
import ButtonMain from "./ButtonMain.vue";
import { BUTTON_SIZE, BUTTON_TYPE, COLOR_TYPE, FONT_TYPE } from "@/scripts/const.js";
import { useColorStore } from "@/stores/color.js";
import LoadingAnimationComponent02 from "./LoadingAnimationComponent02.vue";
import ToastComponent from "./ToastComponent.vue";
import { useSizeStore } from "@/stores/size.js";


const auth = Firebase.auth
const route = useRoute();
const todoStore = useTodoStore();
const sizeStore = useSizeStore();
const loginName = ref("");
const colorStore = useColorStore();
const isLoading = ref(false);
const toast: Ref<typeof ToastComponent | undefined> = ref();
const elemHeaderContainer = ref();

const confirmLogout = () => {
    const result = confirm('ログアウトしますか？')
    if(!result) { return }
    logOut()
}
// ログアウト処理
const logOut = () => {
    // ユーザー情報とイベント内容をログに記録
    signOut(auth).then(() => {
        // Sign-out successful.
        router.push('/login')
        console.log("ログアウト成功")
        alert('ログアウトしました')
    }).catch((error) => {
        // An error happened.
        console.log('ログアウトエラー: error ->'+error)
        alert('ログアウト処理でエラーが発生しました')
    });
}
// ログインアカウントのemailを表示する
const showLoginEmail = () => {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            // User is signed in, see docs for a list of available properties
            // https://firebase.google.com/docs/reference/js/firebase.User
            const email = user.email;
            loginName.value = 'ログイン中: '+email+' さん'
        } else {
            // User is signed out
            loginName.value = '未ログイン: ゲストユーザーさん'
        }
    });
}

        // Homeへ画面遷移
const goToPage = (location: string) => {
    const nowRoute = route.path
    if(nowRoute == location) {
        //window.location.reload()
    } else {
        router.push(location)
    }
}

onMounted(() => {
    showLoginEmail();
    onAuthStateChanged(auth,async (user) => {
        console.log("auth changed")
        if (user) {
            // User is signed in, see docs for a list of available properties
            // https://firebase.google.com/docs/reference/js/firebase.User
            if(todoStore.userId != user.uid){
                todoStore.userId = user.uid;
                if(route.path == "/log"){
                    todoStore.initForLog();
                }else{
                    isLoading.value = true;
                    await todoStore.init();
                    isLoading.value = false;
                    toast.value!.sendToast("loaded")
                    
                }                
            }else{
                if(route.path == "/log"){
                    todoStore.initForLog();
                }
            }
        } else {
            // User is signed out
            todoStore.userId = ""
        }
        

    });
    console.log(elemHeaderContainer)
    sizeStore.heightHeader = elemHeaderContainer.value.clientHeight;
})

</script>

<template>
    <div ref="elemHeaderContainer">
        <div class="header_title_container" >
            <div class="app_title">Task Calendar</div>
            <div class="login_name">{{ loginName }}</div>
            <ButtonMain 
                :button-type="BUTTON_TYPE.SECONDARY" 
                :button-size="BUTTON_SIZE.SHORT"
                v-on:click="confirmLogout">Logout</ButtonMain>
        </div>
        <div class="header_menu_container">
            <ButtonMain 
                :button-type="BUTTON_TYPE.TERTIARY" 
                :button-size="BUTTON_SIZE.SHORT"
                v-on:click="goToPage('/')">ホーム</ButtonMain>
            <ButtonMain 
                :button-type="BUTTON_TYPE.TERTIARY" 
                :button-size="BUTTON_SIZE.SHORT"
                v-on:click="goToPage('/list')">リスト</ButtonMain>
            <ButtonMain 
                :button-type="BUTTON_TYPE.TERTIARY" 
                :button-size="BUTTON_SIZE.SHORT"
                v-on:click="goToPage('/calendar')">カレンダー</ButtonMain>
            <ButtonMain 
                :button-type="BUTTON_TYPE.TERTIARY" 
                :button-size="BUTTON_SIZE.SHORT"
                v-on:click="goToPage('/category')">カテゴリー編集</ButtonMain>
            <ButtonMain 
                :button-type="BUTTON_TYPE.TERTIARY" 
                :button-size="BUTTON_SIZE.SHORT"
                v-on:click="goToPage('/log')">ログ</ButtonMain>
            <LoadingAnimationComponent02 v-if="isLoading"/>
            <ToastComponent ref="toast"/>
        </div>        
    </div>

</template>

<style scoped>
.header_title_container{
    display: flex;
    align-items: center;
    padding: 4px 10px 4px 10px;
    color: v-bind(colorStore.getColorBy(COLOR_TYPE.onPrimaryHeavy));
    background-color: v-bind(colorStore.getColorBy(COLOR_TYPE.primaryHeavy));
}
.login_name{
    margin: 0 10px 0 10px;
    font-size: smaller;
}
.header_menu_container{
    display: flex;
    width: 100%;
    background-color: v-bind(colorStore.getColorBy(COLOR_TYPE.background));
}
.app_title{
    font-family: v-bind(FONT_TYPE.UI_LARGE);
    font-size: medium;
}
</style>