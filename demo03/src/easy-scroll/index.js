import {
  getRect, addEvent, offset, getNow, ease, 
  DIRECTION_UP, DIRECTION_DOWN, DIRECTION_LEFT, DIRECTION_RIGHT,
  momentum
} from '../../../demo01/src/easy-scroll/utils'

class EScroll{
  constructor(el, options) {
    this.wrapper = typeof el === 'string' ? document.querySelector(el) : el
    this.scroller = this.wrapper.children[0]
    this.scrollerStyle = this.scroller.style
    this.options = {
      bounceTime: 800, // 设置回弹动画的动画时长
      deceleration: 0.0015, // momentum 动画的减速度
      swipeBounceTime: 500, // 单位ms,设置当运行 momentum 动画时，超过边缘后的回弹整个动画时间。
      swipeTime: 2500, // 设置 momentum 动画的动画时长。
      bounce: true, // 当滚动超过边缘的时候会有一小段回弹动画。设置为 true 则开启动画
      momentumLimitTime: 300, //快速滑动的时间小于 momentumLimitTime，才能开启 momentum 动画
      momentumLimitDistance: 15  //快速滑动的距离大于 momentumLimitDistance，才能开启 momentum 动画。
    }
    this._init()
  }
  _init() {
    this.x = 0
    this.y = 0
    this.directionX = 0
    this.directionY = 0
    addEvent(this.wrapper, 'touchstart', (e) => {
      this._start(e)
    })
    addEvent(this.wrapper, 'touchmove', (e) => {
      this._move(e)
    })
    addEvent(this.wrapper, 'touchend', (e) => {
      this._end(e)
    })
    addEvent(this.wrapper, 'touchcancel', (e) => {
      this._end(e)
    })
    addEvent(this.wrapper, 'webkitTransitionEnd', (e) => {
      this._transitionEnd(e)
    })
    this.refresh()
  }
  refresh() {
    let wrapperRect = getRect(this.wrapper)
    this.wrapperWidth = wrapperRect.width
    this.wrapperHeight = wrapperRect.height

    let scrollerRect = getRect(this.scroller)
    this.scrollerWidth = Math.round(scrollerRect.width)
    this.scrollerHeight = Math.round(scrollerRect.height)

    this.relativeX = scrollerRect.left
    this.relativeY = scrollerRect.top
 
    this.minScrollX = 0
    this.minScrollY = 0

    this.maxScrollX = 0
    this.maxScrollY = this.wrapperHeight - this.scrollerHeight
    if (this.maxScrollY < 0) {
      this.maxScrollY -= this.relativeY
      this.minScrollY = -this.relativeY
    }
    this.endTime = 0
    this.directionX = 0
    this.directionY = 0
    this.wrapperOffset = offset(this.wrapper)
  }
  _start(e) { 
    e.preventDefault()

    this.distX = 0
    this.distY = 0 
    this.directionX = 0
    this.directionY = 0
    this.startTime = getNow()

    let point = e.touches ? e.touches[0] : e

    this.startX = this.x
    this.startY = this.y
    this.absStartX = this.x
    this.absStartY = this.y
    this.pointX = point.pageX
    this.pointY = point.pageY
  }
  _move(e) { }
  _end(e) { }
  _transitionEnd(e) { }
}

export default EScroll