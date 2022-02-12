import common from "../config/index.js"
const baseUrl = common.url;

module.exports = {
	 async get(url,option){ 
		 
		return await new Promise((resolve, reject) => {
			uni.request({
				url: baseUrl + url,
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
