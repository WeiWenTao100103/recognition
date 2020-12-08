<template>
	<view class="content">
		<view class="searchItem">
			<view class="page_row">
				<view class="search">
					<view class="search_arr">
						<icon class="searchcion" size="20" type="search"></icon>
						<input v-model="keyword" class="searchinput" placeholder="请输入关键字"></input>
					</view>
				</view>
				<view @click="getData(keyword)" class="sousuo">搜索</view>
			</view>
		</view>
		<uni-collapse style="background: #fff;">
			<uni-collapse-item v-for="(item,index) in res" :key="index" :open="index==0" :showAnimation="true" :title="item.keyword.trim()">
				<Item :info="item"></Item>
			</uni-collapse-item>
		</uni-collapse>
		
	</view>
	
</template>

<script>
	import {image2base64} from "../../utils/index.js";
	import Item from "./trashItem.vue"
	export default {
		components:{
			Item
		},
		data() {
			return {
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
					    "imageSrc": "household_food_waste_icon.png"
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
					    "imageSrc": "residual_waste_icon.png"
					},
					{
					    "key": "recyclable",
					    "name": "可回收",
					    "abbr": "可回收",
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
					    "imageSrc": "recyclable_waste_icon.png"
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
					    "imageSrc": "hazardous_waste_icon.png"
					}
				],
				url : 'https://7463-tcb-ypzdcajvxcfsfgbd9be67-3f3589-1304337425.tcb.qcloud.la/trash/',
				res:[],
				keyword:''
			}
		},
		onLoad(option) {
			if(option.keyword){
				this.getData(option.keyword)
				this.keyword = option.keyword
			}
		},
		methods: {
			getData(keyword){
				if(!keyword) return
				wx.showLoading({
				  title: '正在识别',
				})
				uniCloud.callFunction({
					name:'trash',
					data:{
						keyword
					},
					success: (res) => {
						console.log(res)
						if(res.result.matched){
							const data=this.tableList.find(item=>item.name===res.result.matched.typename)
							data.keyword=res.result.keyword
							this.res = [data]
						}else if(res.result.similars){
							this.res=res.result.similars.map(item=>{
								const find = this.tableList.find(tab=>tab.name===item.typename)
								return{
									keyword:item.keywords.replace(/\n/g,''),
									...find
								}
							})
						}
						// 运动鞋?headers=[object Object]
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
				position: relative;
				height: 100rpx;
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
				    left: 20rpx;
				    z-index: 2;
				    width: 40rpx;
				    height: 40rpx;
				    text-align: center;
				}
			}
		}
	}

	
</style>
