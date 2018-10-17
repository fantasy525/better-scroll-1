## touchstat函数

新增touch事件
```
class EScroll{
  constructor(el, options) {
    ...
  }
  _start(e) { }
  _move(e) { }
  _end(e) { }
  _transitionEnd(e) { }
}

```

接下来，重点编写 _star 函数
```
class EScroll{

    ...
    
  _start(e) { 
    e.preventDefault()

    this.distX = 0 // 重置x坐标的差值
    this.distY = 0 // 重置y坐标的差值
    this.directionX = 0 // 重置x轴移动的方向
    this.directionY = 0 // 重置y轴移动的方向
    this.startTime = getNow() // 记录当前touch的时间
    
    let point = e.touches ? e.touches[0] : e

    this.startX = this.x // 记录x的开始值
    this.startY = this.y // 记录y的开始值
    this.absStartX = this.x // 记录x的开始绝对值
    this.absStartY = this.y // 记录y的开始绝对值
    this.pointX = point.pageX // 记录x的坐标值
    this.pointY = point.pageY // 记录y的坐标值
  }
}
```

_star函数作用： 
1. 记录初始化的坐标值
2. 重置坐标值之间的差值，也就是移动的距离。
3. 停止当前滚动，如果当前正在滚动中，停止当前滚动，进行新的滚动效果（后期加上）

