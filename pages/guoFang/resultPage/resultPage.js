// pages/resultPage/resultPage.js
const app = getApp()
import API from "../../../utils/api.js"
import common from "../../../utils/common.js"
// const innerAudioContent = wx.createInnerAudioContext()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        imgUrl: API.imgUrl, //服务器静态图片地址
        result: false,//答题结果
        resultObj: {},//答题结果对象
				resultId: '',
				fromWhere: '',
				innerAudioContent: null
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({ innerAudioContent: wx.createInnerAudioContext() })
				if (options.id) {
					this.setData({
					    fromWhere: options.whereFrom
					})
					this.getFriendlyResult(options.id)
					
				} else {
					this.setData({
					    resultObj: app.globalData.testResult
					})
					//根据相差分数判断显示打靶还是再次答题
					if (app.globalData.testResult.testScore >= 80) {
					    this.setData({ result: true })
							this.data.innerAudioContent.src = 'https://zntest.wxumi.com/guofang/audio/success.mp3'
							this.data.innerAudioContent.play()
					} else {
					    this.setData({ result: false })
							this.data.innerAudioContent.src = 'https://zntest.wxumi.com/guofang/audio/fail.mp3'
							this.data.innerAudioContent.play()
					}
				}
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
			
			
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },
		getFriendlyResult(Id) {
		  common.request(API.getGuoFangResult, {
		    id: Id
		  }).then(res => {
				console.log("res:", res)
				this.setData({
				    resultObj: res.data
				})
				//如果是首页进来的，返回首页需要刷新,做个标识
				// if (this.data.fromWhere) {
				//   app.globalData.isRefresh = true
				// }
				if (res.data.testScore >= 80) {
					this.setData({ result: true })
					this.data.innerAudioContent.src = 'https://zntest.wxumi.com/guofang/audio/success.mp3'
					this.data.innerAudioContent.play()
				} else {
					this.setData({ result: false })
					this.data.innerAudioContent.src = 'https://zntest.wxumi.com/guofang/audio/fail.mp3'
					this.data.innerAudioContent.play()
				}
			})
		},
    //去打靶页
    goShooting(e) {
        wx.navigateTo({
            url: '/pages/shootStart/shootStart',
        })
    },
    // 调用扫一扫
    callScan() {
        common.saoyisao()
    },
    //再次答题
    answerAgain(e) {
        // common.request(API.saveBehaviorApi, {
        //     openId: app.globalData.openId,
		// 	proType: 1
        // }).then((res) => {
        //     console.log("保存用户答题行为成功啦:" ,res)
        // })
        wx.reLaunch({
            url: '/pages/guoFang/answerQuestionPage/answerQuestionPage'
        })
    },
    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {
			this.data.innerAudioContent.pause()
    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})