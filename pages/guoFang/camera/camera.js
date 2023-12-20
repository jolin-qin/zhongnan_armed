// pages/camera/camera.js
// 获取应用实例
const app = getApp()
const innerAudioContent = wx.createInnerAudioContext()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        src: ''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

    },
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },
    takePhoto() {
			innerAudioContent.src = 'https://zntest.wxumi.com/guofang/audio/clickaudio.mp3'
			innerAudioContent.play()
        const ctx = wx.createCameraContext()
        ctx.takePhoto({
            quality: 'normal',
            success: (res) => {
                console.log("拍照返回值:", res)
                // this.setData({ src: res.tempImagePath })
                app.globalData.tempImagePath = res.tempImagePath
                wx.navigateBack()
            }
        })
    },
    error(e) {
        // console.log("拉起相机报错了：", e.detail)
				wx.showToast({
					icon: 'none',
					title: '请检查有无使用相机权限'
				})
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

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