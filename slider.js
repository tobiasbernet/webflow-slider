var Webflow = Webflow || [];
Webflow.push(function() {
  var l = $('#sliderblock .slider-arrow-left');
  var r = $('#sliderblock .slider-arrow-right');
  $('#sliderblock')
    .on('click', '.slider-left', function() {
      l.trigger('tap');
    })
    .on('click', '.slider-right', function() {
      r.trigger('tap');
    });
});

function debounce(func, wait, immediate) {
  var timeout;
  return function() {
    var context = this,
      args = arguments;
    var later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}

var onScroll = debounce(function(direction) {
  if (direction == false) {
    $("#slider-arrow-right").trigger('tap');
  } else {
    $("#slider-arrow-left").trigger('tap');
  }
}, 100, true);

$('.collection-list-wrapper').bind('wheel', function(e) {
  var navSlider = document.querySelector('.slide-nav-2');
  var last = navSlider.children.length - 1;

  e.preventDefault();
  deltaY = event.deltaY;
  deltaX = event.deltaX;
  delta = e.originalEvent.wheelDelta;
  offsetPlus = 30; // offset => do not react to short touchs
  offsetMinus = -30;
  tapDirection = null; // 0 == right, 1 == left, null == undefined

  // Detect direction and do some buffering
  if ((delta <= offsetMinus && deltaY <= 0 && deltaX >= 0)) {
    tapDirection = 1
  } else if (delta >= offsetPlus && deltaX <= 0) {
    tapDirection = 0
  } else if (delta <= offsetMinus && deltaY >= 0 && deltaX >= 0) {
    tapDirection = 1
  }

  // tap left
  if (tapDirection === 1) {
    // Don't tap left on the last element
    if ($('.w-active').index() === 0) {
      return;
    }
    onScroll(true);
  // tap right
  } else if (tapDirection === 0) {
    // Don't tap right on the last element
    if ($('.w-active').index() === last) {
      return;
    }
    onScroll(false);
  }
});
