'use strict';
const {
    formParser
} = require('../common/form-data-utils/index.js')
exports.main = async (event, context) => {
	const fs = require("fs");
	
	const file = formParser(event).file
	// 注意目前仅腾讯云支持云函数往云存储传文件
	const res = uniCloud.uploadFile({
		cloudPath: file.filename,
		fileContent: file.fileContent
	})
	return res
	// const url =await uniCloud.getTempFileURL({
	//     fileList:[result.fileID]
	// });
	
	// return url.fileList
};
