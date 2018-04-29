$(function () {

// 対象となる要素を変数に格納しておく
var $slider     = $('#slider'),
    $container  = $slider.find('div.slider-container'),
    $containerDiv = $slider.find('div.slider-container div');
var distance = 0;    //移動距離を指定するのに使う

// スライド関数
var slide = {

  // スライド(進む)
  next: function (index, spd, flick_flg) {
    distance = distance + index;
    slide.scroll(distance, spd, flick_flg);
  },

  // スライド(戻る)
  prev: function (index, spd, flick_flg) {
    distance = distance - index;
    slide.scroll(distance, spd, flick_flg);
  },

  //移動距離分スクロール
  scroll : function (d, spd, flick_flg) {
    var move = -d
    var env = 'translate3d(' + move + 'px,0,0)';

    if (flick_flg) {
      /* フリック時はwebkit-transformプロパティを設定し、滑らかなアニメーションにする */
      transit_property = '-webkit-transform ' + spd + 'ms cubic-bezier(0,0,0.25,1)';
    } else {
      transit_property = 'none';
    }

    $container.css({
      '-webkit-transform':env,
      '-webkit-transition':transit_property
    }).bind('webkitTransitionEnd', function(){
       //ここで移動後の終了イベントが取れます
    });
  }
}

$(window).load(function() {
  var pageX;      //リアルタイムのX座標
  var pageY;      //リアルタイムのY座標
  var startPageX; //スタート時のX 座標の位置
  var startTime;  //スタート時の時間
  var move_time = 0;

  /* タッチの開始時のイベント */
  $('#slider').bind('touchstart', function() {
    event.preventDefault();     // ページが動いたり、反応を止める（A タグなど）
    pageX = event.changedTouches[0].pageX;
    pageY = event.changedTouches[0].pageY;
    startPageX = pageX;
    startTime = +new Date();
  });

  /* タッチしたまま動かしたときのイベント */
  $('#slider').bind('touchmove', function() {
    var moveX = event.changedTouches[0].pageX; // X 座標の位置
    var absX = Math.abs(pageX - moveX); // 移動距離の絶対値
    var spd = 0.5;
    pageY = event.changedTouches[0].pageY;

    /* スワイプ処理 */
      if (pageX > moveX) {
        slide.next(absX, spd);
      } else if (pageX < moveX) {
        slide.prev(absX, spd);
      }
      pageX = moveX;
  });

  /* タッチ状態から離れたときのイベント */
  $('#slider').bind('touchend', function() {
  	/* 終了処理が必要ならここに書く */
    /* このイベントは、位置を取得できないので注意 */

    var diffX = startPageX - pageX;
    var absX = Math.abs(diffX);
    var mv = 200; //フリック移動距離
    var spd = 700; //フリックスピード
    var now = +new Date(); //現在時間
    var diffTime = now - startTime; //touchstartからの経過時間

    /* フリック処理(touchstartからの経過時間が短い場合) */
    if (diffTime < 400) {
      if (diffX > 0) {
        slide.next(mv, spd, true);
      } else if (diffX < 0) {
        slide.prev(mv, spd, true);
      }
    }

    move_time = 0;
  });
});
});
