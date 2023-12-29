// pages/userCenter/userCenter.js
const app = getApp()
import API from "../../../utils/api.js"
import common from "../../../utils/common.js"
import Dialog from '../../../miniprogram_npm/@vant/weapp/dialog/dialog'
// import Notify from '../../miniprogram_npm/@vant/weapp/notify/notify'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        imgFriendUrl: API.imgFriendUrl, //友善厅图片地址
        imgUrl: API.imgUrl, //服务器静态图片地址
        userInfo: null, //个人信息
        dataList: [],
        waitBarrageCount: 0,
        waitBadgeCount: 0,
        pageNo: 1,
        pageSize: 20,
        isReachBottom: true, //弹幕是否可以上滑到底加载请求
        tabIndex: '0',
        tabTyp: 'N',
        show: false, //拒绝原因弹窗
        memo: '',
        auidtId: '',
        type: '',
        searchName: '',
        studentId: '',
        // 完善学籍信息参数
        shake: true,
        informationPopup: false,
        originalData: [],
        multiArray: [],
        multiIndex: [0, 0, 0],
        educationArr: [], //学历
        objectEducation: [], //学历
        educationIndex: 0, //学历
        sexArr: [{
            name: '女',
            value: 0
        }, {
            name: '男',
            value: 1
        }], //性别
        sexIndex: 0, //默认  女
        nameInput: '',
        testType: '',
        excelList: [],
        signInPopup: false,
        coachPopup: false,
        medalPopup: false,
        playUserList: [1,2,3,4,5,6,7,8,9], //应到人数
        due: 0, //应到人数
        btnIndex: '0',
        coachImgUrl: '', //成为教官二维码
        robotMedalImgUrl: '', //机器人勋章二维码
        isManager: false,
        isInstructor: false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            userInfo: app.globalData.userInfo,
            testType: app.globalData.globalCategory,
            isManager: app.globalData.isManager,
            isInstructor: app.globalData.isInstructor
        })
        //this.getWaitBadgeListFun('N',true) //待审核徽章列表,刚进页面我只需要知道待审核徽章数量就行，不用为dataList赋值
        this.getWaitBarrageListFun('N') //待审核弹幕列表
        this.getStudentStatusFun() //获取学历信息
        this.getLinkageStudentStatusFun() //获取院系专业班级信息
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
    // 点击tab切换
    tabClick(e) {
        let tabIndex = e.currentTarget.dataset.tab
        let typIndex = e.currentTarget.dataset.index
        this.setData({
            tabIndex: tabIndex,
            dataList: [],
            pageNo: 1,
            tabTyp: typIndex,
            searchName: ''
        })
        if (tabIndex === '0') {
            this.getWaitBarrageListFun('N')
        } else if (tabIndex === '1') {
            this.getWaitBarrageListFun('Y')
        } else if (tabIndex === '2') {
            this.getWaitBadgeListFun('N')
        } else if (tabIndex === '3') {
            this.getWaitBadgeListFun('Y')
        } else if (tabIndex === '4') {
            this.getUserListFun()
        } else if (tabIndex === '5') {
            this.getUserListFun('coach')
        }
    },
    // 获取弹幕列表
    getWaitBarrageListFun(typ) {

        common.request(API.checkPendingBarrageApi, {
            paging: {
                pageNumber: this.data.pageNo,
                pageSize: this.data.pageSize
            },
            type: typ,
            proType: app.globalData.globalCategory
        }).then((res) => {
            console.log("获取待审核弹幕列表接口成功啦:", res)
            if (res.code === 200) {
                // 区分待审核与已审核
                let totalArr = res.data.total
                if (this.data.tabTyp === 'N') {
                    this.setData({
                        waitBarrageCount: totalArr
                    })
                }
                this.setData({
                    dataList: this.data.dataList.concat(res.data.rows),
                })
                if (totalArr >= this.data.pageSize) {
                    this.setData({
                        isReachBottom: true
                    })
                } else {
                    this.setData({
                        isReachBottom: false
                    })
                }
                console.log("能否继续滚动：", this.data.isReachBottom)
            } else {
                wx.showToast({
                    title: res.msg,
                    icon: 'none',
                    duration: 2000
                })
            }
        })
    },
    // 获取徽章列表
    getWaitBadgeListFun(typ, isFrist) {
        common.request(API.checkPendingBadgeApi, {
            paging: {
                pageNumber: this.data.pageNo,
                pageSize: this.data.pageSize
            },
            type: typ,
            proType: app.globalData.globalCategory
        }).then((res) => {
            console.log("获取待审核徽章列表接口成功啦:", res)
            if (res.code === 200) {
                let totalArr = res.data.total
                if (this.data.tabTyp === 'N') {
                    this.setData({
                        waitBadgeCount: totalArr
                    })
                }
                if (!isFrist) {
                    let result = res.data.rows
                    result.forEach((item, index) => {
                        item.img = JSON.parse(item.img)
                    })
                    this.setData({
                        dataList: this.data.dataList.concat(result),
                    })
                    if (totalArr >= this.data.pageSize) {
                        this.setData({
                            isReachBottom: true
                        })
                    } else {
                        this.setData({
                            isReachBottom: false
                        })
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
    // 获取用户列表
    getUserListFun(type) {
        let requestData = {
            tableName: "ar_user",
            paging: {
                pageNumber: this.data.pageNo,
                pageSize: this.data.pageSize
            }
        }
        if (type === 'coach') {
            requestData.filters = {
                instructorFlag: {
                    type: "eq",
                    value: 1
                }
            }
        }
        common.request(API.getUserListApi, requestData).then((res) => {
            console.log("获取用户列表接口成功啦:", res)
            if (res.code === 200) {
                let totalArr = res.total
                this.setData({ dataList: this.data.dataList.concat(res.rows) })
                if (totalArr >= this.data.pageSize) {
                    this.setData({ isReachBottom: true })
                } else {
                    this.setData({ isReachBottom: false })
                }
                console.log("能否继续滚动：", this.data.isReachBottom)
            } else {
                common.Toast(res.msg)
            }
        })
    },
    //显示大图
    viewBigPic(e) {
        let url = e.target.dataset.url
        console.log(typeof url)
        let arr = []
        url.forEach((item, index) => {
            arr.push(item.imgUrl)
        })
        wx.previewImage({
            current: url[0].imgUrl, // 当前显示图片的http链接
            urls: arr // 需要预览的图片http链接列表
        })
    },
    // 审核函数
    auditFun(e) {
        let self = this
        let types = e.currentTarget.dataset.genre
        let funId = e.currentTarget.dataset.id
        // 把type与id存起来
        this.setData({
            auidtId: funId,
            type: types
        })
        let url = ''
        // 确认框
        Dialog.confirm({
            title: '确认提示',
            message: '此条内容没有异常，是否通过？',
            confirmButtonText: '通过',
            cancelButtonText: '拒绝'
        }).then(() => {
            // on confirm
            //   删除数组对应的值
            if (types === 'barrage') {
                url = API.auditBarrageApi
            } else if (types === 'medal') {
                url = API.auditBadgeApi
            }
            // 发送请求
            common.request(url, {
                id: funId,
                type: 'Y',
                approveUser: app.globalData.userId
            }).then((res) => {
                console.log("审核接口成功啦:", res)
                if (res.code === 200) {
                    // 弹幕审核相关操作
                    if (types === 'barrage') {
                        let arr = self.data.dataList
                        for (let i = 0; i < arr.length; i++) {
                            if (arr[i].barrageId === funId) {
                                arr.splice(i, 1)
                                break;
                            }
                        }
                        self.setData({
                            dataList: arr,
                            waitBarrageCount: self.data.waitBarrageCount - 1
                        })
                        // 徽章审核相关操作
                    } else if (types === 'medal') {
                        let arr = self.data.dataList
                        for (let i = 0; i < arr.length; i++) {
                            if (arr[i].id === funId) {
                                arr.splice(i, 1)
                                break;
                            }
                        }
                        self.setData({
                            dataList: arr,
                            waitBadgeCount: self.data.waitBadgeCount - 1
                        })
                    }
                } else {
                    wx.showToast({
                        title: res.msg,
                        icon: 'none',
                        duration: 2000
                    })
                }
            })
        }).catch(() => {
            // on cancel
            self.setData({
                show: true
            })
        });
    },
    //拒绝原因弹窗 确定键
    confirmBtnFun(event) {
        let self = this
        if (this.data.memo) {
            let url = ''
            if (this.data.type === 'barrage') {
                url = API.auditBarrageApi
            } else if (this.data.type === 'medal') {
                url = API.auditBadgeApi
            }
            // 发送请求
            common.request(url, {
                id: this.data.auidtId,
                reason: this.data.memo,
                type: 'N',
                approveUser: app.globalData.userId
            }).then((res) => {
                console.log("审核接口成功啦:", res)
                if (res.code === 200) {
                    // 弹幕审核相关操作
                    if (this.data.type === 'barrage') {
                        let arr = self.data.dataList
                        for (let i = 0; i < arr.length; i++) {
                            if (arr[i].barrageId === this.data.auidtId) {
                                arr.splice(i, 1)
                                break;
                            }
                        }
                        self.setData({
                            dataList: arr,
                            waitBarrageCount: self.data.waitBarrageCount - 1
                        })
                        // 徽章审核相关操作
                    } else if (this.data.type === 'medal') {
                        let arr = self.data.dataList
                        for (let i = 0; i < arr.length; i++) {
                            if (arr[i].id === this.data.auidtId) {
                                arr.splice(i, 1)
                                break;
                            }
                        }
                        self.setData({
                            dataList: arr,
                            waitBadgeCount: self.data.waitBadgeCount - 1
                        })
                    }
                } else {
                    wx.showToast({
                        title: res.msg,
                        icon: 'none',
                        duration: 2000
                    })
                }
            })
        } else {
            wx.showToast({
                title: '请说明拒绝原因',
                icon: 'none',
                duration: 2000
            })
        }
    },
    //删除弹幕
    deleteFun(e) {
        let ids = []
        ids.push({
            id: e.currentTarget.dataset.id
        })
        // 确认框
        Dialog.confirm({
            title: '确认提示',
            message: '是否确定删除此条数据？'
        }).then(() => {
            // 发送请求
            common.request(API.removeBarrageApi, {
                tableName: "ar_barrage",
                ids: ids
            }).then((res) => {
                console.log("删除弹幕接口成功啦:", res)
                if (res.code === 200) {
                    this.setData({
                        pageNo: 1,
                        dataList: []
                    })
                    common.Toast('操作成功')
                    setTimeout(() => {
                        this.getWaitBarrageListFun('Y')
                    }, 100)
                } else {
                    common.Toast(res.msg)
                }
            })
        }).catch(() => {});
    },
    //删除徽章
    deleteFun1(e) {
        let ids = []
        ids.push({
            id: e.currentTarget.dataset.id
        })
        // 确认框
        Dialog.confirm({
            title: '确认提示',
            message: '是否确定删除此条数据？'
        }).then(() => {
            // 发送请求
            common.request(API.removeBadgeApi, {
                tableName: "cs_user_medal",
                ids: ids
            }).then((res) => {
                console.log("删除徽章接口成功啦:", res)
                if (res.code === 200) {
                    this.setData({
                        pageNo: 1,
                        dataList: []
                    })
                    wx.showToast({
                        title: '操作成功',
                        icon: 'none',
                        duration: 1500
                    })
                    setTimeout(() => {
                        this.getWaitBadgeListFun('Y')
                    }, 100)
                } else {
                    wx.showToast({
                        title: res.msg,
                        icon: 'none',
                        duration: 2000
                    })
                }
            })
        }).catch(() => {

        });
    },

    // 获取学历数组
    getStudentStatusFun() {
        common.request(API.getDepartmentClassApi, {}).then((res) => {
            // console.log("获取学历接口成功啦:" ,res)
            if (res.code === 200) {
                this.setData({
                    educationArr: this.getArrayProps(res.data.educationList, 'name'),
                    objectEducation: res.data.educationList,
                })
                console.log("获取学历接口成功啦:", res.data.educationList)
                app.globalData.xueLiArr = this.getArrayProps(res.data.educationList, 'name')
                app.globalData.xueLiObjectArr = res.data.educationList
            }
        })
    },

    //获取院系 专业 班级信息（联动）
    getLinkageStudentStatusFun() {
        common.request(API.getDepartmentClassLinkageApi, {}).then((res) => {
            console.log("获取学历接口成功啦:", res)
            if (res.code === 200) {
                let newArr = []
                let list = res.data
                newArr.push(this.getArrayProps(list, 'name'))
                newArr.push(this.getArrayProps(list[0].gradeChildren, 'name'))
                newArr.push(this.getArrayProps(list[0].gradeChildren[0].classChildren, 'name'))

                this.setData({

                    multiArray: newArr,
                    originalData: list
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
    bindMultiPickerChange: function (e) {
        console.log('picker发送选择改变，携带值为', e.detail.value)
        this.setData({
            multiIndex: e.detail.value
        })
    },
    // picker联动
    bindMultiPickerColumnChange: function (e) {
        // console.log("我被触发了")
        let self = this
        console.log(e)
        // console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
        var data = {
            multiArray: this.data.multiArray,
            multiIndex: this.data.multiIndex
        };
        data.multiIndex[e.detail.column] = e.detail.value;
        switch (e.detail.column) {
            // change第一列的选项
            case 0:
                data.multiArray[1] = this.getArrayProps(this.data.originalData[e.detail.value].gradeChildren, 'name')
                data.multiArray[2] = this.getArrayProps(this.data.originalData[e.detail.value].gradeChildren[0].classChildren, 'name')
                data.multiIndex[1] = 0;
                data.multiIndex[2] = 0;
                break;
                // change第二列的选项
            case 1:
                data.multiArray[2] = this.getArrayProps(this.data.originalData[data.multiIndex[0]].gradeChildren[e.detail.value].classChildren, 'name');
                data.multiIndex[2] = 0;
                break;
        }
        console.log(data.multiIndex);
        this.setData(data);
    },
    bindNameInput(e) {
        this.setData({
            nameInput: e.detail.value
        })
    },
    //点击‘修改’
    edit(e) {
        let self = this
        let student = e.currentTarget.dataset.items
        // console.log("item", student)
        // 姓名
        this.setData({
            nameInput: student.name,
            informationPopup: true,
            studentId: student.openId
        })
        // 根据学历id找array的下标index
        for (let i = 0; i < this.data.objectEducation.length; i++) {
            if (this.data.objectEducation[i].id === Number(student.educationId)) {
                this.setData({
                    educationIndex: i
                })
                break;
            }
        }
        //学籍信息
        for (let i = 0; i < self.data.originalData.length; i++) {
            if (self.data.originalData[i].id === Number(student.departmentIndex)) {
                let newData = 'multiIndex[0]'
                self.setData({
                    [newData]: i
                })
                // console.log("学院的下标：", i)
                // 循环下标为i的学院下面的所有专业
                let city = self.data.originalData[i].gradeChildren
                // console.log(city)
                for (let j = 0; j < city.length; j++) {
                    if (city[j].id === Number(student.gradeIndex)) {
                        let newData1 = 'multiIndex[1]'
                        self.setData({
                            [newData1]: j
                        })
                        // console.log("专业的下标：", j)
                        // break
                        let area = self.data.originalData[i].gradeChildren[j].classChildren
                        for (let k = 0; k < area.length; k++) {
                            if (area[k].id === Number(student.classIndex)) {
                                let newData2 = 'multiIndex[2]'
                                self.setData({
                                    [newData2]: k
                                })
                                break
                            }
                        }
                    }
                }
            }
        }
        // 重新修改multiArray数组，这个数组决定弹出picker时默认选中的项
        let newArr = []
        let list = this.data.originalData
        let idx = this.data.multiIndex
        newArr.push(this.getArrayProps(list, 'name'))
        newArr.push(this.getArrayProps(list[idx[0]].gradeChildren, 'name'))
        newArr.push(this.getArrayProps(list[idx[0]].gradeChildren[idx[1]].classChildren, 'name'))

        this.setData({
            multiArray: newArr,
        })
        console.log("学历111", this.data.multiArray)
    },
    // 单个select 改变触发函数
    bindPickerChange: function (e) {
        let index = e.currentTarget.dataset.ids
        if (index === '2') {
            this.setData({
                educationIndex: Number(e.detail.value)
            })
        } else if (index === '1') {
            this.setData({
                sexIndex: Number(e.detail.value)
            })
        }
    },
    // 修改学籍表单
    submitStudentStatusFun(e) {
        if (this.data.nameInput) {
            if (this.data.shake) {
                this.setData({
                    shake: false
                })
                let college = this.data.originalData[this.data.multiIndex[0]] //哪个院校
                let grade = college.gradeChildren[this.data.multiIndex[1]] //哪个专业
                let classes = grade.classChildren[this.data.multiIndex[2]] //哪个班级
                common.request(API.saveDepartmentClassApi, {
                    departmentId: college.id,
                    gradeId: grade.id,
                    classId: classes.id,
                    educationId: this.data.objectEducation[this.data.educationIndex].id,
                    name: this.data.nameInput,
                    openId: this.data.studentId,
                    userSex: this.data.sexArr[this.data.sexIndex].value || 0
                }).then((res) => {
                    console.log("保存院系 专业 班级信息接口成功啦:", res)
                    if (res.code === 200) {
                        this.setData({
                            informationPopup: false,
                            nameInput: '',
                            shake: true,
                            pageNo: 1,
                            dataList: []
                        })
                        wx.showToast({
                            title: '修改成功',
                            icon: 'success',
                            duration: 2000
                        })
                        setTimeout(() => {
                            this.getUserListFun()
                        }, 100)
                    }
                })
            }
        } else {
            wx.showToast({
                title: '请输入姓名',
                icon: 'none',
                duration: 2000
            })
        }
    },
    //搜索用户
    onSearch(e) {
        console.log("搜索输入值:", e.detail)
        this.setData({ searchName: e.detail })
        if (e.detail) {
            let requesQuery = {
                name: {
                    type: "eq",
                    value: e.detail
                }
            }
            if (this.data.tabIndex === '5') {
                requesQuery.instructorFlag = {
                    type: "eq",
                    value: 1
                }
            }
            common.request(API.getUserListApi, {
                tableName: "ar_user",
                filters: requesQuery
            }).then((res) => {
                console.log("搜索接口成功啦:", res)
                if (res.code === 200) {
                    this.setData({
                        pageNo: 1,
                        dataList: res.rows
                    })
                }
            })
        }
    },
    //取消搜索
    onSearchCancel() {
        this.setData({
            searchName: '',
            pageNo: 1,
            dataList: []
        })
        //区分是在哪个tabIndex下
        if (this.data.tabIndex === '4') {
            this.getUserListFun()
        } else if (this.data.tabIndex === '5') {
            this.getUserListFun('coach')
        }
    },
    onClose() {
        this.setData({
            show: false
        });
    },
    onClosePopup() {
        this.setData({ informationPopup: false });
    },
    coachPopupClose() {
        this.setData({ coachPopup: false });
    },
    medalPopupClose() {
        this.setData({ medalPopup: false });
    },
    bindtaltol(e) {
        this.setData({ memo: e.detail.value })
    },
    handleClickClose() {
        this.setData({ signInPopup: false })
    },
    handleOpenSignInPopup() {
        this.setData({ signInPopup: true })
        common.request(API.getSignInListApi, {
            proType: 0
        }, 'application/x-www-form-urlencoded').then((res) => {
            console.log("excel列表成功了:", res)
            if (res.code === 200) {
                this.setData({ excelList: res.data })
            }
        })
    },
    //打开成为教练二维码弹窗
    handleOpenCoachPopup() {
        common.request(API.getBecomeCoachQrCodeApi, {}).then((res) => {
            console.log("excel列表成功了:", res)
            if (res.code === 200) {
                this.setData({ coachImgUrl: res.data, coachPopup: true })
            }
        })
    },
    
    downloadFun(e) {
        let {id, name} = e.currentTarget.dataset
        wx.downloadFile({
            url: `${API.downloadExcelApi}?siginId=${id}`,
            filePath: `${wx.env.USER_DATA_PATH}/${name}.xls`,
            success(res) {
                if (res.statusCode === 200) {
                    const filePath = res.filePath;
                    wx.openDocument({
                        filePath: filePath,
                        showMenu: true,
                        fileType: 'xls',
                        success: function (res) {
                            console.log('打开文档成功', res)
                        }
                    })
                }
            },
            fail(err) {
                console.log("下载文件失败了")
            }
        })
    },
    //删除教官
    deleteCoachFun(e) {
        let clickId = e.currentTarget.dataset.id
        // 确认框
        Dialog.confirm({
            title: '确认提示',
            message: '是否确定删除此条数据？'
        }).then(() => {
            // 发送请求
            common.request(API.cancelCoachApi, {
                userId: clickId,
            }, 'application/x-www-form-urlencoded').then((res) => {
                console.log("删除接口成功啦:", res)
                if (res.code === 200) {
                    // this.setData({
                    //     pageNo: 1,
                    //     dataList: []
                    // })
                    common.Toast('操作成功')
                    let deleteIndex = this.data.dataList.findIndex(item => {
                        return item.id === clickId
                    })
                    this.data.dataList.splice(deleteIndex, 1)
                    this.setData({ dataList: this.data.dataList })
                    // setTimeout(() => {
                    //     this.getWaitBarrageListFun('Y')
                    // }, 100)
                } else {
                    common.Toast(res.msg)
                }
            })
        }).catch(() => {});
    },
    //打开获取机器人勋章二维码弹窗
    handleOpenMedalPopup() {
        common.request(API.getRobotQrCodeApi, {
            userId: app.globalData.userId
        }, 'application/x-www-form-urlencoded').then((res) => {
            console.log("excel列表成功了:", res)
            if (res.code === 200) {
                this.setData({ robotMedalImgUrl: res.data, medalPopup: true })
            } else {
                common.Toast(res.msg)
            }
        }).catch((err) => {
            common.Toast('请求出错啦')
        })
    },
    handleClickBtnChange(e) {
        let clickIdx = e.currentTarget.dataset.idx
        if (clickIdx === '1') {
            common.request(API.coachQueryMedalListApi, {
                userId: app.globalData.userId
            }, 'application/x-www-form-urlencoded').then((res) => {
                console.log("excel列表成功了:", res)
                if (res.code === 200) {
                    this.setData({ due: res.data.personSum, playUserList: res.data.detailList || [] })
                }
            })
        }
        this.setData({ btnIndex: clickIdx })
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
        if (this.data.isReachBottom) {
            this.setData({
                pageNo: this.data.pageNo + 1
            })
            if (this.data.tabIndex === '0') {
                this.getWaitBarrageListFun('N')
            } else if (this.data.tabIndex === '1') {
                this.getWaitBarrageListFun('Y')
            } else if (this.data.tabIndex === '2') {
                this.getWaitBadgeListFun('N')
            } else if (this.data.tabIndex === '3') {
                this.getWaitBadgeListFun('Y')
            } else if (this.data.tabIndex === '4') {
                this.getUserListFun()
            } else if (this.data.tabIndex === '5') {
                this.getUserListFun('coach')
            }
        }
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})