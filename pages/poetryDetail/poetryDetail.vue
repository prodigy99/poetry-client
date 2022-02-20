<template>
	<view class="container">
		<image class="appbg" :src="common.imageUrl+'gamebg.png'"></image>
		<image class="decorate" :src="common.imageUrl+'crane.png'" mode="widthFix"></image>

		<div class="wrapper">
			<image class="bar left" :src="common.imageUrl+'bar-left.png'" mode=""></image>
			<image class="bar right" :src="common.imageUrl+'bar-left.png'" mode=""></image>

			<scroll-view class="content" scroll-y="true">
				<p class="title">{{poetryInfo.title}}</p>
				<p class="auther">{{poetryInfo.writer}}</p>
				<pre class="poetry" v-html="poetryInfo.content"></pre>
				<pre class="other" v-for="(item,index) in poetryInfo.others" :key="index" v-html="item"> </pre>
			</scroll-view>
		</div>
	</view>
</template>

<script>
	import {
		mapState,
		mapActions
	} from 'vuex'
	import api from "../../api/index.js";
	import store from "../../store/index.js";
	import common from "../../config/index.js"
	export default {
		data() {
			return {
				common: common,
				poetryInfo: {},
				pid: "",
			};
		},
		computed: {
			...mapState(["userInfo"])
		},
		onLoad(options) {
			let id = options.id;
			this.getPoetry(id);
		},
		methods: {
			getPoetry(id) {
				uni.showLoading({
					title: "加载中"
				})
				api.poetry.findById(id).then(res => {
					uni.hideLoading();
					this.poetryInfo = res.data;

					for (let sign of ['，', '。', '？', '！', '；']) {
						this.poetryInfo.content = this.poetryInfo.content.replace(new RegExp(sign, 'g'),
							`${sign}<br/>`);
					}

					let otherConstructor = (title, content) => {
						return content != undefined ? `<h3><strong>${title}:</strong></h3> <br/>` + content :
							'';
					}

					this.poetryInfo.others = [
						otherConstructor("注释", this.poetryInfo.remark),
						otherConstructor("翻译", this.poetryInfo.translation),
						otherConstructor("赏析", this.poetryInfo.shangxi),
					];
				})
			},
		}
	}
</script>

<style lang="scss">
	.container {
		position: relative;
		width: 100vw;
		height: 100vh;
		overflow: hidden;

		// &::before {
		// 	position: absolute;
		// 	display: block;
		// 	content: '';
		// 	left: 0;
		// 	top: 0;

		// 	width: 100%;
		// 	height: 5%;

		// 	background: linear-gradient(rgb(78, 132, 230), rgb(215, 131, 234));
		// 	border-radius: 62% 38% 50% 50% / 0% 0% 100% 100%;
		// 	opacity: .9;
		// 	z-index: 1;
		// }


		.appbg {
			position: absolute;
			width: 100%;
			height: 100%;
		}

		.decorate {
			position: absolute;
			width: 80%;
			left: 50%;
			bottom: 0;
			transform: translateX(-50%);
		}

		.wrapper {
			position: absolute;
			width: 80%;
			height: 60%;

			left: 50%;
			top: 50%;
			transform: translate(-50%, -50%);
			opacity: .7;
			background-color: #000;
			border-radius: 20rpx;

			.bar {
				position: absolute;
				height: 100%;
				width: 10%;

				&.left {
					left: 2%;
				}

				&.right {
					right: 2%;
					transform: rotateY(180deg);
				}
			}

			.content {
				position: relative;
				z-index: 2;
				color: white;
				width: 70%;
				left: 50%;
				top: 10%;
				transform: translateX(-50%);
				height: 60%;

				.title {
					text-align: center;
				}

				.auther {
					margin-top: 20rpx;
					font-size: 30rpx;
					text-align: right;
				}

				.poetry {
					margin-top: 20rpx;
					text-align: center;
					font-size: 35rpx;
				}

				.other {
					margin-top: 30rpx;
					text-align: center;
					font-size: 30rpx;
					font-weight: lighter;
				}
			}

			.button {
				position: absolute;
				bottom: 15%;
				color: white;
				padding: 15rpx 25rpx;
				font-size: 30rpx;
				border-radius: 10rpx;
				font-weight: lighter;
				letter-spacing: 5rpx;

				&.left {
					left: 20%;
					background-color: rgb(165, 58, 200);
				}

				&.right {
					right: 20%;
					background-color: rgb(58, 85, 200);
				}
			}
		}
	}
</style>
