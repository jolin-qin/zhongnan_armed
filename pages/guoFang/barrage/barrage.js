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
        statusValue: '0',
        inputValue: '',
        list: [],
        shake: true,
        headImgUrl: ''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        if (app.globalData.userInfo) {
            this.setData({
                headImgUrl: app.globalData.userInfo.headImgUrl
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
        if (app.globalData.userId) {
            this.getListFun()
        }
    },
    // 发送弹幕
    sendText() {
        if (app.globalData.hasStudentStatus) {
            if (this.data.inputValue) {
                if (this.data.shake) {
                    this.setData({
                        shake: false
                    })
                    common.request(API.sendBarrageApi, {
                        userId: app.globalData.userId,
                        txt: this.data.inputValue,
                        proType: app.globalData.globalCategory
                    }).then((res) => {
                        console.log("发送弹幕接口成功啦:" ,res)
                        if (res.code === 200) {
                            this.setData({
                                shake: true,
                                inputValue: ''
                            })
                            //调用函数
                            this.getListFun()
                        } else {
                            wx.showToast({
                                title: res.msg,
                                icon: 'none',
                                duration: 2000
                            })
                            this.setData({
                                shake: true
                            })
                        }
                    })
                }
            } else {
                wx.showToast({
                    title: '请输入有效文字',
                    icon: 'none',
                    duration: 2000
                })
            }
        } else {
            wx.showToast({
              title: '请先完善学籍信息',
              icon: 'none',
              duration: 2000
            })
        }
    },
    getListFun() {
        common.request(API.barrageListApi, {
            userId: app.globalData.userId,
            proType: app.globalData.globalCategory
        }).then((res) => {
            console.log("弹幕列表接口成功啦:" ,res)
            if (res.code === 200) {
                let arr = []
                res.data.forEach((item) => {
                    arr.unshift(item)
                })
                this.setData({
                    list: arr
                })
            } else {
                wx.showToast({
                    title: res.msg,
                    icon: 'none',
                    duration: 2000
                })
                
            }
        })
    },
    bindKeyInput(e) {
        this.setData({
            inputValue: e.detail.value
        })

        // let name = 'form.' + e.target.dataset.name
    　　let val = e.detail.value,
      　pos = e.detail.cursor;
    　　let reg = /([^\u0020-\u007E\u00A0-\u00BE\u2E80-\uA4CF\uF900-\uFAFF\uFE30-\uFE4F\uFF00-\uFFEF\u0080-\u009F\u2000-\u201f\u2026\u2022\u20ac\r\n])|(\s)/g
        if (!reg.test(val)) {
        　　return
        }
        let obj = this.regStrFn(val)

        if (pos != -1 && obj.index) {
        //计算光标的位置
        　　pos = obj.index.index
        }
        return {
        　　value: obj.val,
        　　cursor: pos
        }
    },
    regStrFn: function (str) {
        // 转换一下编码
      　let reg = /([^\u0020-\u007E\u00A0-\u00BE\u2E80-\uA4CF\uF900-\uFAFF\uFE30-\uFE4F\uFF00-\uFFEF\u0080-\u009F\u2000-\u201f\u2026\u2022\u20ac\r\n])|(\s)/g,
    　　indexArr = reg.exec(str);
        if (str.match(reg)) {
        　　str = str.replace(reg, '');
        }
        let obj = { val: str, index: indexArr }
        return obj
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