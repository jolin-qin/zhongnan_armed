// pages/anserEntryPage/anserEntryPage.js
const app = getApp()
import API from "../../utils/api.js"
import common from "../../utils/common.js"
Page({
    /**
     * 页面的初始数据
     */
    data: {
        imgUrl: API.imgUrl, //服务器静态图片地址
        userInfo: null,
        nameInput: '',//姓名
        educationArr: 0, //学院
        objectEducation: [],//学院
        educationIndex: 1, //学院
        classInput: '',//班级
        hasInformation: false,//有无学院班级信息
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
    //去答题排行榜
    goRankPage(e) {
        wx.navigateTo({
            url: '/pages/knowledgeRank/knowledgeRank',
        })
    },
    // 获取学院数组
    getStudentStatusFun() {
        common.request(API.getDepartmentClassApi, {
            openId: app.globalData.openId
        }).then((res) => {
            console.log("获取学院接口成功啦:" ,res)
            if (res.code === 200) {
                this.setData({
                    educationArr: this.getArrayProps(res.data.departmentList, 'name'),
                    objectEducation: res.data.departmentList,
                })
                // 如果返回了个人信息，就要把它赋值给picker
                let userInfoMap = res.data.userInfoMap
                // let arr = []
                // arr = Object.keys(userInfoMap)
                if (userInfoMap.departmentId && userInfoMap.gradeName && userInfoMap.name) {
                    this.setData({
                        nameInput: userInfoMap.name,
                        classInput: userInfoMap.gradeName,
                        hasInformation: false
                    })
                    this.data.objectEducation.forEach((item, index) => {
                        if (item.id == Number(userInfoMap.departmentId)) {
                            this.setData({
                                educationIndex: index
                            })
                        }
                    })
                } else {
                    console.log("我走了这部")
                    this.setData({
                        hasInformation: true
                    })
                }
            }
        })
    },
    // 单个select 改变触发函数
    bindPickerChange: function(e) {
        this.setData({
            educationIndex: e.detail.value
        })
        // console.log('picker发送选择改变，携带值为', e.detail.value)
    },
    bindNameInput(e) {
        this.setData({
            nameInput: e.detail.value
        })
    },
    bindClassNameInput(e) {
        this.setData({
            classInput: e.detail.value
        })
    },
    //遍历数组中的对象得到某个属性值（返回新数组）
    getArrayProps(array, key) {
        let keys = key || "value";
        let res = [];
        if (array) {
            array.forEach(function (t) {
                res.push(t[keys]);
            });
        }
        return res;
    },
    //点击‘开始答题’
    startAnswerBtnFun() {
        console.log("nameInput:", this.data.nameInput)
        console.log("classInput:", this.data.classInput)
        if (this.data.nameInput && this.data.classInput) {
            console.log("我竟然走了这步")
            if (this.data.shake) {
                this.setData({
                    shake: false
                })
                common.request(API.saveDepartmentClassApi, {
                    openId: app.globalData.openId,
                    departmentId: this.data.objectEducation[this.data.educationIndex].id,
                    gradeName: this.data.classInput,
                    name: this.data.nameInput
                }).then((res) => {
                    console.log("保存个人信息接口成功啦:" ,res)
                    if (res.code === 200) {
                        wx.reLaunch({
                            url: '/pages/answerQuestionPage/answerQuestionPage' 
                        })
                    } else {
											
                        wx.showToast({
                            title: res.msg,
                            icon: 'none',
                            duration: 2000
                        })
                    }
                    this.setData({
                        shake: true
                    })
                })
            }
        } else {
            wx.showToast({
                title: '请把信息填写完整',
                icon: 'none',
                duration: 2000
            })
        }
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