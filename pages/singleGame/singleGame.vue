<template>
	<view class="container">
		<image class="appbg" :src=" common.imageUrl + 'gamebg.png' "></image>
		<div class="user">
			<image class="avatar" :src="userInfo.avatar"></image>
			<p>{{userInfo.name}}</p>
		</div>
		<exam-canvas ref="exam" :mode="0" @answer="answer" v-if="!isShowFinal"></exam-canvas>

		// 展示结果
		<div class="finalPanel" v-if="isShowFinal">
			<div class="award">
				
				<div class="item">
					<p style="font-size: 40rpx; color: black;">恭喜你闯到了第{{result.rank}}关</p>
				</div>
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
	import {
		mapState,
		mapActions
	} from 'vuex'
	import common from "../../config/index.js"
	import axios from "../../utils/axios.js";
	import examCanvas from "../../components/examCanvas.vue";
	import api from "../../api/index.js";
	
	export default {
		components: {
			examCanvas
		},
		data() {
			return {
				common: common,
				questions: [],
				questionIndex: 0,
				questionType: 1,
				isShowFinal: false,
				result: {
					// award: {
					// 	gold: "+40",
					// 	exp: "+40",
					// },
					// rank: 3
				},
			}
		},
		onLoad() {
			
		},
		computed: {
			...mapState(["userInfo"])
		},
		mounted() {
			this.$nextTick(function() {
				this.nextQuestion();
			})

		},
		methods: {
			toWrongTopic(){
				uni.redirectTo({
					url:'/pages/wrongList/wrongList'
				})
			},
			playAgain(){
				uni.redirectTo({
					url:'/pages/singleGame/singleGame'
				})
			},
			exit(){
				uni.redirectTo({
					url:"/pages/index/index"
				})
			},
			// 得到答案
			answer(right) {
				if (right == true) {
					// 正确
					console.log("ok");
					this.updateUser(1);
					this.nextQuestion();
				} else {
					// 错误
				
					this.updateUser(0);
					this.setQuestionData();
						
					uni.showToast({
						title: "回答错误",
						icon: "none"
					})
					setTimeout(() => {
						uni.hideToast();
						
						this.result = {
							rank:this.questionIndex,
							award: {
								gold: `+${(this.questionIndex-1) * 10}`,
								exp:  `+${(this.questionIndex-1) * 10}`,
							},
						}
						this.isShowFinal = true;
					}, 1000)
				}
			},

			async updateUser(num) {
				let data = {};
				if (num == 1) {
					data = {
						uid: this.userInfo.uid,
						exper: 20,
						gold: 100,
					}
				} else {
					data = {
						uid: this.userInfo.uid,
						exper: 10,
						gold: 50,
					}
				}
				await axios.get("userData/updateData", data);
			},
			async setQuestionData() {
				let tmp = this.questions[this.questionIndex - 1];
				let data = {
					uid: this.userInfo.uid,
					pid: tmp.pid,
					weight: 0,
					content: tmp.content,
					writer: tmp.writer,
				}
				await axios.get("mistake/setMistake", data);
			},
			async nextQuestion() {
				// let temp = {
				// 	correct:"路漫漫其修远兮",
				// 	len:7,
				// 	mode:1,
				// 	vue:["迟","漫","挥","其","修","远","兮","良","尊","漫","穷","路"],
				// 	writer:"屈原"
				// }
				// this.$refs.exam.changeQuestion(temp);
				// return;

				uni.showLoading({
					title: '加载题目'
				})

				const fill = async () => {
					let result = (await api.puzzle.getCrosswordPuzzles(12)).data;
					return result;
				}

				const quiz = async () => {
					let result = (await api.puzzle.getSingleTopicSelectionPuzzle()).data
					return result;
				}

				let questionConstructer = [
					fill, quiz
				]

				let question = await questionConstructer[this.questionType]();
				this.questionType = 1 - this.questionType;
				console.log(question);

				// let question = await axios.get("question/getQuizQuestion");
				this.questions[this.questionIndex] = question;
				this.$refs.exam.changeQuestion(this.questions[this.questionIndex]);
				this.questionIndex += 1;
				uni.hideLoading();
				
			}
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
				bottom: 10%;
				left: 50%;
				transform: translateX(-50%);

				.item {
					position: relative;
					display: flex;
					justify-content: center;
					align-items: center;
					margin-bottom: 50rpx;


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
						width: 150%;
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
				bottom: -10%;
				background-color: rgb(98, 180, 66);

				image {
					width: 200rpx;
				}
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


		.user {
			z-index: 1;
			position: absolute;
			top: 0;
			left: 50%;
			transform: translateX(-50%);

			.avatar {
				width: 80rpx;
				height: 80rpx;
				border-radius: 50%;
			}

			p {
				position: absolute;
				color: white;
				width: 100%;
				font-size: 30rpx;
				text-align: center;
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

		.indexWrapper {
			position: absolute;
			left: 50%;
			top: 10%;
			transform: translateX(-50%);
			color: rgb(3, 34, 153);
			font-weight: bold;
			font-size: 60rpx;
		}
	}
</style>
