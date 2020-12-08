<template>
	<view class="content">
		<template v-if="image_height===0">
			<image  class="upload"  :src="url+'ocr/upload.png'"></image>
			<button type="primary" v-if="type!=='idcard'" @click="checkImg">开始识别</button>
		</template>
		<div class="ocr" v-else>
			<!-- <text class="header">点击图片可再次选择图片</text> -->
			<image @click="checkImg" class="image_src" :src="image_src" :style="{'height': image_height+'rpx'}"></image>
			<template v-if="type=== 'general'||type=== 'accurate'">
				<text
				 class="flag"
				 v-for="(item,index) in words_result" 
				 :key="index"
				 v-if="item.location"
				 :style="{top: item.location.top+'rpx',left: item.location.left+'rpx'}"
				 >{{item.words}}</text>
			</template>
			 <view class="up" v-if="words_result.length" @click="this.$refs.words_result.open();">
			 	<image :src="url+'ocr/up.png'"></image>
			 </view>
		</div>
		<view class="tab" v-if="type==='idcard'">
			<button type="primary" size="mini" @click="id_card_side='front';checkImg()">正面</button>
			<button type="primary" size="mini" @click="id_card_side='back';checkImg()">反面</button>
		</view>
		<uni-popup ref="words_result" type="bottom">
			<view class="down" @click="this.$refs.words_result.close();">
				<image :src="url+'ocr/down.png'" ></image>
			</view>
			<scroll-view class="words_result" scroll-y="true">
				<view class="item" v-for="(item,index) in words_result" :key="index">
					<text class="text">{{item.words}}</text>
					<text class="copy" v-if="!select" @click="setClipboardData(item.words)">复制</text>
					<text class="select" v-else @click="checkItem(item)" :class="item.select?'active':''"></text>
				</view>
			</scroll-view>
			<view class="popup_bottom" v-if="!select">
				<button class="mini-btn" type="primary" size="mini" @click="allCopy">全部复制</button>
				<button class="mini-btn" type="primary" size="mini" @click="select=!select">选择复制</button>
			</view>
			<view class="popup_bottom" v-else>
				<button class="mini-btn" type="primary" size="mini" @click="selectCopy">复制</button>
				<button class="mini-btn" type="default" size="mini" @click="select=!select">取消</button>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import {image2base64} from "../../utils/index.js";
	import uniPopup from '@/components/uni-popup/uni-popup.vue'
	import uniPopupMessage from '@/components/uni-popup/uni-popup-message.vue'
	import uniPopupDialog from '@/components/uni-popup/uni-popup-dialog.vue'
	export default {
		components: {
			uniPopup,
			uniPopupMessage,
			uniPopupDialog
		},
		data() {
			return {
				access_token: '',
				image_height: 0,
				image_ratio: 1,
				image_src: '',
				select:false,
				words_result:[],
				type:'general',
				id_card_side:'front'
			}
		},
		onLoad(option) {
			this.type = option.type
			this.getToken();
		},
		methods: {
			checkItem(item){
				item.select= !item.select
			},
			getToken(){
				uniCloud.callFunction({
					name:'ocr',
					data:{
						type:'get-ocr-token'
					},
					success: (res) => {
						this.access_token = res.result.data.access_token
					}
				})
			},
			 checkImg(){
				wx.chooseImage({
					count:1,
					success:async (res) => {
						this.url = res.tempFilePaths[0]
						const img = await image2base64(this.url)
						wx.showLoading({
						  title: '正在识别',
						})
						await this.getImageInfo(this.url);
						this.ocr(img)
					}
				})
			},
			getImageInfo(img){
				new Promise(resolve=>{
					wx.getImageInfo({
					  src: img,
					  success :res=>{
						this.image_ratio = (res.width/750)
						this.image_height = res.height/this.image_ratio
						this.image_src = img
						resolve()
					  }
					})
				})
			},
			ocr(img){
				let data = {
					type:'ocr',
					access_token: this.access_token,
					classify: this.type,
					data:{
						image: img,
						detect_direction : true
					}
				}
				if(this.type==='idcard'){
					data.data.id_card_side =this.id_card_side
				}
				uniCloud.callFunction({
					name:'ocr',
					data: data,
					success: (res) => {
						if(res.result.data.error_code){
							wx.showToast({
							  title: res.result.data.error_msg,
							  icon: 'none',
							  duration: 2000
							})
							return
							wx.hideLoading()
						}
						this.format(res.result.data)
						wx.hideLoading()
					},
					fail: (err) => {
						wx.showToast({
						  title: err.errMsg,
						  icon: 'none',
						  duration: 2000
						})
						return
						wx.hideLoading()
					}
				})
			},
			format(data){
				this.$refs.words_result.open();
				if(this.type==='general'||this.type==='accurate'){
					this.words_result =data.words_result.map(item=>{
						if(item.location){
							item.location.top = item.location.top/this.image_ratio
							item.location.left = item.location.left/this.image_ratio
							item.select=false
						}
						return item
					})
				}
				// else if(this.type === 'idcard'){
				// 	this.words_result= data.words_result
				// }else if(this.type === 'driving_license'){
				// 	this.words_result= data.words_result
				// }else if(this.type === 'business_license'){
				// 	this.words_result= data.words_result
				// }else if(this.type === 'household_register'){
				// 	this.words_result= data.words_result
				// }else if(this.type === 'passport'){
				// 	this.words_result= data.words_result
				// }
				else if(this.type === 'vat_invoice'){
					this.words_result= Object.keys(data.words_result).map(item=>{
						return {
							key : item,
							words : typeof data.words_result[item] ==='string'? data.words_result[item] : ''
						}
					}).filter(e=>e.words)
				}else if(this.type==='bankcard'){
					this.words_result=Object.keys(data.result).map(item=>{
						return {
							key : item,
							words : data.result[item]
						}
					}).filter(e=>e.words)

				}else{
					this.words_result= data.words_result
				}
				
				
			},
			allCopy(){
				this.setClipboardData(this.words_result.map(item=>item.words).join())
			},
			selectCopy(){
				this.setClipboardData(this.words_result.filter(item=>item.select).map(item=>item.words).join())
			},
			setClipboardData(data){
				wx.setClipboardData({
				  data: data,
				  success (res) {
				  }
				})
			}
		}
	}
</script>
<style lang="scss">
	.uni-transition{
		background: #fff;
	}
</style>
<style lang="scss" scoped>
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		.tab{
			padding-bottom: 88rpx;
			width: 100%;
			display: flex;
			justify-content: space-around;
		}
	}
	
	.upload {
		width:  256rpx;
		height: 256rpx;
		margin-top: 240rpx;
		margin-left: auto;
		margin-right: auto;
		margin-bottom: 128rpx;
	}
	.ocr{
		text-align: center;
		position: relative;
	}
	.ocr .flag{
		position: absolute;
		font-size: 20rpx;
	}
	.ocr .image_src{
		width: 750rpx;
	}
	.ocr .up{
		position: fixed;
		left: 0;
		bottom: env(safe-area-inset-bottom);
		width: 100%;
		text-align: center;
		background: #fff;
	}
	.ocr .up image{
		width: 48rpx;
		height: 48rpx;
	}
	.words_result{
		margin-bottom: -2rpx;
		max-height: 70vh;
		background: #fff;
		padding:0 8rpx 24rpx;
		box-sizing: border-box;
		text-align: center;
	}
	.down{
		padding-top: 24rpx;
		margin-bottom: -2rpx;
		text-align: center;
		background: #fff;
	}
	.down image{
		width: 48rpx;
		height: 48rpx;
	}
	.popup_bottom{
		background: #fff;
		display: flex;
		justify-content: space-around;
		align-items: center;
		padding: 12rpx 0;
	}
	.words_result .item{
		width: 100%;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 12rpx;
		box-sizing: border-box;
		border-bottom: 1rpx solid #cdcdcd;
	}
	.words_result .item:last-child{
		border-bottom:none;
	}
	.words_result .item .text{
		font-size: 24rpx;
		color: #4CA2FF;
		text-align: left;
	}
	.words_result .item .copy{
		border: 1px solid #ff0000;
		border-radius: 12rpx;
		padding: 0 12rpx;
		font-size: 20rpx;
		height: 40rpx;
		line-height: 40rpx;
		color: #333;
		min-width: 68rpx;
	}
	.words_result .item .select{
		width: 20rpx;
		height: 20rpx;
		border-radius: 50%;
		border: 1px solid #3B4144;
		
	}
	.words_result .item .active::after{
		content: '';
		width: 12rpx;
		height: 12rpx;
		border-radius: 50%;
		background-color: #FF0000;
	}
	.words_result .item .active{
		width: 20rpx;
		height: 20rpx;
		border-radius: 50%;
		border: 1px solid #ff0000;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.text-area {
		display: flex;
		justify-content: center;
	}

	.title {
		font-size: 36rpx;
		color: #8f8f94;
	}
</style>
