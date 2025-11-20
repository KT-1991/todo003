<script setup lang="ts">
import Firebase from "../firebase_settings/index.js"
import { useTodoStore } from '@/stores/todo';
import { onAuthStateChanged } from 'firebase/auth';
import { computed, onMounted } from 'vue';


const auth = Firebase.auth
const todoStore = useTodoStore();

const addTestData: any = async () => {
    todoStore.listCategory.forEach(elem => {
        for(let i=0; i < 5; i++){
            console.log(elem.id + " " + i.toString());
            const num = i.toString();
            todoStore.addTodo(elem.id as any, "title" + num, "detail" + num, new Date());            
        }
    })
}
const formatDate = (date: Date | undefined): string => {
    if(date == null){
        return "";
    }
    const text: string = (date.getMonth() + 1) + "/" + date.getDate();
    return text;
}

onMounted(() => {
})
</script>

<template>
    <div>log</div>
    <button v-on:click="addTestData">test data</button>
    <div class="listTable">
        <table> 
            <thead>
                <tr>
                    <th>category</th>
                    <th>date</th>
                    <th>title</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item, i) in todoStore.listTodo">
                    <td>{{ item.categoryId }}</td>
                    <td>{{ formatDate(item.doAt) }}</td>
                    <td>{{ item.title }}</td>
                    <td>
                        <button v-on:click="todoStore.cancelTodo(item.id)">reset</button>
                    </td>
                </tr>
            </tbody>
        </table>        
    </div>
</template>

<style scoped>
.listTable {
    display: flex;
}
</style>