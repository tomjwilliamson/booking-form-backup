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

portrBookingControllers.controller('howItWorksController', ['$scope', '$location', '$timeout', '$http', 'DataService', 'SharedProperties', function ($scope, $location, $timeout, $http, DataService, SharedProperties) {

  $scope.currentPage = 'how-it-works';
  $scope.flyingSoonPanel = './templates/panels/flying-soon.html';
  $scope.flightDetails = {};

  // call material design scripts after angular has loaded
  $timeout(function(){
    $.material.init();
  }, 500);


  $scope.checkFlight = function(isValid){

    if(isValid){

      DataService.postData(portrGlobals.paths.flightStatus, $scope.flightDetails)
        .success(function(response){

          if(response.validationErrors.length === 0){

            SharedProperties.setUserFlightData(response.flightStatusDetails);
            $location.url('/booking');

          }

        })
        .error(function(){

        });

    }
    else{
      console.log('INVALID');
    }



  };

}]);

portrBookingControllers.controller('bookingController', ['$scope', '$window', '$timeout', '$interval', 'DataService', 'SharedProperties', function ($scope, $window, $timeout, $interval, DataService, SharedProperties) {

  $scope.currentPage = 'booking';
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

  // get set user flight object
  $scope.userFlightDetails = SharedProperties.getUserFlightData();
  console.log($scope.userFlightDetails);

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

  // Luggage panel functions
  $scope.showCarryOnSection = true;

  // Passenger panel functions
  $scope.passengers = [];
  $scope.passenger = {};
  $scope.passengerIndex = 1;

  $scope.passengerTemplate = './templates/panel-elements/passenger-layout.html';

  $scope.passengerClose = function(item){

    $scope.passengers.splice(item, 1);

    $scope.passenger[$scope.passengerIndex].firstname = '';
    $scope.passenger[$scope.passengerIndex].lastname = '';
    $scope.passenger[$scope.passengerIndex].email = '';
    $scope.passenger[$scope.passengerIndex].phone = '';

    $scope.passengerIndex --;
  };

  $scope.addPassengerForm = function(){

    console.log('ADD', $scope.passengerIndex);

    // $scope.passengers.push({
    //   'index': $scope.passengerIndex,
    //   'firstname': $scope.passenger[$scope.passengerIndex].firstname,
    //   'lastname': $scope.passenger[$scope.passengerIndex].lastname,
    //   'email': $scope.passenger[$scope.passengerIndex].email,
    //   'phone': $scope.passenger[$scope.passengerIndex].phone
    // });
    $scope.passengers.push({
      'index': $scope.passengerIndex,
      'firstname': '',
      'lastname': '',
      'email': '',
      'phone': ''
    });

    $scope.passengerIndex ++;
    $.material.init();

    console.log($scope.passengers);

  };

   $scope.onChange = function(val){

    console.log(val);
    // $scope.passenger.firstname = val;

    // console.log($scope.passengers[$scope.passengerIndex - 1].index);

    //console.log($scope.passenger[$scope.passengerIndex].index);


    // console.log($scope.passenger[$scope.passengerIndex].firstname, $scope.passenger[$scope.passengerIndex].lastname);


    // if($scope.passenger[$scope.passengerIndex].firstname !== 'undefined' && $scope.passenger[$scope.passengerIndex].lastname !== 'undefined' && $scope.passenger[$scope.passengerIndex].email !== 'undefined' && $scope.passenger[$scope.passengerIndex].phone !== 'undefined'){

    //   // $scope.passenger[$scope.passengerIndex].index = $scope.passengerIndex,
    //   // $scope.passenger[$scope.passengerIndex].firstname = $scope.passenger[$scope.passengerIndex].firstname,
    //   // $scope.passenger[$scope.passengerIndex].lastname = $scope.passenger[$scope.passengerIndex].lastname,
    //   // $scope.passenger[$scope.passengerIndex].email = $scope.passenger[$scope.passengerIndex].email,
    //   // $scope.passenger[$scope.passengerIndex].phone = $scope.passenger[$scope.passengerIndex].phone;


    //   console.log($scope.passenger[$scope.passengerIndex].firstname);



    //   console.log('in change', $scope.passengers);
    //   //amendObject($scope.passengerIndex, $scope.passenger.firstname, $scope.passenger.lastname, $scope.passenger.email, $scope.passenger.phone);
    //   //$scope.passengers.push(new Passenger($scope.passenger.firstname, $scope.passenger.lastname, $scope.passenger.email, $scope.passenger.phone));


    // }
    // else{
    //   console.log('shit', $scope.passengerIndex);
    // }


  };

  // Passport panel functions
  $scope.passportListTemplate = './templates/panel-elements/passport-list-item.html';
  $scope.confirmationTemplate = './templates/panels/confirmation.html';


}]);
