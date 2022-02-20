<template>
	<view>
		<!-- 单人挑战 -->
		<view class="container">
			<image class="appbg" :src="config.imageUrl + 'gamebg.png' "></image>
			<new-exam-canvas :puzzle="puzzle" :couldAnswer="couldAnswer" :answerState="answerState" @answer="answer">
			</new-exam-canvas>
		</view>
	</view>
</template>

<script>
	import config from "../../config/index.js";
	import newExamCanvas from "../../components/newExamCanvas.vue";
	import api from "../../api/index.js";
	export default {
		components: {
			newExamCanvas
		},
		data() {
			return {
				config,
				answerState: {},
				puzzle: {},
				couldAnswer: false, // 是否可以作答
			};
		},
		mounted() {
			// temp 测试用
			api.setToken("weixinozOT-48RRSstWSCXQl7qMI-gfGTs");
			this.getPuzzle();
		},
		methods: {
			answer: function(index) {
				uni.showLoading({
					title: "提交答案中"
				})
				api.singleGame.submitAnswer(this.puzzle.pid, index.toString()).then(
					({
						data
					}) => {
						uni.hideLoading();
						this.answerState = {
							left: {
								index,
								isRight: data.isRight === "true"
							},
						}
						this.couldAnswer = false;
						setTimeout(() => {
							this.answerState = {};
							this.getPuzzle();
						}, 1000)
					}
				)
			},
			getPuzzle: function() {
				uni.showLoading({
					title: "加载题目"
				});
				api.singleGame.getPuzzle().then(({
					data
				}) => {
					this.puzzle = data;
					uni.hideLoading();
					this.couldAnswer = true;
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
	}
</style>
