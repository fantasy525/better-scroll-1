## 学习分享
tip: 学习源码是最快速的进步途径之一，其实黄老写的库中，大多数写的很精细，通俗易懂。


#### 源码入口
```
import { eventMixin } from './scroll/event'
import { initMixin } from './scroll/init'
import { coreMixin } from './scroll/core'
import { snapMixin } from './scroll/snap'
import { wheelMixin } from './scroll/wheel'
import { scrollbarMixin } from './scroll/scrollbar'
import { pullDownMixin } from './scroll/pulldown'
import { pullUpMixin } from './scroll/pullup'
import { mouseWheelMixin } from './scroll/mouse-wheel'
import { zoomMixin } from './scroll/zoom'
import { infiniteMixin } from './scroll/inifinity'
import { warn } from './util/debug'

function BScroll(el, options) {
  ...
}

initMixin(BScroll)
coreMixin(BScroll)
eventMixin(BScroll)
snapMixin(BScroll)
wheelMixin(BScroll)
scrollbarMixin(BScroll)
pullDownMixin(BScroll)
pullUpMixin(BScroll)
mouseWheelMixin(BScroll)
zoomMixin(BScroll)
infiniteMixin(BScroll)

BScroll.Version = '1.13.2'

export default BScroll

```

入口的函数类似组合模式一样，定义对象，通过mixin方式扩展原型链。


#### event.js
实现事件分发的功能，和vue，$on和$emit类似

this.$on('', function(){}, context)

this.trigger('', arguments)

#### 绑定函数
target.addEventListener(type, listener[, options]);

listener必须是一个实现了 EventListener 接口的对象(含有handleEvent函数)，或者是一个函数。

源码中, listener必须是一个实现了是传入this
// element.addEventListener('touchstart', this, false);
```
BScroll.prototype.handleEvent = function (e) {
    switch (e.type) {
      case 'touchstart':
      case 'mousedown':
        this._start(e)
        if (this.options.zoom && e.touches && e.touches.length > 1) {
          this._zoomStart(e)
        }
        break
        ...
    }
}
```
统一引入，也可以额外扩展功能

#### dom.js
这个是兼容浏览器的工具库，非常nice。
prefixStyle 兼容浏览器的前缀差异，但教程全程用webkit，没用兼容。


#### ease.js
由于BS重度依赖css3，贝塞尔曲线系数，可以参考[帧数动画](https://github.com/ljcGitHub/my-blog-issue/issues/2)，
由于css3是三阶贝塞尔曲线系数，比较容易推导和理解。
类似的transform中的translate,scale,rotate都是matrix的语法糖，css3的基值 matrix(1, 0, 0, 1, 0, 0)

实现也不难的, 推荐先算平移，旋转，正切，缩放
```
const MatrixBase = [1, 0, 0, 1, 0, 0]

class Matrix {
  constructor() {
    let x
    if (arguments.length > 0) {
      x = Array.prototype.slice.call(arguments)
    } else {
      x = MatrixBase
    }
    for (const p in x) {
      this[p] = x[p]
    }
    this.length = x.length
  }
  translate(x, y) {
    this[4] += this[0] * x + this[2] * y
    this[5] += this[1] * x + this[3] * y
    return this
  }
  rotate(r) {
    const cos = Math.cos(r),
      sin = Math.sin(r),
      mx = this,
      a = mx[0] * cos + mx[2] * sin,
      b = mx[1] * cos + mx[3] * sin,
      c = -mx[0] * sin + mx[2] * cos,
      d = -mx[1] * sin + mx[3] * cos
    this[0] = a
    this[1] = b
    this[2] = c
    this[3] = d
    return this
  }
  skew(x, y) {
    const tanX = Math.tan(x),
      tanY = Math.tan(y),
      mx0 = this[0],
      mx1 = this[1]
    this[0] += tanY * this[2]
    this[1] += tanY * this[3]
    this[2] += tanX * mx0
    this[3] += tanX * mx1
    return this
  }
  scale(x, y) {
    const mx = this
    this[0] *= x
    this[1] *= x
    this[2] *= y
    this[3] *= y
    return this
  }
}
```

最后祝大佬们，学习愉快！
