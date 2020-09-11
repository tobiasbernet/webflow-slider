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
  console.log(direction);
  if (direction == false) {
    $("#slider-arrow-right").trigger('tap');
  } else {
    $("#slider-arrow-left").trigger('tap');
  }
}, 200, true);

$('#sliderblock').bind('wheel mousewheel', function(e) {
  e.preventDefault();
  var delta;
  if (typeof event != 'undefined' && event.wheelDelta) {
    delta = event.wheelDelta;
  } else {
    delta = -1 * e.originalEvent.deltaY;
  }

  var navSlider = document.querySelector('.slide-nav-2');
  var last = navSlider.children.length - 1;
  if ($('.w-active').index() == last) {
    if (delta >= 0) {
      $(navSlider.children[last - 1]).trigger('tap');
      delta = -1;
    } else {
      return;
    }
  } else if ($('.w-active').index() == 0) {
    if (delta <= 0) {
      $(navSlider.children[1]).trigger('tap');
      delta = 0;
    } else {
      return;
    }
  }
  onScroll(delta >= 0);
});
