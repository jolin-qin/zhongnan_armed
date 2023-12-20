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
        list: [],
        isDisabled: false,
        showPicture: '',
        themeId: '2',
        setInter: null,
				index: 0,
				
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
			let urls = JSON.parse(decodeURIComponent(options.urls))
			console.log("jklj:",urls)
        this.setData({
					list: urls,
					index: Number(options.idx),
					showPicture: urls[options.idx].imgPath
				})
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
    //显示大图(历史合影记录)
    viewBigPic(e) {
        // let url = e.target.dataset.url
        let index = e.target.dataset.index
        let arr = []
        this.data.list.forEach((item) => {
            arr.push(item.imgPath)
        })
        wx.previewImage({
					current: this.data.list[index].imgPath, // 当前显示图片的http链接
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