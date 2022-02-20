<template>
	<view class="container">
		<image class="appbg" :src="common.imageUrl+'gamebg.png'"></image>

		<scroll-view scroll-y="true" class="wrapper">
			<!-- <div class="wrapper"> -->
			<div class="center">
				<div class="item" v-for="(user,index) in userInfos" :key="index">
					<p class="index">{{index + 1}}</p>
					<div class="userInfo">
						<image class="avatar" :src="user.avatar"></image>
						<p class="name">{{user.nickname}}</p>
						<!-- <p class="accuracy">正确率:{{user.accuracy}}</p> -->
						<div class="grade">等级:{{user.level}}</div>
					</div>
					<div class="gold">金币:{{user.gold}}</div>
				</div>
			</div>
			<!-- <div class="item">
				<p class="index">1</p>
			</div>

			<div class="item">
				<p class="index">1</p>
			</div> -->
			<!-- </div> -->
		</scroll-view>
	</view>
</template>

<script>
	import common from "../../config/index.js";
	import api from "../../api/index.js";
	
	export default {
		data() {
			return {
				common:common,
				userInfos: [
					// {
					// 	name: '董凤军',
					// 	avatar:"https://q.qlogo.cn/headimg_dl?dst_uin=99163267&spec=100",
					// 	accuracy: '82%',
					// 	level: '8',
					// 	gold: '200'
					// }, {
					// 	name: '刘善政  妈妈',
					// 	avatar :"https://q.qlogo.cn/headimg_dl?dst_uin=61368154&spec=100",
					// 	accuracy: '76%',
					// 	level: '5',
					// 	gold: '2000'
					// }, {
					// 	name: '四大名助',
					// 	avatar:"https://q.qlogo.cn/headimg_dl?dst_uin=3199614743&spec=100",
					// 	accuracy: '72%',
					// 	level: '4',
					// 	gold: '1340'
					// }, {
					// 	name: "/@菠萝蜜",
					// 	avatar: "https://q.qlogo.cn/headimg_dl?dst_uin=89175233&spec=100",
					// 	accuracy: '68%',
					// 	level: '11',
					// 	gold: '2240'
					// }, {
					// 	avatar: "https://q.qlogo.cn/headimg_dl?dst_uin=291911551&spec=100",
					// 	name: "在",
					// 	accuracy: '65%',
					// 	level: '10',
					// 	gold: '470'
					// }, {
					// 	avatar: "https://q.qlogo.cn/headimg_dl?dst_uin=391117911&spec=100",
					// 	name: "223",
					// 	accuracy: '63%',
					// 	level: '9',
					// 	gold: '160'
					// }, {
					// 	avatar: "https://q.qlogo.cn/headimg_dl?dst_uin=676282747&spec=100",
					// 	name: "张扬",
					// 	accuracy: '59%',
					// 	level: '12',
					// 	gold: '600'
					// },{
					// 	avatar: "https://q.qlogo.cn/headimg_dl?dst_uin=1264793995&spec=100",
					// 	name: "梦幻",
					// 	accuracy: '59%',
					// 	level: '9',
					// 	gold: '1470'
					// }
				]
			}
		},
		methods: {

		},
		onLoad() {
			api.user.rankTop().then(res => {
				this.userInfos = res.data;
			})
		}
	}
</script>

<style lang="scss">
	.container {
		position: relative;
		width: 100vw;
		height: 100vh;
		overflow: hidden;

		&::before {
			position: absolute;
			display: block;
			content: '';
			left: 0;
			top: 0;

			width: 100%;
			height: 11%;

			background: linear-gradient(rgb(92, 114, 205));
			z-index: 1;
		}

		.appbg {
			position: absolute;
			width: 100%;
			height: 100%;
		}

		.wrapper {
			position: absolute;
			top: 8%;
			width: 90%;
			height: 70%;
			left: 50%;
			transform: translateX(-50%);
			// background-color: #fff;
			z-index: 2;
			
			&:before {
				position: absolute;
				display: block;
				content: '';
				left: 0;
				top: 0;
				transform: translateY(-50%);
				width: 100%;
				height: 20rpx;
				border-radius: 10rpx;
				background: rgb(1, 26, 132);
			}
			.center{
				display: flex;
				flex-direction: column;
				align-items: center;
				
			}

			.item {
				position: relative;
				z-index: 3;
				width: 95%;
				height: 230rpx;
				background-color: rgba(84, 202, 204, 0.8);
				border-radius: 15rpx;
				box-shadow: 1px 1px 5px rgb(93, 115, 206);
				margin-bottom: 30rpx;
				overflow: hidden;

				&:after {
					position: absolute;
					content: '';
					left: 0;
					top: 0;
					width: 0;
					height: 0;
					border: 40rpx solid rgb(20, 51, 180);
					border-right-color: transparent;
					border-bottom-color: transparent;
				}

				.index {
					position: relative;
					left: 15rpx;
					top: 5rpx;
					color: white;
					z-index: 1;
					font-size: 35rpx;
				}

				.userInfo {
					position: absolute;
					width: 90%;
					height: 50%;

					left: 10%;
					top: 50%;

					transform: translateY(-50%);
					// transform: translate(-50%,-50%);
					// background-color: #000;

					.avatar {
						position: absolute;
						left: 0;
						top: 0;
						width: 108rpx;
						height: 108rpx;
						border: white solid 7rpx;
						border-radius: 50%;
					}

					.name {
						position: absolute;
						color: white;
						font-size: 35rpx;
						left: 130rpx;
						top: 50%;
						transform: translateY(-100%);
					}

					.accuracy {
						position: absolute;
						color: white;
						right: 2%;
						font-size: 30rpx;
						top: 50%;
						transform: translateY(-100%);
					}

					.grade {
						position: absolute;
						color: white;
						left: 130rpx;
						font-size: 25rpx;
						letter-spacing: 5rpx;
						top: 50%;
						transform: translateY(30%);
						padding: 5rpx 25rpx;
						background-color: rgb(12, 168, 170);
						border-radius: 20rpx;
					}

					&:before {
						position: absolute;
						content: '';
						left: 0;
						top: 50%;
						display: block;

						width: 100%;
						height: 3rpx;
						transform: translateY(-50%);
						background-color: #fff;
					}
				}

				.gold {
					position: absolute;
					right: 5%;
					bottom: 15%;

					color: white;
					font-size: 25rpx;
					letter-spacing: 5rpx;
					transform: translateY(30%);
					padding: 5rpx 25rpx;
					background-color: rgb(187, 185, 23);
					border-radius: 20rpx;
				}
			}
		}

	}
</style>
