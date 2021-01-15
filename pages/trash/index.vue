<template>
	<view class="content">
		<image class="banner" :src="url+'trash/banner.png'" ></image>
		<view class="searchItem">
			<view class="page_row">
				<view class="search">
					<view class="search_arr">
						<icon class="searchcion" size="20" type="search"></icon>
						<input v-model="keyword" class="searchinput" placeholder="请输入关键字"></input>
					</view>
				</view>
				<view @click="fetchBookData(keyword)" class="sousuo">搜索</view>
			</view>
			 <view @click="takephoto" class="viSearch">
				<image class="imageIcon" mode="widthFix" :src="url+'trash/photo.png'"></image>
				<view class="viMiddle">
					<text>拍照识别</text>
				</view>
				<image class="moreIcon" mode="widthFix" :src="url+'trash/gengduo.png'"></image>
			</view>
			<view class="newsearch">
				<view class="title">热门搜索</view>
				<view>
					<span v-for="item in hotSearch"  @click="fetchBookData(item)" class="item" :key="item">{{item}}</span>
				</view>
			</view>
			<view class="table">
				<text>生活垃圾基本分类</text>
				<view class="item">
					<view class="list" v-for="item in tableList" :key="item.key">
						<image mode="widthFix" :src="url+item.imageSrc"></image>
					</view>
				</view>
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
	import {image2base64} from "../../utils/index.js";
	export default {
		data() {
			return {
				location:'',
				keyword: '',
				hotSearch:['口罩','手机','鞋','水果','塑料袋','锂电池'],
				tableList:[
					{
					    "key": "household",
					    "name": "湿垃圾",
					    "abbr": "湿垃圾",
					    "intro": "是指易腐的生物质废弃物。包括剩菜剩饭、瓜皮果核、花卉绿植、肉类碎骨、过期食品、餐厨垃圾等。",
					    "requirements": [
					        "纯流质的食物垃圾，如牛奶等，应直接倒进下水口",
					        "有包装物的湿垃圾应将包装物取出后分类投放，包装物请投放到对应的可回收物容器或干垃圾容器"
					    ],
					    "color": {
					        "r": 149,
					        "g": 108,
					        "b": 88
					    },
					    "imageSrc": "trash/household_food_waste_icon.png"
					},
					{
					    "key": "residual",
					    "name": "干垃圾",
					    "abbr": "干垃圾",
					    "intro": "是指除有害垃圾、可回收物、湿垃圾以外的其他生活废弃物。",
					    "requirements": [
					        "尽量沥干水分",
					        "难以辨识类别的生活垃圾投入干垃圾容器内"
					    ],
					    "color": {
					        "r": 45,
					        "g": 41,
					        "b": 38
					    },
					    "imageSrc": "trash/residual_waste_icon.png"
					},
					{
					    "key": "recyclable",
					    "name": "可回收物",
					    "abbr": "可回收物",
					    "intro": "是指适宜回收和可循环再利用的废弃物。主要包括废玻璃、废金属、废塑料、废纸张、废织物等。",
					    "requirements": [
					        "轻投轻放",
					        "清洁干燥，避免污染",
					        "废纸尽量平整",
					        "立体包装请清空内容物，清洁后压扁投放",
					        "有尖锐边角的，应包裹后投放"
					    ],
					    "color": {
					        "r": 0,
					        "g": 60,
					        "b": 113
					    },
					    "imageSrc": "trash/recyclable_waste_icon.png"
					},
					{
					    "key": "hazardous",
					    "name": "有害垃圾",
					    "abbr": "有害垃圾",
					    "intro": "是指对人体健康或者自然环境造成直接或者潜在危害的零星废弃物，单位集中产生的除外。主要包括废电池、废灯管、废药品、废油漆桶等。",
					    "requirements": [
					        "充电电池、纽扣电池、蓄电池投放时请注意轻放",
					        "油漆桶、杀虫剂如有残留请密闭后投放",
					        "荧光灯、节能灯易破损请连带包装或包裹后轻放",
					        "废药品及其包装连带包装一并投放"
					    ],
					    "color": {
					        "r": 249,
					        "g": 66,
					        "b": 58
					    },
					    "imageSrc": "trash/hazardous_waste_icon.png"
					}
				],
				access_token:'',
				PData:[]
			}
		},
		onLoad() {
			this.getToken();
		},
		methods: {
			onShareAppMessage: function (res) {
			    return {
			      title: '智能垃圾分类识别',
			      path: '/pages/trash/index',
				  imageUrl:this.url+'trash/banner.png'
			    }
			 },
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
			fetchBookData(keyword){
				wx.navigateTo({
					url: `/pages/trash/trash?location=${this.location}&keyword=${keyword||this.keyword}`,
				})
			},
			takephoto(){
				wx.chooseImage({
					count:1,
					success:async (res) => {
						const url = res.tempFilePaths[0]
						const img = await image2base64(url)
						wx.showLoading({
						  title: '正在识别',
						})
						this.ai(img)
					}
				})
			},
			ai(img){
				let data = {
					type:'ai',
					access_token: this.access_token,
					classify: 'advanced_general',
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
						wx.hideLoading()
						console.log(res.result.data.result)
						this.PData=res.result.data.result.filter(item=>item.score>0.2).map(item=>item.keyword)
						wx.showActionSheet({
						  itemList: this.PData,
						  success :(res)=> {
						    console.log(res.tapIndex)
							this.fetchBookData(this.PData[res.tapIndex])
						  },
						  fail (res) {
						    console.log(res)
						  }
						})

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
		}
	}
</script>

<style lang="scss" scoped>
	.content {
		background: #f0f0f0;
		 min-height: 100vh;
		 overflow: hidden;
		.banner{
			width: 100%;
			height: 350rpx;
		}
		.searchItem{
			margin: 32rpx 20rpx 20rpx;
			border-radius: 20rpx;
			.page_row {
				background: #fff;
			    display: flex;
			    flex-direction: row;
			    padding-top: 20rpx;
				.location{
					display: flex;
					font-size: 24rpx;
					align-items: center;
					padding-left: 12rpx;
					image{
						width: 40rpx;
						height: 40rpx;
					}
				}
				.search{
					flex: 1;
				}
				.search_arr {
				    border: 1px solid #1c87ce;
				    border-radius: 10rpx;
				    margin-left: 20rpx;
				    background: #f6f6fa;
					input {
					    margin-left: 80rpx;
					    height: 80rpx;
					    border-radius: 12rpx;
					}
				}
				
				.sousuo {
				    margin:0 16rpx;
				    width: 15%;
				    line-height: 80rpx;
					height: 80rpx;
				    text-align: center;
					box-sizing: border-box;
				    border: 1px solid #1c87ce;
				    border-radius: 10rpx;
				    background: #f6f6fa;
				}

				.searchcion {
				    margin: 20rpx;
				    position: absolute;
				    left: 40rpx;
				    z-index: 2;
				    width: 40rpx;
				    height: 40rpx;
				    text-align: center;
				}
			}
			.viSearch{
				background: #fff;
				width: 100%;
				height: 150rpx;
				padding: 64rpx 20rpx;
				box-sizing: border-box;
				display: flex;
				align-items: center;
				.imageIcon{
					height: 92rpx;
					width: 92rpx;
				}
				.moreIcon{
					height: 32RPX;
					width: 16rpx;
				}
				.viMiddle {
				    flex: 1;
					padding: 0 24rpx;
				}
			}
			.newsearch {
			    margin: 20rpx;
			    padding-top: 15rpx;
				.title {
				    font-size: 80%;
				    font-weight: 800;
					padding-bottom: 20rpx;
				}
				.item {
					margin-right: 16rpx;
					background: #fff;
					border: 2px solid #fff;
					border-radius: 8rpx;
					padding-left: 8rpx;
					padding-right: 8rpx;
					
				}
			}
			.table{
				background: #fff;
				margin: 40rpx 10rpx 10rpx;
				border-radius: 20rpx;
				text {
				    width: 100%;
				    display: inline-block;
				    text-align: center;
				    padding-top: 40rpx;
				    padding-bottom: 6rpx;
				    font-size: 120%;
				    font-weight: 800;
				}
				.item {
				    margin: 40rpx 8rpx 0;
				    padding-bottom: 40rpx;
					display: flex;
					justify-content: space-between;
					.list {
					    width: 23%;
					    display: inline-block;
					    vertical-align: middle;
					    margin: 1%;
						image {
						    width: 100%;
						    display: inline-block;
						    vertical-align: middle;
						    margin: 0rpx;
						}
					}
					
				}
			}
		}
	}

	
</style>
