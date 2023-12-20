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
        resultObj: {},////答题结果对象
				updataImg: '', //选择的照片
				cameraStatus: true, //camera标签显示
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {
        if (app.globalData.tempImagePath) {
            this.setData({ updataImg: app.globalData.tempImagePath })
            app.globalData.tempImagePath = ''
        }
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
    
		goTakePhotoPage() {
			wx.navigateTo({
				url: '/pages/guoFang/camera/camera'
			})
		},
		// 选择图片
		uploadImg() {
			let that = this
			wx.chooseMedia({
			  count: 1,
			  mediaType: ['image'],
			  sourceType: ['album'],
			  success: async (res) => {
			    console.log("res:", res)
                let uploadObj = res.tempFiles[0]
                wx.getImageInfo({
                    src: uploadObj.tempFilePath,
                    success (res) {
                        console.log("res90:", res)
                        if (res.height > 1920) {
                            common.Toast("图片高度不能超过1920")
                        } else if (res.width > 1080) {
                            common.Toast("图片宽度不能超过1080")
                        //限制上传的图片大小
                        } else if (uploadObj.size > 1887436) {
                            common.Toast("图片不能超过1.8M")
                        } else {
                            that.setData({ updataImg: uploadObj.tempFilePath })
                        }
                    }
                })
			  }
			})
		},
		nextFun() {
			innerAudioContent.src = 'https://zntest.wxumi.com/guofang/audio/clickaudio.mp3'
			innerAudioContent.play()
			setTimeout(() => {
				if (this.data.updataImg) {
					wx.navigateTo({
						url: `/pages/guoFang/selectArmed/selectArmed?photo=${this.data.updataImg}`
					})
				} else {
					common.Toast('还没选择照片呢！')
				}
			}, 350)
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