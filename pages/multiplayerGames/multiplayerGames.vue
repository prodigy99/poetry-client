<template>
	<view class="container">
		<image class="appbg" :src=" common.imageUrl+'gamebg.png'"></image>
		<div class="tab">
			<div class="userLeft">
				<image class="bg" :src=" common.imageUrl+'bluebg.png'"></image>
				<image class="user" :src="userInfo.avatar" mode=""></image>
				<p>{{userInfo.nickname}}</p>
			</div>

			<div class="time" v-if="!isShowFinal">
				<p>{{time == -1 ? "" : time}}</p>
			</div>

			<div class="userRight">
				<image class="bg" :src=" common.imageUrl+'redbg.png'"></image>
				<p>{{otherInfo.nickname}}</p>
				<image class="user" :src="otherInfo.avatar" mode=""></image>
			</div>
		</div>
		<div v-if="!isShowFinal" class="score left" v-show="mode != 0">
			<div class="progress" :style='{"height":((score.meScore / score.totalScore) * 100)+"%"}'></div>
			<div class="label">{{score.meScore}}</div>
		</div>

		<div v-if="!isShowFinal" class="score right" v-show="mode != 0">
			<div class="progress" :style='{"height":((score.otherScore / score.totalScore) * 100)+"%"}'></div>
			<div class="label">{{score.otherScore}}</div>
		</div>

		<new-exam-canvas v-if="!isShowFinal" :puzzle="puzzle" :couldAnswer="couldAnswer" :answerState="answerState"
			@answer="answer">
		</new-exam-canvas>


		<div class="finalPanel" v-if="isShowFinal">
			<div class="finalScore left"
				:style='{"width":((score.meScore / (score.meScore+score.otherScore)) * 100)+"%"}'>
				<p>{{score.meScore}}</p>
			</div>
			<div class="finalScore right"
				:style='{"width":((score.otherScore / (score.meScore+score.otherScore)) * 100)+"%"}'>
				<p>{{score.otherScore}}</p>
			</div>

			<image v-if="score.meScore > score.otherScore" class="win" :src="common.imageUrl+'win.png'" mode=""></image>

			<div class="award">
				<div class="item">
					<image :src=" common.imageUrl+'gold.png'" mode="widthFix"></image>
					<p>{{result.award.gold}}</p>
				</div>
				<div class="item">
					<image :src="common.imageUrl+'exp.png'" mode="widthFix"></image>
					<p>{{result.award.exp}}</p>
				</div>
			</div>

			<div class="buttons">
				<image class="button" :src="common.imageUrl+'again.jpg'" mode="widthFix" @click="playAgain"></image>
				<image class="button" :src="common.imageUrl+'exit.jpg'" mode="widthFix" @click="exit"></image>
			</div>
		</div>
	</view>
</template>

<script>
	import common from "../../config/index.js";
	import newExamCanvas from "../../components/newExamCanvas.vue";
	import webSocket from "../../api/webSocket.js";
	import {
		mapState,
	} from 'vuex'
	export default {
		components: {
			newExamCanvas
		},
		onLoad(option) {
			let otherUserInfo = decodeURIComponent(option.otherUserInfo);
			this.otherInfo = JSON.parse(otherUserInfo);
		},
		computed: {
			...mapState(["userInfo"])
		},
		mounted() {
			webSocket.ready();
			
			webSocket.onUpdateTime((data) => {
				this.time = data;
			})
			webSocket.onMeScore((data) => {
				let left = {
					isRight: data.right,
					index: data.key
				}
				this.answerState = {
					...this.answerState,
					left
				}
			})
			webSocket.onOtherScore((data) => {
				let right = {
					isRight: data.right,
					index: data.key
				}
				this.answerState = {
					...this.answerState,
					right
				}
			})
			webSocket.onShowScore((data) => {
				this.score = data;
				setTimeout(() => {
					webSocket.ready();
					this.answerState = {};
				}, 1000);
			})
			webSocket.onNewPuzzle((data) => {
				this.puzzle = data;
				this.couldAnswer = true;
			})
			webSocket.onFinishGame((data) => {
				this.isShowFinal = true;
				this.score = data;
			})
		},
		data() {
			return {
				common,
				isShowFinal: false,
				otherInfo: {},
				answerState: {
					left: {},
					right: {}
				},
				score: {
					meScore: 0,
					otherScore: 0,
					totalScore: 0
				},
				puzzle: {},
				time: -1,
				couldAnswer: false,
			};
		},
		methods: {
			answer: function(index) {
				webSocket.answer(this.puzzle.pid, index.toString())
				this.couldAnswer = false;
			},
			playAgain: function(){
				uni.navigateTo({
					url:"/pages/matching/matching"
				})
			},exit: function(){
				uni.navigateTo({
					url:"/pages/index/index"
				})
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
				color: #4b9ae9;
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

		.score {
			position: absolute;
			top: 20%;
			border-radius: 2000rpx;
			height: 70%;
			width: 20rpx;
			background: transparent;
			border: 1px solid rgb(50, 82, 200);

			&.left {
				left: 5%;
				color: rgb(24, 53, 166);
			}

			&.right {
				right: 5%;
				color: rgb(205, 27, 27)
			}

			.label {
				transform: translate(-120%, -120%);
			}

			.progress {
				transition: 1s;
				position: absolute;
				left: 0;
				bottom: 0;
				width: 100%;
				background-color: rgb(231, 181, 46);
				border-radius: 2000rpx;
			}
		}

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

			.win {
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

	}
</style>
