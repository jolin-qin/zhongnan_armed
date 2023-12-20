// app.js
App({
    onLaunch() {
        // 展示本地存储能力
        const logs = wx.getStorageSync('logs') || []
        logs.unshift(Date.now())
        wx.setStorageSync('logs', logs)

        // 登录
        wx.login({
            success: res => {
                // 发送 res.code 到后台换取 openId, sessionKey, unionId
            }
        })
    },
    globalData: {
        userInfo: null,
        openId: '',
        userId: '',
        token: null,
        answerPoints: 0,//答题分数
        hasStudentStatus: false, //填写学籍信息否
        friendlyId: '', //友善值测试二维码
        testResult: {},//存放测试结果
        goodsId: '', //扫的某个商品的二维码(彩票兑换商品)
        positionId: '', //靶子位置
        entryWay: '' ,//1为军事知识码，2为模拟射击码
        sort: '', //分为武装部，国防教育
        tempImagePath: '', //拍的照片二进制流
        eqNumber: '',//二维码带的标识
    }
})