<template>
	<view class="container">
		<image class="appbg" :src="common.imageUrl+'gamebg.jpg'"></image>
		<image class="decorate" :src="common.imageUrl+'crane.png'" mode="widthFix"></image>

		<div class="shop">
			<image :src="common.imageUrl+'shop.png'" class="bc" mode="widthFix"></image>
			<div class="items">
				<div class="item" v-for='(item,index) in items' :key='index'>
					<image :src="common.imageUrl+item.url" class="item_bg" mode="widthFix"></image>
					<div class="button" @click="buy(index)">{{item.buy == false ? '购买' : '已购买'}}</div>
				</div>
				
			</div>
		</div>


	</view>

</template>

<script>
	import common from "../../config/index.js"
	export default {
		data() {
			return {
				common: common,
				items:[
					{url:'1.png',buy:false},
					{url:'2.png',buy:false},
					{url:'3.png',buy:false},
				]
			}
		},
		methods: {
			buy(index){
				this.items[index].buy = true;
				uni.setStorage({
					key:'shop_items',
					data:this.items
				})
			}
		},
		mounted(){
			// uni.getStorage({
			// 	key:"shop_items",
			// 	success:(items) => {
			// 		this.items = items.data;
			// 	},
			// 	fail:(err) => {
			// 		console.log(err);
			// 	}
			// })
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

		.decorate {
			position: absolute;
			width: 80%;
			left: 50%;
			bottom: 0;
			transform: translateX(-50%);
		}


		.bc {
			opacity: .9;
			position: absolute;
			left: 50%;
			top: 100rpx;
			width: 90%;
			transform: translateX(-50%);
		}


		.items {
			position: absolute;
			width: 80%;
			height: 100px;
			left: 50%;
			top: 200rpx;
			transform: translateX(-50%);
			display: flex;
			justify-content: space-around;
			// background-color: #fff;
			
			.item{
				position: relative;
				display: inline-block;
				width: 30%;
				display: flex;
				flex-direction: column;
				align-items: center;
				.item_bg{
					width: 100%;
				}
				
				.button{
					width: 80%;
					height: 30px;
					position: absolute;
					bottom: -30px;
					background: linear-gradient(to right,rgb(23, 97, 110),rgb(27, 139, 147));
					
					color:white;
					border-radius: 100rpx;
					
					display: flex;
					justify-content: center;
					align-items: center;
				}
			}
		}
	}
</style>
