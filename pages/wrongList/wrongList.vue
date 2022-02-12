<template>
	<view class="container">
		<image class="appbg" :src="common.imageUrl+'gamebg.jpg'"></image>
		<image class="decorate" :src="common.imageUrl+'crane.png'" mode="widthFix"></image>

		<div class="wrapper">
			<div>
				<p>目录</p>
			</div>
			<scroll-view class="content" scroll-y="true">
				<div class="item" v-for="(info,index) in contractInfo" :key="index" @click="showDetail(info.id,info._id)">
					<p>{{info.title}}</p>
				</div>
			</scroll-view>

		</div>
	</view>
</template>

<script>
	import {
		mapState,
		mapActions
	} from 'vuex'
	import axios from "../../utils/axios.js";
	import store from "../../store/index.js";
	import common from "../../config/index.js"
	export default {
		data() {
			return {
				common:common,
				contractInfo:[],
			};
		},
		computed: {
			...mapState(["userInfo"])
		},
		onShow() {
			uni.showLoading({
				title:"加载错题信息"
			})
			this.getContractMistake().then(uni.hideLoading);
		},
		methods: {
			async getContractMistake(){
				this.contractInfo = await axios.get("mistake/getContractMistake",{uid:this.userInfo.uid});
				console.log(this.contractInfo[0].weight);
				this.contractInfo.sort(function(a,b){
					  return b.weight-a.weight;
				});
			},
			showDetail(id,_id){
				uni.navigateTo({
					url:`/pages/wrongTopic/wrongTopic?id=${id}&_id=${_id}`
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

		&::before {
			position: absolute;
			display: block;
			content: '';
			left: 0;
			top: 0;

			width: 100%;
			height: 5%;

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
			
			& > div{
				z-index: 1;
				position: absolute;
				top: 0;
				margin: 10rpx 0;
				width: 80%;
				left: 50%;
				transform: translateX(-50%);
				border-bottom: 1px solid white;
				text-align: center;
				p{
					margin: 10rpx;
					color:white;
					font-size: 40rpx;
					font-weight: 200;
				}
			}

			.content {
				position: relative;
				z-index: 2;
				color: white;
				width: 100%;
				left: 50%;
				top: 15%;
				transform: translateX(-50%);
				height: 80%;

				.item{
					position: relative;
					margin: 0 5%;
					width: 90%;
					min-height: 70rpx;
					border:1px solid white;
					margin-bottom: 10rpx;
					
					display: flex;
					align-items: center;
					
					p{
						white-space: nowrap;
						overflow: hidden;
						text-overflow: ellipsis;
						margin: 15rpx 0;
						margin-left: 25rpx;
						width: 80%;
					}
					
					&:before,
					&:after{
						position: absolute;
						content:'';
						display: block;
						height: 2px;
						width: 30rpx;
						background-color: #fff;
						right: 5%;
						transform-origin: right;
					}
					
					&:before{
						transform: rotate(45deg);
					}
					
					&:after{
						transform: rotate(-45deg);
					}
					
				}
				
				
			}
		}
	}
</style>
