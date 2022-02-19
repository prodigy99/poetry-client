const baseUrl = "192.168.0.106:8080/";
const httpUrl = "http://" + baseUrl;
const wsUrl = "ws://" + baseUrl;
module.exports = {
	httpUrl,
	wsUrl,
	imageUrl: httpUrl + "image/",
	musicUrl: httpUrl + "music/",
}
