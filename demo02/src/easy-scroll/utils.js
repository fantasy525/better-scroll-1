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