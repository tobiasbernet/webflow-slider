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

var slideroffsetTime = 100;

function addDataHrefAttr() {
  var navSliderMask = document.querySelector('.w-slider-mask');
  var navSliderChildrens = navSliderMask.children;
  for (i = 0; i < navSliderChildrens.length; i++) {
    navElement = navSliderChildrens[i];
    linkElement = $(navElement).find("a");
    if (linkElement) {
      linkElement.attr("data-link", linkElement.attr('href'));
      linkElement.attr("data-slider-index", i);
    }
  }
};

function hideHrefOnInactiveSlides() {
  console.log("hide");
  var navSliderMask = document.querySelector('.w-slider-mask');
  var navSliderChildrens = navSliderMask.children;
  for (i = 0; i < navSliderChildrens.length; i++) {
    navElement = navSliderChildrens[i];
    linkElement = $(navElement).find("a");
    if (navElement.hasAttribute('aria-hidden') && $(navElement).hasClass('w-slide')) {
      linkElement.attr("aria-disabled", true);
      linkElement.removeAttr("href");
    } else if ($(navElement).hasClass('w-slide') && !navElement.hasAttribute('aria-hidden')) {
      linkElement.removeAttr("aria-disabled");
      linkElement.attr("href", linkElement.attr('data-link'));
    }
  }
};

function init() {
  addDataHrefAttr();
  hideHrefOnInactiveSlides();
}

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

function tap(direction) {
  if (direction == false) {
    $("#slider-arrow-right").trigger('tap');
  } else {
    $("#slider-arrow-left").trigger('tap');
  }
  setTimeout(function(){ hideHrefOnInactiveSlides(); }, slideroffsetTime);
}

init();

var onScroll = debounce(function(direction) {
  tap(direction);
}, slideroffsetTime, true);

$( "a.w-inline-block" ).bind( "click", function(e) {
  clickedIndex = $( this ).attr("data-slider-index");
  activeIndex = $('.w-active').index();
  if (clickedIndex) {
    if (clickedIndex > activeIndex) {
      // Go right
      tap(false);
    } else if (clickedIndex < activeIndex) {
      // Go left
      tap(true);
    }
  }
});

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
    // Don't tap left on the first element
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
