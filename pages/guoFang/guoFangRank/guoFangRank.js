// pages/knowledgeRank/knowledgeRank.js
const app = getApp()
import API from "../../../utils/api.js"
import common from "../../../utils/common.js"
Page({

    /**
     * 页面的初始数据
     */
    data: {
        imgUrl: API.imgUrl, //服务器静态图片地址
        badgeCollegeList: [],
        badgePersonalList: [],
        pageNoCollege: 1,
        pageNoPersonal: 1,
        pageSize: 10,
        active: 0,
        myCollegeRank: null,//院校排名
        myPersonalRank: null,//我的个人排名
        isReachBottom1: true,//可以上滑到底加载请求
        isReachBottom2: true,//可以上滑到底加载请求
        tabIndex: '1',
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.getWaitBadgeListFun()
        this.getWaitBarrageListFun()
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
    // 获取院校排行
    getWaitBadgeListFun() {
        let self = this
        common.request(API.badgeCollegeRankApi, {
            pageIndex: this.data.pageNoCollege,
						proType: 1
        }).then((res) => {
            console.log("获取院校排行接口成功啦:" ,res)
            if (res.code === 200) {
                let result = res.data.rankListByDepartment
                let newData = 'badgeCollegeList'
                self.setData({
                    [newData]: this.data.badgeCollegeList.concat(result)
                })
                // 所属院校排行数据
                if (result.myRankData) {
                    let rankObject = result.myRankData
                    let myRankArr = Object.keys(rankObject)
                    if (myRankArr.length > 0) {
                        this.setData({
                            myCollegeRank: rankObject
                        })
                    }
                }
                // 判断是否可以滚动加载
                if (result.length >= this.data.pageSize) {
                    this.setData({ isReachBottom2: true })
                } else {
                    this.setData({ isReachBottom2: false })
                }
            } else {
								common.Toast(res.msg)
            }
        })
    },
    // 获取个人排行
    getWaitBarrageListFun() {
        let self = this
        common.request(API.badgePersonalRankApi, {
            openId: app.globalData.openId,
            pageIndex: this.data.pageNoPersonal,
						proType: 1
        }).then((res) => {
            console.log("获取个人排行接口成功啦:" ,res)
            if (res.code === 200) {
                let result = res.data.rankDataListPersonal
                let newData = 'badgePersonalList'
                self.setData({
                    [newData]: this.data.badgePersonalList.concat(result.rankDataList)
                })
                // 我的个人排行数据
                if (result.myRankData) {
                    let rankObject = result.myRankData
                    let myRankArr = Object.keys(rankObject)
                    if (myRankArr.length > 0) {
                        self.setData({
                            myPersonalRank: rankObject
                        })
                    }
                }
                // 判断是否可以滚动加载
                if (result.length >= this.data.pageSize) {
                    this.setData({ isReachBottom1: true })
                } else {
                    this.setData({ isReachBottom1: false })
                }
            } else {
							common.Toast(res.msg)
            }
        })
    },
    //切换tab
    chooseTab(e) {
        let index = e.currentTarget.dataset.index
        let id = e.currentTarget.dataset.id
        this.setData({
            tabIndex: id
        })
        if (this.data.active === index) {
            return false
        } else {
            console.log("zhixin")
            this.setData({ active: index })
            
        }
    },
    s_to_hs(s){
        //计算分钟
        //算法：将秒数除以60，然后下舍入，既得到分钟数
        var h;
        h  =   Math.floor(s/60);
        //计算秒
        //算法：取得秒%60的余数，既得到秒数
        s  =   s%60;
        //将变量转换为字符串
        h    +=    '';
        s    +=    '';
        //如果只有一位数，前面增加一个0
        h  =   (h.length==1)?'0'+h:h;
        s  =   (s.length==1)?'0'+s:s;
        return h+':'+s;
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
        let self = this
        if (this.data.tabIndex === '1') {
            if (this.data.isReachBottom1) {
                this.setData({
                    pageNoPersonal: this.data.pageNoPersonal + 1
                })
                // 调用函数
                self.getWaitBarrageListFun()
            }
        } else if (this.data.tabIndex === '2') {
            if (this.data.isReachBottom2) {
                this.setData({
                    pageNoCollege: this.data.pageNoCollege + 1
                })
                // 调用函数
                self.getWaitBadgeListFun()
            }
        }
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})