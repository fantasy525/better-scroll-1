## touchMove函数

接下来，_move 函数，_move函数分3段代码解析

#### _move函数数据处理
```
class EScroll{

    ...
    
  _move(e) { 
    e.preventDefault()
    let point = e.touches ? e.touches[0] : e
    let deltaX = point.pageX - this.pointX
    let deltaY = point.pageY - this.pointY
    this.pointX = point.pageX
    this.pointY = point.pageY
    this.distX += deltaX
    this.distY += deltaY
    let absDistX = Math.abs(this.distX)
    let absDistY = Math.abs(this.distY)
    let timestamp = getNow()
    
    // momentumLimitDistance : 300ms（在屏幕上快速滑动的时间）
    // momentumLimitDistance : 15px (在屏幕上快速滑动的距离)
    if (timestamp - this.endTime > this.options.momentumLimitTime &&
      (absDistY < this.options.momentumLimitDistance &&
        absDistX < this.options.momentumLimitDistance)
    ) {
      return
    }
  }
}
```
1. _start函数记录了开始的坐标。
2. _move的当前坐标值和开始值相减，并且获取2点触摸的距离.
3. 判断当前时间和距离是否在快速滑动范围内，快速滑动为300ms中滑动，滑动距离大于 15（具体参数看api）
 

#### _move函数边界值处理
```
class EScroll{
  _move(e) { 
    ...
    if (timestamp - this.endTime > this.options.momentumLimitTime &&
      (absDistY < this.options.momentumLimitDistance &&
        absDistX < this.options.momentumLimitDistance)
    ) {
      return
    }
    deltaX = 0
    let newX = this.x + deltaX
    let newY = this.y + deltaY

    let top = false
    let bottom = false
    // Slow down or stop if outside of the boundaries
    const bounce = this.options.bounce
    if (bounce !== false) {
      top = bounce.top === undefined ? true : bounce.top
      bottom = bounce.bottom === undefined ? true : bounce.bottom
    }

    if (newY > this.minScrollY || newY < this.maxScrollY) {
      if ((newY > this.minScrollY  && top) || (newY < this.maxScrollY && bottom)) {
        newY = this.y + deltaY / 3
      } else {
        newY = newY > this.minScrollY ? this.minScrollY : this.maxScrollY
      }
    }
    this._translate(newX, newY))
  }
}
```


1.  由于只做Y轴滚动，所以 deltaX = 0
2.  newY = this.y + deltaY 
3.  2个坐标之间差值为滚动值，this.y为开始的位置
4.  如果设置回弹效果，并且判断滚动的方向
5.  判断newY是否在超过顶部(最小滚动距离)，或者底部的距离(最大滚动距离)

```
1. 如果设置回弹效果，重新计算移动的距离，增加阻尼系数 0.3 
   newY = this.y + deltaY / 3

2. 如果没设置回弹效果，设置为边界值
   newY = newY > this.minScrollY ? this.minScrollY : this.maxScrollY
```

#### 新增 _translate函数
```
class EScroll {
  ...
  _translate(x, y) {
    this.scrollerStyle['webkitTransform'] = `translate(${x}px,${y}px) translateZ(0)`
    this.x = x
    this.y = y    
  }
  ...    
}
```




#### _move函数处理 滑到区域外的操作
```
class EScroll{
  _move(e) { 
    ...
   
    this._translate(newX, newY))
    
    if (timestamp - this.startTime > this.options.momentumLimitTime) {
      this.startTime = timestamp
      this.startX = this.x
      this.startY = this.y
    }

    let scrollLeft = document.documentElement.scrollLeft || window.pageXOffset || document.body.scrollLeft
    let scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop

    let pX = this.pointX - scrollLeft
    let pY = this.pointY - scrollTop

    if (pX > document.documentElement.clientWidth - this.options.momentumLimitDistance || pX < this.options.momentumLimitDistance || pY < this.options.momentumLimitDistance || pY > document.documentElement.clientHeight - this.options.momentumLimitDistance
    ) {
      this._end(e)
    }
  }
}
```
最后一步是处理用户的操作场景：
1. 正常匀速滑动，突然加速滑动的
2. 滑动到滚动区域外，结束当前滑动行为。

1. 匀速滑动，且不在快速滑动的时间中，保存当前时间和位置，为下一个move函数参考。
2. 当滚到区域外，判断停止滑动行为。直接执行_end函数



