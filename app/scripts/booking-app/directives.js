// bookingApp Directives
/* global portrFunctions:false */
'use strict';

var portrBookingDirectives = angular.module('portrBookingDirectives', []);

portrBookingDirectives.directive('fixedSidebar', ['$window', function ($window) {

  var $win = angular.element($window),
      $parent = angular.element('.booking-panel-container');

  return{
    restrict: 'A',
    link: function(scope, element, attrs){

      scope.fixedElemHeight = $win.height();
      scope.fixedElemWidth = $parent.width();

      scope.fixedElemCount = $parent.children().length;

      var fixedClass = attrs.fixedClass,
          offsetFromTop = element.offset().top;

      $win.on('scroll', function (){

        element.removeClass('hidden');

        if ($win.scrollTop() >= offsetFromTop) {
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

portrBookingDirectives.directive('addPanels', ['$window', function ($window) {

  return{
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
              //$win.off('scroll');
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

portrBookingDirectives.directive('panel', ['$timeout', function ($timeout) {

  return{
    restrict: 'A',
    link: function(scope, element, attrs){

      element.on('click', function(){

        if(!attrs.scroll){
          return;
        }

        $timeout(function(){
          portrFunctions.animateScroll(element, {duration: 750, offset: -250});
          scope.$digest();
        }, 250);

      });

    }
  };

}]);

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
