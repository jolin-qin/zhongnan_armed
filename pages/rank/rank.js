// pages/rank/rank.js
const app = getApp()
import API from "../../utils/api.js"
import common from "../../utils/common.js"
Page({

    /**
     * 页面的初始数据
     */
    data: {
        imgUrl: API.imgUrl, //服务器静态图片地址
        active: 0,
        tabIndex: '1',
        dataList: [[], [], []],
        showPopup: false,
        pageNo: [1, 1, 1],
        pageSize: 10,
        isReachBottom: [true, true, true],//是否可以上滑到底加载请求
        isFirstChange: [true,false, false],//判断tabBar选项是不是第一次切换到
        primaryRanking: null,//我的初级排名
        seniorRanking: null,//我的高级排名
        moveRanking: null,//我的移动排名
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.getPrizeList(0, '1')
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
    // 获取排行
    getPrizeList(index, type) {
        common.request(API.shootingRankingApi, {
            userId: app.globalData.userId,
            rankingType: type,
            pageNumber: this.data.pageNo[index],
            pageSize: this.data.pageSize
        }).then((res) => {
            console.log("射击排行成功啦:", res)
            if (res.code === 200) {
                if (this.data.pageSize > res.data.rangkingList.length) {
                    let newData = ''
                    if (this.data.tabIndex === '1') {
                        newData = 'isReachBottom[0]'
                    } else if (this.data.tabIndex === '2') {
                        newData = 'isReachBottom[1]'
                    } else if (this.data.tabIndex === '3') {
                        newData = 'isReachBottom[2]'
                    }
                    this.setData({
                        [newData]: false
                    })
                    // console.log(this.data.isReachBottom[0])
                }
                //将秒数转换为  分:秒
                res.data.rangkingList.forEach((item, index) => {
                    item.useTime = this.s_to_hs(item.useTime)
                })
                // 我的个人排行数据
                let rees = null
                if (res.data.myRanking) {
                    let rankObject = res.data.myRanking
                    let myRankArr = Object.keys(rankObject)
                    if (myRankArr.length > 0) {
                        rankObject.useTime = this.s_to_hs(rankObject.useTime)
                        rees = rankObject
                    }
                }
                let result = ''
                if (this.data.tabIndex === '1') {
                    result = 'dataList[0]'
                    this.setData({
                        primaryRanking: rees,
                        [result]: this.data.dataList[0].concat(res.data.rangkingList)
                    })
                    
                } else if (this.data.tabIndex === '2') {
                    result = 'dataList[1]'
                    this.setData({
                        seniorRanking: rees,
                        [result]: this.data.dataList[1].concat(res.data.rangkingList)
                    })
                   
                } else if (this.data.tabIndex === '3') {
                    result = 'dataList[2]'
                    this.setData({
                        moveRanking: rees,
                        [result]: this.data.dataList[2].concat(res.data.rangkingList)
                    })
                    
                }
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
            console.log("wozou l zhebu")
            return false
        } else {
            console.log("zhixin")
            this.setData({ active: index })
            //判断是否是第一次切换
            if (!this.data.isFirstChange[index]) {
                // 修改对应的isFirstChange的值
                let newlike = 'isFirstChange[' + index + ']'
                this.setData({
                    [newlike]: true
                })
                // 调用函数
                this.getPrizeList(index, id)
            }
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
        let onReachBottomIdx = this.data.active
        if (this.data.isReachBottom[onReachBottomIdx]) {
            let newPageNo = 'pageNo[' + onReachBottomIdx + ']'
            this.setData({
                [newPageNo]: this.data.pageNo[onReachBottomIdx] + 1
            })
            if (onReachBottomIdx === 0) {
                this.getPrizeList(0, '1')
            } else if (onReachBottomIdx === 1) {
                this.getPrizeList(1, '2')
            } else if (onReachBottomIdx === 2) {
                this.getPrizeList(2, '3')
            }
        } else {
            let newReachBottom = 'isReachBottom[' + onReachBottomIdx + ']'
            this.setData({
                [newReachBottom]: false
            })
        }
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})