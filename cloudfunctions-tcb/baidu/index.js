'use strict';

const axios = require('axios');
exports.main = async (event, context) => {
	//event为客户端上传的参数
	// console.log('event : ', event)
	// const APIKey = 'EfWXbYeF8q9fwikmtG3DWjGa'
	const APIKey = '2NSeerdnNUAsS5DGuO3792Zf'
	// const SecretKey = 'KpmakAHWYmhtTNABijA3qoOMQtLgOfqg'
	const SecretKey = 'GyDn2G34FD1yH4ptRFnanT5tjklERUoP'
	const {type, b64, access_token} = event
	
	switch (type){
		case 'gettoken':
			const tokenData = await  uniCloud.httpclient.request(
				'https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id='+APIKey+'&client_secret='+SecretKey+'&',
				{
					dataType: 'json'
				},
			 )
			return tokenData;
		case 'ocr':
			const ocrData = await  uniCloud.httpclient.request(
				'https://aip.baidubce.com/rest/2.0/ocr/v1/general?access_token='+access_token,
				{
					method:'POST',
					data:{
						image: b64
					},
					dataType:'json'
				},
			 )
			return ocrData;
		default:
			break;
	}
	
	//返回数据给客户端
};
