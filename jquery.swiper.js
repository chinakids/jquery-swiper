/*
  说明 : swiper jquery扩展，减少dom中比不要的class添加
        增加slide的ID 方便多slide维护
  依赖 : swiper
  编写 : chinakids
 */
(function($){
  "use strict";
  //所有slide的ID
  var thisPageList=[];
  //随机数方法
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
  //检查ID是否存在
  function findId(id){
    for(var key in thisPageList){
      if(thisPageList[key] == id){
        return false;
      }
    }
    return false;
  }
  //删除指定键值
  function deleId(id){
    console.log(thisPageList);
    for(var k in thisPageList){
      if(thisPageList[k] == id){
        thisPageList.splice(k,1);
        console.log(thisPageList);
      }
    }
  }
  //扩展方法
  $.fn.extend({
    slide : function(obj){
      var _obj = obj || {};
      $(this).each(function(){
        var _this = $(this),
            id = rand(100,999);
        function createSlide(){
          //绑定过先移除
          var c = _this.attr('class'),i = '';
          for(var k in c.split(' ')){
            if(c.split(' ')[k].indexOf('slide-') != -1){
              i = c.split(' ')[k];
              _this.removeClass(i);
              deleId(i.split('-')[1]);
            }
          }
          //做ID唯一判断
          //console.log(findId(id));
          if(!findId(id)){
            thisPageList.push(id);
            //加上需要的class
            _this.addClass('slide-'+id);
            _this.find('.slide-list').addClass('swiper-container');
            _this.find('.slide-list ul').addClass('swiper-wrapper');
            _this.find('.slide-list li').addClass('swiper-slide');
            //限制控制按钮区域
            //console.log(thisPageList);
            if(_obj.prevButton != undefined){
              _obj.prevButton = '.slide-'+id+' '+_obj.prevButton;
            }
            if(_obj.nextButton != undefined){
              _obj.nextButton = '.slide-'+id+' '+_obj.nextButton;
            }
            if(_obj.pagination != undefined){
              _obj.pagination = '.slide-'+id+' '+_obj.pagination;
            }
            //实例swiper
            var swiper = new Swiper('.slide-'+id+' .swiper-container',_obj);

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