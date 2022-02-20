import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
import common from "../config/index.js";
const api = require("../api/index.js")
const webSocket = require("../api/webSocket.js")
const store = new Vuex.Store({
	state: {
		userInfo: {
			uid: '', //用户唯一身份标识 涉及数据库操作的请求均需要携带该id
			name: '请登录',
			avatar: '',
			level: '0',
			gold: '0',
			exp: 0,
		},
		audio: {
			flag: 0,
			index: Number(0),
		},
		openid:""
	},
	getters: {
		isLogin: (state) => !!state.userInfo.uid //是否登录
	},
	mutations: {
		setUserInfo(state, userInfo) {
			// todo
			if (!!userInfo.uid) {
				api.setToken(userInfo.uid); // 设置token
				webSocket.setToken(userInfo.uid);
			}
			state.userInfo = {
				...userInfo,
				nextRankPercent: ((userInfo.nextRankPercent * 100) + "%"),
			}
		}
	},
	actions: {
		async updateUserInfo(store) {
			//模拟异步方法从服务器获取信息
			let userInfo = (await api.user.getUserInfo(store.state.userInfo.uid)).data;
			store.commit("setUserInfo", userInfo);
		},
		async getUserInfo(store, {
			code,
			provider
		}) {
			//微信端 转换openid
			if (provider == "weixin") {
				this.openid = (await api.user.getOpenId(code)).data.openid;
			}
			let uid = provider + this.openid;
			//模拟异步方法从服务器获取信息
			let userInfo = (await api.user.getUserInfo(uid)).data;
			if (userInfo) {
				store.commit("setUserInfo", userInfo);
			}

		},
		async userRegister(store, {
			provider,
			rawUserInfo
		}) {
			let uid = provider + this.openid;
			let userInfo = (await api.user.register(uid, rawUserInfo.nickName, rawUserInfo.avatarUrl)).data;
			
			store.commit("setUserInfo", userInfo);
		}
	}
});
export default store
