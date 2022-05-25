import Vue from 'vue'
import Vuex from 'vuex'
// import axios from 'axios';
import data from '@/assets/data'

Vue.use(Vuex);

const storage = {
	menuFetch(){
		return data.menu;
	}
}

export const store = new Vuex.Store({
	//data
	state: {
		loginState: {
			login: false,
			updateTime: '',
			loginUser:'',
		},
		menuState: storage.menuFetch(),
		dummyUsers:[
			{id:'ryu8701', pw:'1234'},
			{id:'malc',pw:'1234'},
			{id:'yeo',pw:'1234'}
		]
	},

	//computed
	getters: {
		getLoginState(state){
			return state.loginState;
		},
		getMenuState(state){
			return state.menuState;
		}
	},
	
	//state 변경 (commit('함수명','전달인자')로 실행)
	mutations: {
		// setLoginState(state, payload){
		// 	let today = new Date();   
		// 	state.loginState.login = payload.userID != '' ? true:false;
		// 	state.loginState.updateTime = payload.userID != '' ? today.toLocaleTimeString(): '';
		// }
		setLoginState(state,userInfo){
			state.loginState.login=true;
			state.updateTime=new Date().toLocaleDateString();
			state.loginUser=userInfo;
		}
	},

	//mutations 실행 (distpatch('함수명', '전달인자')로 실행)
	//비동기처리라 콜백함수로 작성
	actions: {
		// getUserInfo(context){
		// 	axios.get('http://localhost:3000/pica/login').then((Response)=>{
		// 		context.commit('setLoginState', Response.data.userInfo);
		// 	}).catch((Error)=>{
		// 		console.log(Error);
		// 	})
		// }
		getUserInfo({state,context},{id,pw}){
			state.dummyUsers.forEach(user => {
				if(user.id===id&&user.pw===pw){
					context.commit('setLoginState','{id,pw}')
				}
			});
		}
	}
});
