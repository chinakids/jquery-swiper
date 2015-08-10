/**
 *   说明 : swiper3 jquery扩展，减少dom中比不要的class添加
 *        增加slide的ID 方便多slide维护
 *   依赖 : swiper，jquery
 *   编写 : chinakids
 *   时间 : 2015-06-11  UpdataTime 2015-08-10
 */
;(function($){
  "use strict";
  /**
   * 所有slide的数组，用于维护多swiper列表
   */
  var thisPageList=[];
  /**
   * 随机数方法
   * @param  {[number]} or {{obj}} smin [最小数 or 需要随机取的数据集合]
   * @param  {[number]} smax [最大数]
   * @return {[str]}      [随机取数结果]
   */
  function rand(smin, smax){
    if(typeof(smin) == "object"){
        var range = smin.length - 1;
        var rand = Math.random();
        return smin[Math.round(rand * range)];
    }else{
        var range = smax - smin;
        var rand = Math.random();
        return (smin + Math.round(rand * range));
    }
  }
  /**
   * 检查ID是否存在
   * @param  {[str]} id [要查找的键值]
   * @return {[bool]}    [恒定为FALSE,或不返回]
   */
  function findId(id){
    for(var key in thisPageList){
      if(thisPageList[key] == id){
        return false;
      }
    }
    return false;
  }
  /**
   * 删除指定键值
   * @param  {[str]} id [要删除的键值]
   */
  function deleId(id){
    //console.log(thisPageList);
    for(var k in thisPageList){
      if(thisPageList[k] == id){
        thisPageList.splice(k,1);
        console.log(thisPageList);
      }
    }
  }
  /**
   * 拷贝对象
   * @param  {[obj]} obj [需要拷贝的对象]
   * @return {[obj]}     [拷贝完成的新对象]
   */
  function clone(obj){
    if(typeof(obj) != 'object') return obj;
    if(obj == null) return obj;
    var newObj = new Object();
    for(var i in obj){
      newObj[i] = clone(obj[i]);
    }
    return newObj;
  }
  /**
   * 正对 swiper2不支持某些 swiper3的特新而增加的兼容部分
   * @param  {[object]} swiper [ swiper 对象 ]
   * @param  {[number]} id    [ 当前 swiper 对象的 ID ]
   * @param  {[object]} obj    [ 配置参数 ]
   */
  function useSwiper2(swiper,id,obj){
    //一下都是正对 swiper3降级到2 特性不支持的修正
    //prev,next 按钮修正
    $(obj.prevButton).click(function(){
      swiper.swipePrev();
    })
    $(obj.nextButton).click(function(){
      swiper.swipeNext();
    })
    //间距支持修正
    $('.slide-'+id).find('.swiper-slide').each(function(){
      $(this).css({marginRight:obj.spaceBetween,width:$(this).width()-obj.spaceBetween})
    })
    //外部容器宽度修正
    var ele = $('.slide-'+id).find('.swiper-slide');
    $('.slide-'+id).find('.swiper-wrapper').width((ele.width()+obj.spaceBetween+2)*ele.size() + 10); //加10为了容错
  }
  /**
   * jquery扩展方法
   */
  $.fn.extend({
    /**
     * jquery扩展的swiper方法
     * @param  {[obj]} obj [swiper初始化参数]
     */
    slide : function(obj){
      var obj = obj || {};
      $(this).each(function(){
        var _obj = clone(obj);
        var _this = $(this),
            id = rand(100,999);
        /**
         * 创建swiper
         */
        function createSlide(){
          /**
           * 绑定过的先移除
           */
          var c = _this.attr('class'),i = '';
          for(var k in c.split(' ')){
            if(c.split(' ')[k].indexOf('slide-') != -1){
              i = c.split(' ')[k];
              _this.removeClass(i);
              deleId(i.split('-')[1]);
            }
          }
          /**
           * 做ID唯一判断
           */
          if(!findId(id)){
            thisPageList.push(id);
            /**
             * 加上需要的class
             */
            _this.addClass('slide-'+id);
            _this.find('.slide-list').addClass('swiper-container');
            _this.find('.slide-list ul').addClass('swiper-wrapper');
            _this.find('.slide-list li').addClass('swiper-slide');
            /**
             * 限制控制按钮区域
             */
            if(_obj.prevButton != undefined){
              _obj.prevButton = '.slide-'+id+' '+_obj.prevButton;
            }
            if(_obj.nextButton != undefined){
              _obj.nextButton = '.slide-'+id+' '+_obj.nextButton;
            }
            if(_obj.pagination != undefined){
              _obj.pagination = '.slide-'+id+' '+_obj.pagination;
            }

            /**
             * 实例swiper
             */
            _obj.calculateHeight = true; //fixed swiper2
            //console.log(_obj)
            var swiper = new Swiper('.slide-'+id+' .swiper-container',_obj);
            //console.log(!!swiper.version)
            if(!!!swiper.version){
              //swiper2.使用兼容函数
              useSwiper2(swiper,id,_obj);
            }

          }else{
            id = rand(100,999);
            createSlide();
          }
        }
        createSlide();
      })
    }
  });
})(jQuery);
