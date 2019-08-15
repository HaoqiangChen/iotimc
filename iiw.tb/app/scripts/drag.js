var app = angular.module('myApp', []);
app.controller('myCtrl', function ($scope, $timeout) {

  var dragMinWidth = 100;
  var dragMinHeight = 100;

  $scope.tvWindow = {
    select: '',
    warning: {
      show: false,
      top: '',
      left: ''
    },
    top: '',
    left: '',
    list: [
      {active: false, top: '0', left: '0', width: '50%', height: '100%',
        child: [
          {active: false, top: '0', left: '0', width: '50%', height: '50%', zindex: 1, cameraname: '一监区', windowid: 0},
          // {active: false, top: '0', left: '50%', width: '50%', height: '50%', zindex: 1, cameraname: '二监区', windowid: 1},
          // {active: false, top: '50%', left: '0', width: '50%', height: '50%', zindex: 1, cameraname: '监控室', windowid: 2},
          // {active: false, top: '50%', left: '50%', width: '50%', height: '50%', zindex: 1, cameraname: '', windowid: 3}
        ]
      },
      {active: false, top: '0', left: '50%', width: '50%', height: '100%',
        child: []
      }
    ],
    /**
     * 初始化 dom 拖拽缩放 函数
     * @param dom {Object} 窗口节点
     */
    resizeWindow(dom) {
      // console.log(dom)
      var oDrag = dom;
      var oL = dom.getElementsByClassName('resizeL')[0];
      var oT = dom.getElementsByClassName('resizeT')[0];
      var oR = dom.getElementsByClassName('resizeR')[0];
      var oB = dom.getElementsByClassName('resizeB')[0];
      var oLT = dom.getElementsByClassName('resizeLT')[0];
      var oTR = dom.getElementsByClassName('resizeTR')[0];
      var oBR = dom.getElementsByClassName('resizeBR')[0];
      var oLB = dom.getElementsByClassName('resizeLB')[0];

      drag(oDrag);
      //四角
      resize(oDrag, oLT, true, true, false, false);
      resize(oDrag, oTR, false, true, false, false);
      resize(oDrag, oBR, false, false, false, false);
      resize(oDrag, oLB, true, false, false, false);
      //四边
      resize(oDrag, oL, true, false, false, true);
      resize(oDrag, oT, false, true, true, false);
      resize(oDrag, oR, false, false, false, true);
      resize(oDrag, oB, false, false, true, false);

    },
    stickyTopic(arr, index, callback) {
      callback(true);
      // var maxZindex = _.max(arr, function(stooge){ return stooge.zindex; }).zindex;
      // if (arr[index].zindex === maxZindex) {
      //   if (index === arr.length - 1) {return;} else {
      //     arr.push(arr[index]);
      //     arr.splice(index, 1);
      //   }
      // }
      // return arr;
    },
    setActive(e, $index) {
      _.map($scope.tvWindow.list, function (item, index) {
        if (index === $index) {
          item.active = true;
        } else {
          item.active = false;
        }
      })
    },
    selectWindow(e, $index, $win) {
      e.stopPropagation();
      $scope.tvWindow.resizeWindow(e.currentTarget);
      if ($win.active) {return;}
      this.stickyTopic($index, $index, function (isTop) {
        if (!isTop) {
          $scope.tvWindow.warning.show = true;
          $scope.tvWindow.warning.top = e.clientY - $('.tvwall')[0].offsetTop - 110;
          $scope.tvWindow.warning.left = e.clientX - $('.tvwall')[0].offsetLeft;
        } else {
          var windowList = $scope.tvWindow.list[e.currentTarget.parentElement.dataset.index].child;
          _.map(windowList, function (win, index) {
            if (index === $index) {
              win.active = true;
              win.zindex = win.zindex + 4;
            } else {
              win.active = false;
            }
          })
        }
      })
    },
  }

  $scope.openWindow = {
    wId: 'window',
    index: 0,
    target: null,
    flag: false,
    startX: 0,
    startY: 0,
    startL: 0,
    startT: 0,
    boxWidth: 0,
    boxHeight: 0,
    frame: null,
    frameBox: null,
    newMarkPos: {
      top: this.startT, // 按下时鼠标距离的上边的距离
      left: this.startL // 按下时鼠标距离的左边的距离
    },
    mouseDown: function (e) {
      var e = window.event || e;
      this.target = e.target || e.srcElement; //获取document 对象的引用
      if (!$(this.target).hasClass('box')) {
        this.flag = false;
      } else {
        this.flag = true;
      }
      //e.pageY，e.pageX兼容
      if(this.target.src) {
        stopDefault(e)
      }

      this.frame = $(e.currentTarget)
      this.frameBox = {
        pos: this.frame.offset(),
        width: this.frame.outerWidth(),
        height: this.frame.outerHeight()
      }

      var scrollTop = e.currentTarget.scrollTop;
      var scrollLeft = e.currentTarget.scrollLeft;
      var ePageX = e.clientX + scrollLeft;
      var ePageY = e.clientY + scrollTop;

      // 按下时鼠标距离页面的距离
      this.startX = ePageX;
      this.startY = ePageY;

      //按下时鼠标距离的左边和上边的距离
      this.startL = this.startX - this.frameBox.pos.left;
      this.startT = this.startY - this.frameBox.pos.top;
      this.index++;

      var div = document.createElement('div');
      div.id = this.wId + this.index;
      div.className = 'dashed-box';
      e.currentTarget.appendChild(div);
      div = null;
    },
    // 鼠标移动
    mouseMove: function(e) {
      var e = window.event || e;
      stopDefault(e)
      if(this.flag) {
        var scrollTop = e.currentTarget.scrollTop;
        var scrollLeft = e.currentTarget.scrollLeft;
        var ePX = e.clientX + scrollLeft;
        var ePY = e.clientY + scrollTop;
        var disW = ePX - this.startX;
        var disH = ePY - this.startY;
        var L = this.startL + disW;
        var T = this.startT + disH;
        if(disW > 0) {
          if(L >= 0) {
            this.boxWidth = disW
          }
          this.newMarkPos.left = this.startL;
        } else {
          if(L <= 0) {
            L = 0;
            this.boxWidth = this.startL;
          }
          this.boxWidth = (this.startL - L);
          this.newMarkPos.left = L;
        }
        if(disH > 0) {
          if(T >= 0) {
            this.boxHeight = disH
          }
          this.newMarkPos.top = this.startT;
        } else {
          if(T <= 0) {
            T = 0;
            this.boxHeight = this.startT;
          }
          this.boxHeight = (this.startT - T)
          this.newMarkPos.top = T;
        }
        document.getElementById(this.wId + this.index).style.left = this.newMarkPos.left + 'px';
        document.getElementById(this.wId + this.index).style.top = this.newMarkPos.top + 'px';
        document.getElementById(this.wId + this.index).style.width = Math.abs(this.boxWidth) + 'px';
        document.getElementById(this.wId + this.index).style.height = Math.abs(this.boxHeight) + 'px';
        if(e.srcElement.src) {
          stopDefault(e)
        }
      }
    },
    // 鼠标离开
    mouseUp: function(e) {
      var e = window.event || e;
      if(this.boxWidth >= 100 || this.boxHeight >= 100) {
        e.currentTarget.removeChild(document.getElementById(this.wId + this.index));
        this.index++;
        var windowList = $scope.tvWindow.list[e.currentTarget.dataset.index].child;
        var openwindow = {active: true, top: this.newMarkPos.top + 'px', left: this.newMarkPos.left + 'px', width: this.boxWidth + 'px', height: this.boxHeight + 'px', zindex: windowList.length, cameraname: '', windowid: windowList.length}
        windowList.push(openwindow);
        this.boxWidth = 0;
        this.boxHeight = 0;
      } else {
        if(this.flag) {
          e.currentTarget.removeChild(document.getElementById(this.wId + this.index));
        }
      }
      this.flag = false;
    },
  }

  //阻止默认行为
  function stopDefault(e) {
    if(e && e.preventDefault)
      e.preventDefault();
    else
      window.event.returnValue = false;
    return false;
  }

  /**
   * 拖拽函数
   * @param oDrag {Object} 父节点
   * @param handle {Object} 拖拽节点
   */
  function drag(oDrag, handle) {
    var disX = 0, disY = 0;
    handle = handle || oDrag;
    handle.style.cursor = 'move';
    handle.onmousedown = function (event) {
      var event = event || window.event;
      event.stopPropagation();
      disX = event.clientX - oDrag.offsetLeft;
      disY = event.clientY - oDrag.offsetTop;

      document.onmousemove = function (event) {
        var event = event || window.event;
        event.stopPropagation();
        var iL = event.clientX - disX;
        var iT = event.clientY - disY;
        var maxL = oDrag.parentElement.clientWidth - oDrag.offsetWidth;
        var maxT = oDrag.parentElement.clientHeight - oDrag.offsetHeight;

        iL <= 0 && (iL = 0);
        iT <= 0 && (iT = 0);
        iL >= maxL && (iL = maxL);
        iT >= maxT && (iT = maxT);

        oDrag.style.left = iL + 'px';
        oDrag.style.top = iT + 'px';

        return false
      };

      document.onmouseup = function () {
        document.onmousemove = null;
        document.onmouseup = null;
        this.releaseCapture && this.releaseCapture()
      };
      this.setCapture && this.setCapture();
      return false
    };
  }

  /**
   * 改变大小函数
   * @param oParent {Object} 父节点
   * @param handle {Object} 拖拽节点
   * @param isLeft {Boolean}
   * @param isTop {Boolean}
   * @param lockX {Boolean}
   * @param lockY {Boolean}
   */
  function resize(oParent, handle, isLeft, isTop, lockX, lockY) {
    handle.onmousedown = function (event) {
      window.event ? window.event.cancelBubble = true : event.stopPropagation(); // 阻止冒泡事件，防止与拖拽事件发生关联
      var event = event || window.event;

      var disX = event.clientX - handle.offsetLeft;
      var disY = event.clientY - handle.offsetTop;
      var iParentTop = oParent.offsetTop;
      var iParentLeft = oParent.offsetLeft;
      var iParentWidth = oParent.offsetWidth;
      var iParentHeight = oParent.offsetHeight;

      document.onmousemove = function (event) {
        var event = event || window.event;
        event.stopPropagation();

        var iL = event.clientX - disX;
        var iT = event.clientY - disY;
        var maxW = oParent.parentElement.clientWidth - 2;
        var maxH = oParent.parentElement.clientHeight - 2;
        var iW = isLeft ? iParentWidth - iL : handle.offsetWidth + iL;
        var iH = isTop ? iParentHeight - iT : handle.offsetHeight + iT;

        isLeft && (oParent.style.left = (iParentLeft + iL >= 0 ? iParentLeft + iL : 0) + 'px');
        isTop && (oParent.style.top = (iParentTop + iT >= 0 ? iParentTop + iT : 0) + 'px');

        iW < dragMinWidth && (iW = dragMinWidth);
        iW > maxW && (iW = maxW);
        lockX || (oParent.style.width = iW + 'px');

        iH < dragMinHeight && (iH = dragMinHeight);
        iH > maxH && (iH = maxH);
        lockY || (oParent.style.height = iH + 'px');

        if((isLeft && iW === dragMinWidth) || (isTop && iH === dragMinHeight)) document.onmousemove = null;

        return false;
      };
      document.onmouseup = function () {
        document.onmousemove = null;
        document.onmouseup = null;
      };
      return false;
    }
  }

  $scope.$on('myCtrlOnEvent', function () {
  })

  $scope.$watch('tvWindow.warning.show', function (nV) {
    if (nV) {
      $timeout(function () {
        $scope.tvWindow.warning.show = false;
      }, 300000)
    }
  })

});
