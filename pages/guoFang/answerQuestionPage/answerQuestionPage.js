// pages/answerQuestionPage/answerQuestionPage.js
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
        isRight: [0,0,0,0,0],//对错指示
        titleNumber: 1,//第几道题目（不是下标）
        times: 15,//时间倒计时
        isSelect: [false, false, false, false],//都默认没被选答案
        titleAnimation: '',//题目动画
        answerAnimation: '',//答案动画
        proportionAnimation: '',//百分比出现动画
        timer: null,//定时器
        shake: true,//防止用户同时点击两个答案
        timeArr: [],//存放每道题答题时间
        currentQuesTionObj: {},//当前题目对象
        questionList: [],//所有题目数组
        selectAnswerList: []
    },
		onReady() {
			// 自动背景播放音乐
			this.beiJingAudioContent = wx.createInnerAudioContext()
			this.beiJingAudioContent.src = 'https://zntest.wxumi.com/guofang/audio/hongxingshanshan.mp3'
			this.beiJingAudioContent.play()
			
			//答题对错音乐
			
		},
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        this.getTitleListFun() //调用获取题目列表函数
        this.setData({
            titleAnimation: 'titleAnimationAppear',
            answerAnimation: 'answerAnimationAppear',
            // proportionAnimation: 'proportionAnimationAppear'
        })
        setTimeout(() => {
            this.startCountdownInter()
        }, 1000)
    },
    

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },
    // 获取题目列表
    getTitleListFun() {
        common.request(API.getQuestionList, {
					proType: 1,
					openId: app.globalData.openId
				}, 'application/x-www-form-urlencoded').then((res) => {
            console.log("获取题目列表接口成功啦:" ,res)
            if (res.code === 200) {
                this.setData({
                    questionList: res.data,
                    currentQuesTionObj: res.data[0]
                })
            } else {
								common.Toast(res.msg)
            }
        })
    },
    //设置倒计时定时器
		startCountdownInter: function() {
        this.data.timer = setInterval(() => {
            let seconds = this.data.times
            seconds -= 1
            this.setData({
                times: seconds,
            })
            if (seconds === 0) {
                clearInterval(this.data.timer)
                //出现点击事件
                this.clickAnswerFun()

            }
        }, 1000)
    },
    //点击答案函数
    clickAnswerFun(e) {
        // console.log(this.data.titleNumber)
        // console.log(e)
        if (5 >= this.data.titleNumber) {
            console.log()
            if (this.data.shake) {
                let index = 0
                let answerIndex = '1'
                if (e) {
                    index = e.currentTarget.dataset.index //点击答案按钮的下标
                    answerIndex = e.currentTarget.dataset.answerresult //答案对应的id
                }
                let titleIndex = this.data.titleNumber - 1 //每道题的下标
                let costtime = 15 - this.data.times //答题耗费时间
                let arr = []
                arr.push(costtime)
                //判断本题选择对了还是错了
                // console.log("答案的id类型:",typeof(this.data.currentQuesTionObj.answerResult))
                // console.log("答案的id:",this.data.currentQuesTionObj.answerResult)
                // console.log("答案的id类型:",typeof(answerIndex))
                // console.log("选择的id:",answerIndex)
                if (Number(this.data.currentQuesTionObj.answerResult) === answerIndex) {
                    let newData = 'isRight[' + titleIndex + ']'
                    this.setData({
                        [newData]: '1'
                    })
										// 播放对的音乐
										innerAudioContent.src = 'https://zntest.wxumi.com/guofang/audio/right.mp3'
										innerAudioContent.play()
                } else {
                    let newData = 'isRight[' + titleIndex + ']'
                    this.setData({
                        [newData]: '2'
                    })
										// 播放错的音乐
										innerAudioContent.src = 'https://zntest.wxumi.com/guofang/audio/wrong.mp3'
										innerAudioContent.play()
                }
                let newLike = 'isSelect[' + index + ']'
                this.setData({
                    [newLike]: true,
                    shake: false,
                    proportionAnimation: 'proportionAnimationAppear',
                    timeArr: this.data.timeArr.concat(arr)
                })
                console.log("时间数组:", this.data.timeArr)
                // 2秒后本题退场 清除定时器 
                setTimeout(() => {
                    this.setData({
                        proportionAnimation: 'proportionAnimationDisappear',//百分比退出
                        answerAnimation: 'answerAnimationDisappear',//答案退出
                        titleAnimation: 'titleAnimationDisappear',//题目退出
                        
                        [newLike]: false,//还原
                    })
                    clearInterval(this.data.timer)
                }, 2000)
                // 把每个题目Id与选择了答案的IDpush进数组，请求接口提交数据用
                let aaaa = []
                aaaa.push({
                    questionId: this.data.currentQuesTionObj.questionId,
										answer: Number(answerIndex)
                })
								this.setData({
                    selectAnswerList: this.data.selectAnswerList.concat(aaaa)
                })
                console.log("问题数组:", this.data.selectAnswerList)
                //点击完第五题的答案按钮，不要在出现题目了,而是发起请求
                if (this.data.titleNumber !== 5) {
                    // 3s后下一题进场(此3s包括退场的2s)
                    setTimeout(() => {
                        this.setData({
                            times: 15,
                            titleAnimation: 'titleAnimationAppear',
                            answerAnimation: 'answerAnimationAppear',
                            currentQuesTionObj: this.data.questionList[this.data.titleNumber], //同时更换当前题目
                            titleNumber: this.data.titleNumber + 1,
                            shake: true, //让答案按钮可点击
                        })
                        setTimeout(() => {
                            this.startCountdownInter()
                        }, 1000)
                    }, 3000)
                } else {
                    //所用时间求和
                    let sum = 0;
                    this.data.timeArr.forEach(function(val) {
                        sum += val;
                    })
                    console.log("titleNumber为5了")
                    this.setData({
                        currentQuesTionObj: {},
                        titleAnimation: 'titleAnimationDisappear',
                        answerAnimation: 'answerAnimationDisappear'
                    })
                    //发送请求
                    console.log("用时：", sum)
                    common.request(API.saveQuestionListByPhone, {
                        openId: app.globalData.openId,
                        testTime: sum,
                        selectAnswerList: this.data.selectAnswerList,
												proType: 1
                    }).then((res) => {
                        console.log("答案提交成功啦:" ,res)
                        if (res.code === 200) {
                            app.globalData.testResult = res.data
                            wx.reLaunch({
                                url: "/pages/guoFang/resultPage/resultPage"
                            })
                        } else {
													common.Toast(res.msg)
                        }
                    })
                }
            }
        } else {
            console.log("没有题目了")
            this.setData({
                currentQuesTionObj: {},
                titleAnimation: 'titleAnimationDisappear',
                answerAnimation: 'answerAnimationDisappear'
            })
        }
    },
    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {
			this.beiJingAudioContent.pause()
			innerAudioContent.pause()
    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {
			this.beiJingAudioContent.pause()
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