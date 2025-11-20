<script setup lang="ts">
import { BUTTON_SIZE, BUTTON_TYPE, COLOR_TYPE } from '@/scripts/const';
import { useColorStore } from '@/stores/color';

const colorStore = useColorStore();

const props = defineProps({
  buttonType: String,
  buttonSize: String,
  color: String,
  heavyColor: String,
  textColor: String,
})
const emit = defineEmits(['click']);

const onClick = () => {
    emit("click");
}

const getClassButtonType = () => {
    switch(props.buttonType){
        case BUTTON_TYPE.PRIMARY:
            return "button_base_type_primary";
        case BUTTON_TYPE.SECONDARY:
            return "button_base_type_secondary";
        case BUTTON_TYPE.TERTIARY:
            return "button_base_type_tertiary";
    }
}
const getClassButtonSize = (name: string) => {
    switch(name){
        case "base":
            switch(props.buttonSize){
                case BUTTON_SIZE.LONG:
                    return "button_base_size_long";
                case BUTTON_SIZE.SHORT:
                    return "button_base_size_short";
                case BUTTON_SIZE.THIN:
                    return "button_base_size_thin";
            }
        case "content":
            switch(props.buttonSize){
                case BUTTON_SIZE.LONG:
                    return "button_content_size_long";
                case BUTTON_SIZE.SHORT:
                    return "button_content_size_short";
                case BUTTON_SIZE.THIN:
                    return "button_content_size_thin";
            }
    }

}   
</script>

<template>
    <span class="button_base" v-bind:class="getClassButtonType(), getClassButtonSize('base')" v-on:click="onClick">
        <span class="button_content" v-bind:class="getClassButtonSize('content')">
            <slot></slot>
        </span>
    </span>
</template>

<style scoped>
.button_base {
    display: flex;
    justify-content: center;
    cursor: pointer;
    border-radius: 5px;
    :hover{
        border-radius: 3px;
    }
}
.button_base_size_long {
    width: 100%;
}
.button_base_size_short {
    width: fit-content;
}
.button_base_size_thin{
    width: fit-content;
}
.button_base_type_primary {
    color: v-bind($props.textColor);
    background-color: v-bind($props.color);
    :hover{
        background-color: v-bind($props.heavyColor);
    }
}
.button_base_type_secondary {
    color: v-bind($props.textColor);
    border: 2px solid v-bind($props.heavyColor);
    background-color: v-bind(colorStore.getColorBy(COLOR_TYPE.background));
    :hover{
        background-color: v-bind($props.heavyColor);
    }
}
.button_base_type_tertiary {
    color: v-bind($props.textColor);
    background-color: v-bind(colorStore.getColorBy(COLOR_TYPE.background));
    :hover{
        background-color: v-bind($props.color);
    }
}
.button_content {
    flex: 1;
    text-align: center;
}
.button_content_size_thin{
    padding: 0 10px;
}
.button_content_size_short{
    padding: 5px 10px;
}
.button_content_size_long{

}
</style>