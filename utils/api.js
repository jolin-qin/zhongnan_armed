//现在的
// const hostBase = 'https://myznpro.wxumi.com'
const hostBase = 'https://armedzn.hnlvw.com'
const imgBase = 'https://zntest.wxumi.com'
const api = {
	imgFriendUrl: imgBase + '/newsImgs/',//借用友善厅的图片地址
	imgUrl: imgBase + '/guofang/',//国防程序图片来源
	imgArmedUrl: imgBase + '/armed/',//武装部图片来源
	getQuestionList: hostBase+'/armed/question/getQuestionList',//获取题目信息
	mpUploadOssHelper: hostBase+'/storage/aliyun/mpUploadOssHelper',//图片上传
	//mpUploadOssHelper: hostBase+'/storage/tx/osstoken',//图片上传
	saveQuestionListByPhone: hostBase+'/armed/testResult/saveQuestionListByPhone',//提交答案
	saveSaoRecord: hostBase+'/friendly/login/saveSaoRecord',//扫码记录信息_手机端
	isAuthorizationApi: hostBase+'/armed/login/code',//检查是否授权
	loginApi: hostBase+'/armed/login/login',//登录
	getDepartmentClassApi: hostBase+'/armed/login/getDepartmentClassList',//获取院系/姓名/班级信息
	getDepartmentClassLinkageApi: hostBase+'/armed/login/getDepartmentList',//获取院系/专业/班级信息(联动)
	saveDepartmentClassApi: hostBase+'/armed/login/saveDepartmentInfo',//保存院系/姓名/班级信息
	confirmShootingApi: hostBase+'/shooting/beginShooting',//确认打靶
	shootingRankingApi: hostBase+'/shooting/getRankingList',//打靶排行
	badgeCollegeRankApi: hostBase+'/armed/testResult/getRankListByDepartment',//知识测评院校排行榜
	badgePersonalRankApi: hostBase+'/armed/testResult/rankDataListPersonal',//知识测评个人排行榜
	

	// 国防API
	getMedalWallListApi: hostBase+'/armed/phone/getPersinMedalInfo',//勋章墙
	checkPendingBarrageApi: hostBase+'/armed/barrage/waitApproveBarrageList',//待审核弹幕列表
	removeBarrageApi: hostBase+'/armed/barrage/remove',//删除弹幕列表删除
	getUserListApi: hostBase+'/armed/barrage/list',//用户列表
	getUserDetailApi: hostBase+'/armed/barrage/edit',//查看用户详情
	getGuoFangResult: hostBase+'/armed/testResult/getQuestionResultById',//获取测试结果
	saveBehaviorApi: hostBase+'/armed/login/saveSaoRecord',//扫码记录信息_手机端
	
	auditBarrageApi: hostBase+'/armed/barrage/approveBarrage',//审核弹幕
	scanARapi: hostBase+'/armed/phone/scanArHz',//用户扫PC的AR换装
	// friendlyRankApi: hostBase+'/friendly/friendlyResult/getRankResult',//友善值排行榜
	
	sendBarrageApi: hostBase+'/armed/barrage/addBarrage',//发送弹幕
	barrageListApi: hostBase+'/armed/barrage/barrageHistory',//弹幕列表
	friendlyTestApi: hostBase+'/armed/testResult/friendlyMap',//获取测试列表数据
	photoListApi: hostBase+'/armed/phone/getArHzImgList',//AR照片合影列表
	photoAIlistApi: hostBase+'/armed/phone/getAIRHImgList',//AI照片合影列表
	
	getAItemplateApi: hostBase+'/armed/phone/getAIJzTemp',//获取AI军装照模板
	compositePhotoApi: hostBase+'/armed/phone/saveAIRHData',//上传二进制流合成AI军装照
	getPasswordApi: hostBase+'/armed/phone/password',//验证密码是否通过
	getWelcomeApi: hostBase+'/armed/phone/getWelcomeConfig',//获取迎宾词语
	setWelcomeApi: hostBase+'/armed/phone/setWelcomeConfig',//设置迎宾词语
    signInApi: hostBase+'/armed/phone/setWelcomeGuestsDate',//签到
    getSignInListApi: hostBase+'/armed/phone/findSiginList',//获取签到活动列表
    downloadExcelApi: hostBase+'/armed/phone/total/excel',//下载excel
	changeAvatarApi: hostBase+'/armed/login/uploadUserHeadImgToIo',//更换头像
}
module.exports = api