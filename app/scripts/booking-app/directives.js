// bookingApp Directives
/* global portrFunctions:false */
/* global portrGlobals:false */
'use strict';

var portrBookingDirectives = angular.module('portrBookingDirectives', []);

portrBookingDirectives.directive('fixedBg', ['$window', function ($window) {

  var $win = angular.element($window);

  return {
    restrict: 'A',
    link: function (scope, element) {

      element.width($win.width());
      element.height($win.height());

      portrFunctions.browserSize.resize(function () {
        element.width($win.width());
        element.height($win.height());
      });

    }
  };

}]);

portrBookingDirectives.directive('fixedSidebar', ['$window', function ($window) {

  var $win = angular.element($window),
      $parent = angular.element('.booking-panel-container'),
      $header = angular.element('.booking-header');

  return {
    restrict: 'A',
    link: function(scope, element, attrs){

      scope.fixedElemHeight = $win.height();
      scope.fixedElemWidth = $parent.width();

      scope.fixedElemCount = $parent.children().length;

      var fixedClass = attrs.fixedClass,
          offsetFromTop = element.offset().top,
          delta = 50;

      $win.on('scroll', function (){

        element.removeClass('hidden');

        if ($win.scrollTop() >= (offsetFromTop + $header.height() + delta) && $win.scrollTop() >= delta) {
          element.addClass(fixedClass);
        }
        else {
          element.removeClass(fixedClass);
        }

      });

      // swap visibility by watching 'visiblePanel' scope item
      // and comparing with attr
      scope.$watch('visiblePanel', function(nv){

        if(parseInt(nv, 10) >= parseInt(attrs.fixedShow, 10) && parseInt(nv, 10) <= parseInt(attrs.fixedHide, 10)){
          element.addClass('show-section');
          element.removeClass('hide-section');
        }
        else{
          element.removeClass('show-section');
          element.addClass('hide-section');
        }

      });

      portrFunctions.browserSize.resize(function () {

        scope.fixedElemHeight = $win.height();
        scope.fixedElemWidth = $parent.width();
        scope.$digest();

      });

    }
  };

}]);

portrBookingDirectives.directive('panelParent', ['$timeout', function ($timeout) {

  var initLoad = true;

  return {
    link: function(scope, element, attrs){

      scope.$watch('visiblePanel', function(nv){

        if((parseInt(attrs.panelIndex, 10) < 3) && initLoad === true){
          element.addClass('active-panel');
          $timeout(function(){
            initLoad = false;
          }, 1000);
        }
        else if((parseInt(attrs.panelIndex, 10) === nv) && initLoad === false){
          element.addClass('active-panel');
        }
        else{
          element.removeClass('active-panel');
        }

      });
    }
  };

}]);

portrBookingDirectives.directive('addPanels', ['$window', function ($window) {

  return {
    link: function(scope, element, attrs){

      var $win = angular.element($window),
          offsetValue = 50;

      scope.scrollElemHeight = $win.height();

      if(scope.panelCount < attrs.addMax || typeof scope.panelCount === 'undefined'){

        $win.on('scroll', function (){
          var $elem = element;

          var docViewTop = $win.scrollTop();
          var docViewBottom = docViewTop + $win.height();

          var elemTop = $elem.offset().top;
          var elemBottom = elemTop + $elem.height();

          if(elemBottom <= (docViewBottom - offsetValue)){

            if(scope.panelCount === parseInt(attrs.addMax, 10)){
              return;
            }

            scope.panelCount = scope.panelCount + 1;
            scope.$digest();

          }

        });

      }

    }
  };

}]);

// portrBookingDirectives.directive('panel', ['$timeout', function ($timeout) {

//   return{
//     restrict: 'A',
//     link: function(scope, element, attrs){

//       element.on('click', function(){

//         if(attrs.scroll === false){
//           return;
//         }

//         $timeout(function(){
//           portrFunctions.animateScroll(element, {duration: 500, offset: -250});
//           angular.element('.panel').parent('.panel-parent').removeClass('active-panel');
//           element.parent('.panel-parent').addClass('active-panel');
//           scope.$digest();
//         }, 250);

//       });

//     }
//   };

// }]);

portrBookingDirectives.directive('showtab', [function () {

  return {
    link: function (scope, element) {
      element.on('click', function(e) {
        e.preventDefault();
        element.tab('show');
      });
    }
  };

}]);

portrBookingDirectives.directive('siteHeader', ['$window', '$document', '$interval', function ($window, $document, $interval) {

  var $win = angular.element($window),
      $doc = angular.element($document);

  return {
    restrict: 'A',
    replace: true,
    templateUrl: portrGlobals.sections.header,
    link: function(scope, element){

      var didScroll,
          lastScrollTop = 0,
          delta = 5,
          navbarHeight = element.outerHeight();

      $win.on('scroll', function (){
        didScroll = true;
      });
      $interval(function() {
        if (didScroll) {
          hasScrolled();
          didScroll = false;
        }
      }, 250);

      var hasScrolled = function() {
        var st = $win.scrollTop();

        if (Math.abs(lastScrollTop - st) <= delta){
          return;
        }

        if (st > lastScrollTop && st > navbarHeight){
          // Scroll Down
          element.removeClass('nav-down').addClass('nav-up');
        }
        else {
          // Scroll Up
          if(st + $win.height() < $doc.height()) {
            element.removeClass('nav-up').addClass('nav-down');
          }
        }

        lastScrollTop = st;

      };

    }
  };

}]);

portrBookingDirectives.directive('siteFooter', [function () {

  return {
    restrict: 'A',
    replace: true,
    templateUrl: portrGlobals.sections.footer
  };

}]);

portrBookingDirectives.directive('jqdatepicker', [function () {

  return {
    restrict: 'A',
    scope: {
      ngModel: '='
    },
    link: function (scope, element, ngModelCtrl) {

      element.datepicker({
        dateFormat: 'yy-mm-dd',

        onSelect: function (date) {
          ngModelCtrl.FlightDate = date;
          scope.ngModel = date;

          if(date !== ''){
            element.parent('.form-group').removeClass('is-empty has-error');
          }

        }

      });
    }
  };

}]);

portrBookingDirectives.directive('toggleClass', [function () {

  return {
    restrict: 'A',
    link: function(scope, element, attrs) {
      element.on('click', function() {
        angular.element(attrs.toggleSelector).removeClass(attrs.toggleClass);
        element.addClass(attrs.toggleClass);
      });
    }
  };

}]);
