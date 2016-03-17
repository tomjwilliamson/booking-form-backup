// bookingApp Directives
/*eslint-disable */
/* global portrFunctions:false */
/* global portrGlobals:false */
'use strict';

var portrBookingDirectives = angular.module('portrBookingDirectives', []);

portrBookingDirectives.directive('fixedBg', ['$window', function ($window) {

  var $win = angular.element($window);

  return {
    restrict: 'A',
    link: function (scope, element) {

      $win.pageYOffset = 0;

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

portrBookingDirectives.directive('panelParent', [ '$window', '$timeout', function ($window, $timeout) {

  var $win = angular.element($window),
      offset = 100,
      timer = null,
      fireCount = 0;

  return {

    restrict: 'A',

    link: function(scope, element, attrs){

      // set first panel to visible
      if(parseInt(attrs.panelIndex, 10) === 1){
        element.addClass('active-panel');
      }

      scope.$watch('showDetailPanel', function(){
        $win.trigger('scroll');
      });

      // update visible panel value
      var updateVisible = function(v, e){

        // fix due to hidden 'flying soon' panel
        if(v === 2 && scope.showDetailPanel === true){
          v = 3;
          e = angular.element('#panel3');
        }

        visiblePanelDisplay(e);

        $timeout(function(){
          scope.$apply(function(){
            scope.$parent.$parent.visiblePanel = v;
            fireCount = 0;
          });
        }, 250);
      };

      // update panel classes
      var visiblePanelDisplay = function(e){
        angular.element('.panel-parent').removeClass('active-panel');
        e.addClass('active-panel');
      };

      $win.on('scroll', function (){

        if(timer !== null) {
          clearTimeout(timer);
        }
        timer = $timeout(function(){
          hasScrolled();
        }, 500);

      });

      var hasScrolled = function(){

        var $elem = element;

        var docViewTop = $win.scrollTop();
        var docViewBottom = docViewTop + $win.height();

        var elemTop = $elem.offset().top;
        var elemBottom = elemTop + $elem.height();

        if(docViewTop < offset){
          if(parseInt(attrs.panelIndex, 10) === 1 && scope.showDetailPanel === true){
            if(fireCount === 0){
              updateVisible(1, element);
              fireCount = 1;
            }
          }
          else if(parseInt(attrs.panelIndex, 10) === 2 && scope.showDetailPanel === false){
            if(fireCount === 0){
              updateVisible(2, element);
              fireCount = 1;
            }
          }
        }
        else if(elemTop >= (docViewTop + offset) && elemBottom <= (docViewBottom - offset)){

          if(fireCount === 0){
            updateVisible(parseInt(attrs.panelIndex, 10), element);
            fireCount = 1;
          }
        }
        else if(elemBottom > (docViewBottom - 350)  && elemTop < (docViewTop + 350)){

          if(fireCount === 0 && parseInt(attrs.panelIndex, 10) !== scope.visiblePanel){
            updateVisible(parseInt(attrs.panelIndex, 10), element);
            portrFunctions.animateScroll(element, {duration: 500, offset: -250});
            fireCount = 1;
          }
        }

      };

    }
  };

}]);

portrBookingDirectives.directive('addPanels', ['$window', '$timeout', function ($window, $timeout) {

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

            $timeout(function(){
              scope.panelCount = scope.panelCount + 1;
              scope.$digest();
            });

          }

        });

      }

    }
  };

}]);

portrBookingDirectives.directive('panel', [ function () {

  return{
    restrict: 'A',
    link: function(scope, element, attrs){

      scope.$watch('visiblePanel', function(nv){
        if(parseInt(attrs.panelOrder, 10) === nv){
          element.find('.first-input').focus();
        }
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

portrBookingDirectives.directive('toggleClass', [ function () {

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

portrBookingDirectives.directive('focusInput', ['$timeout', function($timeout) {

  return {
    link: function(scope, element, attrs) {
      element.on('click', function() {
        $timeout(function() {
          angular.element(attrs.focusSelector).focus();
        });
      });
    }
  };

}]);

portrBookingDirectives.directive('googlePlacesAutocomplete', [ 'SharedProperties', function(SharedProperties) {

  var componentForm = {
    premise: 'long_name',
    street_number: 'short_name',
    route: 'long_name', // i.e. Road
    sublocality_level_1: 'long_name',
    neighborhood: 'short_name',
    locality: 'long_name', //i.e. Can be town
    postal_town: 'long_name', //i.e. can be same as locality
    administrative_area_level_1: 'long_name', // i.e. can be county
    administrative_area_level_2: 'long_name', // i.e. can be county
    country: 'long_name',
    postal_code: 'long_name',
    postal_code_prefix: 'long_name'
  };
  var mapping = {
    //premise: 'long_name',
    street_number: 'addressLine1',
    route: 'addressLine2', // i.e. Road
    sublocality_level_1: 'addressLine3',
    neighborhood: 'addressLine3',
    locality: 'addressTown', //i.e. Can be town
    postal_town: 'addressTown', //i.e. can be same as locality
    administrative_area_level_1: 'addressCounty',// i.e. can be county
    administrative_area_level_2: 'addressCounty',// i.e. can be county
    country: 'addressCountry',
    postal_code_prefix: 'addressPostCodePrefix',
    postal_code: 'addressPostCode'
  };

  return {
    restrict: 'A',
    scope: {
      details: '=?'
    },
    link: function(scope, element, attrs) {

      var options = {
        types: attrs.googlePlacesAutocomplete !== '' ? attrs.googlePlacesAutocomplete.split(',') : [],
        componentRestrictions: {}
      };

      scope.collectionLocation = new google.maps.places.Autocomplete(element[0], options);

      google.maps.event.addListener(scope.collectionLocation, 'place_changed', function() {

        // Get the place details from the autocomplete object.
        var place = scope.collectionLocation.getPlace();

        var details = place.geometry && place.geometry.location ? {
          latitude: place.geometry.location.lat(),
          longitude: place.geometry.location.lng()
        } : {};

        // Get each component of the address from the place details
        // and fill the corresponding field on the form.
        for (var i = 0; i < place.address_components.length; i++) {
          var addressType = place.address_components[i].types[0];
          if (componentForm[addressType]) {
            var val = place.address_components[i][componentForm[addressType]];
            details[mapping[addressType]] = val;
          }
        }
        details.formatted = place.formatted_address;
        details.shortName = place.name;
        details.placeId = place.place_id;

        scope.$apply(function () {
          scope.details = details;
          //model.$setViewValue(element.val());

          SharedProperties.setUserLocation(scope.details);

        });


      });

    }
  };

}]);

/*eslint-enable */
