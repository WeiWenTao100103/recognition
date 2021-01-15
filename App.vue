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
	/*每个页面公共css */
	.fixed{
		position: fixed;
		bottom: 180rpx;
		right:48rpx;
		
		
		display: flex;
		flex-direction: column;
		align-items: center;
		.kefu{
			border-radius: 12rpx;
			width: 64rpx;
			height: 64rpx;
			margin-bottom: 32rpx;
			background: rgba(255,255,255,0.6);
		}
		.share{
			border-radius: 12rpx;
			width: 60rpx;
			height: 60rpx;
			background: rgba(255,255,255,0.6);
		}
		view{
			position: relative;
			image{
				width: 100%;
				height: 100%;
			}
			button{
				position: absolute;
				left: 0;
				top: 0;
				width: 100%;
				height: 100%;
				opacity:0;
			}
		}
	}
</style>
<!-- ff0000 -->
<!-- cdcdcd -->