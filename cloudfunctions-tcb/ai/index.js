'use strict';
exports.main = async (event, context) => {
	//event为客户端上传的参数
	console.log('event : ', event)
	const APIKey = 'EfWXbYeF8q9fwikmtG3DWjGa'
	const SecretKey = 'KpmakAHWYmhtTNABijA3qoOMQtLgOfqg'
	const {type, b64, data, access_token, classify} = event
	//返回数据给客户端
	switch (type){
		case 'get-token':
			const tokenData = await  uniCloud.httpclient.request(
				'https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id='+APIKey+'&client_secret='+SecretKey+'&',
				{
					dataType: 'json'
				},
			 )
			return tokenData;
		case 'ai':
			const aiData = await  uniCloud.httpclient.request(
				'https://aip.baidubce.com/rest/2.0/image-classify/'+(classify==='advanced_general'||classify==='dish'||classify==='logo'?'v2/':'v1/')+classify+'?access_token='+access_token,
				{
					method:'POST',
					data,
					dataType:'json'
				},
			 )
			return aiData;
		default:
			break;
	}
};
