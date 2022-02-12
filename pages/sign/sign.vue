<template>
	<div class="container">
		<image class="appbg" :src="common.imageUrl+'gamebg.jpg'"></image>
		<image class="decorate" :src="common.imageUrl+'crane.png'" mode="widthFix"></image>
		<view class="calendar">
			<ss-calendar :checks=checks />
			<view class="btn-sign-in" @click="signIn">{{label}}</view>
		</view>
	</div>

</template>

<script>
	import ssCalendar from '@/components/ss-calendar/ss-calendar.vue'
	import common from "../../config/index.js"

	export default {
		data() {
			return {
				common: common,
				checks: [],
				sign: false,
			}
		},
		onShow() {
			let month = new Date().getMonth();
			
			uni.getStorage({
				key:'month',
				success : (e) => {
					if(month != e.data){
						uni.setStorage({
							key:'checks',
							data:[]
						})
					}
				}
			})
			
			uni.setStorage({
				key:'month',
				data:month
			})
			
			uni.getStorage({
				key:'checks',
				success: (e) => {
					this.checks = e.data;
					for(let i of this.checks){
						if(i ==  new Date().getDate()){
							this.sign = true;
						}
					}
				}
			})
			
			
		},
		components: {
			ssCalendar
		},
		methods: {
			signIn() {
				if (this.sign == false) {
					this.sign = true;
					const day = new Date().getDate();
					let temp = new Set(this.checks);
					temp.add(day);
					this.checks = Array.from(temp);

					uni.setStorage({
						key: 'day',
						data: day
					})
					
					uni.setStorage({
						key:'checks',
						data:this.checks,
					})
				}
			}
		},
		computed: {
			label() {
				return this.sign == false ? '签到' : '已签到';
			}
		}
	}
</script>

<style lang="scss" scoped>
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
			position: absolute;
			left: 50%;
			top: 40%;
			transform: translate(-50%, -50%);
			width: 90%;
		}

		.calendar {
			opacity: .9;
			position: absolute;
			width: 70%;
			left: 50%;
			top: 10%;

			padding: 10% 6% 20% 6%;
			background-color: #000;
			background: linear-gradient(to bottom, rgb(173, 187, 204), rgb(48, 61, 76));
			border-radius: 10px;
			border: 2px solid rgb(146, 160, 179);

			transform: translateX(-50%);
			z-index: 1001;

			.btn-sign-in {
				position: absolute;
				width: 240upx;
				height: 70upx;
				line-height: 70upx;
				text-align: center;
				border: 2upx solid #ddd;
				border-radius: 43upx;
				margin: 0 auto;
				font-size: 32upx;
				color: #fff;

				left: 50%;
				transform: translateX(-50%);
				bottom: 5%;
			}
		}


	}
</style>
