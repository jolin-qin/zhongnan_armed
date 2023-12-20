// pages/barrage/barrage.js
const app = getApp()
import API from "../../../utils/api.js"
import common from "../../../utils/common.js"
Page({

    /**
     * 页面的初始数据
     */
    data: {
        imgUrl: API.imgUrl,//服务器静态图片地址
        active: 0,//默认选中第一个
        list: [], //AR历史列表
				myList: [], //与我相关的照片
        isDisabled: false,
        showPicture: '',
        themeId: '2',
        setInter: null,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.aiPhotoFun()
				this.aiPhotoFun('my')
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
    
    //获取历史合影
    aiPhotoFun(type) {
			let requestData = {
				rowCout: 20,
				proType: '0'
			}
			if (type === 'my') {
				requestData.userId = app.globalData.userId
			}
			common.request(API.photoAIlistApi, requestData, 'application/x-www-form-urlencoded').then((res) => {
					console.log("AI合影列表接口成功啦:" ,res)
					if (res.code === 200) {
							if (res.data.length > 0) {
								if (type === 'my') {
									this.setData({ myList: res.data })
								} else {
									this.setData({ list: res.data })
								}
							}
					}
			})
    },
    chooseTheme(e) {
        let index = e.currentTarget.dataset.index
        let id = e.currentTarget.dataset.id
        this.setData({
            active: index,
            themeId: id
        })
    },
		goDetailPage(e) {
			let { index, type } = e.target.dataset
			if (type === 'my') {
				wx.navigateTo({
					url: `/pages/guoFang/AIphotoDetail/AIphotoDetail`,
					success: (res) => {
						res.eventChannel.emit('getData', [this.data.myList, index])
					}
				})
			} else {
				wx.navigateTo({
					url: `/pages/guoFang/AIphotoDetail/AIphotoDetail`,
					success: (res) => {
						res.eventChannel.emit('getData', [this.data.list, index])
					}
				})
			}
			
		},
    
    //显示大图(历史合影记录)
    viewBigPic(e) {
        let url = e.target.dataset.url
        let index = e.target.dataset.index
        let arr = []
        url.forEach((item) => {
            arr.push(item.img)
        })
        wx.previewImage({
				current: url[index].img, // 当前显示图片的http链接
				urls: arr // 需要预览的图片http链接列表
			})
    },
     //最新一张合影放大图
     bigShow(e) {
        let url = e.target.dataset.url
        wx.previewImage({
				urls: [url] // 需要预览的图片http链接列表
		})
    },
    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {
        // this.setData({
        //     isDisabled: true
        // })
    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {
        // this.endSetInter()
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