## 初始化函数

```
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
  }
}
```
由于简化了代码，去掉可以配置的参数，option的参数是计算快速滑动的回弹动画，保存容器，滚动对象及样式。


### 工具类
新建工具类的文件 src/easy-scroll/utils.js
```
export const getRect = function (el) {
  if (el instanceof window.SVGElement) {
    let rect = el.getBoundingClientRect()
    return { top: rect.top, left: rect.left, width: rect.width, height: rect.height }
  } else {
    return {
      top: el.offsetTop, left: el.offsetLeft,
      width: el.offsetWidth, height: el.offsetHeight
    }
  }
}

export const addEvent = function (el, type, fn, capture) {
  el.addEventListener(type, fn, {passive: false, capture: !!capture})
}
```


#### 新增 _init 函数
1. 初始化数据。
2. 绑定事件。
3. 调用refresh函数获取容器的高度，刷新计算滚动最大值和最小值。

```
import {getRect, addEvent} from  './utils'

class EScroll{
  constructor(el, options) {
    ...
    
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
  }
}
```

上面的代码是绑定事件，源码是引入dom.js中style对象。为了简化代码，只模拟移动端touch事件，不弄pc端的mouse事件。


#### refresh 函数
使用BS就知道，这个函数是重新刷新滚动高度。实现原理是获取容器和滚动对象的offset值。


修改 src/easy-scroll/index.js
```
class EScroll{
  ...
  
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
}
```

