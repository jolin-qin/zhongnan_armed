// pages/resultPage/resultPage.js
const app = getApp()
import API from "../../utils/api.js"
import common from "../../utils/common.js"
Page({

    /**
     * 页面的初始数据
     */
    data: {
        imgUrl: API.imgUrl, //服务器静态图片地址
        result: false,//答题结果
        resultObj: {},////答题结果对象
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        console.log(app.globalData.testResult)
        this.setData({
            resultObj: app.globalData.testResult
        })
        //根据相差分数判断显示打靶还是再次答题
        if (app.globalData.testResult.testScore >= 80) {
            this.setData({
                result: true
            })
        } else {
            this.setData({
                result: false
            })
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
        common.request(API.saveBehaviorApi, {
            openId: app.globalData.openId
        }).then((res) => {
            console.log("保存用户答题行为成功啦:" ,res)
            wx.reLaunch({
                url: '/pages/answerQuestionPage/answerQuestionPage'
            })
        })
    },
    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

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