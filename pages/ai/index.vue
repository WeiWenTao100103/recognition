<template>
	<view class="content">
		<image class="ai" :src="url+'ai/ai.jpeg'"></image>
		<view class="list">
			<view class="item" @click="navTo('advanced_general')">
				<image  style="width: 84rpx;" :src="url+'ai/01.png'"></image>
				通用物体场景识别
			</view>
			<view class="item" @click="navTo('animal')">
				<image :src="url+'ai/02.png'"></image>
				动物识别
			</view>
			<view class="item" @click="navTo('plant')">
				<image :src="url+'ai/03.png'"></image>
				植物识别
			</view>
			<view class="item" @click="navTo('classify/ingredient')">
				<image :src="url+'ai/04.png'"></image>
				果蔬识别
			</view>
			<view class="item" @click="navTo('dish')">
				<image :src="url+'ai/05.png'"></image>
				菜品识别
			</view>
			<view class="item" @click="navTo('redwine')">
				<image :src="url+'ai/06.png'"></image>
				红酒识别
			</view>
			<view class="item" @click="navTo('currency')">
				<image :src="url+'ai/07.png'"></image>
				货币识别
			</view>
			<view class="item" @click="navTo('logo')">
				<image :src="url+'ai/08.png'"></image>
				logo识别
			</view>
			<view class="item" @click="navTo('landmark')">
				<image :src="url+'ai/09.png'"></image>
				地标识别
			</view>
		</view>
		<view class="fixed">
			<view class="kefu">
				<image :src="url+'public/kefu.png'"></image>
				<button open-type="contact"></button>
			</view>
			<view class="share">
				<image :src="url+'public/share.png'"></image>
				<button open-type="share"></button>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
			}
		},
		onLoad() {
		},
		methods: {
			onShareAppMessage: function (res) {
			    return {
			      title: '精准的物体场景智能识别',
			      path: '/pages/ai/index',
				  imageUrl:this.url+'ai/ai.jpeg'
			    }
			 },
			navTo(type){
				wx.navigateTo({
				  url: '/pages/ai/ai?type='+type,
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		.ai{
			width: 100vw;
			margin-left: auto;
			margin-right: auto;
			margin-bottom: 50rpx;
			height: 462rpx;
		}
		.list{
			display: flex;
			flex-wrap: wrap;
			.item{
				width: 33%;
				font-size: 24rpx;
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				margin: 24rpx 0 48rpx;
				image{
					width: 82rpx;
					height: 82rpx;
					margin: 0 0 24rpx 0;
					padding: 0;
				}
			}
		}
		
	}

</style>
