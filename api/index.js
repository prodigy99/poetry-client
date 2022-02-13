import config from "../config/index.js"
 
const get = (location) => {
	return new Promise((resolve, reject) => {
		uni.request({
			url: config.baseUrl + location,
			method: "GET",
			header
		}).then(res => {
			console.log(`info --- GET [${location}] --- ${JSON.stringify(parseData(res[1].data))}`)
			resolve(parseData(res[1].data))
		}).catch((err) => {
			reject(err)
		});
	})
}


const post = (location, data) => {
	return new Promise((resolve, reject) => {
		uni.request({
			url: config.baseUrl + location,
			method: "POST",
			data,
			header,
			dataType:"json"
		}).then(res => {
			console.log(`info --- POST [${location}] --- ${JSON.stringify(parseData(res[1].data))}`)
			resolve(parseData(res[1].data))
		}).catch((err) => {
			reject(err)
		});
	})
}

const parseData = (resData) => {
	return {
		isSuccess: resData.status === "success",
		data: resData.data,
		message: resData.message,
		rawData: resData
	}
}

const header = {}
const api = {
	setToken:(token) => {
		header.uid = token;
	},
	user: {
		getUserInfo: (uid) => {
			return get(`user/getUserInfo/${uid}`)
		},
		register: (uid, nickname, avatar) => {
			return post(`user/register`,{
				uid,
				nickname,
				avatar
			})
		},
		addUserExp: (uid, num) => {
			return get(`user/addUserExp/${uid}/${num}`)
		},
		getOpenId: (code) => {
			return get(`user/getWxOpenId/${code}`)
		}
	},
	poetry: {
		getPoetryByTitle: (title) => {
			return get(`poetry/findPoetryByTitle/${title}`)
		},
		
	},
	singleGame:{
		getPuzzle:() => {
			return get(`singleGame/getPuzzle`)
		},
		submitAnswer:(pid,key) => {
			return post('singleGame/submitAnswer',{pid,key})
		}
	}
}

module.exports = api
