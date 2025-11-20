<script setup lang="ts">
import Firebase from "../firebase_settings/index.js"
import { useTodoStore } from '@/stores/todo';
import { onMounted, reactive, ref, type Ref } from 'vue';
import { BUTTON_SIZE, BUTTON_TYPE, CATEGORY_COLOR_INFO, COLOR_TYPE, DIALOG_TYPE, RESPONSE_TYPE } from '@/scripts/const';
import { useColorStore } from '@/stores/color';
import ConfirmDialog from './ConfirmDialog.vue';
import ButtonMain from './ButtonMain.vue';
import ColorPickerDialog from "./ColorPickerDialog.vue";
import ButtonColor from "./ButtonColor.vue";

const auth = Firebase.auth
const colorStore = useColorStore();
const todoStore = useTodoStore();

const confirmDialog = ref();
const colorPickerDialog = ref();

const newName: Ref<string> = ref("");

const list: Array<{id: string,
                        name: string,
                        colorId: string}> = reactive([]);
const initCategoryList = () => {
    list.push(todoStore.listCategory.map( list => ({...list})));
}

const addCategory = () => {
    if(newName.value.trim() == ""){
        return;
    }
    console.log(newName.value);
    todoStore.addCategory(newName.value);
    todoStore.init();
}
const deleteCategory = async (id: string, name: string) => {
    const result = await confirmDialog.value.openDialog(DIALOG_TYPE.ALERT, "警告", "削除対象： " + name +"\r\n削除すると復元できません。関連するすべてのTODOも削除されます。よろしいですか？");
    if(result == RESPONSE_TYPE.CANCEL){
        return;
    }
    //todoStore.deleteCategory(id);
    todoStore.initCategory();
}
const changeColor = async (categoryId: string, colorId: string) => {
    const result: string = await colorPickerDialog.value.openDialog(colorId);
    console.log(result);
    if(colorId != result){
        //todoStore.updateCategoryColor(categoryId, result);
        for(let i=0; i < list.length; i++){
            if(list[i]?.id == categoryId){
                const item: any = list[i];
                list[i] = {id: item.id, name: item.name, colorId: item.colorId};
                
                //list.value[i]!.colorId = colorId;
                console.log("changed");
            }
        }
    }
}
onMounted(() => {
    initCategoryList();
})
</script>

<template>
    <div class="base_edit_category">
        <div class="add_category">
            <div class="title_add_category">カテゴリー追加</div>
            <div class="content_add_category">
                <input type="text" placeholder="new category" v-model="newName">
                <ButtonMain v-on:click="addCategory"
                    :button-type="BUTTON_TYPE.PRIMARY"
                    :button-size="BUTTON_SIZE.SHORT">add</ButtonMain>
            </div>
            
        </div> 
        <div class="table_category">
            <div class="title_table_category">カテゴリー編集</div>
            <div>
                <button>保存</button>
            </div>
            <table class="content_table_category">
                <tr v-for="item in list">
                    <td>{{ item.name }}</td>
                    <td>
                        <ButtonColor 
                            :button-type="BUTTON_TYPE.PRIMARY" 
                            :button-size="BUTTON_SIZE.SHORT"
                            :color="CATEGORY_COLOR_INFO[item.colorId]?.color"
                            :heavy-color="CATEGORY_COLOR_INFO[item.colorId]?.heavyColor"
                            :text-color="CATEGORY_COLOR_INFO[item.colorId]?.textColor"
                            v-on:click="changeColor(item.id, item.colorId)">色の選択</ButtonColor>
                    </td>
                    <td>
                        <ButtonMain 
                            v-on:click="deleteCategory(item.id, item.name)"
                            :button-type="BUTTON_TYPE.SECONDARY"
                            :button-size="BUTTON_SIZE.SHORT">削除</ButtonMain>
                    </td>
                </tr>
            </table>            
        </div>
    </div>
    <ConfirmDialog ref="confirmDialog"></ConfirmDialog>
    <ColorPickerDialog ref="colorPickerDialog"/>
</template>

<style scoped>
.base_edit_category {
    margin: 10px;
}
.add_category {
    margin: 0 0 10px;
    border: 1px solid black
}
.table_category {
    margin: 0 0 10px;
    border: 1px solid black;
    color: v-bind(colorStore.getColorBy(COLOR_TYPE.onPrimary));
    background-color: v-bind(colorStore.getColorBy(COLOR_TYPE.primary));
}
.title_add_category {
    padding: 5px;
    color: v-bind(colorStore.getColorBy(COLOR_TYPE.onSecondaryHeavy));
    background-color: v-bind(colorStore.getColorBy(COLOR_TYPE.secondaryHeavy));
}
.content_add_category {
    padding: 5px;
    color: v-bind(colorStore.getColorBy(COLOR_TYPE.onSecondary));
    background-color: v-bind(colorStore.getColorBy(COLOR_TYPE.secondary));
}

.title_table_category {
    padding: 5px;
    color: v-bind(colorStore.getColorBy(COLOR_TYPE.onPrimaryHeavy));
    background-color: v-bind(colorStore.getColorBy(COLOR_TYPE.primaryHeavy));
}
.content_table_category {
    padding: 5px;
    color: v-bind(colorStore.getColorBy(COLOR_TYPE.onPrimary));
    background-color: v-bind(colorStore.getColorBy(COLOR_TYPE.primary));
}
</style>