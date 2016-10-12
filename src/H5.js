const $ = selector => document.querySelector(selector)
const $$ = selector => document.querySelectorAll(selector)

class H5 {
  constructor (animations) {
    // 设置默认参数
    this.windowHeight = this.isSupportTouch() ? window.document.documentElement.clientHeight : 480
    this.windowWidth = this.isSupportTouch() ? window.document.documentElement.clientWidth : 320
    this.originWidth = 320 // 基准宽度
    this.originHeight = 480 // 基准高度
    this.scale = 1
    this.startY = null
    this.currentPage = 0 // 当前页
    this.prevPage = 0 // 之前页
    this.isMoving = false // section 是否在自动运动中
    this.isPageMoved = false // section 是否被手指带动了
    this.duration = 0.4 // 单位秒
    this.delays = [] // 延迟动画函数队列
    this.sections = $$('section') // dom section 集合
    this.totalPage = this.sections.length
    this.animations = animations // 动画配置

    this.isMouseDown = false
    window.addEventListener('load', e => {
      $('#loader').className = 'hidden'
      this.init()
    })
  }

  init(){
    this.initTouchEvent()
    // 判断触摸设备
    if(this.isSupportTouch()) {
      this.initPageScale()
    }else{
      this.initMouseEvent()
    }
    this.startAnimation(this.animations[0])
  }

  /**
   * 初始化页面缩放
   */
  initPageScale(){
    let scale = 1
    const winWidth = this.windowWidth
    const winHeight = this.windowHeight
    if(winWidth / winHeight >= this.originWidth / this.originHeight){
      scale = winHeight / this.originHeight
    }else{
      scale = winWidth / this.originWidth
    }
    this.scale = scale
    $('[name="viewport"]').setAttribute("content", `width=${this.originWidth}, initial-scale=${scale}, maximum-scale=${scale}, user-scalable=no`)
  }

  /**
   * 初始化各个section的位置
   */
  initPosition(){
    this.sections[0].classList.add('currentSection')
  }

  /**
   * 使该id屏置于顶部或底部待滚动：top or bottom
   */
  setPosition($dom, position){
    $dom.classList.add(`moveSection`)
    $dom.setAttribute('data-position', position)
  }

  scrollTo($dom, isNext) {
    this.isMoving = true
    this.isPageMoved = false
    this.translateYAnimate($dom, this.windowHeight * (isNext ? -1 : 1))
    setTimeout(this.transitionend.bind(this), this.duration * 1000)
  }

  initMouseEvent(){
    const currentDOM = document
    const prevBtn = $('#prev-btn')
    const nextBtn = $('#next-btn')
    currentDOM.addEventListener('mousewheel', this.onWheelDelta.bind(this))
    currentDOM.addEventListener('mousedown', this.onTouchstart.bind(this))
    currentDOM.addEventListener('mousemove', this.onTouchmove.bind(this))
    currentDOM.addEventListener('mouseup', this.onTouchend.bind(this))
    prevBtn.addEventListener('click', this.onClickPageBtn.bind(this, 'prev'))
    nextBtn.addEventListener('click', this.onClickPageBtn.bind(this, 'next'))
  }

  initTouchEvent(){
    const currentDOM = document
    currentDOM.addEventListener('touchstart', this.onTouchstart.bind(this))
    currentDOM.addEventListener('touchmove', this.onTouchmove.bind(this))
    currentDOM.addEventListener('touchend', this.onTouchend.bind(this))
  }

  getSectionByIndex(index){
    if(!this.sections){
      this.sections = $$('section')
      return this.sections[index]
    }else{
      return this.sections[index]
    }
  }

  /**
   * 屏幕动画到指定Y
   */
  translateYAnimate($dom, num){
    const duration = this.duration
    num = num / this.scale
    $dom.classList.remove('panSection')
    $dom.classList.add('moveSection')
    $dom.style.transition = $dom.style.webkitTransition = `all ${duration}s ease-in`
    $dom.style.transform = $dom.style.webkitTransform = `translate3d(0, ${num}px, 0)`
  }

  /**
   * 指定section dom，无动画，用于跟随手指
   */
  translateY($dom, num){
    $dom.classList.add('panSection')
    $dom.classList.remove('moveSection')
    $dom.style.transition = $dom.style.webkitTransition = `all 0s`
    $dom.style.transform = $dom.style.webkitTransform = `translate3d(0, ${num}px, 0)`
  }

  /**
   * css动画执行完毕回调
   */
  transitionend(){
    Array.prototype.forEach.call($$('section'), (ele, i)=>{
      ele.style.webkitTransition = ele.style.transition = 'none'
      ele.classList.remove('currentSection', 'moveSection')
      if(this.currentPage === i){
        ele.classList.remove('moveSection')
        ele.classList.add('currentSection')
      }else{
        ele.style.webkitTransform = ele.style.transform = 'none'
      }
    })

    this.clearAnimation(this.prevPage)
    this.startAnimation(this.animations[this.currentPage])
    this.isMoving = false
  }

  startAnimation(eles){
    this.delayAnimate(eles)
  }

  clearAnimation(prevPage){
    // 清理之前的delay
    this.delays.forEach((data)=>{
      clearTimeout(data)
    })
    this.delays = []
    // 清理之前的动画
    Array.prototype.forEach.call(this.getSectionByIndex(prevPage).querySelectorAll('.animate-ele'), ele => {
      ele.style.opacity = 0
      ele.style.animation = ele.style.webkitAnimation = 'none'
    })
  }

  // 单个animate-ele
  delayAnimate(eles){
    if(!eles) return
    const currentPage = this.currentPage
    const animateEles = this.getSectionByIndex(currentPage).querySelectorAll('.animate-ele')
    eles.forEach((anim, subi)=>{
      const clock = setTimeout(()=>{
        animateEles[subi].style.webkitAnimation = animateEles[subi].style.animation = eles[subi].name
        animateEles[subi].style.opacity = 1
      }, eles[subi].delay)
      this.delays.push(clock)
    })
  }

  onClickPageBtn(type, e){
    if(this.isMoving) return
    const isPanUp = type === 'next'
    this.setCurrentPage(e, isPanUp, true)
    const targetDom = this.getSectionByIndex(this.currentPage)
    let isNext
    if(isPanUp){
      isNext = true
      this.setPosition(targetDom, 'bottom')
      const Null = targetDom.getBoundingClientRect().height
    }else{
      isNext = false
      this.setPosition(targetDom, 'top')
      const Null = targetDom.getBoundingClientRect().height
    }
    this.scrollTo(targetDom, isNext)
  }

  onWheelDelta(e){
    if(this.isMoving) return
    this.setCurrentPage(e, !this.isWheelUp(e))
    const targetDom = this.getSectionByIndex(this.currentPage)
    let isNext
    if(!this.isWheelUp(e)){
      isNext = true
      this.setPosition(targetDom, 'bottom')
      const Null = targetDom.getBoundingClientRect().height
    }else{
      isNext = false
      this.setPosition(targetDom, 'top')
      const Null = targetDom.getBoundingClientRect().height
    }
    this.scrollTo(targetDom, isNext)
  }

  /**
   * 判断滚轮是否向上滚
   */
  isWheelUp(e){
    return e.wheelDelta > 0 ? true : false
  }

  /**
   * 手指刚刚接触到屏幕执行
   */
  onTouchstart(e) {
    if(typeof e.y === 'number'){
      this.isMouse = true
      this.isMouseDown = true
    }
    this.startY = this.getCurrentY(e)
  }

  /**
   * 滑动事件时的动作
   */
  onTouchmove(e){
    e.preventDefault()
    if(!this.isSupportTouch()) {
      if(!this.isMouseDown) return
    }
    this.isPageMoved = true
    if(this.isMoving) return
    let targetDom
    // 向上滑
    if(this.isPanUp(e)){
      targetDom = this.isLastScreen() ? this.getSectionByIndex(0) : this.getSectionByIndex(this.currentPage + 1)
      this.setPosition(targetDom, 'bottom')
    // 向下滑
    }else{
      targetDom = this.isFirstScreen() ? this.getSectionByIndex(this.totalPage - 1) : this.getSectionByIndex(this.currentPage - 1)
      this.setPosition(targetDom, 'top')
    }
    // 跟随手指移动
    this.translateY(targetDom, this.getPanDistance(e))
  }

  /**
   * 手指离开时的回调函数
   */
  onTouchend(e){
    this.isMouseDown = false
    if(this.isMoving || this.getPanDistance(e) === 0 || ! this.isPageMoved) return
    this.isMoving = true
    this.isPageMoved = false
    // 计算currentPage
    this.setCurrentPage(e, this.isPanUp(e))
    this.scrollTo(this.getSectionByIndex(this.currentPage), this.isPanUp(e))
  }

  // 获取当前Y坐标
  getCurrentY(e){
    if(!this.isSupportTouch()) return e.y
    return e.changedTouches[0].screenY
  }

  /**
   * 获取滑动距离
   */
  getPanDistance(e){
    return this.getCurrentY(e) - this.startY
  }

  /**
   * 是否向上滑动
   */
  isPanUp(e){
    return this.getPanDistance(e) < 0
  }

  /**
   * 是否在第一屏
   */
  isFirstScreen(){
    return this.currentPage === 0
  }

  /**
   * 是否在最后一屏
   */
  isLastScreen(){
    return this.currentPage + 1 === this.totalPage
  }

  isSupportTouch(){
    const agent = navigator.userAgent
    return /Android/.test(agent) || /BlackBerry/.test(agent) || /iPhone|iPad|iPod/.test(agent) || /IEMobile/.test(agent)
  }

  /**
   * 设置当前页数和之前页数
   */
  setCurrentPage(e, isPanUp, isClick){
    // 当手指未移动时
    if(this.getCurrentY(e) === this.startY && !isClick) return

    this.prevPage = this.currentPage

    // 当在第一屏且向下滑动
    if(this.isFirstScreen() && ! isPanUp) {
      this.currentPage = this.totalPage - 1
      return
    }
    // 当到最后一屏且向上滑动
    if(this.isLastScreen() && isPanUp) {
      this.currentPage = 0
      return
    }

    // 正常情况下的滑动
    if(isPanUp){
      this.currentPage ++
    }else{
      this.currentPage --
    }
  }
}

export default H5
