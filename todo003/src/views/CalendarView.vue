<script setup lang="ts">
import InputTodo from '@/components/InputTodo.vue';
import HeaderComponent from '@/components/HeaderComponent.vue';
import CalendarTodo from '@/components/CalendarTodo.vue';
</script>

<template>
    <div class="base_calendar_view">
        <HeaderComponent/>
        <InputTodo/>
        <CalendarTodo/>        
    </div>

</template>

<style scoped>
</style>