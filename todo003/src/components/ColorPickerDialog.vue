<script setup lang="ts">
import { onMounted, onUnmounted, type Ref, ref } from 'vue'
import { BUTTON_SIZE, BUTTON_TYPE, CATEGORY_COLOR_INFO, DIALOG_TYPE, RESPONSE_TYPE } from '@/scripts/const'
import { useColorStore } from '@/stores/color';
import { COLOR_TYPE } from '@/scripts/const';
import ButtonMain from './ButtonMain.vue';
import ButtonColor from './ButtonColor.vue';

const colorStore = useColorStore();

// APIを公開
defineExpose({
  openDialog
})

// dialogの参照を保持する変数
const dialog = ref<HTMLDialogElement | null>(null)
const open = ref(false)

const initialColorId: Ref<string> = ref("");
const selectedColorId: Ref<string> = ref("");

// Promiseのresolveをキャッシュ
let resolve: (color: string) => void

// 外部に公開するAPI。ダイアログを開いて、終了
async function openDialog(colorId: string) {
  initialColorId.value = colorId
  selectedColorId.value = colorId
  open.value = true
  dialog?.value?.showModal()
  const promise = new Promise<string>((res) => {
    resolve = res
  })

  const result = await promise
  dialog?.value?.close()
  open.value = false
  return result
}

// ダイアログ側の閉じるボタンが押されたときに呼ばれるコールバック
function onDialogAction(action: "ok" | "cancel") {
    switch(action){
        case "ok":
            resolve(selectedColorId.value);
            break;
        case "cancel":
            resolve(initialColorId.value);
            break;
    }
}

// escapeキーで閉じるのをフックして、実装しようとする終了と同じ流れに載せる
function handleEscape(event: Event) {
  event.preventDefault()
  resolve(initialColorId.value)
}

const changeColor = (colorId: string) => {
    selectedColorId.value = colorId;
}

onMounted(() => {
  dialog.value?.addEventListener(initialColorId.value, handleEscape)
})

onUnmounted(() => {
  dialog.value?.removeEventListener(initialColorId.value, handleEscape)
})
</script>

<template>
  <dialog ref="dialog" class="modal_dialog">
    <div v-if="open" class="modal_container">
        <div class="modal_title">色の選択</div>
        <div class="modal_color_list" >
            <ButtonColor 
                v-for="item in CATEGORY_COLOR_INFO"
                :button-type="BUTTON_TYPE.PRIMARY" 
                :button-size="BUTTON_SIZE.LONG"
                :color="item.color"
                :heavy-color="item.heavyColor"
                :text-color="item.textColor"
                v-on:click="changeColor(item.id)"
                :class="{selected: item.id == selectedColorId}">色</ButtonColor>
        </div>
      <div class="modal_action">
        <ButtonMain 
          :button-type="BUTTON_TYPE.PRIMARY" 
          :button-size="BUTTON_SIZE.LONG"
          class="modal_button" 
          v-on:click="onDialogAction('ok')">OK</ButtonMain> 
        <ButtonMain 
          :button-type="BUTTON_TYPE.SECONDARY" 
          :button-size="BUTTON_SIZE.LONG"
          class="modal_button" 
          v-on:click="onDialogAction('cancel')">Cancel</ButtonMain>
      </div>
    </div>
  </dialog>
</template>

<style scoped>

.modal_dialog[open] {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 0;
  width: 300px;
  border: 2px solid black;
  outline: 0;
  box-shadow: 3px 3px black;
}
.modal_container{
  position: relative;
  flex-direction: column;
}
.modal_title{
    padding-left: 10px;
    color: v-bind(colorStore.getColorBy(COLOR_TYPE.onSecondaryHeavy));
    background-color: v-bind(colorStore.getColorBy(COLOR_TYPE.secondaryHeavy));
}

.modal_color_list {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  margin: 20px;
  border: 1px solid gray;
  height: fit-content;
}

.modal_action {
    display: flex;
    flex-direction: row;
    width: 100%;
    background-color: v-bind(colorStore.getColorBy(COLOR_TYPE.background));
}
.modal_button {
    width: 100%;
    margin: 5px;
}
.modal_icon {
    display: flex;
    justify-content: center;
}
.selected {
  border: 2px solid red;
}
</style>
