<template>
	<view class="content">
		<image  class="undraw" :src="url+'ocr/undraw.jpeg'" ></image>
		<view class="list">
			<view class="item" @click="navTo('general')">
				<image  class="undraw" :src="url+'/ocr/01.png'"></image>
				通用文字识别
			</view>
			<view class="item" @click="navTo('accurate')">
				<image style="width: 88rpx;" :src="url+'/ocr/02.png'"></image>
				高精度文字识别
			</view>
			<view class="item" @click="navTo('idcard')">
				<image style="width: 112rpx;" :src="url+'/ocr/03.png'"></image>
				身份证识别
			</view>
			<view class="item" @click="navTo('bankcard')">
				<image :src="url+'/ocr/04.png'"></image>
				银行卡识别
			</view>
			<view class="item" @click="navTo('driving_license')">
				<image style="width: 126rpx;" :src="url+'/ocr/05.png'"></image>
				驾驶证识别
			</view>
			<view class="item" @click="navTo('vat_invoice')">
				<image style="width: 102rpx;" :src="url+'/ocr/06.png'"></image>
				增值税发票识别
			</view>
			<view class="item" @click="navTo('business_license')">
				<image :src="url+'/ocr/07.png'"></image>
				营业执照识别
			</view>
			<view class="item" @click="navTo('household_register')">
				<image style="width: 106rpx;" :src="url+'/ocr/08.png'"></image>
				户口本识别
			</view>
			<view class="item" @click="navTo('passport')">
				<image :src="url+'/ocr/09.png'"></image>
				护照识别
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		components: {
		},
		data() {
			return {
			}
		},
		onLoad() {
		},
		methods: {
			navTo(type){
				wx.navigateTo({
				  url: '/pages/ocr/ocr?type='+type,
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
		.undraw{
			width: 100vw;
			margin-left: auto;
			margin-right: auto;
			margin-bottom: 50rpx;
			height: 468rpx;
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
