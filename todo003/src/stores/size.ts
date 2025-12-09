// src/stores/counter.ts
import { defineStore } from "pinia";
import { CATEGORY_COLOR_INFO, COLOR_INFO, COLOR_TYPE, LOCAL_STORAGE } from "@/scripts/const";

// カウンターストアを定義
export const useSizeStore = defineStore("size", {
  // ストアの状態（state）
  state: () => ({
    heightHeader: 0 as number,
    heightInput: 0 as number,
  }),
  getters: {
  },
  
  actions: {
    init(){
      
    },  
  },

});  