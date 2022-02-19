import common from "../config/index.js"
const httpUrl = common.url;

module.exports = {
	 async get(url,option){ 
		 
		return await new Promise((resolve, reject) => {
			uni.request({
				url: httpUrl + url,
				data:option,
			}).then(
				(res)=>{		
					let data = res[1].data.data.value;
					resolve(data)
				}
			).catch(
				(response) => {
					reject(response)
				} 
			)
		})
		
	}, 
}
