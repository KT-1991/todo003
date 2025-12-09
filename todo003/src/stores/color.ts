// src/stores/counter.ts
import { defineStore } from "pinia";
import { CATEGORY_COLOR_INFO, COLOR_INFO, COLOR_TYPE, LOCAL_STORAGE } from "@/scripts/const";

// カウンターストアを定義
export const useColorStore = defineStore("color", {
  // ストアの状態（state）
  state: () => ({
    colorFormat: "test" as string,
  }),
  getters: {
  },
  
  actions: {
    init(){
      const savedColor = localStorage.getItem(LOCAL_STORAGE.COLOR);
      if(savedColor == null){
        this.colorFormat = "test";
      }else{
        this.changeColorFormat(savedColor);
      }
    },  
    getColorBy(id: string): any {
      return (COLOR_INFO[this.colorFormat] as any).color[id] as string;
    },
    changeColorFormat(newId: string){
      this.colorFormat = newId;
      localStorage.setItem(LOCAL_STORAGE.COLOR, newId);
    },
    getCategoryColorBy(id: string): {id: string, name: string, color: string, heavyColor: string, textColor: string} {
      const colorInfo = CATEGORY_COLOR_INFO[id];
      if(colorInfo == null){
        return CATEGORY_COLOR_INFO["category_color_01"]!;
      }else{
        return colorInfo;
      }
    }
  },

});  