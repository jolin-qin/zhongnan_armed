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
				imgFriendUrl: API.imgFriendUrl, //服务器静态图片地址
				oldUserCenterPage: '', //扫码进入userCenter页面显示新的UI
        userInfo: null,
        hasUserInfo: false, //用户信息
        hasStudentInfor: false,//是否有学籍信息
        isCanShoot: false,//能否射击
        scanCodeEntry: false,//扫码进入
        nameInput: '',//姓名
        classInput: '',//年纪
        // 学院
        arrayAcademy: [],
        objectArrayAcademy: [],
        indexAcademy: 0,
        authorizationPopup: false,//授权弹窗
        informationPopup: false, //完善信息弹窗
				educationArr: [], //学历
				educationIndex: 0, //学历
				objectEducation: [],
				sexArr: [{name: '女', value: 0}, {name: '男', value: 1}], //性别
				sexIndex: 0, //默认  女
				originalData: [],
				multiArray: [],
				multiIndex: [0, 0, 0],
				shake: true,
				passwordPopup: false,
				inputValue: '', //密码值
				focus: false, //密码input获得焦点
				passwordList: [], //密码
				errorTips: false, //密码错误提示
				friendlyValueList: [],
				ARimg: '',
                AIimg: [],
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
			//从index.wxml进入
			// if (app.globalData.sort === 'wuZhuangBu') {
            //     wx.hideTabBar()
			// 	this.setData({ oldUserCenterPage: 'wuZhuangBu' })
			// }
			// if (app.globalData.sort === 'guoFang') {
			// 	wx.showTabBar()
			// 	this.setData({ oldUserCenterPage: 'guoFang' })
			// }
			//扫码进入
			if (options.scene) {
                let value = common.getCode(unescape(options.scene))
                //value为获取到二维码传给我的参数，注意与扫码获取方式不一样
                let way = value.get("t")
                let positionId = value.get("pId")
                // 进入类型
				if (way) {
					app.globalData.entryWay = way
					//1与2代表是武装部的UI
					if (way === '1' || way === '2') {
                        wx.hideTabBar()
						this.setData({ oldUserCenterPage: 'wuZhuangBu' })
					} else {
						this.setData({ oldUserCenterPage: 'guoFang' })
                    }
                    //测试与AI二维码会带参数eq
                    if (way === '13' || way === '15') {
                        let eq = value.get("eq")
                        app.globalData.eqNumber = eq
                    }
				}
				if (positionId) {
					app.globalData.positionId = positionId
				}
			} else {
                this.setData({ oldUserCenterPage: 'guoFang' })
            }
			// app.globalData.entryWay = '15'
			this.isAuthorizationFun()
				
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
    //检验是否授权
    isAuthorizationFun() {
        let self = this;
        wx.showLoading({
            title: '加载中...',
            mask: true
        })
        wx.login({
            success: (res) => {
                common.request(API.isAuthorizationApi, {
                    code: res.code
                }).then((res) => {
                    wx.hideLoading()
                    console.log("检验是否授权接口返回值：", res)
                    if (res.code === 200) {
                        app.globalData.openId = res.data.openId
                        //已经微信授权，但不一定完善了信息
                        if (res.data.flag) {
                            self.setData({
                                userInfo: res.data,
                                hasUserInfo: true,
                            })
                            app.globalData.userInfo = res.data
                            app.globalData.userId = res.data.id
                            // 判断模拟射击训练是否可点击
                            // if (res.data.isPass === 1) {
                            //     self.setData({ isCanShoot: true, scanCodeEntry: false})
                            //     // 如果entryWay=1不做处理
                            //     if (app.globalData.entryWay === '2') {
                            //         wx.navigateTo({
                            //             url: '/pages/shootStart/shootStart' //射击过渡页
                            //         })
                            //     }
                            // } else {
                            //     self.setData({ isCanShoot: false })
                            //     // 如果entryWay有值
                            //     if (app.globalData.entryWay === '1') {
                            //         wx.navigateTo({
                            //             url: '/pages/anserEntryPage/anserEntryPage' //开始答题页
                            //         })
                            //     } else if (app.globalData.entryWay === '2') {
                            //         self.setData({ scanCodeEntry: true })
                            //     }
                            // }
														// flag为true是有可能没填学籍信息的
														if (res.data.departmentName && res.data.educationIdName) {
															console.log("90909090：", app.globalData.entryWay)
														    app.globalData.hasStudentStatus = true
														    self.setData({ informationPopup: false, hasStudentInfor: true })
														    if (app.globalData.entryWay === '1') {
																	// 判断模拟射击训练是否可点击
																	if (res.data.isPass === 1) {
																		self.setData({ isCanShoot: true, scanCodeEntry: false})
																	} else {
																		self.setData({ isCanShoot: false })
																		wx.navigateTo({
																		    url: '/pages/anserEntryPage/anserEntryPage' //开始答题页
																		})
																	}
																} else if (app.globalData.entryWay === '2') {
																	// 判断模拟射击训练是否可点击
																	if (res.data.isPass === 1) {
																		self.setData({ isCanShoot: true, scanCodeEntry: false})
																		wx.navigateTo({
																		    url: '/pages/shootStart/shootStart' //射击过渡页
																		})
																	} else {
																		self.setData({ isCanShoot: false, scanCodeEntry: true })
																	}
																}
																
																// 签到
														    else if (app.globalData.entryWay === '11') {
																	common.request(API.signInApi, {
																		userId: app.globalData.userId,
																		proType: 0
																	}, 'application/x-www-form-urlencoded').then((res) => {
																		if (res.code === 200) {
																			common.Toast("签到成功！", 2000)
																		} else {
																			common.Toast(res.msg)
																		}
																	}).catch((err) => {
																		console.log("我出错了")
																	})
																	//弹幕
														    } else if (app.globalData.entryWay === '12') {
														        wx.switchTab({
														          url: '/pages/guoFang/barrage/barrage'
														        })
																		//测试
														    } else if (app.globalData.entryWay === '13') {
                                                                common.request(API.saveBehaviorApi, {
                                                                    openId: app.globalData.openId,
                                                                    proType: 1,
                                                                    eqNumber: app.globalData.eqNumber
                                                                }).then((res) => {
                                                                    app.globalData.eqNumber = ''
                                                                }).catch((err) => {
                                                                    app.globalData.eqNumber = ''
                                                                })
                                                                wx.navigateTo({
														            url: '/pages/guoFang/testStart/testStart'
														        })
																//AR换装
														    } else if (app.globalData.entryWay === '14') {
																	//测试过了，可以玩AR换装
																	if (res.data.isAIok === '1') {
																		common.request(API.scanARapi, {
																		    userId: app.globalData.userId,
																		    proType: 0
																		}, 'application/x-www-form-urlencoded').then((res) => {
																		    console.log("玩AR了：", res)
																		    if (res.code === 200) {
																		        wx.showModal({
																		          title: '提示',
																		          content: '请在大屏上玩AR换装吧',
																		        	showCancel: false,
																		        	confirmText: '确定',
																		          success (res) {
																		            if (res.confirm) {
																									
																		            } else if (res.cancel) {
																									
																		            }
																		          }
																		        })
																		    } else {
																					common.Toast(res.msg)
																				}
																		})
																		//没过也要请求下接口
																	} else {
																		common.request(API.scanARapi, {
																		    userId: app.globalData.userId,
																		    proType: 0
																		}, 'application/x-www-form-urlencoded').then((res) => {
																		    console.log("没资格玩AR：", res)
																		})
																		self.goStartAnswerPage()
																	}
																	//AI人脸融合
														    } else if (app.globalData.entryWay === '15') {
																	if (res.data.isAIok === '1') {
																		wx.navigateTo({
																		  url: '/pages/guoFang/AIdetection/AIdetection'
																		})
																	} else {
																		self.goStartAnswerPage()
																	}
														    }
														} else {
														    self.setData({ informationPopup: true, hasStudentInfor: false })
														    this.getStudentStatusFun() //获取学历信息
														    this.getLinkageStudentStatusFun() //获取院系专业班级信息
														}
														//是新国防该请求的函数
														if (app.globalData.entryWay !== '1' && app.globalData.entryWay !== '2' && this.data.oldUserCenterPage !== 'wuZhuangBu') {
															self.fridendlyTestListFun() //测试记录
														}
                            
                        } else {
                            self.setData({ authorizationPopup: true })
                        }
												//是新国防该请求的函数
												if (app.globalData.entryWay !== '1' && app.globalData.entryWay !== '2' && self.data.oldUserCenterPage !== 'wuZhuangBu') {
													self.arPhotoFun() //AR照片
													self.AIphotoFun() //AI照片
												}
                        return false
                    }
                })
            }
        })
    },
		goStartAnswerPage() {
			wx.showModal({
			  title: '提示',
			  content: '国防教育知识测评满80分才可以进行哦',
				cancelText: '确定',
				confirmText: '去答题',
			  success (res) {
			    if (res.confirm) {
			      wx.navigateTo({ url: '/pages/guoFang/testStart/testStart' })
			    } else if (res.cancel) {
			      console.log('用户点击取消')
			    }
			  }
			})
		},
    //第一次登录函数
    autoLogin() {
        common.request(API.loginApi, {
            openId: app.globalData.openId,
            nickName: app.globalData.userInfo.nickName,
            avatarUrl: app.globalData.userInfo.avatarUrl
        }).then((res) => {
            console.log("login接口返回值：", res)
            if (res.code === 200) {
                this.isAuthorizationFun()
            }
        })
    },
    
		//打开密码输入弹窗
		openPasswordPopup() {
		    if (this.data.hasUserInfo) {
		        if (this.data.hasStudentInfor) {
		            this.setData({
		                passwordPopup: true,
		                focus: true
		            })
		            console.log("input:", this.data.focus)
		        } else {
		            this.setData({ informationPopup: true })
		        }
		    } else {
		        this.setData({ authorizationPopup: true })
		    }
		},
		
		//关闭密码输入弹窗
		closePasswordPopup() {
		    console.log("我被点击了")
		    this.setData({
		        passwordPopup: false,
		        focus: false,
		        inputValue: '',
		        passwordList: []
		    })
		},
		
		// 输入密码触发input事件
		bindKeyInput: function (e) {
		    this.setData({ inputValue: e.detail.value })
		    let strLength = this.data.inputValue.length
		    this.setData({ passwordList: [] })
		    for (let i = 0; i < strLength; i++) {
		        let newlike = 'passwordList[' + i + ']'
		        this.setData({ [newlike]: '·' })
		    }
		    if (strLength === 0) {
		        this.setData({ passwordList: [] })
		    }
		    if (strLength === 4) {
		        common.request(API.getPasswordApi, {
		            password: this.data.inputValue,
		            id: app.globalData.userId,
		            proType: 0
		        }).then((res) => {
		            console.log("密码接口:" ,res)
		            if (res.code === 200) {
		                if (res.data.flag) {
		                    this.setData({
		                        focus: false,
		                        passwordPopup: false,
		                        passwordList: [],
		                        inputValue: ''
		                    })
		                    wx.navigateTo({
		                        url: '/pages/guoFang/audit/audit'
		                    })
		                } else {
		                    this.setData({
		                        errorTips: true,
		                        passwordList: [],
		                        inputValue: ''
		                    })
		                    setTimeout(() => {
		                        this.setData({ errorTips: false })
		                    }, 1500)
		                }
		            } else {
										common.Toast(res.msg)
		            }
		        })
		    }
		},
		
    //新版授权API
    getUserProfile(e) {
        let self = this;
        wx.getUserProfile({
            desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
            success: (res) => {
                console.log("获取用户信息新API:",res)
                // let newResult = res.userInfo
                // newResult.headImgUrl = res.userInfo.avatarUrl
                app.globalData.userInfo = res.userInfo;
                self.setData({
                    // hasUserInfo: true,
                    // userInfo: newResult,
                    authorizationPopup: false
                })
                //登录函数
                self.autoLogin()
            },
            fail(err) {
                console.log(err)
            }
        })
    },
		
		//更换微信头像
		getUserImg(res) {
		  console.log(res)
			console.log("我被点击了")
		  let that = this
		  wx.uploadFile({
		    url: API.changeAvatarApi,
		    filePath: res.detail.avatarUrl,
		    name: 'file',
		    formData: {
		      userId: app.globalData.userInfo.id
		    },
		    success (res) {
		      const data = JSON.parse(res.data)
		      //do something
		      console.log("上传成功：", data)
		      if (data.code === 200) {
		        that.setData({
		          ['userInfo.headImgUrl']: data.data
		        })
		        app.globalData.userInfo.avatarUrl = data.data
		      } else {
						common.Toast('更改头像失败')
		      }
		    }
		  })
		},
		
		// goStartPage() {
		//   wx.reLaunch({ url: '/pages/index/index' })
		// },
    //去开始答题过渡页
    goAnswerEntryPage() {
        if (this.data.hasUserInfo) {
						wx.reLaunch({
						    url: '/pages/answerQuestionPage/answerQuestionPage' 
						})
        } else {
            this.setData({ authorizationPopup: true })
        }
    },
		goAnswerPage() {
			wx.reLaunch({
			    url: '/pages/guoFang/answerQuestionPage/answerQuestionPage' 
			})
		},
		
		
    // 调用扫一扫
    callScan() {
        common.saoyisao()
    },
    //打开授权弹窗
    openAuthorizationPopupFun() {
        this.setData({
            authorizationPopup: true
        })
    },
    //关闭授权弹窗
    closeAuthorizationPopupFun() {
        this.setData({
            authorizationPopup: false
        })
    },
    // 获取测试列表
    fridendlyTestListFun() {
        common.request(API.friendlyTestApi, {
            userId: app.globalData.userId,
            proType: 1
        }).then((res) => {
            console.log("友善值测试列表接口成功啦:" ,res)
            if (res.code === 200) {
                let arr = res.data.friendlyList
                arr.forEach((item) => {
                    item.createTime = common.timeHandlerFun(item.createTime)
                })
                this.setData({ friendlyValueList: arr })
            }
        })
    },
		
		// 获取AR合影列表
		arPhotoFun() {
				common.request(API.photoListApi, {
				    rowCout: 1,
				    proType: '0'
				}, 'application/x-www-form-urlencoded').then((res) => {
				    console.log("AR合影列表接口成功啦:" ,res)
				    if (res.code === 200) {
				        if (res.data.length > 0) {
				            this.setData({ ARimg: res.data[0].imgPath })
				        }
				    }
				})
		},
		
		// 获取AI合影列表
		AIphotoFun() {
				common.request(API.photoAIlistApi, {
				    rowCout: 2,
				    proType: '0'
				}, 'application/x-www-form-urlencoded').then((res) => {
				    console.log("AI合影列表接口成功啦:" ,res)
				    if (res.code === 200) {
				        if (res.data.length > 0) {
				            this.setData({ AIimg: res.data })
				        }
				    }
				})
		},
		
    //去答题排行榜
    goRankPage(e) {
			if (this.data.hasUserInfo) {
					wx.navigateTo({
						url: '/pages/knowledgeRank/knowledgeRank',
					})
			} else {
				this.setData({ authorizationPopup: true })
			}
    },
		
		//去测试结果页
		checkFriendValueFun(e) {
		    if (this.data.hasUserInfo) {
		        if (this.data.hasStudentInfor) {
		            let id = e.currentTarget.dataset.id
		            wx.navigateTo({
		                url: `/pages/guoFang/resultPage/resultPage?id=${id}&whereFrom=userCenter`
		            })
		        } else {
		            this.setData({ informationPopup: true })
		        }
		    } else {
		        this.setData({ authorizationPopup: true })
		    }
		},
		
    // 获取学历数组
    getStudentStatusFun() {
        common.request(API.getDepartmentClassApi, {}).then((res) => {
            console.log("获取学历接口成功啦:" ,res)
            if (res.code === 200) {
                this.setData({
                    educationArr: this.getArrayProps(res.data.educationList, 'name'),
                    objectEducation: res.data.educationList,
                })
								
                app.globalData.xueLiArr = this.getArrayProps(res.data.educationList, 'name')
                app.globalData.xueLiObjectArr = res.data.educationList
            }
        })
    },
    // 获取院系 专业 班级信息（联动）
    getLinkageStudentStatusFun() {
        common.request(API.getDepartmentClassLinkageApi, {}).then((res) => {
            console.log("获取学籍联动接口成功啦:" ,res)
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
    
		// 单个select 改变触发函数
		bindPickerChange: function(e) {
			// console.log(e.detail)
			let index = e.currentTarget.dataset.ids
			if (index === '2') {
				this.setData({ educationIndex: Number(e.detail.value) })
			} else if (index === '1') {
				this.setData({ sexIndex: Number(e.detail.value) })
			}
		},
		
		bindMultiPickerChange: function (e) {
		    // console.log('picker发送选择改变，携带值为', e.detail.value)
		    this.setData({
		        multiIndex: e.detail.value
		    })
		},
		
		// picker联动
		bindMultiPickerColumnChange: function (e) {
		    let self = this
		    console.log(e)
		    console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
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
		    this.setData({ nameInput: e.detail.value })
		},
		
		// 提交学籍表单
		submitStudentStatusFun(e) {
		    if (this.data.nameInput) {
		        if (this.data.shake) {
		            this.setData({ shake: false })
		            let college = this.data.originalData[this.data.multiIndex[0]] //哪个院校
		            let grade = college.gradeChildren[this.data.multiIndex[1]] //哪个专业
		            let classes = grade.classChildren[this.data.multiIndex[2]] //哪个班级
		            console.log(college.id)
		            console.log(grade.id)
		            console.log(classes.id)
		            common.request(API.saveDepartmentClassApi, {
		                departmentId: college.id,
		                gradeId: grade.id,
		                classId: classes.id,
		                educationId: this.data.objectEducation[this.data.educationIndex].id,
		                name: this.data.nameInput,
		                openId: app.globalData.openId,
										userSex: this.data.sexArr[this.data.sexIndex].value || 0
		            }).then((res) => {
		                console.log("保存院系 专业 班级信息接口成功啦:" ,res)
		                if (res.code === 200) {
		                    this.setData({
		                        informationPopup: false,
		                        hasStudentInfor: true,
		                        nameInput: '',
		                        shake: true
		                    })
		                    this.isAuthorizationFun()
		                    Notify({ type: 'success', message: '提交成功' })
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
    //AR照片列表页
    goARphotoList() {
        if (this.data.hasUserInfo) {
            wx.navigateTo({
              url: '/pages/guoFang/ARphotoList/ARphotoList'
            })
        } else {
            this.setData({ authorizationPopup: true })
        }
    },
		//AI照片列表页
		goAIphotoList() {
		    if (this.data.hasUserInfo) {
		        wx.navigateTo({
		          url: '/pages/guoFang/AIphotoList/AIphotoList'
		        })
		    } else {
		        this.setData({ authorizationPopup: true })
		    }
		},
		//国防答题排行榜
		goGuoFangRankPage() {
		    if (this.data.hasUserInfo) {
		        wx.navigateTo({
		          url: '/pages/guoFang/guoFangRank/guoFangRank'
		        })
		    } else {
		        this.setData({ authorizationPopup: true })
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