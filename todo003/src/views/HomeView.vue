<script setup lang="ts">
import { signOut, onAuthStateChanged } from "firebase/auth";
import Firebase from "../firebase_settings/index.js"
import { onMounted, ref } from "vue";
import router from "@/router/index.js";
import { useRoute } from "vue-router";
import HeaderComponent from "@/components/HeaderComponent.vue";
const auth = Firebase.auth

const loginName = ref("");
const route = useRoute();



</script>

<template>
    <body>
        <HeaderComponent/>
        <main>
            <p class="contents">ここがHomeです</p>
        </main>
    </body>
</template>
