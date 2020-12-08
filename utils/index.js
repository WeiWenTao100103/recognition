export const image2base64 = img=>{
	return new Promise(reslove=>{
		wx.getFileSystemManager().readFile({
			filePath:img,
			encoding:'base64',
			success: (res) => {
				reslove(res.data)
			}
		})
	})
}