## 动画优化

在demo05，我们已经实现了BS的基本功能了，但是仔细发现，还是有bug

1.  不回弹
2.  滑动不流畅
 

1.原因是没加_transitionEnd函数判断
```
class EScroll{

    _transitionEnd(){
        if (e.target !== this.scroller || !this.isInTransition) {
          return
        }
        this._transitionTime()
        if (!this.resetPosition(this.options.bounceTime, ease.bounce)) {
          this.isInTransition = false
        }
    }
}

```
如果当前元素不是滚动对象或者不是在要进行过渡效果，返回

设置过渡时间为 0 ，是停止当前的过渡效果

通过resetPosition来判断是否超出滚动区域，已超出设置过渡函数，并且关闭这次回弹的过渡函数 this.isInTransition = false


2. 滑动不流畅，在于在_move的过程中，没有及时transition-duration设置为0，导致滑动的过程也一直进行元素过渡。
 
我们在touch开始的时候重置为0，新增个 stop函数
```
class EScroll{
    _start(e) {
        e.preventDefault()
        this.distX = 0
        this.distY = 0
        this.directionX = 0
        this.directionY = 0
        this.startTime = getNow()
        this._transitionTime()
        this.stop()
    
        let point = e.touches ? e.touches[0] : e
    
        this.startX = this.x
        this.startY = this.y
        this.absStartX = this.x
        this.absStartY = this.y
        this.pointX = point.pageX
        this.pointY = point.pageY
    }
    stop () {
        if (this.isInTransition) {
          this.isInTransition = false
          let pos = this.getComputedPosition()
          this._translate(pos.x, pos.y)
        }
    }
    getComputedPosition() {
        let matrix = window.getComputedStyle(this.scroller, null)
        let x
        let y
        matrix = matrix['webkitTransform'].split(')')[0].split(', ')
        x = +(matrix[12] || matrix[4])
        y = +(matrix[13] || matrix[5])
        return { x, y }
    }
}

```
getComputedPosition获取当前transform的x和y值