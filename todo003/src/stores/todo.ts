import { addDoc, collection, doc, Firestore, getDocs, limit, orderBy, query, runTransaction, serverTimestamp, Timestamp, updateDoc, where } from "firebase/firestore";
import { defineStore } from "pinia";
import Firebase from "../firebase_settings/index.js"
import { CATEGORY_COLOR_INFO } from "@/scripts/const.js";

// カウンターストアを定義
export const useTodoStore = defineStore("todo", {
  // ストアの状態（state）
  state: () => ({
    listTodo: [] as Array<{id: string, 
                            createdAt: Date, 
                            doAt: Date, 
                            completedAt: Date | null, 
                            title: string, 
                            detail: string,
                            categoryId: string}>,
    listCategory: [] as Array<{id: string,
                                name: string,
                                colorId: string,
                                priority: number}>,
    dataTodo: {} as {[categoryId: string]: Array<{
                            id: string, 
                            createdAt: Date, 
                            doAt: Date, 
                            completedAt: Date | null, 
                            title: string, 
                            detail: string,
                            categoryId: string}>},
    isSortedAscByDate: true as boolean,
    isSortedAscByTitle: true as boolean,     
    db: Firebase.db,
    userId: "" as string,
    listTodoForSuggestions: [] as Array<{
                            createdAt: Date, 
                            title: string, }>,
    suggestions: [] as Array<string>,
  }),
  getters: {
    getTodoData(): {[categoryId: string]: Array<{}>} {
      const data: {[categoryId: string]: Array<{}>} = {};
      this.listCategory.forEach(category => {
          const list: any = [];
          this.listTodo.forEach(item => {
              if(category.id == item.categoryId){
                  list.push(item);
              }
          })
          data[category.id] = list;
      })
      return data;
    },
    getDateSpan():Array<Date>{
      let min: Date = new Date();
      let max: Date = new Date();
      this.listTodo.forEach(todo => {
        if(todo.doAt > max){
          max = new Date(todo.doAt.getTime());
        }
        if(todo.doAt < min){
          min = new Date(todo.doAt.getTime());
        }
      })
      max.setDate(max.getDate() + 3);
      min.setDate(min.getDate() - 3);


      const diffTime = max.getTime() - min.getTime();
      const diffDate = diffTime / (1000*60*60*24);
      const span: Array<Date> = [];
      console.log(diffDate);
      for(let i=0; i < diffDate; i++){
        span.push(new Date(min));
        min.setDate(min.getDate() + 1);
      }
      return span;
    },
    getTodoListAt() {
      return (date: Date, categoryId: string) => {
        const list = this.dataTodo[categoryId]?.filter(item => {
          return item.doAt.getDate() == date.getDate() && item.doAt.getMonth() == date.getMonth() && item.doAt.getFullYear() == date.getFullYear()
        });
        return list;        
      }
    },
    sortedListCategory(): Array<{id: string,
                                name: string,
                                colorId: string,
                                priority: number}>{
      //return this.listCategory.sort((a, b) => a.name.localeCompare(b.name));
      return this.listCategory.sort((a, b) => a.priority - b.priority);
    }
  },
  
  actions: {
    async init(){
      await this.initCategory();
      await this.initTodo();
      await this.initTodoForSuggestions();
    },  
    async initForLog(){
      this.initCategory();
      this.initTodoCompleted()
    },

    async initCategory(){
      this.listCategory.splice(0);
      try {
        const collectionRef = collection(this.$state.db, `userData/${this.$state.userId}/category`);
        const que = query(collectionRef, where("deletedAt", "==", null));
        const querySnapshot = await getDocs(que);
        console.log(querySnapshot.docs.length);

        querySnapshot.docs.forEach((doc) => {
          this.listCategory.push({id: doc.id, 
                                  name: doc.data().name, 
                                  colorId: doc.data().colorId, 
                                  priority: doc.data().priority});
        });
      } catch (error) {
            console.error("Error getting posts: ", error);
      }
    },
    async initTodo(){
      this.listTodo.splice(0);
      try {
        const collectionRef = collection(this.$state.db, `userData/${this.$state.userId}/todo`);
        const que = query(collectionRef, where("completedAt", "==", null));
        const querySnapshot = await getDocs(que);
        
        querySnapshot.docs.forEach((doc) => {
          this.listTodo.push({id: doc.id as string,
                              createdAt: doc.data().createdAt.toDate() as Date, 
                              doAt: doc.data().doAt.toDate() as Date,
                              completedAt: doc.data().completedAt,
                              title: doc.data().title,
                              detail: doc.data().detail,
                              categoryId: doc.data().categoryId})
          });
          this.dataTodo = this.getTodoData;
          this.sortByDate(this.dataTodo);
      } catch (error) {
            console.error("Error getting posts: ", error);
      }
    },
    async initTodoForSuggestions(){
      const limitNo: number =this.listTodo.length + 100; 
      this.listTodoForSuggestions.splice(0);
      try {
        const collectionRef = collection(this.$state.db, `userData/${this.$state.userId}/todo`);
        const que = query(collectionRef, where("completedAt", "==", null), limit(limitNo));
        const querySnapshot = await getDocs(que);
        
        querySnapshot.docs.forEach((doc) => {
          this.listTodoForSuggestions.push({createdAt: doc.data().createdAt.toDate() as Date, 
                              title: doc.data().title});
          });
          //this.sortByDate(this.dataTodo); todo: ソート処理
      } catch (error) {
            console.error("Error getting posts: ", error);
      }
    },
    async initTodoCompleted(){
      this.listTodo.splice(0);
      try {
        const collectionRef = collection(this.$state.db, `userData/${this.$state.userId}/todo`);
        const que = query(collectionRef, where("completedAt", "!=", null));
        const querySnapshot = await getDocs(que);
        
        querySnapshot.docs.forEach((doc) => {
          console.log(doc.data().doAt.toDate());
          this.listTodo.push({id: doc.id as string,
                              createdAt: doc.data().createdAt.toDate() as Date, 
                              doAt: doc.data().doAt.toDate() as Date,
                              completedAt: doc.data().completedAt,
                              title: doc.data().title,
                              detail: doc.data().detail,
                              categoryId: doc.data().categoryId})
          });
          console.log(this.getTodoData);
          this.dataTodo = this.getTodoData;
          this.sortByDate(this.dataTodo);
      } catch (error) {
            console.error("Error getting posts: ", error);
      }
    },
    async addTodo(categoryId: string, title: string, detail: string, doAt: Date){
      const docRef = collection(this.$state.db, "userData", this.$state.userId, "todo");
      try {
        console.log(doAt, Timestamp.fromDate(doAt));
        const today: Date = new Date();
        const newDocRef = await addDoc(docRef, {
          categoryId: categoryId,
          title: title,
          detail: detail,
          doAt: Timestamp.fromDate(doAt),
          createdAt: Timestamp.fromDate(today),
          completedAt: null,
        });
        console.log(newDocRef.id);
        this.listTodo.push({
          id: newDocRef.id,
          categoryId: categoryId,
          title: title,
          detail: detail,
          doAt: doAt,
          createdAt: today,
          completedAt: null,
        });
          this.dataTodo = this.getTodoData;
          this.sortByDate(this.dataTodo);
      } catch(error) {
        console.log(doAt);
        console.log(error)
        alert("エラーが発生しました")
      }
    },
    async completeTodo(id: string){
      const docRef = doc(this.$state.db, "userData", this.$state.userId, "todo", id);
      try {
        await updateDoc(docRef, {
          completedAt: serverTimestamp(),
        });
      }catch(error){
        console.log(error)
        alert("エラーが発生しました")
      }
    },
    async cancelTodo(id: string){
      const docRef = doc(this.$state.db, "userData", this.$state.userId, "todo", id);
      try {
        await updateDoc(docRef, {
          completedAt: null,
        });
      }catch(error){
        console.log(error)
        alert("エラーが発生しました")
      }
    },
    async addCategory(name: string, colorId: string){
      const docRef = collection(this.$state.db, "userData", this.$state.userId, "category");
      try {
        await addDoc(docRef, {
         name: name,
         deletedAt: null,
         colorId: colorId,
         priority: 0
        });
      } catch(error) {
        console.log(error)
        alert("エラーが発生しました")
      }
    },
    sortByDate(todoData: {[id: string]: Array<{}>}){
      this.listCategory.forEach(category => {
        todoData[category.id]?.sort((a, b): number => {
          const sign: number = this.compareTime(a.doAt, b.doAt);
          if(sign == 0){
            return this.compareTitle(a.title, b.title);
          }else{
            return sign;
          }
        })
      });
    },
    sortByTitle(todoData: {[id: string]: Array<{}>}){
      this.listCategory.forEach(category => {
        todoData[category.id]?.sort((a, b): number => {
          const sign: number = this.compareTitle(a.title, b.title);
          if(sign == 0){
            return this.compareTime(a.doAt, b.doAt);
          }else{
            return sign;
          }
        })
      });
    },
    compareTime(a: Date, b: Date): number{
      let sign: number;

      if(this.isSortedAscByDate){
        sign = 1;
      }else{
        sign = -1;
      }
      if(a.getTime() > b.getTime()){
        return sign;
      }else if(a.getTime() == b.getTime()){
        return 0;
      } else{
        return -sign;
      }
    },
    compareTitle(a: string, b: string): number{
      let sign: number;

      if(this.isSortedAscByTitle){
        sign = 1;
      }else{
        sign = -1;
      }

      if(a > b){
        return sign;
      }else if(a == b){
        return 0;
      } else{
        return -sign;
      }
    },
    async makeSuggestions(word: string){
      
      const limitNo: number =this.listTodo.length + 100; 
      try {
        //const collectionRef = collection(this.$state.db, `userData/${this.$state.userId}/todo`);
        //const que = query(collectionRef, limit(limitNo), orderBy("createdAt"));
        //const querySnapshot = await getDocs(que);

        this.suggestions.splice(0);
        if(word == ""){
          return;
        }
        for(const doc of this.listTodoForSuggestions){
          const text:string = doc.title;
          if(text.includes(word)){
            this.suggestions.push(text);
          }           
          if(this.suggestions.length >= 10){
            return;
          }   
        }
      } catch (error) {
            console.error("Error getting posts: ", error);
      }
    },
    async updateCategoryColor(categoryId: string ,newColorId: string){
      const docRef = doc(this.$state.db, "userData", this.$state.userId, "category", categoryId);
      try {
        updateDoc(docRef, {
          colorId: newColorId,
        });
        this.listCategory.forEach(category => {
          if(category.id == categoryId){
            category.colorId = newColorId;
          }
        })
      }catch(error){
        console.log(error)
        alert("エラーが発生しました")
      }
    },
    async updateCategoryStyle(newListCategory: Array<{id: string,
                                                name: string,
                                                colorId: string,
                                                priority: number}>){
      await runTransaction(this.$state.db, async (transaction) => {
        this.listCategory.forEach(category => {
          newListCategory.forEach(newCategory => {
            if(category.id == newCategory.id){
              if(category.name != newCategory.name || category.colorId != newCategory.colorId || category.priority != newCategory.priority){
                const categoryRef = doc(this.db, `userData/${this.$state.userId}/category/${category.id}`);
                //const categorySnap = await transaction.get(categoryRef)
                transaction.update(categoryRef, {name: newCategory.name, colorId: newCategory.colorId, priority: newCategory.priority})
              }
            }
          })
        })
      })
    }
  },

});  