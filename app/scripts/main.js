'use strict';

// Create name space - stops conflicts
var portrFunctions = portrFunctions || {};

//Browser resize
portrFunctions.browserSize = (function () {

  var BROWSER_TYPE = {
    MOBILE: { width: 768 },
    TABLET: { width: 992 },
    DESKTOP: { width: 1200 }
  };

  var width = function () {
    return window.innerWidth || $(window).width();
  };

  var height = function () {
    return window.innerHeight || $(window).innerHeight();
  };

  var isMobileWidth = function () {
    return width() < BROWSER_TYPE.MOBILE.width;
  };

  var isTabletWidth = function () {
    return (width() >= BROWSER_TYPE.MOBILE.width && width() <= BROWSER_TYPE.TABLET.width);
  };

  var isDesktopWidth = function () {
    return (width() > BROWSER_TYPE.TABLET.width);
  };

  var isLargeDesktopWidth = function () {
    return (width() > BROWSER_TYPE.DESKTOP.width);
  };

  var resize = function (callback) {

    $(window).on('debouncedresize', function(){
      if (callback) {
        return callback(width());
      }
    });

  };

  return {
    sizes: BROWSER_TYPE,
    width: width,
    height: height,
    isMobileWidth: isMobileWidth,
    isTabletWidth: isTabletWidth,
    isDesktopWidth: isDesktopWidth,
    isLargeDesktopWidth: isLargeDesktopWidth,
    resize: resize
  };
})();

// generic function to test if passed in ele is in view
// returns true or false
portrFunctions.isInView = function(elem){

  var $elem = $(elem);
  var $window = $(window);

  var docViewTop = $window.scrollTop();
  var docViewBottom = docViewTop + $window.height();

  var elemTop = $elem.offset().top;
  var elemBottom = elemTop + $elem.height();

  return ((elemBottom <= docViewBottom) && (elemTop >= docViewTop));

};

// animate scrolling to an element
// -----------------------------
// pass in:
// ele: jQuery element to scroll to (null will default to top of page)
// opts: object of options including
//       duration: of scroll in ms
//       container: jQuery element to scroll
portrFunctions.animateScroll = function(ele, options, callback){

  // defaults - set variables here
  var scrollPos = 0,
      opts = {
        container: $('html, body'),
        duration: 1000,
        offset: 0
      };

  // extend
  $.extend(opts, options);

  if (ele) { scrollPos = ele.offset().top; }

  // binding to stop scroll if user attempts to scroll during animation
  opts.container.on('scroll.cancelscroll mousedown.cancelscroll DOMMouseScroll.cancelscroll mousewheel.cancelscroll keyup.cancelscroll touchstart.cancelscroll touchend.cancelscroll touchmove.cancelscroll', function(){
    opts.container.stop();
  });

  // do the scroll
  opts.container.animate({
    scrollTop: scrollPos + opts.offset
  }, opts.duration, function(){
    // remove scroll stop binding on complete
    opts.container.off('.cancelscroll');

    // fire callback if defined
    if (callback) {
      callback();
    }
  });
};

$(function(){


});
