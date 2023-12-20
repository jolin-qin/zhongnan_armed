// pages/resultPage/resultPage.js
const app = getApp()
import API from "../../../utils/api.js"
import common from "../../../utils/common.js"
const audioUrls = [
	'',
	'https://zntest.wxumi.com/guofang/AI/kongjun.wav',
	'https://zntest.wxumi.com/guofang/AI/haijun.wav',
	'https://zntest.wxumi.com/guofang/AI/lujun.wav',
	'https://zntest.wxumi.com/guofang/AI/huojian.wav'
]
const clickAudioContent = wx.createInnerAudioContext()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        imgUrl: API.imgUrl, //服务器静态图片地址
        updataImg: '', //选择的照片
        listData: [], //军装数组照片
        informationPopup: false,
        speciesIndex: 0,//选择的swiper序号
        shake: true,
        zhongLei: '', //对应兵种
        radio: null, //  男  女
        totalData: [], //后台返回的模板
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
			// console.log("handleConfirm:", app.globalData.userInfo)
			//如果以前没有性别的用户，现在默认给个性别
			// if (app.globalData.userInfo.userSex === null) {
			// 	app.globalData.userInfo.userSex = 0
			// }
			
		this.setData({ updataImg: options.photo, radio: app.globalData.userInfo.userSex })
        this.getAItemplateFun() //获取模板
			
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
        this.innerAudioContent = wx.createInnerAudioContext()
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },
    handleConfirm() {
        clickAudioContent.src = 'https://zntest.wxumi.com/guofang/audio/clickaudio.mp3'
        clickAudioContent.play()
        let that = this
        if (this.data.shake) {
            this.setData({ shake: false })
            wx.showLoading({
                title: '合成中，请稍后',
            })
            wx.uploadFile({
                url: API.compositePhotoApi, //仅为示例，非真实的接口地址
                filePath: that.data.updataImg,
                name: 'file',
                formData: {
                    'userId': app.globalData.userId,
                    'proType': '0',
                    'eqNumber': Number(app.globalData.eqNumber),
                    'tempId': that.data.listData[that.data.speciesIndex].id
                },
                success (res){
                    console.log("返回值是：", res)
                    app.globalData.eqNumber = ''
                    let result = JSON.parse(res.data)
                    if (result.code == 200) {
                        //跳转到AIphotoDetail页面
                        let img = result.msg
                        wx.reLaunch({
                            url: `/pages/guoFang/AIphotoDetail/AIphotoDetail?urls=${img}&comefrom=ai`
                        })
                    } else {
                        common.Toast(result.msg, 3000)
                        that.setData({ shake: true })
                        wx.hideLoading()
                    }
                },
                fail(err) {
                    common.Toast(err.errMsg)
                    that.setData({ shake: true })
                    wx.hideLoading()
                }
            })
        }
    },
    //获取模板
    getAItemplateFun(e) {
        common.request(API.getAItemplateApi, {
            proType: 0
        }, 'application/x-www-form-urlencoded').then((res) => {
            console.log("获取题目列表接口成功啦:" ,res)
            console.log("获取题目列表接口成功啦:" ,app.globalData.userInfo)
            
            //根据用户性别筛选模板
            let arr = res.data.filter(item => {
                return item.tempSex === app.globalData.userInfo.userSex
            })
            this.setData({ 
                totalData: res.data || [],
                listData: arr
            })
        })
    },
		closeFun() {
			this.setData({ informationPopup: false })
			this.innerAudioContent.pause()
		},
		openFun() {
			clickAudioContent.src = 'https://zntest.wxumi.com/guofang/audio/clickaudio.mp3'
			clickAudioContent.play()
			let value = this.data.listData[this.data.speciesIndex].tempType
			this.setData({ 
				informationPopup: true, 
				zhongLei: value
			})
			// 播放音乐
			
			this.innerAudioContent.src = audioUrls[value]
			this.innerAudioContent.play()
		},
		handleSwiperChange(e) {
            // console.log(e.detail.current)
            this.setData({ speciesIndex: e.detail.current })
            setTimeout(() => {
                this.setData({ 
                    zhongLei: this.data.listData[this.data.speciesIndex].tempType
                })
            }, 50)
        },
        // 左边按钮
        addFun() {
            let dataNumber = this.data.listData.length - 1
            let copyValue = this.data.speciesIndex
            //是最后一个
            if (copyValue === dataNumber) {
                this.setData({ speciesIndex: 0 })
            } else {
                this.setData({ speciesIndex: copyValue + 1 })
            }
        },
        // 右边按钮
        reduceFun() {
            let dataNumber = this.data.listData.length - 1
            let copyValue = this.data.speciesIndex
            //第一个
            if (copyValue === 0) {
                this.setData({ speciesIndex: dataNumber })
            } else {
                this.setData({ speciesIndex: copyValue - 1 })
            }
        },
        onChange(event) {
            console.log("haha:", typeof event.detail)
            //重新筛选模板
            let arr = this.data.totalData.filter(item => {
                return item.tempSex === event.detail
            })
            this.setData({ 
                speciesIndex: 0,
                radio: event.detail,
                listData: arr
            })
        },
    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide() {
		this.innerAudioContent.pause()
    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() {
        clickAudioContent.pause()
		this.innerAudioContent.pause()
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