// page/star/star.js
Page({
  data: {
    mark: 0,
    range: [1, 2, 3, 4, 5],
    multipleSlots: false
  },
  properties: {
    mark: {
      type: Number,
      value: '',
      observer: 'update'
    }
  },
  methods: {
    update: function (newVal, oldVal) {
      this.setData({
        mark: newVal
      })
    },
    tapMark(e) {
      let mark = parseInt(e.target.dataset.mark) || 0;
      if (mark > 0) {
        this.setData({
          mark: mark
        });
        this.triggerEvent('markChange', { mark: mark }, {})
      }
    }
  }
 
})