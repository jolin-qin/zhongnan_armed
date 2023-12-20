var app = getApp();
import API from "api.js";
const formatDate = function (datetime) {
	var arr = datetime.split("T");
	var d = arr[0];
	var darr = d.split('-');

	var t = arr[1];
	var tarr = t.split('.000');
	var marr = tarr[0].split(':');

	var dd = parseInt(darr[0]) + "-" + toLength(parseInt(darr[1])) + "-" + toLength(parseInt(darr[2])) + " " + toLength(parseInt(marr[0])) + ":" + toLength(parseInt(marr[1])) + ":" + toLength(parseInt(marr[2]));
	return dd
}

const toLength = function (str) {
	return str.toString().length > 1 ? str : '0' + str
}

const ajax = function(url, data, callback) {
	var parm = JSON.stringify(data)
	let datas = {
		'content-type': 'application/json', // 默认值
	}
	wx.request({
		url: url, //仅为示例，并非真实的接口地址
		method: 'POST',
		data: parm,
		header: datas,
		success: function (res) {
			callback(res)
		},
		fail: function (res) {
			console.log(res)
		}
	})
}
// 自己封装的请求函数 2021-03-17
const request = function(url, data, headerType = 'application/json') {
	let parm = null
	if (headerType === 'application/x-www-form-urlencoded') {
		parm = data
	} else {
		parm = JSON.stringify(data)
	}
	let token = app.globalData.token
	let headers = {
		'content-type': headerType, 
	}
	if (token) {
		headers = {
			'content-type': headerType,
			'Authorization': "Bearer " + token
		}
	}
	return new Promise(function(resolve, reject) {
		wx.request({
			url: url, 
			method: 'POST',
			data: parm,
			header: headers,
			success: (res) => {
				if (res.data.code == 200 || res.data.code == 500){
					resolve(res.data)
				} else {
					wx.showToast({
						title: res.data.message,
						icon: 'none',
						duration: 2000
					})
				}
			},
			fail: (err) => {
				wx.showToast({
					title: '' + err.errMsg,
					icon: 'none',
					duration: 2000
				})
				reject(err)
			}
		})
	})
}
// 封装请求兑奖接口函数
const redeemFun = function() {
	request(API.exchangeFun, {
		robotId: app.globalData.robotId,
		openId: app.globalData.openId
	}).then((res) => {
		console.log("调用兑奖二维码接口成功:" ,res)
		if (res.code === 200) {
			wx.showToast({
				title: '扫码成功，在前屏上选择需要兑换的奖品吧',
				icon: 'none',
				duration: 3000
			})
		} else {
			wx.showToast({
				title: '' + message,
				icon: 'none',
				duration: 3000
			})
		}
	})
}
// 封装弹幕函数
const danMu = function() {
	return new Promise(function(resolve, reject){
		request(API.requestBarrage, {
			companyId: app.globalData.companyId
		}).then((res) => {
			resolve(res)
		})
	})
}
// 封装的扫一扫
const saoyisao = function() {
	let self = this;
	// this.setData({ showPopup: false });
	wx.scanCode({
		// onlyFromCamera: true,
		scanType: 'qrCode',
		success: (res) => {
			console.log("扫码res:", res)
			if (res.path) {
				let len = (res.path).split("scene=")
				let value = getCode(unescape(len[1]))
				//value为获取到二维码传给我的参数
				
				let codeType = value.get("t")
				//扫答题二维码
				if (codeType === "1") {
					//扫的答题二维码
					wx.showToast({
						title: '请扫射击训练码',
						icon: 'none',
						duration: 2000
					})
				} else if (codeType === "2") {
					//扫模拟射击训练二维码
					//t为区分扫哪个位置的码
					app.globalData.positionId = value.get("pId")
					wx.reLaunch({
						url: '/pages/shootStart/shootStart'
					})
				}
			} else {
				wx.showToast({
					title: '不能识别的二维码',
					icon: 'none',
					duration: 2000
				})
			}
		}
	})
}
const getCode = function (str) {
	var spl = str.split("&");
	var map = new Map();
	for (var i in spl) {
		var a = spl[i].split("=");
		map.set(a[0], a[1])
	}
	return map
}
//时间处理函数
const timeHandlerFun = function(timeStr) {
	timeStr = timeStr.toString()
	let str = ''
	if (timeStr.length > 10) {
		str = timeStr.substring(0, 10)
	} else {
		str = timeStr
	}
	return str
}
const Toast = function(str, time = 1500) {
	wx.showToast({
		title: str,
		icon: 'none',
		duration: time
	})
}
export default {
	ajax,
	request,
	saoyisao,
	getCode,
	danMu,
	timeHandlerFun,
	Toast
}