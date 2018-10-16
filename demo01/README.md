## 环境搭建

由于时间原因，就请大家直接拷贝本章节的内容，跳过搭建环境。


为了实现better-scroll，采用UI对比方式。


UI左侧为better-scroll，右侧为我们实现的better-scroll


## better-scroll

better-scroll 最常见的应用场景是列表滚动，我们来看一下它的 html 结构
```html
<div class="wrapper">
  <ul class="content">
    <li>...</li>
    <li>...</li>
    ...
  </ul>
  <!-- 这里可以放一些其它的 DOM，但不会影响滚动 -->
</div>
```
 滚动原理是 div.content 的高度大于 div.wrapper 的高度
 
 最简单的初始化代码如下：

``` js
import BScroll from 'better-scroll'
let wrapper = document.querySelector('.wrapper')
let scroll = new BScroll(wrapper)
```

我们新建个 src/easy-scroll/index.js
```
class EScroll{
  constructor(el, options) {
  }
}

export default EScroll
```

实例方式和better-scroll一样

#### 实现原理

better-scroll依赖css3实现滚动

通过momentum函数模拟滚动差值

通过修改transition-timing-function模拟浏览器的滚动效果

#### 工具类
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

export const offset = function (el) {
  let left = 0
  let top = 0
  while (el) {
    left -= el.offsetLeft
    top -= el.offsetTop
    el = el.offsetParent
  }
  return { left, top }
}

export const getNow = () => new Date()

export const ease = {
  // easeOutQuint
  swipe: {
    style: 'cubic-bezier(0.23, 1, 0.32, 1)',
    fn: function (t) {
      return 1 + (--t * t * t * t * t)
    }
  },
  // easeOutQuard
  swipeBounce: {
    style: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    fn: function (t) {
      return t * (2 - t)
    }
  },
  // easeOutQuart
  bounce: {
    style: 'cubic-bezier(0.165, 0.84, 0.44, 1)',
    fn: function (t) {
      return 1 - (--t * t * t * t)
    }
  }
}



export const DIRECTION_UP = 1
export const DIRECTION_DOWN = -1
export const DIRECTION_LEFT = 1
export const DIRECTION_RIGHT = -1
export const momentum= function (current, start, time, lowerMargin, upperMargin, wrapperSize, options) {
  /*
  current: 结束值
  start： 初始值  
  time 时间
  lowerMargin： 峰值
  upperMargin: 峰值
  wrapperSize  容器的
  */
  let distance = current - start
  let speed = Math.abs(distance) / time
  // deceleration 0.0015
  // swipeBounceTime 500ms
  // swipeTime 2500ms
  let {deceleration, swipeBounceTime, swipeTime} = options
  let duration = swipeTime
  let rate =  15

  let destination = current + speed / deceleration * (distance < 0 ? -1 : 1)

  if (destination < lowerMargin) {
    destination = wrapperSize ? Math.max(lowerMargin - wrapperSize / 4, lowerMargin - (wrapperSize / rate * speed)) : lowerMargin
    duration = swipeBounceTime
  } else if (destination > upperMargin) {
    destination = wrapperSize ? Math.min(upperMargin + wrapperSize / 4, upperMargin + wrapperSize / rate * speed) : upperMargin
    duration = swipeBounceTime
  }

  return {
    destination: Math.round(destination),
    duration
  }
}
```

getRect函数 获取元素位置

addEvent 绑定事件

offset 获取绝对位置

getNow 获取当前时间

ease 物理缓动函数和css3的贝塞尔曲线系数

DIRECTION_UP    判断方向上
DIRECTION_DOWN  判断方向下
DIRECTION_LEFT  判断方向左
DIRECTION_RIGHT 判断方向右

momentum  计算滚动差值算法（重点！！！）


本章节完。。。

