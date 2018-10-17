import Vue from './vue.min'
import BScroll from 'better-scroll'
import EScroll from './easy-scroll'

new Vue({
  el: '#app',
  mounted: function () {
    this.$nextTick(function () {
      const bsWrapper = document.getElementById('bsWrapper')
      new BScroll(bsWrapper)

      const esWrapper = document.getElementById('esWrapper')
      new EScroll(esWrapper)
    })
  }
})


