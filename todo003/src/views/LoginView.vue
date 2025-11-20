<script setup lang="ts">
import TheWelcome from '../components/TheWelcome.vue'
import { createUserWithEmailAndPassword, sendPasswordResetEmail, signInWithEmailAndPassword } from "firebase/auth";
import Firebase from "../firebase_settings/index.js"
import { ref } from 'vue';
import router from '@/router/index.js';
import LoadingAnimationComponent from '@/components/LoadingAnimationComponent.vue';

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

</script>

<template>
<header>
            <div class="title">Vue Firebase Example</div>
        </header>

        <main>
            <button v-on:click="register">register</button>
            <div class="container">
                <p>ID(メールアドレス)</p>
                <input type="email" v-model="inputValueId">
                <!-- この下の<p></p>はテキストボックスを中央に配置するために必要な疑似要素です -->
                <p></p>
            </div>

            <div class="container">
                <p>パスワード</p>
                <input type="password" v-model="inputValuePassword">
                <!-- この下の<p></p>はテキストボックスを中央に配置するために必要な疑似要素です -->
                <p></p>
            </div>

            <div class="message">
                <p class="red">{{ errorMessage }}&nbsp;</p>
            </div>

            <div>
                <button class="btn_standard" type="submit" v-on:click="logIn">ログインする</button>
            </div>
            <div>
                <button v-on:click="submitPasswordResetEmail">パスワード変更</button>
            </div>
            <!-- ローディングアニメーション -->
            <div class="loading_animation_container">
                <div class="loading_animation" v-if="isLoading">
                    <LoadingAnimationComponent></LoadingAnimationComponent>
                </div>
            </div>
        </main>
</template>
