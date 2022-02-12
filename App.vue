<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style lang="scss">
	.shadowFont
	{
		font-weight: bold;
		text-shadow: 0 2px 2px #777;
	}
	
	.button{
		
		&:hover{
			animation: .3s click;
		}
	}
	
	@keyframes click{
		0%{
			transform: scale(1);
		}
		50%{
			transform: scale(0.7);
		}
		100%{
			transform: scale(1);
		}
	}
	
	
</style>
