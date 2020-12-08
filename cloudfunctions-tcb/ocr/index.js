'use strict';
exports.main = async (event, context) => {
	
	const {type, data, access_token, classify} = event
	
	switch (type){
		
		case 'get-ocr-token':
			const ocrToken = await  uniCloud.httpclient.request(
				'https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=2NSeerdnNUAsS5DGuO3792Zf&client_secret=GyDn2G34FD1yH4ptRFnanT5tjklERUoP&',
				{
					dataType: 'json'
				},
			 )
			return ocrToken;
		case 'ocr':
			const ocrData = await  uniCloud.httpclient.request(
				'https://aip.baidubce.com/rest/2.0/ocr/v1/'+classify+'?access_token='+access_token,
				{
					method:'POST',
					data,
					dataType:'json'
				},
			 )
			return ocrData;
		default:
			break;
	}
	
};
