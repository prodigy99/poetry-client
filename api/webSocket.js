import config from "../config/index.js"

const EVENT_TYPE = {
	startMatch: "startMatch", // 开始匹配
	cancelMatch: "cancelMatch", // 取消匹配
	matchSuccess: "matchSuccess", // 匹配成功
	updateTime: "updateTime", // 时钟同步
	ready: "ready", // 是否准备好了
	newPuzzle: "newPuzzle", // 新的题目
	answer: "answer", // 回答题目
	meScore: "meScore", // 自己的回答结果
	otherScore: "otherScore", // 对手的回答结果
	showScore: "showScore", // 展现分数
	finishGame: "finishGame"
}

uni.connectSocket({
	url: `${config.wsUrl}/multiplayerGames`,
	success: () => {

	},
	fail: (err) => {
		console.log(JSON.stringify(err))
	}
});


const sendMessage = (eventType, data) => {
	uni.sendSocketMessage({
		data: JSON.stringify({
			eventType,
			data: {
				uid: token,
				...data
			}
		}),
		success: (res) => {
			console.log(res);
		},
		fail: (res) => {
			console.log(res);
		}
	});
}



uni.onSocketMessage(function(res) {
	const data = JSON.parse(res.data);

	switch (data.eventType) {
		case EVENT_TYPE.matchSuccess:
			onMatchSucessHandler(data.data);
			break;
		case EVENT_TYPE.updateTime:
			onUpdateTimeHandler(data.data);
			break;
		case EVENT_TYPE.meScore:
			onMeScoreHandler(data.data);
			break;
		case EVENT_TYPE.otherScore:
			onOtherScoreHandler(data.data);
			break;
		case EVENT_TYPE.showScore:
			onShowScoreHandler(data.data);
			break;
		case EVENT_TYPE.finishGame:
			onFinishGameHandler(data.data);
			break;
		case EVENT_TYPE.newPuzzle:
			onNewPuzzleHandler(data.data);
			break;
		default:
			console.log(data);
	}
});

//通过 WebSocket 连接发送数据
let token;

let onMatchSucessHandler;
let onNewPuzzleHandler;
let onUpdateTimeHandler;
let onMeScoreHandler;
let onOtherScoreHandler;
let onShowScoreHandler;
let onFinishGameHandler;

module.exports = {
	setToken: (uid) => {
		token = uid
	},
	startMatch: () => {
		sendMessage(EVENT_TYPE.startMatch, {})
	},
	ready: () => {
		sendMessage(EVENT_TYPE.ready, {})
	},
	answer: (pid, key) => {
		sendMessage(EVENT_TYPE.answer, {
			pid,
			key
		})
	},
	onMatchSucess: (handler) => {
		onMatchSucessHandler = handler;
	},
	onUpdateTime: (handler) => {
		onUpdateTimeHandler = handler;
	},
	onMeScore: (handler) => {
		onMeScoreHandler = handler;
	},
	onOtherScore: (handler) => {
		onOtherScoreHandler = handler;
	},
	onShowScore: (handler) => {
		onShowScoreHandler = handler;
	},
	onFinishGame: (handler) => {
		onFinishGameHandler = handler;
	},
	onNewPuzzle: (handler) => {
		onNewPuzzleHandler = handler;
	}
}
