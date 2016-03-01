//BookingApp Controllers
/* global portrGlobals:false */
'use strict';

var portrBookingControllers = angular.module('portrBookingControllers', []);

portrBookingControllers.controller('homeController', ['$scope', '$timeout', function ($scope, $timeout) {

  $scope.currentPage = 'home';
  $scope.panelPath = './templates/panels/login-register.html';

  // call material design scripts after angular has loaded
  $timeout(function(){
    $.material.init();
  }, 500);

}]);

portrBookingControllers.controller('bookingController', ['$scope', '$window', '$timeout', '$interval', 'DataService', function ($scope, $window, $timeout, $interval, DataService) {

  $scope.panels = [];
  $scope.panelCount = 3;
  $scope.visiblePanel = 1;

  DataService.getData(portrGlobals.paths.panelOrder)
    .success(function(response){

      // populate scope with response
      $timeout(function(){
        var intervalLength = 250,
            iterations = response.length,
            count = 0,
            displayInterval;

        // set interval to stagger entrance animation
        displayInterval = $interval(function(){
          // if the length of the panels array is less than the response
          // add items to the scope item based on the count increment
          if($scope.panels.length < iterations){

            if(count < iterations) {
              $scope.panels.push(response[count]);
              count ++;

              $.material.init();
            }
          }
          // if all items are in the array cancel the interval
          else{
            $interval.cancel(displayInterval);
          }

        }, intervalLength);

      }, 0, false);

    }).error(function(response){
      if ($window.console) { console.error(response); }
      throw new Error('Error loading order feed');
    });

  // set the template file based on the return data
  // passes in the order of the panel name from the data
  $scope.getTemplateFile = function(thisPanel){

    switch (thisPanel) {
      case 'flight-details':
        return './templates/panels/flight-details.html';
      case 'luggage':
        return './templates/panels/luggage.html';
      case 'bag-pickup-time':
        return './templates/panels/bag-pickup-time.html';
      case 'bag-pickup-location':
        return './templates/panels/bag-pickup-location.html';
      case 'passengers':
        return './templates/panels/passengers.html';
      case 'your-airline-reservation':
        return './templates/panels/your-airline-reservation.html';
      case 'passport-information':
        return './templates/panels/passport-information.html';
      case 'payment-details':
        return './templates/panels/payment-details.html';
    }

  };

  // toggle visibility based on current panel
  var stateChangeHandler = function(panelID){
    $scope.visiblePanel = panelID;
  };

  $scope.panelInView = function(index, inview, inviewpart) {
    if(inview && inviewpart === 'both'){
      stateChangeHandler(index + 1);
    }
  };

  $scope.$watch('panelCount', function(){

    $timeout(function(){
      $.material.init();
    }, 500);

  });

}]);
