<template>
	<view>
		<div class="container">
			<image class="title" src="../../static/title.png" mode="widthFix"></image>
			<image class="appbg" src="../../static/index.jpg"></image>
			<image class="load" v-for="(url,index) in urls" :key="index" :src=" common.imageUrl+url" mode="widthFix" @load="load" @error="load"></image>
			
		</div>
	</view>
</template>

<script>
	import common from "../../config/index.js"
	
	export default {
		data() {
			return {
				urls : ['appbg.png', 'gold.png', 'answerbg.png', 'crane.png', 'sign-wrong.png', 'sign-right.png', 'qd.png',
					'userbg.png', '1.png', '2.png', '3.png', 'bank.png', 'bar-left.png',  'bluebg.png',
					'gamebg.jpg', 'gold.png', 'matchbg.png', 'matchUserBg1.png', 'matchUserBg2.png', 'message.png', 'new.png',
					'pk.png', 'rank.png', 'redbg.png', 'sg.png', 'shop.png', 'sound.png', 'top.png', 'wrong.png'
				],
				common:common,
				count:0
			}
		},
		methods: {
			load(){
				this.count ++;
				let percentage = Math.floor((this.count / this.urls.length) * 100);
				
				uni.showLoading({
					title:`资源加载中 ${percentage}%`
				})
				
				if(this.count == this.urls.length){
					uni.redirectTo({
						url:'/pages/index/index'
					})
				}
			}
		},
		mounted() {
			uni.showLoading({
				title:'资源加载中'
			})
		}
	}
</script>

<style lang="scss">
	.load{
		visibility: hidden;
	}
	
	.container {
		position: relative;
		width: 100vw;
		height: 100vh;
		overflow: hidden;
		
		.title{
			position: absolute;
			z-index: 1000;
			top: 20%;
			left: 50%;
			transform: translateX(-50%);
			width: 600rpx;
		}
		
		.appbg {
			position: absolute;
			width: 100%;
			height: 100%;
		}
	}
</style>
