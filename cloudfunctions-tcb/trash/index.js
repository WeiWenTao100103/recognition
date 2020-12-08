'use strict';
exports.main = async (event, context) => {
	//event为客户端上传的参数
	const {keyword} = event
	const trashData = await  uniCloud.httpclient.request(
		"https://sffc.sh-service.com/wx_miniprogram/sites/feiguan/trashTypes_2/Handler/Handler.ashx?a=EXC_QUERY&kw="+keyword,
		{
			dataType:'json'
		},
	 )
	 if(trashData.status!=200)return trashData;

	 let finalData={
	    keyword:event.keyword,
	    matched:null,
	    similars:[]
	   };
	if(trashData.data.query_result_type_1){
	      finalData.matched={
	      "typename":trashData.data.query_result_type_1.TypeKey
	      }
	}
	 if(trashData.data.query_result_type_m1){
	   for(let i=0;i<trashData.data.query_result_type_m1.trashTypes.length;i++){
	    finalData.similars.push({
	     "keywords":trashData.data.query_result_type_m1.trashTypes[i]["Name"],
	     "typename":trashData.data.query_result_type_m1.trashTypes[i]["TypeKey"]
	    });
	   }
	}
	  
	return finalData;
};
