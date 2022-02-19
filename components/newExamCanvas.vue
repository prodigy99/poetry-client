<template>
	<view>
		<div class="answer quiz">
			<image class="answerbg" :src=" config.imageUrl+'answerbg.png'" mode="widthFix"></image>
			<image class="decorate" :src=" config.imageUrl+'crane.png'" mode="widthFix"></image>
			<text class="questionTitle">{{puzzle.title}}</text>

			<div class="options">
				<div class="button option" v-for="(option,index) in puzzle.options" @click="() => click(index)" :key="option"
					:class="{'leftShow' : answerState.left.index == index, 'rightShow' : answerState.right.index == index}">
					<image class="left"
						:src="answerState.left.isRight !== true ?  config.imageUrl+'sign-wrong.png' :  config.imageUrl+'sign-right.png'"
						mode=""></image>
					<image class="right"
						:src="answerState.right.isRight !== true ? config.imageUrl+'sign-wrong.png' : config.imageUrl+'sign-right.png'"
						mode=""></image>

					<p>{{option}}</p>
				</div>
			</div>
		</div>
	</view>
</template>

<script>
	import config from "../config/index.js"
	export default {
		name: "newExamCanbas",
		props: ["answerState","puzzle","couldAnswer"],
		data() {
			return {
				config,
			};
		},
		mounted() {

		},
		methods:{
			click(index){
				if(this.couldAnswer)
					this.$emit("answer",index)
			}
		}
	}
</script>

<style lang="scss">
	.answer {
		position: absolute;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);

		.answerbg {
			width: 650rpx;
		}

		.decorate {
			position: absolute;
			width: 100%;
			left: 0;
			bottom: 0;
			opacity: .9;
			transform: translateY(50%);
		}

		.questionTitle {
			position: absolute;
			text-align: center;
			width: 60%;
			top: 7%;
			left: 50%;
			transform: translateX(-50%);
			color: rgb(133, 10, 178);
			font-weight: 500;
			word-wrap: break-word;
			word-break: break-all;
			overflow: hidden;
			font-size: 35rpx;
		}

		.options {
			position: absolute;
			left: 50%;
			top: 30%;
			width: 55%;
			transform: translateX(-50%);
			display: flex;
			flex-direction: column;
			align-items: center;

			.option {
				position: relative;
				width: 85%;
				min-height: 70rpx;
				border-radius: 15rpx;
				background-color: rgb(50, 82, 200);
				color: white;
				margin-bottom: 7%;
				font-size: 30rpx;
				display: flex;
				justify-content: center;
				align-items: center;
				letter-spacing: 10rpx;
				font-weight: lighter;

				.left,
				.right {
					position: absolute;
					top: 50%;
					transform: translateY(-50%);

					width: 40rpx;
					height: 40rpx;
					visibility: hidden;
				}

				&.leftShow .left {
					visibility: visible;
				}

				&.rightShow .right {
					visibility: visible;
				}

				.left {
					left: -50rpx;
				}

				.right {
					right: -50rpx;
				}

				p {
					margin: 10rpx 0;
					text-align: center;
				}
			}
		}
	}
</style>
