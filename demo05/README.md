## touchEnd函数


接下来，_end 函数是整个scroll的动画的核心，以下是动画实现，看到一大坨，别慌。。。

```
class EScroll {
    _end(e) {
    e.preventDefault()
    this.isInTransition = false

    let newX = Math.round(this.x)
    let newY = Math.round(this.y)

    let deltaX = newX - this.absStartX
    let deltaY = newY - this.absStartY
    this.directionX = deltaX > 0 ? DIRECTION_RIGHT : deltaX < 0 ? DIRECTION_LEFT : 0
    this.directionY = deltaY > 0 ? DIRECTION_DOWN : deltaY < 0 ? DIRECTION_UP : 0

    if (this.resetPosition(this.options.bounceTime, ease.bounce)) {
      return
    }

    this._translate(newX, newY)

    this.endTime = getNow()
    let duration = this.endTime - this.startTime
    let absDistX = Math.abs(newX - this.startX)
    let absDistY = Math.abs(newY - this.startY)

    let time = 0
    if (duration < this.options.momentumLimitTime && (
      absDistY > this.options.momentumLimitDistance ||
      absDistX > this.options.momentumLimitDistance)
    ) {
      let top = false
      let bottom = false
      let left = false
      let right = false
      const bounce = this.options.bounce
      if (bounce !== false) {
        top = bounce.top === undefined ? true : bounce.top
        bottom = bounce.bottom === undefined ? true : bounce.bottom
        left = bounce.left === undefined ? true : bounce.left
        right = bounce.right === undefined ? true : bounce.right
      }
      const wrapperWidth = ((this.directionX === DIRECTION_RIGHT && left) || (this.directionX === DIRECTION_LEFT && right)) ? this.wrapperWidth : 0
      const wrapperHeight = ((this.directionY === DIRECTION_DOWN && top) || (this.directionY === DIRECTION_UP && bottom)) ? this.wrapperHeight : 0
      let momentumX = {destination: newX, duration: 0}
      let momentumY = momentum(this.y, this.startY, duration, this.maxScrollY, this.minScrollY, wrapperHeight, this.options)
      newX = momentumX.destination
      newY = momentumY.destination
      time = Math.max(momentumX.duration, momentumY.duration)
      this.isInTransition = true

    }

    let easing = ease.swipe

    if (newX !== this.x || newY !== this.y) {
      if (newX > this.minScrollX ||
          newX < this.maxScrollX ||
          newY > this.minScrollY ||
          newY < this.maxScrollY) {
          easing = ease.swipeBounce
      }
      this.scrollTo(newX, newY, time, easing)
      return
    }
  }
}
```
#### 详解
一段一段代码解析_end函数如何处理滚动动画的效果：

```
this.isInTransition = false
```
上面是用来标记当前为过渡效果，在_transitionEnd函数和停止当前滚动效果的stop函数，进行判断。

==---------==我--是--分--割--线==-------------------==

```
let newX = Math.round(this.x)
let newY = Math.round(this.y)

let deltaX = newX - this.absStartX
let deltaY = newY - this.absStartY
this.directionX = deltaX > 0 ? DIRECTION_RIGHT : deltaX < 0 ? DIRECTION_LEFT : 0
this.directionY = deltaY > 0 ? DIRECTION_DOWN : deltaY < 0 ? DIRECTION_UP : 0
```
this.absStartY是绝对开始的坐标值

newY 是当前滚动位置的y轴的滚动值

通过相减得值，来判断滚动方向this.directionY

比如当前滚到中间 this.absStartY = -120,滚到下面去的话，ths.y = -240

this.directionY = -120 = -240 - (-120)

directionY为负数，所以方式是向上（手指滑动方向）


==---------==我--是--分--割--线==-------------------==

```
if (this.resetPosition(this.options.bounceTime, ease.bounce)) {
  return
}

this._translate(newX, newY)
```
resetPosition函数主要是处理边界值，超出滚动区域外，恢复到滚动的区域内，代码如下
```
resetPosition(time = 0, easeing = ease.bounce) {
    let x = this.x
    let y = this.y
    let roundY = Math.round(y)
    if (roundY > this.minScrollY) {
      y = this.minScrollY
    } else if (roundY < this.maxScrollY) {
      y = this.maxScrollY
    }
    if (y === this.y) {
      return false
    }
    this.scrollTo(x, y, time, easeing)
    return true
}

scrollTo(x, y, time = 0, easing = ease.bounce) {
    this.isInTransition = time > 0 && (x !== this.x || y !== this.y)
    this._transitionTimingFunction(easing.style)
    this._transitionTime(time)
    this._translate(x, y)
}
_transitionTimingFunction(easing) {
    this.scrollerStyle['webkitTransitionTimingFunction'] = easing
}
_transitionTime(time = 0) {
    this.scrollerStyle['webkitTransitionDuration'] = time + 'ms'
}
_translate(x, y) {
    this.scrollerStyle['webkitTransform'] = `translate(${x}px,${y}px) translateZ(0)`
    this.x = x
    this.y = y    
}
```
scrollTo函数比较简单，就是执行相应的修改滚动对象的样式，触发元素的css3过渡效果


==---------==我--是--分--割--线==-------------------==

##### 接下来，继续分析 _end函数 核心算法

```
this.endTime = getNow()
let duration = this.endTime - this.startTime
let absDistX = Math.abs(newX - this.startX)
let absDistY = Math.abs(newY - this.startY)

let time = 0
if (duration < this.options.momentumLimitTime && (
  absDistY > this.options.momentumLimitDistance ||
  absDistX > this.options.momentumLimitDistance)
) {
  let top = false
  let bottom = false
  const bounce = this.options.bounce
  if (bounce !== false) {
    top = bounce.top === undefined ? true : bounce.top
    bottom = bounce.bottom === undefined ? true : bounce.bottom
  }
  const wrapperHeight = ((this.directionY === DIRECTION_DOWN && top) || (this.directionY === DIRECTION_UP && bottom)) ? this.wrapperHeight : 0
  let momentumX = {destination: newX, duration: 0}
  let momentumY = momentum(this.y, this.startY, duration, this.maxScrollY, this.minScrollY, wrapperHeight, this.options)
  newX = momentumX.destination
  newY = momentumY.destination
  time = Math.max(momentumX.duration, momentumY.duration)
  this.isInTransition = true

}
```
章节只展示Y轴移动，所以删除了X轴的判断，X和Y方式实现方式是一样的。就不多解析了。

```
this.endTime = getNow()
let duration = this.endTime - this.startTime
let absDistX = Math.abs(newX - this.startX)
let absDistY = Math.abs(newY - this.startY)
```
这里的计算和上面不同，这是需要计算在滑动的绝对值和滑动时间。

用来判断是否为快速滑动。判断代码如下：

时间小于300ms，距离大于15
```
if (duration < this.options.momentumLimitTime && (
    absDistY > this.options.momentumLimitDistance ||
    absDistX > this.options.momentumLimitDistance)
) {
    ...
}
```


接下来，解析在这个判断内做的事件，为什么能模拟到滚动条的滑动效果。
```
let top = false
let bottom = false
const bounce = this.options.bounce
if (bounce !== false) {
    top = bounce.top === undefined ? true : bounce.top
    bottom = bounce.bottom === undefined ? true : bounce.bottom
}
const wrapperHeight = ((this.directionY === DIRECTION_DOWN && top) || (this.directionY === DIRECTION_UP && bottom)) ? this.wrapperHeight : 0
let momentumX = {destination: newX, duration: 0}
let momentumY = momentum(this.y, this.startY, duration, this.maxScrollY, this.minScrollY, wrapperHeight, this.options)
newX = momentumX.destination
newY = momentumY.destination
time = Math.max(momentumX.duration, momentumY.duration)
this.isInTransition = true
```
相信大家能一下看得懂代码，就是判断，然后执行momentum函数获取到新的滚动位置

momentum函数是一个计算动量在时间内，类似惯性增大目标值

```
const momentum= function (current, start, time, lowerMargin, upperMargin, wrapperSize, options) {
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
上面的代码，估计大家也会看晕了，一段代码一段的解析
```
let destination = current + speed / deceleration * (distance < 0 ? -1 : 1)
```
这代码就是 
```
                     目标值 - 开始值
实际距离 = 目标值 ± ——————————————————
                      时间  x 衰减系数  
```
笼统来说就是惯例滑出多余的距离。

剩下就是判断实际距离是否超出容器外部
```
if (destination < lowerMargin) {
    destination = wrapperSize ? Math.max(lowerMargin - wrapperSize / 4, lowerMargin - (wrapperSize / rate * speed)) : lowerMargin
    duration = swipeBounceTime
} else if (destination > upperMargin) {
    destination = wrapperSize ? Math.min(upperMargin + wrapperSize / 4, upperMargin + wrapperSize / rate * speed) : upperMargin
    duration = swipeBounceTime
}
```
超出了滚动区域，判断相应的值，取最大值或者最小值