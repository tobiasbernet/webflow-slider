var Webflow = Webflow || [];
    Webflow.push(function () {
      var l = $('#sliderblock .slider-arrow-left');
      var r = $('#sliderblock .slider-arrow-right');
      $('#sliderblock')
        .on('click', '.slider-left', function () {
          l.trigger('tap');
        })
        .on('click', '.slider-right', function () {
          r.trigger('tap');
        });
    });


    const customElementId = "bik";

    /**
     * --------------------------------------------------------------------
     * Function: Slider navigation and motion
     * --------------------------------------------------------------------
     */
    function debounce(func, wait, immediate) {
      var timeout;
      return function () {
        var context = this,
          args = arguments;
        var later = function () {
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
      setTimeout(function () {
        hideHrefOnInactiveSlides();
      }, sliderOffsetTime);
    }

    /**
     * --------------------------------------------------------------------
     * Function: Move to next Slide while clicking on neighbour element.
     * --------------------------------------------------------------------
     */

    /**
     * Store the href link in a data attribute.
     */
    function addDataHrefAttr() {
      var navSliderMask = document.querySelector('.w-slider-mask');
      var navSliderChildren = navSliderMask.children;
      for (i = 0; i < navSliderChildren.length; i++) {
        navElement = navSliderChildren[i];
        linkElement = $(navElement).find("a");
        if (linkElement) {
          $(navElement).attr("data-element", customElementId);
          linkElement.attr("data-link", linkElement.attr('href'));
          linkElement.attr("data-slider-index", i);
        }
      }
    };

    function getCurrentSlideIndex() {
      let index = $('.w-active').index();
      if (index >= 0) {
        return index
      } else {
        return 0;
      }
    }

    function isCustomElement(value) {
      if (value === customElementId) {
        return true;
      } else {
        return false;
      }
    }

    /**
     * Remove the href attribute on all slides except the current.
     */
    function hideHrefOnInactiveSlides() {
      var navSliderMask = document.querySelector('.w-slider-mask');
      var navSliderChildren = navSliderMask.children;
      for (i = 0; i < navSliderChildren.length; i++) {
        let navElement = navSliderChildren[i];
        let currentSlideIndex = getCurrentSlideIndex();
        let customElement = isCustomElement($(navElement).attr('data-element'));
        let linkElement = $(navElement).find("a");

        if (i == currentSlideIndex && customElement) {
          linkElement.removeAttr("aria-disabled");
          linkElement.attr("href", linkElement.attr('data-link'));
        } else if (i != currentSlideIndex && customElement) {
          linkElement.attr("aria-disabled", true);
          linkElement.removeAttr("href");
        }
      }
    };

    function init() {
      addDataHrefAttr();
      hideHrefOnInactiveSlides();
    }

    init();


    /**
     * --------------------------------------------------------------------
     * Function: Slider gesture control
     * --------------------------------------------------------------------
     */

    // Offset time - bigger value = reacts more slowly to movement
    const sliderOffsetTime = 100;

    var onScroll = debounce(function (direction) {
      tap(direction);
    }, sliderOffsetTime, true);

    $("#slider-arrow-right").bind("click", function () {
      setTimeout(function () {
        hideHrefOnInactiveSlides();
      }, sliderOffsetTime);
    });

    $("#slider-arrow-left").bind("click", function () {
      setTimeout(function () {
        hideHrefOnInactiveSlides();
      }, sliderOffsetTime);
    });

    $("a.w-inline-block").bind("click", function () {
      clickedIndex = $(this).attr("data-slider-index");
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

    $('.collection-list-wrapper').bind('wheel', function (e) {
      var navSlider = document.querySelector('.slide-nav-2');
      var last = navSlider.children.length - 1;

      e.preventDefault();
      deltaY = event.deltaY;
      deltaX = event.deltaX;
      delta = e.originalEvent.wheelDelta;
      offsetPlus = 30; // offset => do not react to short touches
      offsetMinus = -30;
      tapDirection = null; // 0 == right, 1 == left, null == undefined

      // Detect direction and do some buffering
      if ((delta <= offsetMinus && deltaY <= 0 && deltaX >= 0)) {
        tapDirection = 0
      } else if (delta >= offsetPlus && deltaX <= 0) {
        tapDirection = 1
      } else if (delta <= offsetMinus && deltaY >= 0 && deltaX >= 0) {
        tapDirection = 0
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
