//BookingApp Controllers
/*eslint-disable */
/* global portrGlobals:false */
/* global portrFunctions:false */
/* global moment:false */ //jshint ignore:line
'use strict';

var portrBookingControllers = angular.module('portrBookingControllers', []);

portrBookingControllers.controller('homeController', ['$scope', '$timeout', function ($scope, $timeout) {

  $scope.currentPage = 'home';
  $scope.panelPath = portrGlobals.panels.loginRegister;

  // call material design scripts after angular has loaded
  $timeout(function(){
    $.material.init();
  }, 500);

}]);

portrBookingControllers.controller('howItWorksController', ['$scope', '$location', '$timeout', '$http', 'DataService', 'SharedProperties', '$localstorage', function ($scope, $location, $timeout, $http, DataService, SharedProperties, $localstorage) {

  $scope.currentPage = 'how-it-works';
  $scope.flyingSoonPanel = portrGlobals.panels.flyingSoon;
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

            $localstorage.setObject('flightdetails', {
              flightNumber: $scope.flightDetails.flightNumber,
              departureDate: $scope.flightDetails.departureDate
            });

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

portrBookingControllers.controller('bookingController', ['$scope', '$window', '$timeout', '$interval', 'DataService', 'SharedProperties', 'BookingObject', '$localstorage', '$filter', function ($scope, $window, $timeout, $interval, DataService, SharedProperties, BookingObject, $localstorage, $filter) {

  // inital scope variables
  $scope.currentPage = 'booking';
  $scope.panels = [];
  $scope.panelCount = 3;
  $scope.visiblePanel = 1;
  $scope.showDetailPanel = true;

  $scope.booking = {};

  $scope.offsetValue = (angular.element($window).height() / 2);
  //console.log($scope.winHeight);

  // get order of panels from JSON data
  // set up scope var
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
        return portrGlobals.panels.flightDetails;
      case 'flying-soon':
        return portrGlobals.panels.flyingSoon;
      case 'luggage':
        return portrGlobals.panels.luggage;
      case 'bag-pickup-time':
        return portrGlobals.panels.bagPickUpTime;
      case 'bag-pickup-location':
        return portrGlobals.panels.bagPickUpLocation;
      case 'passengers':
        return portrGlobals.panels.passengers;
      case 'your-airline-reservation':
        return portrGlobals.panels.airlineReservation;
      case 'passport-information':
        return portrGlobals.panels.passportInformation;
      case 'payment-details':
        return portrGlobals.panels.paymentDetails;
    }

  };

  // // toggle visibility based on current panel
  // var stateChangeHandler = function(panelID){
  //   $scope.visiblePanel = panelID;
  // };
  // // set inital panel
  // stateChangeHandler(1);

  // $scope.panelInView = function(index, inview, inviewpart) {

  //   if(inview && inviewpart === 'both' || inview && inviewpart === 'neither'){

  //     console.log('Elem', index, inview, inviewpart);

  //     if(angular.element($window).scrollTop() < 100){
  //       stateChangeHandler(1);
  //     }
  //     else{
  //       stateChangeHandler(index + 1);
  //     }

  //   }

  // };

  // re-init material js functions when panel count changes
  // fixes bug with loading of methods
  $scope.$watch('panelCount', function(){
    $timeout(function(){
      $.material.init();
    }, 500);
  });

  // next panel
  // goToPanel function
  $scope.goToPanel = function(panelIndex, isValid){
    var thisPanel = angular.element('#panel' + (panelIndex + 1));
    if(isValid){
      portrFunctions.animateScroll(thisPanel, {duration: 500, offset: -40});
    }
  };

  $scope.keyDown = function(e, i){
    if(e.keyCode === 13){
      $timeout(function(){
        angular.element('#next' + i).triggerHandler('submit');
        angular.element('#next' + i).triggerHandler('click');
      });
      return;
    }
  };

  $scope.formBlur = function(){
    console.log('blur');
  };
  $scope.formFocus = function(){
    console.log('focus');
  };

  //
  // Flight Details/Flying Soon panel functions
  // --------------------------------------------------
  $scope.flightDetails = {};
  $scope.showFlightErrorText = false;

  // flight api call handler
  // pass in form data and if required to set local storage obj
  var flightDetailHandler = function(data, setLocalObj){

    DataService.postData(portrGlobals.paths.flightStatus, data)
      .success(function(response){

        // set local storage obj
        if(setLocalObj === true){
          $localstorage.setObject('flightdetails', {
            flightNumber: $scope.flightDetails.flightNumber,
            departureDate: $scope.flightDetails.departureDate
          });
        }

        // if no errors
        // set data to scope item, update display - show detail apnel, hide loader
        if(response.validationErrors.length === 0){
          $scope.userFlightDetails = response.flightStatusDetails;
          $scope.showFlightLoader = false;
          $scope.showDetailPanel = true;
        }
        else{
          $scope.showFlightErrorText = true;

          for(var e = 0; e < response.validationErrors.length; e++){
            $scope.flightErrorText = response.validationErrors[e];
          }

          $scope.showFlightLoader = false;
        }

      })
      .error(function(){
        console.log('Error');
      });
  };

  // handle page refresh
  // shared property is empty
  // get obj from local storage
  if(typeof SharedProperties.getUserFlightData() === 'undefined'){

    var flightData = $localstorage.getObject('flightdetails');
    $scope.showFlightLoader = true;

    $timeout(function(){
      // call service with stored data
      flightDetailHandler(flightData, false);
    }, 5000);

  }
  else{
    // else set from shared propertry
    // this happens when redirected from how-it-works page
    $scope.userFlightDetails = SharedProperties.getUserFlightData();
  }

  // show flying soon panel on clikc of change flight btn
  $scope.changeFlightPanel = function(){
    $scope.showDetailPanel = false;
  };
  // check flight click, pass through if form is valid
  $scope.checkFlight = function(isValid){
    if(isValid){
      // call api service handler, pass in form field data
      flightDetailHandler($scope.flightDetails, true);
    }
  };

  // Flying soon continue click
  $scope.flyingSoonContinue = function(){
    $scope.showDetailPanel = true;
  };

  //
  // Luggage panel functions
  // --------------------------------------------------
  $scope.showCarryOnSection = true;
  $scope.luggageDetails = {};

  $scope.setLuggage = function(isValid){

    if(isValid){
      $localstorage.setObject('luggageDetails', {
        bagCheckIn: parseInt($scope.luggageDetails.bagCheckIn, 10),
        bagCarryOn: parseInt($scope.luggageDetails.bagCarryOn, 10)
      });
    }

    console.log($scope.luggageDetails);

  };

  //
  // Bag pick up time panel functions
  // --------------------------------------------------
  $scope.bagPickupTimeDetails = {};
  $scope.bagPickupDateSelection = function(type){

    if(type === 'same'){
      $scope.bagTimeSelection = $scope.userFlightDetails.departureTimeDetails.scheduledDate;
    }
    else if(type === 'before'){

      var dateWithSlash = $filter('formatDateDash')($scope.userFlightDetails.departureTimeDetails.scheduledDate),
          day = moment(dateWithSlash, 'YYYY-MM-DD').subtract(1, 'day').format('DD-MM-YYYY'),
          yesterday = $filter('formatDateSlash')(day);

      $scope.bagTimeSelection = yesterday;
    }

  };

  $scope.setBagPickUpTimeDate = function(isValid){

    if(isValid){
      $localstorage.setObject('bagPickupTimeDetails', {
        bagPickupDate: $scope.bagPickupTimeDetails.date,
        bagPickupTime: $scope.bagPickupTimeDetails.time,
      });

      $scope.booking = BookingObject.setCollectionDateTime($scope.bagPickupTimeDetails);

      console.log($scope.booking);

    }

    else{

      console.log($scope.bagPickupTimeDetails);

      console.log('error');
    }

  };

  //
  // Bag pick up location panel functions
  // --------------------------------------------------
  $scope.collectionLocation = {};

  $scope.setBagPickUpLocation = function(isValid){

    $scope.locationDetails = SharedProperties.getUserLocation();
    console.log($scope.locationDetails);

    $scope.collectionLocation.name = $scope.locationDetails.formatted;
    $scope.collectionLocation.shortName = $scope.locationDetails.shortName;
    $scope.collectionLocation.addressLine1 = typeof $scope.locationDetails.addressLine1 !== 'undefined' ? $scope.locationDetails.addressLine1 : '';
    $scope.collectionLocation.addressLine2 = typeof $scope.locationDetails.addressLine2 !== 'undefined' ? $scope.locationDetails.addressLine2 : '';
    $scope.collectionLocation.addressLine3 = typeof $scope.locationDetails.addressLine3 !== 'undefined' ? $scope.locationDetails.addressLine3 : '';
    $scope.collectionLocation.addressTown = typeof $scope.locationDetails.addressTown !== 'undefined' ? $scope.locationDetails.addressTown : '';
    $scope.collectionLocation.addressPostCode =  $scope.locationDetails.addressPostCode;
    $scope.collectionLocation.addressPostCodePrefix =  $scope.locationDetails.addressPostCodePrefix;
    $scope.collectionLocation.addressCounty = typeof $scope.locationDetails.addressCounty !== 'undefined' ? $scope.locationDetails.addressCounty : '';
    $scope.collectionLocation.addressCountry = $scope.locationDetails.addressCountry;

    if(isValid){
      $localstorage.setObject('collectionLocation', {
        collectionLocationType: $scope.collectionLocation.type,
        collectionLocationAddress1: $scope.collectionLocation.addressLine1,
        collectionLocationAddress2: $scope.collectionLocation.addressLine2,
        collectionLocationAddress3: $scope.collectionLocation.addressLine3,
        collectionLocationAddressTown: $scope.collectionLocation.addressTown,
        collectionLocationAddressPostCode: $scope.collectionLocation.addressPostCode,
        collectionLocationAddressCounty: $scope.collectionLocation.addressCounty,
        collectionLocationAddressCountry: $scope.collectionLocation.addressCountry,
      });

      $scope.booking = BookingObject.setCollectionLocation($scope.collectionLocation);
      console.log($scope.booking);

    }

  };

  //
  // Passenger panel functions
  // --------------------------------------------------
  $scope.passengers = [];
  $scope.passenger = {};
  $scope.passengers.push($scope.passenger);

  $scope.getPassengerTemplate = function(i){

    if(i === 0){
      return portrGlobals.panelElements.passengerLead;
    }
    else{
      return portrGlobals.panelElements.passengerLayout;
    }

  };

  $scope.passengerClose = function(item){
    $scope.passengers.splice(item, 1);
    delete $scope.passengers.passenger[item];
  };

  $scope.addPassengerForm = function(){
    $scope.passengers.push($scope.passenger);
    $.material.init();
  };

  $scope.setPassengers = function(isValid){

    if(isValid){

      $filter('addLuggageToPassengers')($scope.passengers.passenger, 'check-in', $scope.luggageDetails.bagCheckIn);

      $scope.booking = BookingObject.setPassengers($scope.passengers.passenger);
      $scope.passengerCount = Object.keys($scope.passengers.passenger).length;
      console.log($scope.passengerCount);

      console.log($scope.booking);

    }

  };

  //
  // Airline reservation panel functions
  // --------------------------------------------------
  $scope.airlineReservation = {};

  $scope.setAirlineReservation = function(isValid){

    if(isValid){
      $localstorage.setObject('airlineReservation', {
        airlineReservationNumber: $scope.airlineReservation.airlineReservationNumber,
        executiveClubNumber: $scope.airlineReservation.executiveClubNumber,
      });

      $scope.booking = BookingObject.setPassengers($scope.passengers.passenger);

      console.log($scope.booking);
    }

  };

  //
  // Passport panel functions
  // --------------------------------------------------
  $scope.passportListTemplate = portrGlobals.panelElements.passportList;

  $scope.setPassport = function(isValid){

    if(isValid){

      console.log($scope.passengers.passenger);
      $scope.booking = BookingObject.setPassengers($scope.passengers.passenger);
      console.log($scope.booking);

    }

  };

  //
  // Confimration panel functions
  // --------------------------------------------------
  $scope.confirmationTemplate = portrGlobals.panels.confirmation;
  $scope.confirmationBagCount = parseInt($scope.luggageDetails.bagCheckIn, 10) + parseInt($scope.luggageDetails.bagCarryOn, 10);


}]);






/*eslint-enable */
