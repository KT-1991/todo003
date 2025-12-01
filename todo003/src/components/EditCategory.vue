<script setup lang="ts">
//@ts-ignore
import Firebase from "../firebase_settings/index.js"
import { useTodoStore } from '@/stores/todo';
import { onMounted, reactive, ref, TransitionGroup, type Ref } from 'vue';
import { BUTTON_SIZE, BUTTON_TYPE, CATEGORY_COLOR_INFO, COLOR_TYPE, DIALOG_TYPE, RESPONSE_TYPE } from '@/scripts/const';
import { useColorStore } from '@/stores/color';
import ConfirmDialog from './ConfirmDialog.vue';
import ButtonMain from './ButtonMain.vue';
import ColorPickerDialog from "./ColorPickerDialog.vue";
import ButtonColor from "./ButtonColor.vue";
import { onBeforeRouteLeave } from "vue-router";

const auth = Firebase.auth
const colorStore = useColorStore();
const todoStore = useTodoStore();

const confirmDialog = ref();
const colorPickerDialog = ref();

const newName: Ref<string> = ref("");
const newColorId: Ref<string> = ref("");

const isEdittingName: Ref<boolean> = ref(false);

const list: Ref<Array<{id: string,
                        name: string,
                        colorId: string,
                        priority: number}>> = ref([]);
const initCategoryList = () => {
    list.value = todoStore.sortedListCategory.map( list => ({...list}));
}

const hasChangedCategory = (): boolean => {
    let result = false;

    for(let i=0; i < list.value.length; i++){
        list.value[i]!.priority = i;
    }
    
    list.value.forEach(newCategory => {
        if(result){
            return;
        }
        todoStore.listCategory.forEach(category => {
            if(result){
                return;
            }
            if(category.id == newCategory.id){
                if(category.name == newCategory.name && 
                    category.colorId == newCategory.colorId && 
                    category.priority == newCategory.priority){
                        //ok. 何もしない
                }else{
                    console.log("change detected")
                    result = true;
                }
            }
        })
    })
    return result;
}
const updateListCategory = async () => {
    if(!hasChangedCategory()){
        return;
    }
    await todoStore.updateCategoryStyle(list.value);
    await todoStore.initCategory();
    confirm("ok");
}

const addCategory = () => {
    if(newName.value.trim() == ""){
        return;
    }
    console.log(newName.value);
    todoStore.addCategory(newName.value, newColorId.value);
    todoStore.init();
}
const deleteCategory = async (index: number, name: string) => {
    const result = await confirmDialog.value.openDialog(DIALOG_TYPE.ALERT, "警告", "削除対象： " + name +"\r\n削除すると復元できません。関連するすべてのTODOも削除されます。よろしいですか？");
    if(result == RESPONSE_TYPE.CANCEL){
        return;
    }
    //todoStore.deleteCategory(id);
    list.value.splice(index, 1);
    todoStore.initCategory();
}
const getNewColor = async (colorId: string) => {
    newColorId.value = await colorPickerDialog.value.openDialog(colorId);
}
const changeColor = async (i: number, colorId: string) => {
    const result: string = await colorPickerDialog.value.openDialog(colorId);
    console.log(result);
    if(colorId != result){
        const item: any = list.value[i];
        console.log(i)
        const newItem = {id: item.id, name: item.name, colorId: result, priority: item.priority};
        list.value.splice(i, 1, newItem);
    }
}
const dragStartIndex: Ref<number | null> = ref(null);
const listDragStart = (index: number) => {
    dragStartIndex.value = index;
}
const listDragLeave = (index: number) => {
    dragStartIndex.value = index;
}
const listDragEnter = (index: number) => {
    if(dragStartIndex.value == index || dragStartIndex.value == null){
        return;
    }
    console.log(dragStartIndex.value, index);
    const item = list.value.splice(dragStartIndex.value, 1)[0];
    //const item = list.value[dragStartIndex.value];
    list.value.splice(index, 0, item!);
    dragStartIndex.value = index;
}
const listDragEnd = () => {
    dragStartIndex.value = null;
}

const updateName = (event: KeyboardEvent) => {
    if (event.keyCode !== 13){
        return;
    }
    isEdittingName.value = !isEdittingName.value;
}

onMounted(() => {
    initCategoryList();
})
onBeforeRouteLeave(async (to, from, next) => {
    if(hasChangedCategory()){
        const result = await confirmDialog.value.openDialog(DIALOG_TYPE.ALERT, "更新内容あり", "更新内容を破棄しますか？");
        if(result == RESPONSE_TYPE.OK){
            next();
        }else{
            next(false);
        }
    }else{
        console.log("ok")
        next();
    }
})
</script>

<template>
    <div class="base_edit_category">
        <div class="add_category">
            <div class="title_add_category">カテゴリー追加</div>
            <div class="content_add_category">
                <input type="text" placeholder="new category" v-model="newName">
                <ButtonColor 
                    :button-type="BUTTON_TYPE.PRIMARY" 
                    :button-size="BUTTON_SIZE.SHORT"
                    :color="CATEGORY_COLOR_INFO[newColorId]?.color"
                    :heavy-color="CATEGORY_COLOR_INFO[newColorId]?.heavyColor"
                    :text-color="CATEGORY_COLOR_INFO[newColorId]?.textColor"
                    v-on:click="getNewColor(newColorId)">色の選択</ButtonColor>
                <ButtonMain v-on:click="addCategory"
                    :button-type="BUTTON_TYPE.PRIMARY"
                    :button-size="BUTTON_SIZE.SHORT">add</ButtonMain>
            </div>
            
        </div> 
        <div class="table_category">
            <div class="title_table_category">カテゴリー編集</div>
            <div>
                <button v-on:click="updateListCategory">保存</button>
                <div>・ダブルクリック：カテゴリー名編集</div>
                <div>・ドラッグ：並び替え</div> 
            </div>
            <table class="content_table_category">
                <TransitionGroup name="list">
                <tr v-for="item, i in list" 
                    :key="item.id"
                    :draggable="!isEdittingName"
                    v-on:dragstart="listDragLeave(i)"
                    v-on:dragenter="listDragEnter(i)"
                    v-on:dragend="listDragEnd"
                    v-on:dragover.prevent
                    
                    :style="{background: CATEGORY_COLOR_INFO[item.colorId]?.heavyColor}"
                    :class="{dragging: i==dragStartIndex}">
                    <td class="category_item">
                        <div v-show="!isEdittingName"
                            v-on:dblclick="isEdittingName = !isEdittingName">{{ item.name }}</div>
                        <input type="text" v-show="isEdittingName" v-model="item.name" v-on:keydown="updateName">
                    </td>
                    <td>
                        <ButtonColor 
                            :button-type="BUTTON_TYPE.PRIMARY" 
                            :button-size="BUTTON_SIZE.SHORT"
                            :color="CATEGORY_COLOR_INFO[item.colorId]?.color"
                            :heavy-color="CATEGORY_COLOR_INFO[item.colorId]?.heavyColor"
                            :text-color="CATEGORY_COLOR_INFO[item.colorId]?.textColor"
                            v-on:click="changeColor(i, item.colorId)">色の選択</ButtonColor>
                    </td>
                    <td>
                        <ButtonMain 
                            v-on:click="deleteCategory(i, item.name)"
                            :button-type="BUTTON_TYPE.SECONDARY"
                            :button-size="BUTTON_SIZE.SHORT">削除</ButtonMain>
                    </td>
                </tr>
                </TransitionGroup>
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
    margin: 10px;
    border-radius: 10px;
    border-collapse: collapse;
    color: v-bind(colorStore.getColorBy(COLOR_TYPE.onPrimary));
    background-color: v-bind(colorStore.getColorBy(COLOR_TYPE.primary));
}
.dragging {
  opacity: 0.5;
}
.category_item {
    padding: 0 10px 0 10px;
}

/* リストアニメーション用 */
.list-move, /* 移動する要素にトランジションを適用 */
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

/* leave する項目をレイアウトフローから外すことで
   アニメーションが正しく計算されるようになる */
.list-leave-active {
  position: absolute;
}
</style>