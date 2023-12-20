// pages/userCenter/userCenter.js
const app = getApp()
import API from "../../utils/api.js"
import common from "../../utils/common.js"
import Notify from '../../miniprogram_npm/@vant/weapp/notify/notify'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        imgUrl: API.imgUrl, //服务器静态图片地址
        userInfo: null,
        userName: '',
        college: '',
        className: '',
        confirmPopup: false,//确认弹窗
        name: '初级靶', //靶名称
        chooseIndex: '1', //靶Id
        // textColor: 'blue',
        // textColor: 'yellow',
        textColor: 'move', //字的颜色
        shake: true,//防抖
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            userInfo: app.globalData.userInfo
        })
        this.getStudentStatusFun()
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
    choose(e) {
        let index = e.currentTarget.dataset.index
        this.setData({
            chooseIndex: index,
            confirmPopup: true
        })
        if (index === '1') {
            this.setData({
                name: "初级靶",
                textColor: "blue"
            })
        } else if (index === '2') {
            this.setData({
                name: "高级靶",
                textColor: "yellow"
            })
        } else if (index === '3') {
            this.setData({
                name: "移动靶",
                textColor: "move"
            })
        }
    },
    closeConfirmPopupFun() {
        this.setData({
            confirmPopup: false
        })
    },
    //'确认'按钮
    confirmFun() {
        if (this.data.shake) {
            this.setData({
                shake: false
            })
            common.request(API.confirmShootingApi, {
                userId: app.globalData.userId,
                shootingLevel: this.data.chooseIndex,
                targetSite: app.globalData.positionId
            }).then((res) => {
                console.log("打靶返回值：", res)
                if (res.code === 200) {
                    app.globalData.positionId = ''
                    wx.reLaunch({
                        url: '/pages/success/success'
                    })
                } else {
                    wx.showToast({
                      title: res.msg,
                      icon: 'none',
                      duration: 1500
                    })
                    setTimeout(() => {
                        wx.navigateTo({
                            url: '/pages/userCenter/userCenter'
                        })
                    }, 1500)
                }
                this.setData({
                    confirmPopup: false
                })
                setTimeout(() => {
                    this.setData({
                        shake: true
                    })
                }, 1000)
            })
        }
    },
    goRankingPage() {
        wx.reLaunch({
            url: '/pages/rank/rank'
        })
    },
    // 获取学院数组
    getStudentStatusFun() {
        common.request(API.getDepartmentClassApi, {
            openId: app.globalData.openId
        }).then((res) => {
            console.log("获取学院接口成功啦:" ,res)
            if (res.code === 200) {
                let result = res.data.userInfoMap
                this.setData({
                    userName: result.gradeName,
                    className: result.name
                })
                let length = res.data.departmentList.length
                for (let i=0;i<length;i++) {
                    if (res.data.departmentList[i].id == Number(result.departmentId)) {
                        this.setData({
                            college: res.data.departmentList[i].name
                        })
                        break;
                    }
                }
            } else {
                wx.showToast({
                  title: res.msg,
                  icon: 'none',
                  duration: 2000
                })
            }
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