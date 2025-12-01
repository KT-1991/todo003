<script setup>
import { ref, onMounted } from 'vue';
import { Plus, X, Sparkles, Droplets } from 'lucide-vue-next';

// 状態管理
const tasks = ref([
  { id: 1, text: "水族館のチケット予約", completed: false },
  { id: 2, text: "深呼吸をする", completed: true },
  { id: 3, text: "新しいプレイリスト作成", completed: false },
]);
const inputValue = ref("");
const bubbles = ref([]);

// 泡（パーティクル）の生成
onMounted(() => {
  bubbles.value = Array.from({ length: 15 }).map((_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    animationDelay: `${Math.random() * 5}s`,
    animationDuration: `${10 + Math.random() * 10}s`,
    size: `${4 + Math.random() * 8}px`,
  }));
});

// アクション
const addTask = () => {
  if (!inputValue.value.trim()) return;
  tasks.value.unshift({ 
    id: Date.now(), 
    text: inputValue.value, 
    completed: false 
  });
  inputValue.value = "";
};

const toggleTask = (task) => {
  task.completed = !task.completed;
};

const deleteTask = (id) => {
  tasks.value = tasks.value.filter(t => t.id !== id);
};
</script>

<template>
  <link href="https://fonts.googleapis.com/css2?family=Zen+Maru+Gothic:wght@300;500;700&display=swap" rel="stylesheet">

  <div class="min-h-screen w-full bg-[#050b14] relative overflow-hidden font-zen text-white selection:bg-cyan-500 selection:text-black">
    
    <div class="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-blue-900/20 rounded-full blur-[120px] mix-blend-screen animate-pulse-slow"></div>
    <div class="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-900/20 rounded-full blur-[100px] mix-blend-screen animate-pulse-slow delay-1000"></div>

    <div 
      v-for="b in bubbles" 
      :key="b.id"
      class="absolute bottom-[-20px] rounded-full bg-cyan-400/20 blur-[1px] bubble-anim"
      :style="{
        left: b.left,
        width: b.size,
        height: b.size,
        animationDelay: b.animationDelay,
        animationDuration: b.animationDuration
      }"
    ></div>

    <div class="relative z-10 max-w-md mx-auto px-6 py-12 flex flex-col items-center min-h-screen">
      
      <div class="mb-10 text-center relative animate-fade-in-down">
        <div class="absolute -top-12 left-1/2 -translate-x-1/2 w-32 h-32 bg-cyan-500/10 rounded-full blur-[40px]"></div>
        <h1 class="text-4xl font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-b from-cyan-100 to-cyan-600 drop-shadow-[0_0_15px_rgba(34,211,238,0.5)]">
          海月
        </h1>
        <p class="text-cyan-300/50 text-xs tracking-[0.3em] mt-2 uppercase">Drift & Do</p>
      </div>

      <div class="w-full relative group mb-12 animate-fade-in-scale">
        <div class="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <form @submit.prevent="addTask" class="relative flex items-center bg-white/5 backdrop-blur-xl border border-white/10 rounded-full px-2 py-2 shadow-2xl overflow-hidden transition-all focus-within:border-cyan-500/30 focus-within:shadow-[0_0_20px_rgba(34,211,238,0.2)]">
          <input
            type="text"
            v-model="inputValue"
            placeholder="思考を漂わせる..."
            class="flex-1 bg-transparent border-none outline-none px-4 py-2 text-cyan-100 placeholder-cyan-700/50 font-medium"
          />
          <button 
            type="submit"
            class="w-10 h-10 rounded-full bg-cyan-500/20 hover:bg-cyan-400/40 text-cyan-200 flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-[0_0_15px_rgba(34,211,238,0.6)]"
          >
            <Plus :size="20" />
          </button>
        </form>
      </div>

      <div class="w-full relative">
        <TransitionGroup 
          name="list" 
          tag="div" 
          class="space-y-4 relative"
        >
          <div
            v-for="task in tasks"
            :key="task.id"
            class="
              relative overflow-hidden
              group flex items-center p-4 rounded-2xl border
              backdrop-blur-md transition-all duration-500
              cursor-pointer select-none
            "
            :class="[
              task.completed 
                ? 'bg-purple-900/10 border-purple-500/10 shadow-none' 
                : 'bg-white/5 border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.1)] hover:border-cyan-500/30 hover:shadow-[0_0_20px_rgba(34,211,238,0.15)] hover:translate-x-1 hover:scale-[1.02]'
            ]"
          >
            <div 
              v-if="!task.completed"
              class="absolute left-0 top-0 bottom-0 w-[2px] bg-gradient-to-b from-transparent via-cyan-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" 
            ></div>

            <button
              @click.stop="toggleTask(task)"
              class="w-6 h-6 rounded-full border-2 mr-4 flex items-center justify-center transition-all duration-300 z-20"
              :class="[
                task.completed
                  ? 'border-purple-500/50 bg-purple-500/20 text-purple-300 scale-90'
                  : 'border-cyan-200/30 group-hover:border-cyan-400 group-hover:shadow-[0_0_10px_rgba(34,211,238,0.4)]'
              ]"
            >
              <Sparkles v-if="task.completed" :size="12" class="animate-pop-in" />
            </button>

            <span 
              class="flex-1 text-lg transition-all duration-500 z-10"
              :class="[
                task.completed 
                  ? 'text-purple-300/40 line-through decoration-purple-500/30 blur-[0.5px]' 
                  : 'text-cyan-50'
              ]"
            >
              {{ task.text }}
            </span>

            <button
              @click.stop="deleteTask(task.id)"
              class="opacity-0 group-hover:opacity-100 transition-opacity p-2 text-cyan-700 hover:text-red-400 z-20"
            >
              <X :size="16" />
            </button>

            <div 
              v-if="task.completed"
              class="absolute inset-0 bg-purple-600/5 pointer-events-none animate-fade-in" 
            ></div>
          </div>
        </TransitionGroup>

        <Transition name="fade">
          <div v-if="tasks.length === 0" class="text-center py-20 opacity-30 text-cyan-100 absolute w-full top-0">
            <Droplets class="mx-auto mb-4 animate-bounce" :size="32" />
            <p class="tracking-widest text-sm">深海は静かです</p>
          </div>
        </Transition>
      </div>
      
      <div class="fixed bottom-0 left-0 w-full h-[30vh] pointer-events-none bg-gradient-to-t from-cyan-900/10 to-transparent blur-3xl z-0"></div>
      
    </div>
  </div>
</template>

<style scoped>
/* Font Family Setup */
.font-zen {
  font-family: 'Zen Maru Gothic', sans-serif;
}

/* === Animations & Transitions === */

/* List Transitions (Vue TransitionGroup) - Spring feel */
.list-move,
.list-enter-active,
.list-leave-active {
  transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(-20px) scale(0.95);
}

/* Ensure items are removed smoothly */
.list-leave-active {
  position: absolute;
  width: 100%;
}

/* Standard Fade */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Custom Keyframes for Atmosphere */
@keyframes floatUp {
  0% { transform: translateY(0) scale(1); opacity: 0; }
  50% { opacity: 0.5; }
  100% { transform: translateY(-120vh) scale(1.2); opacity: 0; }
}

.bubble-anim {
  animation-name: floatUp;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
}

@keyframes popIn {
  0% { transform: scale(0); }
  100% { transform: scale(1); }
}
.animate-pop-in {
  animation: popIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}

@keyframes fadeInDown {
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in-down {
  animation: fadeInDown 1s ease-out forwards;
}

@keyframes fadeInScale {
  from { opacity: 0; transform: scale(0.9); }
  to { opacity: 1; transform: scale(1); }
}
.animate-fade-in-scale {
  animation: fadeInScale 0.6s ease-out 0.2s forwards;
  opacity: 0; /* Initial state */
}

@keyframes pulseSlow {
  0%, 100% { opacity: 0.2; transform: scale(1); }
  50% { opacity: 0.3; transform: scale(1.05); }
}
.animate-pulse-slow {
  animation: pulseSlow 8s ease-in-out infinite;
}
</style>