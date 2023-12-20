// pages/resultPage/resultPage.js
const app = getApp()
import API from "../../../utils/api.js"
import common from "../../../utils/common.js"
const innerAudioContent = wx.createInnerAudioContext()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        imgUrl: API.imgUrl, //服务器静态图片地址
        result: false,//答题结果
        resultObj: {},//用户信息
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            resultObj: app.globalData.userInfo
        })
				console.log("app:", app.globalData.userInfo)
        //是否有玩AI军装照的资格
        if (app.globalData.userInfo.isAIok === '0') {
            this.setData({ result: false })
        } else {
            this.setData({ result: true })
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
		goPage() {
			innerAudioContent.src = 'https://zntest.wxumi.com/guofang/audio/clickaudio.mp3'
			innerAudioContent.play()
			//开始拍照
			setTimeout(() => {
				if (this.data.result) {
					wx.navigateTo({
						url: '/pages/guoFang/photoEntrance/photoEntrance'
					})
				} else {
					//去答题
					wx.reLaunch({
					    url: '/pages/guoFang/answerQuestionPage/answerQuestionPage'
					})
				}
			}, 500)
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
    
    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {
			innerAudioContent.pause()
    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {
			innerAudioContent.pause()
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