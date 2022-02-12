<template>
	<view class="container">
		<image class="appbg" :src=" common.imageUrl+'matchbg.png'" mode="aspectFill"></image>

		<div class="user">
			<image class="bg1" :src=" common.imageUrl+'matchUserBg1.png'"></image>
			<image class="bg2" :src=" common.imageUrl+'matchUserBg2.png'"></image>
			<image class="avatar" :src="userInfo.avatar" mode=""></image>

			<div class="userinfo">
				<p>用户:{{userInfo.name}}</p>
				<p>等级:{{userInfo.level}}</p>
				<p>段位:{{userInfo.rank}}</p>
			</div>
		</div>
	</view>
</template>

<script>
	import {
		mapState,
		mapActions
	} from 'vuex'

	import axios from "../../utils/axios.js";
	import common from "../../config/index.js"
	export default {
		data() {
			return {
				common:common,
				exit:false,
			}
		},
		methods: {

		},
		computed: {
			...mapState(["userInfo"])
		},
		onLoad() {
			// 从服务器端获取对手信息
			axios.get("fakedata/userAvatar").then(otherInfo => {
				setTimeout(() => {
					if(this.exit) return;
					
					uni.showToast({
						title: "匹配成功"
					})

					setTimeout(() => {
						uni.redirectTo({
							url: `/pages/rank/rank?otherInfo=${encodeURIComponent(JSON.stringify(otherInfo))}`,
						});
						uni.hideToast();
					}, 500);

				}, 1000)
			})
		},
		onUnload() {
			this.exit = true;
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

		.user {
			position: absolute;
			width: 550rpx;
			height: 550rpx;
			left: 50%;
			top: 30%;
			transform: translate(-50%, -50%);

			.bg1,
			.bg2 {
				position: absolute;
				left: 0;
				top: 0;
				width: 550rpx;
				height: 550rpx;
			}

			.bg2 {
				transform: rotate(90deg);
				animation: 2s rotate linear infinite;
			}

			.avatar {
				position: absolute;
				left: 50%;
				top: 50%;
				width: 130rpx;
				height: 130rpx;
				border: white solid 7rpx;
				border-radius: 50%;
				transform: translate(-50%, -50%);
			}

			.userinfo {
				position: absolute;
				left: 50%;
				bottom: -300rpx;
				transform: translateX(-50%);
				font-size: 35rpx;
				letter-spacing: 10rpx;
				font-weight: solid;
			}
		}
	}

	@keyframes rotate {
		from {
			transform: rotate(0);
		}

		to {
			transform: rotate(360deg);
		}
	}
</style>
