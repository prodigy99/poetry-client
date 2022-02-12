import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
import common from "../config/index.js";
const store = new Vuex.Store({
	state: {
		userInfo: {
			uid:'', //用户唯一身份标识 涉及数据库操作的请求均需要携带该id
			name: '请登录',
			avatar: '',
			level: '0',
			gold: '0',
			rank: '平民',
			exp: 0,
		},
		audio:{
			flag:0,
			index:Number(0),
		},
		sign:false,//是否签到
	},
	mutations: {
		setUserInfo(state, userInfo) {
			state.userInfo = {...state.userInfo,...userInfo};
		},
		setSign(state,sign){
			state.sign = sign;
		}
	},
	actions: {		
		async updateUserInfo(store){
			//模拟异步方法从服务器获取信息
			let userInfo = await new Promise((resolve, reject) => {
				uni.request({
					url: common.url+"userdata/getUser",
					data: {
						uid: store.state.userInfo.uid
					},
				}).then(
					(res) => {
						let data = res[1].data.data.value;						
						let percent = 100 * (data.exper * 1.0 / (20 * Math.pow(2, data.rank - 1))).toFixed(2) + '%';
						resolve({
							level: data.rank,
							exp: percent, // 百分比
							gold: data.gold,
							rank: "秀才",
						})
					}
				).catch(
					(response) => {
						reject(response)
					}
				)
			})
			store.commit("setUserInfo", userInfo);
		},
		async getUserInfo(store, {
			uid,
			provider,
			nativeUserInfo
		}) {
			let zuid = null;
			console.log("----------")
			//微信端 转换openid
			if (provider == "weixin") {
				var urlVal = common.url+`user/getWxOpenId/${uid}`;
				zuid = await new Promise((resolve, reject) => {
					uni.request({
						url: urlVal,
						method: 'GET',
					}).then(
						(res) => {
							resolve(res[1].data.openid);
						}
					).catch(
						(response) => {
							reject(response)
						}
					)
				})
			}

			//模拟异步方法从服务器获取信息
			let userInfo = await new Promise((resolve, reject) => {
				uni.request({
					url: common.url+`user/getUserInfo/${provider+zuid}`,
					method:"GET"
				}).then(
					(res) => {
						console.log(res);
						let data = res[1].data;
						console.log(data);						
						let percent = data.nextRankPercent*100+'%';
						console.log(percent);

						resolve({
							name: nativeUserInfo.nickName,
							avatar: nativeUserInfo.avatarUrl,
							uid: provider + zuid,
							level: data.rank,
							exp: percent, // 百分比
							gold: data.gold,
							rank: "秀才",
						})
					}
				).catch(
					(response) => {
						reject(response)
					}
				)

			})
			
			store.commit("setUserInfo", userInfo);
		
		}
	}
});
export default store
