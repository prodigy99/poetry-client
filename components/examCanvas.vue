<template>
	<div class="answer" :class="questionType">
		<image class="answerbg" :src=" common.imageUrl+'answerbg.png'" mode="widthFix"></image>
		<image class="decorate" :src=" common.imageUrl+'crane.png'" mode="widthFix"></image>

		<div class="questionWrapper" v-if="!isChangeQuestion">
			<text class="question">{{questionTitle}}</text>
			<text v-show = "questionType == 'fill'" class="content">{{fillContent}}</text>
			
			<div class="options">
				<div class="button option" v-for="(option,index) in options" :key="index" @click="answer(index)" :class="{'leftShow' : leftChooseIndex == index, 'rightShow' : rightChooseIndex == index}">
					<image class="left" :src="index != question.key ?  common.imageUrl+'sign-wrong.png' :  common.imageUrl+'sign-right.png'"
					 mode=""></image>
					<image class="right" :src="index != question.key ? common.imageUrl+'sign-wrong.png' : common.imageUrl+'sign-right.png'"
					 mode=""></image>
					<p>{{option}}</p>
				</div>
			</div>
			
			<div class="col" v-show = "questionType == 'fill'">
				<div class="button left" @click="confirm">确认</div>
				<div class="button right" @click="clear">清空</div>
			</div>
		</div>
		<div v-else class="indexWrapper">
			<p class="index">{{rankIndex}}</p>
		</div>

		<div class="score left" v-show="mode != 0">
			<div class="progress" :style="{'height':score.me.per}"></div>
			<div class="label">{{score.me.value}}</div>
		</div>

		<div class="score right" v-show="mode != 0">
			<div class="progress" :style="{'height':score.other.per}"></div>
			<div class="label">{{score.other.value}}</div>
		</div>
	</div>

</template>

<script>
	import {
		numberParseChina
	} from "../utils/character.js";
	import common from "../config/index.js"
	export default {
		// 0为单人游戏 1为多人游戏
		props: ["mode"],
		data() {
			return {
				common: common,
				question: {
					// mode: 1,
					// title: '__知时节,\n当春乃__。',
					// options: ['浩宇', '好雨', '发生', '生发'],
					// key:1
				},
				problemIndex: 0,
				isChangeQuestion: false,
				score: {
					me: {
						value: 0,
						per: '0' // 服务器预先计算一个最高分值，然后当前得分除以最高得分算出
					},
					other: {
						value: 0,
						per: '0'
					}
				},
				leftChooseIndex: -1,
				rightChooseIndex: -1,
				
				////////fill
				typeContent:[],
			}
		},
		computed: {
			questionType() {
				let map = {
					0: 'quiz',
					1: 'fill'
				}
				return map[this.question.mode];
			},
			rankIndex() {
				return `第${numberParseChina(this.problemIndex)}关`;
			},
			questionTitle(){
				if(this.questionType == "quiz"){
					return this.question.title;
				}else if(this.questionType == "fill"){
					return `请将以下文字组成一句${this.question.writer}的诗/词`;
				}else {
					return '';
				}
			},
			fillContent(){
				if(this.questionType != 'fill') return '';
				
				let temp = '';
				
				for(let i = 0; i < this.question.len;i++){
					if(i < this.typeContent.length){
						temp += ` ${this.typeContent[i]} `;
					}else
						temp += " _ "
				}
				return temp;
			},
			options(){
				if(this.questionType == "quiz"){
					return this.question.options;
				}else if(this.questionType == "fill"){
					return this.question.vue;
				}else {
					return [];
				}
			}
		},
		methods: {
			changeQuestion(newQuestion) {
				this.leftChooseIndex = -1;
				this.rightChooseIndex = -1;
				this.problemIndex += 1;
				this.isChangeQuestion = true;
				this.question = newQuestion;
				this.typeContent = [];
				
				setTimeout(() => {
					this.isChangeQuestion = false;
				}, 1000);
			},
			answer(index) {
				if (this.questionType == 'quiz') {
					if (index == this.question.key) {
						this.$emit("answer", true);
					} else
						this.$emit("answer", false);

					this.leftChooseIndex = index;
				}else if(this.questionType == 'fill'){
					if(this.typeContent.length <= this.question.len)
						this.typeContent.push(this.question.vue[index]);
				}

			},
			changeScore(newScore) {
				this.score = newScore;
			},
			clear(){
				this.typeContent = [];
			},
			confirm(){
				if(this.typeContent.join('') == this.question.correct){
					this.$emit("answer", true);
				}else{
					this.$emit("answer", false);
				}
			}
		},
	}
</script>

<style lang="scss">
	.indexWrapper {
		position: absolute;
		left: 50%;
		top: 10%;
		transform: translateX(-50%);
		color: rgb(3, 34, 153);
		font-weight: bold;
		font-size: 60rpx;
	}

	.answer {
		position: absolute;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);

		.answerbg {
			// opacity: .8;
			// height: 70vh;
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

		& .question {
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

		&.quiz .options {
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
		
		.content{
			position: absolute;
			text-align: center;
			transform: translateX(-50%);
			left: 50%;
			top: 25%;
			width: 100%;
			height: 20%;
			color:black;
			z-index: 10000;
		}

		&.fill .options {
			position: absolute;
			left: 50%;
			top: 40%;
			width: 60%;
			height: 20%;
			transform: translateX(-50%);
			display: flex;
			flex-wrap: wrap;

			
			.option {
				width: 15%;
				height: 25%;
				margin: 5%;
				background-color: rgb(114, 140, 177);
				font-size: 30rpx;
				// font-weight: lighter;
				border-radius: 10rpx;
				color: white;
				display: flex;
				align-items: center;
				justify-content: center;
				
				image{
					display: none;
				}
			}
		}
		
		&.fill .col{
			position: absolute;
			left: 50%;
			bottom: 10%;
			width: 70%;
			height: 20%;
			transform: translateX(-50%);
			display: flex;
			align-items: center;
			justify-content:space-around;
			
			.button {
				position: absolute;
				bottom: 15%;
				color: black;
				padding: 15rpx 25rpx;
				font-size: 30rpx;
				border-radius: 10rpx;
				font-weight: lighter;
				letter-spacing: 5rpx;
			
				&.left {
					left: 20%;
					background-color: rgb(89, 214, 118);
				}
			
				&.right {
					right: 20%;
					background-color: rgb(233, 95, 86);
				}
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
				left: -2%;
				color: rgb(24, 53, 166);
			}

			&.right {
				right: -2%;
				color: rgb(205, 27, 27)
			}

			.label {
				transform: translate(-100%, -200%);
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
	}
</style>
