<template>
	<view class="container">
		<image class="appbg" :src=" common.imageUrl+'gamebg.jpg'"></image>
		<div class="tab">
			<div class="userLeft">
				<image class="bg" :src=" common.imageUrl+'bluebg.png'"></image>
				<image class="user" :src="userInfo.avatar" mode=""></image>
				<p>{{userInfo.name}}</p>
			</div>

			<div class="time" v-if="!isShowFinal">
				<p>{{time}}</p>
			</div>

			<div class="userRight">
				<image class="bg" :src=" common.imageUrl+'redbg.png'"></image>
				<p>{{otherInfo.name}}</p>
				<image class="user" :src="otherInfo.avatar" mode=""></image>
			</div>
		</div>

		<exam-canvas ref="exam" :mode="1" @answer="answer" v-if="!isShowFinal"></exam-canvas>

		// 展示结果
		<div class="finalPanel" v-if="isShowFinal">
			<!-- <div class="finalScore left" :style="{'width':result.me.per}">
				<p>{{result.me.value}}</p>
				<span>{{result.label.substring(0,1)}}</span>
			</div>
			<div class="finalScore right" :style="{'width':result.other.per}">
				<p>{{result.other.value}}</p>
				<span>{{result.label.substring(1,2)}}</span>
			</div> -->
			<div class="finalScore left" :style="{'width':result.me.per}">
				<p>{{result.me.value}}</p>
				<!-- <span>{{result.label.substring(0,1)}}</span> -->
			</div>
			<div class="finalScore right" :style="{'width':result.other.per}">
				<p>{{result.other.value}}</p>
				<!-- <span>{{result.label.substring(1,2)}}</span> -->
			</div>
			
			<image v-if="result.win" class="win" src="../../static/win.png" mode=""></image>

			<div class="award">
				<div class="item">
					<image :src=" common.imageUrl+'gold.png'" mode="widthFix"></image>
					<p>{{result.award.gold}}</p>
				</div>
				<div class="item">
					<image src="../../static/exp.png" mode="widthFix"></image>
					<p>{{result.award.exp}}</p>
				</div>
			</div>

			<div class="wrongTopic">
				<image :src=" common.imageUrl+'wrong.png'" @click="toWrongTopic" style="width: 200rpx;height: 70rpx; border-radius: 20rpx;"></image>
			</div>

			<div class="buttons">
				<image class="button" src="../../static/again.jpg" mode="widthFix" @click="playAgain"></image>
				<image class="button" src="../../static/exit.jpg" mode="widthFix" @click="exit"></image>
			</div>
		</div>
	</view>
</template>

<script>
	import axios from "../../utils/axios.js";
	import examCanvas from "../../components/examCanvas.vue";
	import common from "../../config/index.js"
	import {
		mapState,
		mapActions
	} from 'vuex'

	export default {
		components: {
			examCanvas
		},
		data() {
			return {
				common: common,
				isShowFinal: false,
				result: {
					// win:true,
					// me: {
					// 	value:"150分",
					// 	per: '55%',
					// },
					// other: {
					// 	value:"100分",
					// 	per: '45%',
					// },
					// award: {
					// 	gold: "+40",
					// 	exp: "+40",
					// },
				},
				time: 10,
				timer: null, // 计时器
				count: 6, // 题目总数
				question: {}, //当前题目
				//双方分数
				score: {
					me: 0,
					other: 0,
				},

				maxScore: 600,

				// 自己和对手是否已经答题
				otherAnswer: true,
				meAnswer: true,

				//对手的答案
				otherIndex: -1,

				//对手的信息 头像 姓名
				otherInfo: {},

			}
		},
		

		methods: {
			toWrongTopic(){
				uni.redirectTo({
					url:'/pages/wrongList/wrongList'
				})
			},
			playAgain(){
				this.timer = null;
				uni.redirectTo({
					url:'/pages/matching/matching'
				})
			},
			exit(){
				uni.redirectTo({
					url:"/pages/index/index"
				})
			},
			async updateUser(data) {
				await axios.get("userData/updateData", data);
			},
			async setQuestionData(tmp) {

				let data = {
					uid: this.userInfo.uid,
					pid: tmp.pid,
					weight: 0,
					content: tmp.content,
					writer: tmp.writer,
				}
				await axios.get("mistake/setMistake", data);
			},
			answer(right) {
				if (this.meAnswer == true) return;
				this.meAnswer = true;

				if (right == true) {
					this.score.me += (50 + this.time * 5);
				} else {
					this.setQuestionData(this.question);
				}
				this.updateScore();

				// 对方已经回答过题目
				if (this.otherAnswer == true) {
					this.$refs.exam.rightChooseIndex = this.otherIndex;
					setTimeout(this.newQuestion,1000);
				}

			},
			// 展示结果
			showFinal(info) {
				// this.result = info
				let data = {

				};
				if (this.score.me == this.score.other && this.score.me == 0) {
					this.result = {
						me: {
							value: this.score.me + "分",
							per: '50%',
						},
						other: {
							value: this.score.other + "分",
							per: '50%',
						},
						label: "平局",
						award: {
							gold: "+40",
							exp: "+40",
						},
						win:true
					}
					data = {
						uid: this.userInfo.uid,
						exper: parseInt(this.result.award.exp),
						gold: parseInt(this.result.award.gold),
					}
				} else {
					this.result = {
						me: {
							value: this.score.me + "分",
							per: `${30 + this.score.me / (this.score.me + this.score.other) * 70}%`,
						},
						other: {
							value: this.score.other + "分",
							per: `${30 + this.score.other / (this.score.me + this.score.other) * 70}%`
						},
						label: this.score.me > this.score.other ? "成功" : "失败",
						award: {
							gold: this.score.me > this.score.other ? "+80" : "+20",
							exp: this.score.me > this.score.other ? "+60" : "+20",
						},
						win:this.score.me > this.score.other 

					}
					data = {
						uid: this.userInfo.uid,
						exper: parseInt(this.result.award.exp),
						gold: parseInt(this.result.award.gold),
					}

				}
				this.updateUser(data);
				this.isShowFinal = true;
			},
			updateScore() {
				this.$refs.exam.changeScore(this.showScore);

				if (this.count <= 0 && this.meAnswer == true && this.otherAnswer == true) {
					setTimeout(this.showFinal, 1000);
				}
			},
			async newQuestion() {
				if (!this.meAnswer || !this.otherAnswer) return;

				this.otherIndex = -1;

				if (this.count <= 0) {
					clearInterval(this.timer);
					return;
				}

				this.count--;
				this.otherAnswer = false;
				this.meAnswer = false;

				if (this.timer != null) {
					clearInterval(this.timer);
				}

				uni.showLoading({
					title: "加载题目"
				})

				this.question = await axios.get("question/getQuizQuestion");

				// 模拟对手
				setTimeout(() => {
					if (Math.random() > 0.4) {
						// 回答正确
						this.score.other += (50 + this.time * 5);
						this.otherIndex = this.question.key;
					} else {
						while (true) {
							this.otherIndex = Math.floor(Math.random() * 4)
							if (this.otherIndex != this.question.key) {
								break;
							}
						}
					}
					this.otherAnswer = true;
					this.updateScore();
					if (this.meAnswer == true) {
						// 已经回答过题目,直接显示答案
						this.$refs.exam.rightChooseIndex = this.otherIndex;
					}
					if (this.meAnswer == true){
						setTimeout(this.newQuestion,1000);
					}
				}, Math.max(2000, Math.random() * 7000));

				this.$refs.exam.changeQuestion(this.question);
				uni.hideLoading();

				this.time = 10;
				// 计时器
				this.timer = setInterval(() => {
					if (this.time > 0) this.time -= 1;

					if (this.time <= 0) {
						this.answer(-1);
					}
				}, 1000);
				console.log(this.question.key);
			},
		},

		async onLoad(option) {
			this.otherInfo = JSON.parse(decodeURIComponent(option.otherInfo));
			this.newQuestion();
		},
		mounted() {
			// this.$refs.exam.changeQuestion({
			// 	mode: '0',
			// 	title: '《静夜思》的作者是谁?',
			// 	options: ['李白时刻提防见识到了副驾驶打开链接发', '白居易', '杜甫', '苏轼'],
			// 	key: 0
			// })
		},

		computed: {
			...mapState(["userInfo", "audio"]),
			showScore() {
				return {
					me: {
						value: this.score.me,
						per: `${this.score.me / this.maxScore * 100}%`,
					},
					other: {
						value: this.score.other,
						per: `${this.score.other / this.maxScore * 100}%`
					}
				}
			}
		},
		onShow() {

		},
		onUnload() {
			clearInterval(this.timer);
			this.timer = null;
		}
	}
</script>

<style lang="scss">
	.container {
		position: relative;
		width: 100vw;
		height: 100vh;
		overflow: hidden;

		.finalPanel {
			position: absolute;
			height: 35%;
			width: 100%;
			left: 0;
			top: 40%;
			transform: translateY(-50%);
			display: flex;

			.award {
				position: absolute;
				bottom: 0;
				left: 50%;
				transform: translateX(-50%);

				.item {
					position: relative;
					display: flex;
					justify-content: center;
					align-items: center;
					margin-bottom: 30rpx;

					p {
						font-size: 30rpx;
						color: rgb(69, 103, 233);
					}

					image {
						margin-right: 10rpx;
						width: 100rpx;
						height: 100rpx;
					}

					&::before {
						position: absolute;
						content: '';
						display: block;
						width: 200%;
						height: 5rpx;
						bottom: -15rpx;
						border-radius: 50%;
						background: linear-gradient(to right, rgb(254, 177, 8), rgb(255, 253, 0), rgb(254, 177, 8));
					}
				}
			}

			.buttons {
				position: absolute;
				
				bottom: -100%;
				left: 50%;
				transform: translateX(-50%);
				margin-top: 30%;
				display: flex;
				flex-direction: column;

				.button {
					border-radius: 20rpx;
					width: 400rpx;
					margin-bottom: 70rpx;
				}
			}

			.wrongTopic {
				position: absolute;
				right: 0;
				bottom: 0;
				background-color: rgb(98, 180, 66);

				image {
					width: 200rpx;
				}
			}
			
			.win{
				position: absolute;
				top: -25%;
				left: 50%;
				width: 300rpx;
				height: 300rpx;
				transform: translateX(-50%);
				animation: 1.5s scaleIn ease;
			}
			
			@keyframes scaleIn {
				from {
					width: 0;
					height: 0;
					opacity: 0;
				}
			
				to {
					width: 300rpx;
					height: 300rpx;
					opacity: 1;
				}
			}

			.finalScore {
				position: relative;
				height: 40%;

				p {
					position: absolute;
					color: white;
					font-size: 55rpx;
					letter-spacing: 5rpx;
					top: 50%;
					transform: translateY(-50%);
				}

				span {
					position: absolute;
					top: 50%;
					transform: translateY(-50%);
					color: rgb(234, 232, 52);
					font-size: 100rpx;
				}



				&.left {
					p {
						left: 10%;
					}

					span {
						right: 10%;
					}

					border-radius: 0 1000rpx 1000rpx 0;
					background-color: rgb(69, 103, 233);
				}

				&.right {
					p {
						right: 10%;
					}

					span {
						left: 10%;
					}

					border-radius: 1000rpx 0 0 1000rpx;
					background-color: rgb(208, 56, 56);
				}
			}
		}

		&::before {
			position: absolute;
			display: block;
			content: '';
			left: 0;
			top: 0;

			width: 100%;
			height: 11%;

			background: linear-gradient(rgb(78, 132, 230), rgb(215, 131, 234));
			border-radius: 62% 38% 50% 50% / 0% 0% 100% 100%;
			opacity: .9;
			z-index: 1;
		}

		.appbg {
			position: absolute;
			width: 100%;
			height: 100%;
		}

		.tab {
			z-index: 1;
			position: absolute;
			right: 0;
			top: 10rpx;

			width: 100%;
			height: 7%;

			display: flex;
			align-items: center;
			justify-content: space-between;

			.time {
				width: 60rpx;
				height: 60rpx;
				border-radius: 50%;
				border: 5rpx solid white;
				box-shadow: inset 0 0 0 8rpx red;

				display: flex;
				justify-content: center;
				align-items: center;
				color: white;
			}

			.userLeft,
			.userRight {
				position: relative;
				height: 100%;
				width: 40%;
				overflow: hidden;
				display: flex;
				align-items: center;
				justify-content: center;

				.bg {
					z-index: 1;
					position: absolute;
					top: 0;
					left: 0;
					width: 100%;
					height: 100%;
				}

				.user {
					z-index: 2;
					height: 80rpx;
					width: 80rpx;
					border-radius: 50%;
				}

				p {
					color: white;
					letter-spacing: 3rpx;
					font-size: 25rpx;
					margin: 0 20rpx;
				}
			}

			.userLeft {
				border-radius: 0 50rpx 50rpx 0;
				background-color: rgb(69, 103, 233);
			}

			.userRight {
				border-radius: 50rpx 0rpx 0rpx 50rpx;
				background-color: rgb(236, 64, 64);
			}
		}
	}
</style>
