<script setup lang="ts">
import TheWelcome from '../components/TheWelcome.vue'
// Firebase関連のインポート
import Firebase from "../firebase_settings/index.js"
import { doc, getDoc, setDoc, serverTimestamp, addDoc, collection } from "firebase/firestore"
import { onAuthStateChanged } from "firebase/auth";
import { onMounted, ref } from 'vue';
const auth = Firebase.auth
const db = Firebase.db
const errorMessage =  ref("");
const isLoading = ref(false);
const food = ref("");
const uid = ref("");
const inputFood = ref("");
const timeStamp = ref("");

const getFavoriteFood = async () => {
            // 変数を初期化
            food.value = ""

            // DBからデータ取得
            try {
                const docRef = doc(db, "userData", uid.value)
                const docSnap = await getDoc(docRef)
                if (!docSnap.exists()) {
                    food.value = "データ未登録"
                    timeStamp.value = ""
                    return
                }
                food.value = docSnap.get('food')
                timeStamp.value = "更新日時: "+docSnap.get('timestamp').toDate().toLocaleString()
            } catch(error) {
                food.value = "データ取得に失敗しました"
                console.log(error)
            }
        }

        // DBへ好きな食べ物を登録する
const registerFood = async () => {
            // データ書き込み処理ステータスをチェック
            if(isLoading.value) { return }

            // inputの入力値チェック
            const mFood = inputFood.value.trim()
            if(mFood==="") {
                errorMessage.value = "好きな食べ物が入力されていません"
                return
            }

            // エラーメッセージ消去
            errorMessage.value = ""

            const result = confirm('好きな食べ物を登録しますか？')
            if(!result) { return }

            // 書き込み開始
            isLoading.value = true
            const docRef = doc(db, "userData", uid.value)
            try {
                await setDoc(docRef, {
                    food: mFood,
                    timestamp: serverTimestamp(),
                },
                { merge: true })
            } catch(error) {
                console.log(error)
                alert("エラーが発生しました")
            }

            // データ再取得
            getFavoriteFood()

            // 書き込み終了
            isLoading.value = false
        }
const test = async () => {
            // データ書き込み処理ステータスをチェック
            if(isLoading.value) { return }

            // inputの入力値チェック
            const mFood = inputFood.value.trim()
            if(mFood==="") {
                errorMessage.value = "好きな食べ物が入力されていません"
                return
            }

            // エラーメッセージ消去
            errorMessage.value = ""

            const result = confirm('好きな食べ物を登録しますか？')
            if(!result) { return }

            // 書き込み開始
            isLoading.value = true
            const docRef = collection(db, "userData", uid.value, "todo")
            try {
                await addDoc(docRef, {
                title: "Tokyo",
                createAt: serverTimestamp(),
                });
            } catch(error) {
                console.log(error)
                alert("エラーが発生しました")
            }

            // データ再取得
            getFavoriteFood()

            // 書き込み終了
            isLoading.value = false
}

onMounted(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                // User is signed in, see docs for a list of available properties
                // https://firebase.google.com/docs/reference/js/firebase.User
                uid.value = user.uid;
                getFavoriteFood()
            } else {
                // User is signed out
                uid.value = ""
            }
        });
})
</script>

<template>
<main>
            <!-- <p class="contents">ここがFoodです</p> -->
             <button v-on:click="test">test</button>
            <div class="all_container">
                <div class="row_container">
                    <div class="container_left">
                        <p>好きな食べ物</p>
                    </div>
                    <div class="container_right">
                        <p>{{ food }}&nbsp;</p>
                        <p>{{ timeStamp }}&nbsp;</p>
                    </div>
                </div>

                <div class="row_container">
                    <div class="container_left">
                    </div>
                    <div class="container_right">
                        <input type="text" v-model="inputFood">
                    </div>
                </div>

                <div class="row_container">
                    <div class="container_left">
                    </div>
                    <div class="container_right">
                        <button class="btn_standard" v-on:click="registerFood">好きな食べ物を登録</button>
                        <p class="red">{{ errorMessage }}&nbsp;</p>
                        <!-- ローディングアニメーション -->
                        <div class="loading_animation" v-if="isLoading">
                            <LoadingAnimationComponent></LoadingAnimationComponent>
                        </div>
                    </div>
                </div>
            </div>
        </main>
</template>
