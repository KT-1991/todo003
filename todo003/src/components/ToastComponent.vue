<script setup lang="ts">
import { onMounted, onUnmounted, type Ref, ref } from 'vue'
import { BUTTON_TYPE, DIALOG_TYPE, RESPONSE_TYPE } from '@/scripts/const'
import { useColorStore } from '@/stores/color';
import { COLOR_TYPE, FONT_TYPE } from '@/scripts/const';

const colorStore = useColorStore();

// APIを公開
defineExpose({
  sendToast
})

// dialogの参照を保持する変数
const dialog = ref<HTMLDialogElement | null>(null)
const open = ref(false)

const hasOK: Ref<boolean> = ref(false);
const hasCancel: Ref<boolean> = ref(false);
const title: Ref<string> = ref("");
const detail: Ref<string> = ref("");
const dialogPattern: Ref<string> = ref("");

// 外部に公開するAPI。ダイアログを開いて、終了
async function sendToast(inputTitle: string) {
    
    title.value = inputTitle;

    dialog?.value?.show()
    open.value = true

    await new Promise(resolve => setTimeout(resolve, 1000))
    open.value = false  
    await new Promise(resolve => setTimeout(resolve, 500))
    dialog?.value?.close();
}
</script>

<template>
    
  <dialog ref="dialog" class="toast_dialog">
    <Transition name="fade">
    <div class="toast" v-show="open">{{ title }}</div>
    </Transition>
  </dialog>        
    

</template>

<style scoped>
.toast_dialog{
    padding: 0;
    background-color: transparent;
    border: 0;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 150;
    outline: 0;
    border: 0;
}
.toast{
    width: 100vw;
    text-align: center;
    transition: 0.5s;
    border: 5px solid v-bind(colorStore.getColorBy(COLOR_TYPE.onSecondaryHeavy));
    border-radius: 0;
    color: v-bind(colorStore.getColorBy(COLOR_TYPE.onSecondaryHeavy));
    background-color: v-bind(colorStore.getColorBy(COLOR_TYPE.secondaryHeavy));
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
