// index.js
// 获取应用实例
const app = getApp()
import API from "../../../utils/api.js"
Page({
  data: {
		imgFriendUrl: API.imgFriendUrl, //友善厅静态图片地址
		imgUrl: API.imgUrl, //国防静态图片地址
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady () {
  	// 自动播放音乐
		this.beiJingAudioContent = wx.createInnerAudioContext()
		this.beiJingAudioContent.src = 'https://zntest.wxumi.com/guofang/audio/hongxingshanshan.mp3'
		this.beiJingAudioContent.play()
  },
  onLoad() {
    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true
      })
    }
  },
	onUnload() {
		this.beiJingAudioContent.pause()
		this.innerAudioContent.pause()
	},
  startAnswerBtnFun() {
		this.innerAudioContent = wx.createInnerAudioContext()
		this.innerAudioContent.src = 'https://zntest.wxumi.com/guofang/audio/clickaudio.mp3'
		this.innerAudioContent.play()
		setTimeout(() => {
			wx.reLaunch({
			    url: '/pages/guoFang/answerQuestionPage/answerQuestionPage' 
			})
		}, 1000)
	}
})
