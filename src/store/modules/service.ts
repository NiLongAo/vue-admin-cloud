import { defineStore } from "pinia";
import { store } from '../index';
const useServiceStore = defineStore({
	id:'app-service',
	state:()=>({
		isRefreshing : false ,
	 	requests : [] as Array<any>, // 存储待重发请求的数组(同时发起多个请求的处理)
	}),
	getters:{
		getIsRefreshing(): boolean {
			return this.isRefreshing;
		},
		getRequests() :Array<any>{
			return this.requests;
		}
	},
	actions:{
		setIsRefreshing(isRefreshing:boolean){
			this.isRefreshing = isRefreshing;
		},
		setRequests(requests:any){
			this.requests.push(requests);
		},
		cloneRequests(){
			this.requests=[];
		}
	}
})

// Need to be used outside the setup
export function useServiceStoreWithOut() {
  return useServiceStore(store);
}
