<template>
	<div class="container">

		<!-- 签到按钮 -->
		<div class="qd" @click="toSign">
			<image :src="common.imageUrl+'qd.png'" mode="widthFix"></image>
		</div>

		<button class="login" open-type="getUserInfo" @getuserinfo="login" v-if="notLogin"></button>
		<image class="appbg" :src=" common.imageUrl+'appbg.png'" mode="aspectFill"></image>

		<div class="user">
			<image class="user_bg" :src=" common.imageUrl+'userbg.png' "></image>
			<text class="name shadowFont">{{userInfo.name}}</text>
			<image class="avatar" :src="userInfo.avatar" mode=""></image>
			<div class="level">
				<text :key="menuKey">Lv.{{userInfo.level}}</text>
				<div class="experience">
					<div class="bar" :key="menuKey" :style="{'width':userInfo.exp}"></div>
				</div>
			</div>
			<div class="gold">
				<image :src=" common.imageUrl+'gold.png'" mode="aspectFit"></image>
				<p>{{userInfo.gold}}</p>
			</div>
		</div>



		<scroll-view class="wraper" scroll-y="true">
			<div class="itemsContainer">
				<!-- <div class="button item item_pk">
					<p class="label shadowFont">至交对战</p>
					<image class="item_bg" :src=" common.imageUrl+'pk.png'"></image>
				</div> -->

				<div class="col">
					<div class="button item item_rank" @click="gotoWhere('matching')">
						<p class="label shadowFont">对弈赛</p>
						<image class="item_bg" :src=" common.imageUrl+'rank.png'"></image>
					</div>

					<div class="button item item_sg" @click="gotoWhere('singleGame')">
						<p class="label shadowFont">孤军奋战</p>
						<image class="item_bg" :src=" common.imageUrl+'sg.png'"></image>
					</div>
				</div>

				<div class="col">
					<div class="topAndConfig">
						<div class="button item item_top" @click="gotoWhere('top')">
							<p class="label shadowFont">排行榜</p>
							<image class="item_bg" :src=" common.imageUrl+'top.png'"></image>
						</div>



						<div class="config">
							<div class="button item item_sound" @click="changeAudioFlag()">
								<p class="label shadowFont">声音</p>
								<image class="item_bg" :src=" common.imageUrl+'sound.png'"></image>
							</div>

							<div class="button item item_message">
								<p class="label shadowFont">消息</p>
								<image class="item_bg" :src=" common.imageUrl+'message.png'"></image>
							</div>
						</div>
					</div>

					<div class="row">
						<div class="button item item_wrong" @click="gotoWhere('wrongList')">
							<p class="label shadowFont">错题本</p>
							<image class="item_bg" :src=" common.imageUrl+'wrong.png'"></image>
						</div>

						<div class="button item item_bank" @click="gotoWhere('shop')">
							<p class="label shadowFont">钱庄</p>
							<image class="item_bg" :src=" common.imageUrl+'bank.png'"></image>
						</div>
					</div>
				</div>

				<div class="item item_new">
					<p class="label shadowFont">新功能请期待</p>
					<image class="item_bg" :src=" common.imageUrl+'new.png'"></image>
				</div>
			</div>
		</scroll-view>
	</div>
</template>

<script>
	import {
		mapState,
		mapActions,
		mapMutations
	} from 'vuex'
	import Vue from 'vue';
	import axios from "../../utils/axios.js";
	import common from "../../config/index.js";
	
	export default {
		data() {
			return {
				notLogin: true,
				provider: '',
				uid: '',
				common: common,
				innerAudioContext: uni.createInnerAudioContext(),
			}
		},
		onLoad() {
			this.audioInit();

			uni.getStorage({
				key: 'day',
				success: (data) => {
					const day = new Date().getDate();
					if (data.data != day) {
						this.setSign(false);
					} else {
						this.setSign(true);
					}
				}
			})
		},
		onShow() {
			uni.getStorage({
				key: 'audio_flag',
				success: (data) => {
					this.audio.flag = data.data;
				}
			})
			
			if (this.audio.flag == 1) {
				this.innerAudioContext.pause();
			}
			if (this.audio.Flag == 1)
				if (this.userInfo.uid != '') {
					this.updateUserInfo();
				}


		},
		mounted() {
			
			let that = this;

			uni.getProvider({
				service: "oauth",
				success: (service) => {
					that.provider = service.provider[0];
					uni.login({
						provider: that.provider,
						success: function(loginRes) {
							that.uid = loginRes.code;
							uni.getUserInfo({
								provider: that.provider,
								success: (infoRes) => {
									console.log(infoRes)
									that.initUserInfo(infoRes.userInfo);
									that.notLogin = false;
								}
							});
						},
					})
				}
			})
		},

		methods: {
			...mapActions(["getUserInfo", "updateUserInfo"]),
			...mapMutations(['setSign']),
			// 这里初始化用户数据
			audioInit() {

				this.innerAudioContext.autoplay = true;
				this.innerAudioContext.src = common.musicUrl + 'gs.mp3';
				this.innerAudioContext.onPlay(() => {
					console.log('开始播放');
				});
				this.innerAudioContext.onEnded(() => {
					let source = ["gs.mp3", "smmf.mp3", "fqh.mp3"];
					this.audio.index++;
					this.audio.index %= 3;
					this.innerAudioContext.src = common.musicUrl + source[this.audio.index];
					console.log(this.innerAudioContext.src);
				});
			},
			initUserInfo(userInfo) {
				uni.showLoading({
					title: "获取用户信息",
				})

				this.getUserInfo({
					uid: this.uid,
					provider: this.provider,
					nativeUserInfo: userInfo
				}).then(
					() => {
						uni.hideLoading();
					}
				)
			},
			changeAudioFlag() {
				if (this.audio.flag == 0) {
					this.audio.flag = 1;
				} else {
					this.audio.flag = 0;
				}


				uni.setStorage({
					key: 'audio_flag',
					data: this.audio.flag,
				})
			},
			login(e) {
				let that = this;
				uni.getUserInfo({
					provider: that.provider,
					success: (infoRes) => {
						that.initUserInfo(infoRes.userInfo);
						console.log(infoRes);
						that.notLogin = false;
					}
				});
			},
			gotoWhere(name) {
				uni.navigateTo({
					url: '/pages' + "/" + name + "/" + name,
				});
			},
			toSign() {
				this.setSign(true);
				this.gotoWhere("sign")
			}

		},
		computed: {
			...mapState(["userInfo", "audio", "sign"]),
			audio_flag() {
				return this.audio.flag;
			}
		},
		watch: {
			audio_flag(now) {
				if (this.audio.flag == 1) {
					this.innerAudioContext.pause();
				} else {
					this.innerAudioContext.play();
				}
			}
		}
	}
</script>

<style lang="scss">
	.container {
		position: relative;
		height: 100vh;
		width: 750rpx;
		display: flex;
		justify-content: center;

		.qd {
			z-index: 100000;
			position: absolute;
			top: 0%;
			right: 10%;
			width: 60rpx;

			image {
				width: 100%;
			}
		}

		.login {
			position: absolute;
			z-index: 9999;
			left: 0;
			top: 0;
			right: 0;
			bottom: 0;
			opacity: 0;
		}

		.appbg {
			position: absolute;
			left: 0;
			top: 0;
			width: 100%;
			height: 100%;
			z-index: 0;
		}

		// &::before {
		// 	position: absolute;
		// 	display: block;
		// 	content: '';
		// 	left: 0;
		// 	top: 0;

		// 	width: 100%;
		// 	height: 100rpx;

		// 	background-color: rgb(78, 132, 230);
		// 	border-radius: 0% 100% 46% 54% / 0% 0% 100% 100%;

		// 	z-index: 1;
		// }

		.user {
			position: absolute;
			min-height: 300rpx;
			// border: 2rpx solid rgb(86, 197, 255);
			width: 100%;

			display: flex;
			// justify-content: center;
			align-items: center;
			flex-direction: column;

			// border-radius: 30rpx;
			// height: 20vh;
			overflow: hidden;

			.gold {
				position: absolute;
				right: 10%;
				top: 20%;

				z-index: 1;
				align-self: flex-start;
				margin-top: 3%;
				margin-left: 10%;
				margin-bottom: 3%;

				display: flex;
				align-items: center;

				image {
					width: 40rpx;
					height: 40rpx;
					margin-right: 10rpx;
				}

				p {
					color: white;
					font-weight: blod;
					font-size: 30rpx;
				}
			}

			.user_bg {
				position: absolute;
				width: 100%;
				height: 100%;
				z-index: 0;
			}

			.name {
				position: absolute;
				left: 10%;
				transform: translateX(140rpx);
				z-index: 1;
				margin-top: 10rpx;
				color: white;
			}

			.avatar {
				position: absolute;
				left: 10%;
				z-index: 1;
				margin-top: 10rpx;
				width: 102rpx;
				height: 102rpx;
				border-radius: 50%;
				border: 10rpx solid white;
			}

			.level {
				position: absolute;
				left: 10%;
				transform: translateX(140rpx);
				top: 25%;

				z-index: 1;
				margin-top: 10rpx;
				height: 10%;
				width: 30%;
				margin-bottom: 10rpx;

				display: flex;
				align-items: center;
				justify-content: center;

				text {
					color: rgb(122, 251, 254);
					font-size: 35rpx;
					margin-right: 10rpx;
					font-weight: bold;
					text-shadow: 0 8rpx 20rpx rgb(12, 111, 212);
				}

				.experience {
					position: relative;
					margin-top: 5rpx;
					height: 20rpx;
					width: 80%;
					border-radius: 100rpx;
					background: rgb(12, 111, 212);
					border: 5upx solid rgb(86, 197, 255);

					.bar {
						position: absolute;
						display: block;
						content: '';
						left: 1px;
						top: 1px;
						height: calc(100% - 2px);
						border-radius: 100rpx;
						background-color: rgb(122, 251, 254);
					}
				}
			}
		}

		.wraper {
			width: 90%;
			// height: 100vh;
			z-index: 1;
			margin-bottom: 1rem;

			.itemsContainer {
				z-index: 1000;
				// display: flex;
				margin-top: 200rpx;

				.label {
					color: white;
				}

				.col {
					display: flex;
				}



				.item {
					margin-top: 20rpx;
					border-radius: 10rpx;
					overflow: hidden;

					.item_bg {
						position: absolute;
						top: 0;
						right: 0;
						width: 100%;
						height: 100%;
					}

					.label {
						z-index: 2;
						font-weight: 500;
					}
				}

				.item_rank {
					position: relative;
					width: 55%;
					margin-right: 5%;
					height: 350rpx;

					.label {
						position: absolute;
						top: 15rpx;
						left: 35rpx;
					}
				}

				.item_sg {
					position: relative;
					height: 350rpx;
					width: 40%;
					background: linear-gradient(145deg, rgb(120, 214, 40), rgb(103, 231, 95));

					.label {
						position: absolute;
						top: 15rpx;
						right: 15rpx;
					}

					.item_bg {
						position: absolute;
						right: 0;
						width: 100%;
						height: 100%;
					}
				}

				.row {
					width: 55%;
					display: flex;
					flex-direction: column;
				}

				.item_wrong {
					position: relative;
					height: 150rpx;
					width: 100%;
					background: linear-gradient(145deg, rgb(71, 230, 150), rgb(98, 181, 67));

					.label {
						position: absolute;
						top: 15rpx;
						right: 15rpx;
					}
				}

				.item_bank {
					position: relative;
					height: 150rpx;
					width: 100%;
					background: linear-gradient(145deg, rgb(242, 201, 0), rgb(214, 128, 51));

					.label {
						position: absolute;
						top: 15rpx;
						left: 15rpx;
					}
				}

				.item_new {
					position: relative;
					height: 150rpx;
					width: 100%;
					background: linear-gradient(145deg, rgb(79, 180, 199), rgb(26, 141, 144));

					.label {
						position: absolute;
						left: 50%;
						top: 50%;
						transform: translate(-50%, -50%);
					}
				}

				.item_pk {
					position: relative;
					width: 100%;
					height: 250rpx;
					background: linear-gradient(145deg, rgb(215, 122, 213), rgb(177, 61, 194));

					.label {
						position: absolute;
						top: 15rpx;
						left: 15rpx;
					}

					.item_bg {
						position: absolute;
						right: 0;
						width: 100%;
						height: 100%;
					}
				}



				.topAndConfig {
					display: flex;
					width: 40%;
					margin-right: 5%;

					.item_top {
						position: relative;
						height: 320rpx;
						width: 59%;
						margin-right: 2%;
						background: linear-gradient(145deg, rgb(184, 212, 71), rgb(153, 185, 23));

						.label {
							position: absolute;
							left: 17%;
							top: 3%;
							// top: 15rpx;
							// right: 15rpx;
						}
					}

					.config {
						width: 39%;
						display: flex;
						flex-direction: column;

						.item_sound {
							position: relative;
							height: 49%;
							margin-bottom: 2%;
							background: linear-gradient(145deg, rgb(168, 81, 185), rgb(146, 51, 164));

							.label {
								font-size: 30rpx;
								position: absolute;
								left: 25%;
								top: 3%;
							}
						}

						.item_message {
							position: relative;
							height: 49%;
							background: linear-gradient(145deg, rgb(60, 82, 194), rgb(43, 66, 182));

							.label {
								font-size: 30rpx;
								position: absolute;
								left: 25%;
								top: 3%;
							}
						}
					}
				}
			}
		}
	}
</style>
