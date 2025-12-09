<script setup lang="ts">
import router from "@/router/index.js";
//@ts-ignore
import Firebase from "../firebase_settings/index.js"
import { useTodoStore } from '@/stores/todo';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { nextTick, onBeforeUpdate, onMounted, onUpdated, reactive, ref, useTemplateRef, type Ref } from 'vue';
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
const naviPosition = reactive({
    top: 0,
    left: 0,
    height: 0,
    width: 0,
})
const buttonHome = ref();

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
            loginName.value = email+' さん'
        } else {
            // User is signed out
            loginName.value = 'ゲストユーザーさん'
        }
    });
}
        // Homeへ画面遷移
const goToPage = (location: string, event: any) => {


    const nowRoute = route.path
    if(nowRoute == location) {
        //window.location.reload()
    } else {
        router.push(location)
    }
    naviPosition.left = event.target.offsetLeft;
    naviPosition.top = event.target.offsetTop;
    naviPosition.height = event.target.offsetHeight;
    naviPosition.width = event.target.offsetWidth;
}

onMounted(() => {
    console.log("mounted")
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
                    toast.value!.sendToast("ロード完了")
                    
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

    naviPosition.height = buttonHome.value.offsetHeight;
    naviPosition.width = buttonHome.value.offsetWidth;
})

</script>

<template>
    <div ref="elemHeaderContainer">
        <div class="header_title_container2">
            <div class="header_title_container" >
                <div class="app_title">タスクカレンダー</div>
                <div class="login_name">{{ loginName }}</div>
                <ButtonMain 
                    :button-type="BUTTON_TYPE.TERTIARY" 
                    :button-size="BUTTON_SIZE.SHORT"
                    v-on:click="confirmLogout">Logout</ButtonMain>
            </div>
        </div>
        <div class="header_menu_container2">
            <div class="header_menu_container">
                <div class="header_button_container">
                    <div v-on:click.stop="goToPage('/', $event)" ref="buttonHome">
                        <ButtonMain 
                            :button-type="BUTTON_TYPE.QUATERNARY" 
                            :button-size="BUTTON_SIZE.SHORT"
                            >ホーム</ButtonMain>
                    </div>
                    <div v-on:click.stop="goToPage('/list', $event)">
                        <ButtonMain 
                            :button-type="BUTTON_TYPE.QUATERNARY" 
                            :button-size="BUTTON_SIZE.SHORT"
                            >リスト</ButtonMain>
                    </div>
                    <div v-on:click="goToPage('/calendar', $event)">
                        <ButtonMain 
                            :button-type="BUTTON_TYPE.QUATERNARY" 
                            :button-size="BUTTON_SIZE.SHORT"
                            >カレンダー</ButtonMain>                    
                    </div>
                    <div v-on:click="goToPage('/category', $event)">
                        <ButtonMain 
                            :button-type="BUTTON_TYPE.QUATERNARY" 
                            :button-size="BUTTON_SIZE.SHORT"
                            >カテゴリー編集</ButtonMain>
                    </div>
                    <div v-on:click="goToPage('/log', $event)">
                        <ButtonMain 
                            :button-type="BUTTON_TYPE.QUATERNARY" 
                            :button-size="BUTTON_SIZE.SHORT"
                            >ログ</ButtonMain>   
                    </div>
                    <div v-on:click="goToPage('/setting', $event)">
                        <ButtonMain 
                            :button-type="BUTTON_TYPE.QUATERNARY" 
                            :button-size="BUTTON_SIZE.SHORT"
                            >設定</ButtonMain>   
                    </div>
                </div>
                <div class="header_current_position"></div>
            </div>     
        </div>
           
    </div>
    <LoadingAnimationComponent02 v-if="isLoading"/>
    <ToastComponent ref="toast"/>
</template>

<style scoped>
.header_title_container{
    margin: auto;
    width: fit-content;
    display: flex;
    align-items: center;
    padding: 4px 10px 4px 10px;
}
.header_title_container2{
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
    position: relative;
    margin: auto;   
    width: fit-content; 
}
.header_menu_container2{
    background-color: v-bind(colorStore.getColorBy(COLOR_TYPE.background));
}
.app_title{
    font-family: v-bind(FONT_TYPE.UI_LARGE);
    font-size: large;
}
.header_button_container{
    z-index: 10;
    display: flex;
}
.header_current_position{
    position: absolute;
    width: calc(v-bind(naviPosition.width) * 1px);
    height: calc(v-bind(naviPosition.height) * 1px);
    left: calc(v-bind(naviPosition.left) * 1px);
    top: calc(v-bind(naviPosition.top) * 1px);
    background-color: v-bind(colorStore.getColorBy(COLOR_TYPE.primary));
    z-index: 0;
    transition: width 0.3s ease-out, height 0.3s ease-out, top 0.3s ease-out, left 0.3s ease-out;
}
</style>