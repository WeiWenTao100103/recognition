<template>
	<view class="content">
			<view class="imageSrc">
				<image mode="widthFix" :src="url+info.imageSrc"></image>
			</view>
			<view class="intro">
				{{info.intro}}
			</view>
			<view class="requirements">
				<view class="title">
					{{info.name}}投放指南：
				</view>
				<view class="item" v-for="item in info.requirements">
					{{item}}
				</view>
			</view>
		
	</view>
	
</template>

<script>
	import {image2base64} from "../../utils/index.js";
	export default {
		props:{
			info:{
				
			}
		},
		data() {
			return {
				open:false,
				url : 'https://7463-tcb-ypzdcajvxcfsfgbd9be67-3f3589-1304337425.tcb.qcloud.la/trash/',
			}
		},
		onLoad(option) {
			
		},
		methods: {
			
		}
	}
</script>

<style lang="scss" scoped>
	.content{
		background: #fff;
		padding: 20rpx;
		    box-sizing: border-box;
		.keyword{
			display: flex;
			justify-content: space-between;
			color: #2cb0e6;
			padding: 8rpx 0;
			image{
				width: 48rpx;
			}
		}
		.imageSrc{
			margin: 24rpx auto;
			text-align: center;
			image{
				width: 200rpx;
			}
		}
		.intro{
			padding: 12rpx 24rpx;
			background: #ededed;
			font-size: 36rpx;
			border-radius: 12rpx;
		}
		.requirements{
			margin-top: 24rpx;
			    font-weight: 600;
				color: #333;
			.title{
				font-size: 36rpx;
				
			}
			.item{
				text-indent: 2em;
				padding-top: 12rpx;
				color: #4d4d4d;
				font-size: 32rpx;
			}
		}
	}
</style>
