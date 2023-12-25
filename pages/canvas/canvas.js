// index.js
// 获取应用实例
const app = getApp()
import API from "../../utils/api.js"
let isDrawing = false
let lastX = 0
let lastY = 0
let ctx = null
let canvas = null
Page({
    data: {
      signature: null, // 存储签名数据
      localImg: '',
      
    },
    onReady: function () {
        const query = wx.createSelectorQuery()
        query.select('#myCanvas').fields({ node: true, size: true }).exec((res) => {
            canvas = res[0].node
            ctx = canvas.getContext('2d')
            ctx.fillStyle = '#ffffff'
        })
    },
    onLoad() {
     
    },
    //开始触摸
    canvasTouchStart(e) {
        isDrawing = true
        lastX = e.touches[0].x
        lastY = e.touches[0].y
    },
    canvasTouchMove(e) {
        if (!isDrawing) return
        const currentX = e.touches[0].x
        const currentY = e.touches[0].y
        //绘制路径
        ctx.moveTo(lastX, lastY)
        ctx.lineTo(currentX, currentY)
        ctx.stroke()

        lastX = currentX
        lastY = currentY
    },
    canvasTouchEnd() {
        isDrawing = false
        ctx.closePath()
    },
    saveSignature: function () {
        let that = this
      // 将画布内容转换为图片数据
      const dataUrl = wx.canvasToTempFilePath({
        canvas: canvas,
        success: function (res) {
          // 将图片数据存储到本地或上传到服务器
          console.log(res.tempFilePath)
          that.setData({ localImg:  res.tempFilePath})
        },
        fail: function(err) {
            console.log(err)
        }
      })
    }
  })
