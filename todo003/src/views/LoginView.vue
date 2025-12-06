<script setup lang="ts">
import TheWelcome from '../components/TheWelcome.vue'
import { createUserWithEmailAndPassword, sendPasswordResetEmail, signInWithEmailAndPassword } from "firebase/auth";
//@ts-ignore
import Firebase from "../firebase_settings/index.js"
import { ref } from 'vue';
import router from '@/router/index.js';
import LoadingAnimationComponent from '@/components/LoadingAnimationComponent.vue';
import { useColorStore } from '@/stores/color.js';
import { FONT_TYPE, COLOR_TYPE, BUTTON_SIZE, BUTTON_TYPE } from '@/scripts/const.js';
import ButtonMain from '@/components/ButtonMain.vue';

const colorStore = useColorStore();

const auth = Firebase.auth

const inputValueId = ref("");
const inputValuePassword = ref("");
const errorMessage = ref("");
const isLoading = ref(false);
const goToHome = () => {
        router.push('/')
    }
const logIn = () => {
        // IDとパスワードの未入力チェック
        if(inputValueId.value === undefined || inputValueId.value === "" || inputValuePassword.value === undefined || inputValuePassword.value === "") {
            errorMessage.value = 'IDまたはパスワードが未入力です'
            return
        }

        // エラーメッセージの消去
        errorMessage.value = ""

        // ローディングアニメーション
        isLoading.value = true

        // id,passを取得
        const mId = inputValueId.value
        const mPass = inputValuePassword.value

        // 連続クリックを防ぐためにパスワード欄を空欄にする
        inputValuePassword.value = ""

        // サインインメソッド
        signInWithEmailAndPassword(auth, mId, mPass)
            // サインイン成功時
            .then((userCredential) => {
                const user = userCredential.user;
                console.log("ログイン成功 "+user.email)
                goToHome()
            })

            // サインイン失敗時
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log('ログインエラー: errorCode -> '+errorCode+', errorMessage -> '+errorMessage)
                JudgeErrorCode(errorCode)

                // ローディングアニメーション
                isLoading.value = false
            });
    }

    // FirebaseAuthから受け取ったエラーコードを判定しエラーメッセージを表示する
const JudgeErrorCode = (mError: string) => {
        const errorCode = String(mError)
        if(errorCode === 'auth/wrong-password' || errorCode === 'auth/invalid-email' || errorCode === 'auth/user-not-found') {
            errorMessage.value = "ログインに失敗しました。IDまたはパスワードが間違っています"
        } else {
            errorMessage.value = "ログインに失敗しました。予期せぬエラーが発生しました。"
        }
    }

const register = () => {
    createUserWithEmailAndPassword(auth, inputValueId.value, inputValuePassword.value).then((userCredential) => {
                const user = userCredential.user;
                console.log("ログイン成功 "+user.email)
                goToHome()
            })

            // サインイン失敗時
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log('ログインエラー: errorCode -> '+errorCode+', errorMessage -> '+errorMessage)
                JudgeErrorCode(errorCode)

                // ローディングアニメーション
                isLoading.value = false
            });
}
const submitPasswordResetEmail = async () => {
  await sendPasswordResetEmail(auth, inputValueId.value)
    .then((resp) => {
      // メール送信成功
      console.log(resp);
    })
    .catch((error) => {
      // メール送信失敗
      console.log(error)
    })
}

const nextFocus = (event: any) => {
    event.target.nextSibling.focus();
}

</script>

<template>
    <main>
        <div class="login_base">
            <div class="login_base_container">
                <div class="login_title">タスクカレンダー</div>
                <div class="login_input_container">
                    <input class="login_input_item" 
                            v-on:keydown.enter="nextFocus"
                            type="email" 
                            v-model="inputValueId" 
                            placeholder="ID(メールアドレス)">
                    <input class="login_input_item" 
                            v-on:keydown.enter="logIn"
                            type="password" 
                            v-model="inputValuePassword" 
                            placeholder="パスワード">                      
                </div>
           
                <div class="login_message" v-show="errorMessage.length > 0">
                    <p class="red">{{ errorMessage }}</p>
                </div>

                <div class="login_button_container">
                    <ButtonMain 
                            :button-type="BUTTON_TYPE.TERTIARY"
                            :button-size="BUTTON_SIZE.SHORT"
                            v-on:click="logIn">
                                <span>ログイン</span>
                    </ButtonMain>
                    <ButtonMain 
                            :button-type="BUTTON_TYPE.TERTIARY"
                            :button-size="BUTTON_SIZE.SHORT"
                            v-on:click="register">
                                <span>登録</span>
                    </ButtonMain>
                    <ButtonMain 
                            :button-type="BUTTON_TYPE.TERTIARY"
                            :button-size="BUTTON_SIZE.SHORT"
                            v-on:click="submitPasswordResetEmail">
                                <span>パスワード変更</span>
                    </ButtonMain>
                </div>
            </div>            
        </div>


        <!-- ローディングアニメーション -->
        <div class="loading_animation_container">
            <div class="loading_animation" v-if="isLoading">
                <LoadingAnimationComponent></LoadingAnimationComponent>
            </div>
        </div>             
    </main>
</template>

<style scoped>
.login_base{
    height: 100vh;
    width: 100vw;
    display: flex;
    justify-content: center;
    align-items: center;
}
.login_base_container{
    border: 5px solid black;
    height: fit-content;
    width: fit-content;
    display: flex;
    flex-direction: column;
    align-items: center;
    color: v-bind(colorStore.getColorBy(COLOR_TYPE.background));
    background-color: v-bind(colorStore.getColorBy(COLOR_TYPE.background));
}
.login_title {
    text-align: center;
    font-size: large;
    width: 100%;
    color: v-bind(colorStore.getColorBy(COLOR_TYPE.onPrimaryHeavy));
    background-color: v-bind(colorStore.getColorBy(COLOR_TYPE.primaryHeavy));
    font-family: v-bind(FONT_TYPE.UI_LARGE);
}
.login_button_container{
    display: flex;
    margin: 10px;
}
.login_input_container{
    display: flex;
    flex-direction: column;
    margin: 10px;
}
.login_input_item {
    margin: 2px 5px 2px 5px;
    padding-left: 5px;
    max-width: 200px;
    background: white;
    border: 2px solid black;
    outline:0;
    font-size: medium;
    font-family: v-bind(FONT_TYPE.MAIN_SENTENSE);;
}
.login_input_item:focus{
    border: 3px solid v-bind(colorStore.getColorBy(COLOR_TYPE.primary)); 
}
.login_input_item::placeholder{
   font-family: v-bind(FONT_TYPE.UI_SMALL); 
}
.login_message{
    margin: 10px;
    padding: 5px;
    color: v-bind(colorStore.getColorBy(COLOR_TYPE.onError));
    background-color: v-bind(colorStore.getColorBy(COLOR_TYPE.error));
}
</style>