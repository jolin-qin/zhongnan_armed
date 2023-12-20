// index.js
// 获取应用实例
const app = getApp()
import API from "../../../utils/api.js"
Page({
  data: {
		imgUrl: API.imgUrl, //服务器静态图片地址
    dataList: [],
    userInfo: {},
    hasUserInfo: false,
    ratio: 0,
  },
  
  onLoad() {
		
  },
	onShow() {
		if (app.globalData.userId) {
			this.setData({ hasUserInfo: true })
			this.getMedalWallListFun()
		} else {
			this.setData({ hasUserInfo: false })
			wx.switchTab({
				url: '/pages/userCenter/userCenter'
			})
		}
		
	},
  getMedalWallListFun() {
    wx.request({
      url: API.getMedalWallListApi,
      data: {
        userId: app.globalData.userId
      },
      method: "POST",
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: (res) => {
        // console.log("获取成功啦:", res)
        if (res.data.code == 200) {
  				let allArr = res.data.data.allPersonList, finishArr = res.data.data.personList || [];
					allArr.forEach(item => {
						finishArr.forEach(anthoritem =>　{
							if (anthoritem.keyName === item.keyName) {
								item.finish = 1
							}
						})
					})
					// console.log("获取成功啦555:", allArr)
					let ratio = finishArr.length / allArr.length * 100
					this.setData({ 
						dataList: allArr,
						ratio
					})
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 2000
          })
        }
      }
    });
  },
})
