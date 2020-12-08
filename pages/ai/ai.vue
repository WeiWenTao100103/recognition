<template>
	<view class="content">
		<template v-if="words_result.length===0">
			<image  class="upload" :src="url+'ocr/upload.png'"></image>
			<button type="primary" v-if="type!=='idcard'" @click="checkImg">开始识别</button>
		</template>
		<view class="ai" v-else>
			<image @click="checkImg" class="image_src" :src="image_src" :style="{'height': image_height+'rpx'}"></image>
		</view>
		<view class="up" v-if="words_result.length" @click="this.$refs.words_result.open();">
			<image  :src="url+'ocr/up.png'"></image>
		</view>
		<uni-popup ref="words_result" type="bottom" >
			<view class="down" @click="this.$refs.words_result.close();">
				<image :src="url+'ocr/down.png'" src="/static/down.png"></image>
			</view>
			<scroll-view class="words_result" scroll-y="true">
				<view class="item" v-for="(item,index) in words_result" :key="index">
					<view class="text">{{item.name}}</view>
					<view class="baike" v-if="item.baike_info">
						<image class="image_url" v-if="item.baike_info.image_url" :src="item.baike_info.image_url" mode=""></image>
						<view class="description" v-if="item.baike_info.description">
							{{item.baike_info.description}}
						</view>
						
					</view>
					<view class="baike" v-if="item.hasdetail&& type==='redwine'">
						<view class="detail">英文名:{{item.wineNameEn}} </view>
						<view class="detail">产  地:{{item.countryCn}}-{{item.regionCn}}-{{item.wineryCn}}  </view>
						<view class="detail">色  泽:{{item.color}}</view>
						<view class="description">{{item.description}}</view>
					</view>
				</view>
			</scroll-view>
		</uni-popup>
	</view>
</template>

<script>
	import {image2base64} from "../../utils/index.js";
	import uniPopup from '@/components/uni-popup/uni-popup.vue';
	export default {
		components: {
			uniPopup
		},
		data() {
			return {
				access_token: '',
				image_src: '',
				image_height: 0,
				select:false,
				words_result:[],
				type:'advanced_general'
			}
		},
		onLoad(option) {
			this.type = option.type
			this.getToken();
		},
		methods:{
			getToken(){
				uniCloud.callFunction({
					name:'ai',
					data:{
						type:'get-token'
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
						this.ai(img)
					}
				})
			},
			getImageInfo(img){
				new Promise(resolve=>{
					wx.getImageInfo({
					  src: img,
					  success :res=>{
						this.image_height = res.height/(res.width/750)
						this.image_src = img
						resolve()
					  }
					})
				})
			},
			ai(img){
				let data = {
					type:'ai',
					access_token: this.access_token,
					classify: this.type,
					data:{
						image: img,
						baike_num : 1
					}
				}
				uniCloud.callFunction({
					name:'ai',
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
						console.log( res.result.data)
						this.$refs.words_result.open()
						wx.hideLoading()
						this.format(res.result.data)
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
				if(this.type==='advanced_general'){
					this.words_result = data.result.filter(item=>item.score>0.5).map(item=>{
						return {
							name:item.keyword,
							baike_info:item.baike_info
						}
					})
				}else if(this.type==='animal'){
					this.words_result = data.result.filter(item=>item.score>0.2)
				}else if(this.type==='plant'){
					this.words_result = data.result.filter(item=>item.score>0.2)
				}else if(this.type==='classify/ingredient'){
					this.words_result = data.result.filter(item=>item.score>0.2)
				}else if(this.type==='dish'){
					this.words_result = data.result.filter(item=>item.probability>0.2)
				}else if(this.type==='redwine'){
					if(data.result.hasdetail){
						this.words_result = [{name:data.result.wineNameCn,...data.result}]
					}else{
						this.words_result = [{name:data.result.wineNameCn}]
					}
				}else if(this.type==='currency'){
					this.words_result = [{name:`${data.result.currencyDenomination|| ''}${data.result.currencyName}`}]
				}else if(this.type==='logo'){
					this.words_result = data.result.filter(item=>item.probability>0.2)
				}else if(this.type==='landmark'){
					this.words_result = [{name:data.result.landmark}]
				}
			}
		}
	}
</script>
<style lang="scss">
	.uni-transition{
		background: #fff;
	}
</style>
<style lang="scss">
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		.upload {
			width:  256rpx;
			height: 256rpx;
			margin-top: 240rpx;
			margin-left: auto;
			margin-right: auto;
			margin-bottom: 128rpx;
		}
		.ai{
			text-align: center;
			.image_src{
				width: 750rpx;
			}
		}
		.up{
			position: fixed;
			left: 0;
			bottom: env(safe-area-inset-bottom);
			width: 100%;
			text-align: center;
			background: #fff;
			image{
				width: 48rpx;
				height: 48rpx;
			}
		}
		.down{
			padding-top: 24rpx;
			margin-bottom: -2rpx;
			text-align: center;
			background: #fff;
			image{
				width: 48rpx;
				height: 48rpx;
			}
		}
		.words_result{
			margin-bottom: -2rpx;
			max-height: 75vh;
			background: #fff;
			padding:0 8rpx 24rpx;
			box-sizing: border-box;
			text-align: center;
			.item{
				width: 100%;
				padding: 12rpx;
				box-sizing: border-box;
				border-bottom: 1rpx solid #cdcdcd;
				.text{
					font-size: 36rpx;
					color: #4CA2FF;
					text-align: left;
					padding-bottom: 8rpx;
				}
				.baike{
					.image_url{
						width: 100%;
					}
					.detail{
						font-size: 32rpx;
						color: #333;
						text-align: left;
					}
					.description{
						font-size: 32rpx;
						color: #333;
						text-align: left;
						text-indent: 2em;
					}
				}
			}
			.item:last-child{
				border-bottom:none;
			}
		}
	}

</style>