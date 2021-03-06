//BookingApp Controllers
/*eslint-disable */
/* global portrGlobals:false */
/* global portrFunctions:false */
/* global moment:false */ //jshint ignore:line
'use strict';

var portrBookingControllers = angular.module('portrBookingControllers', []);

portrBookingControllers.controller('homeController', ['$scope', '$timeout', 'Auth', 'DataService', '$filter', function ($scope, $timeout, Auth, DataService, $filter) {

  $scope.currentPage = 'home';
  $scope.panelPath = portrGlobals.panels.loginRegister;

  // call material design scripts after angular has loaded
  $timeout(function(){
    $.material.init();
  }, 500);

  //
  // Login panel functions
  // --------------------------------------------------

  $scope.user = {};
  $scope.loggedIn = false;
  $scope.loginError = '';

  // login click handler
  $scope.loginHandler = function(isValid){

    if(isValid){

      if(!angular.isDefined($scope.user.username) || $scope.user.username.trim() === ''){
         $scope.loginError = 'Email address is invalid. Please try again.';
         return;
      }

      var loginParams = 'username=' + $scope.user.username + '&password=' + $scope.user.password;
      console.log(loginParams);
      loginParams = $filter('encode')(loginParams);
      console.log(loginParams);

      DataService.getData(portrGlobals.paths.login, loginParams)
        .success(function(response){

          console.log(response);

          // handle success
          // set user
          Auth.setUser({
            username: $scope.user.username
          });
          $scope.loggedIn = true;

        })
        .error(function(){
          console.log('Nope');
        });

    }

  };


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

            $localstorage.setObject('flightDetails', {
              flightNumber: $scope.flightDetails.flightNumber,
              departureDate: $scope.flightDetails.departureDate
            });
            $localstorage.setObject('deliveryDetails', {
              airportName: response.flightStatusDetails.departureAirport.airportName
            });
            $localstorage.setObject('deliveryDateTime', {
              time: response.flightStatusDetails.departureTimeDetails.scheduledTimeUTC,
              date: response.flightStatusDetails.departureTimeDetails.scheduledDate
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
  $scope.progress = 0;

  $scope.booking = {};

  var offsetValue = (angular.element($window).height() / 4);

  // set device handler
  // set device to desktop, tablet or mobile
  var setScreensize = function() {
    if(portrFunctions.browserSize.width() < 768){
      $scope.device = 'mobile';
    }
    else if(portrFunctions.browserSize.width() >= 768 && portrFunctions.browserSize.width() < 992){
      $scope.device = 'tablet';
    }
    else{
      $scope.device = 'desktop';
    }
  };
  setScreensize();

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

        $scope.fullCardCount = iterations;

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
      portrFunctions.animateScroll(thisPanel, {duration: 500, offset: -offsetValue});
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

  // progress bar function
  var widthCalcValue = 100 / 8;
  $scope.$watch('progress', function(){
    $scope.progressWidth = $scope.progress * widthCalcValue + '%';
  });

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

        // if no errors
        // set data to scope item, update display - show detail panel, hide loader
        // also set delivery address object
        if(response.validationErrors.length === 0){
          $scope.userFlightDetails = response.flightStatusDetails;
          $scope.deliveryLocation = response.departureAirport;
          $scope.deliveryDateTime = response.departureTimeDetails;
          $scope.showFlightLoader = false;
          $scope.showDetailPanel = true;

          $scope.flightDataLoaded = true;

          console.log($scope.userFlightDetails);

          // set local storage obj
          if(setLocalObj === true){
            $localstorage.setObject('flightDetails', {
              flightNumber: $scope.flightDetails.flightNumber,
              departureDate: $scope.flightDetails.departureDate
            });
          }

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

    var flightData = $localstorage.getObject('flightDetails');
    $scope.showFlightLoader = true;

    $timeout(function(){
      // call service with stored data
      flightDetailHandler(flightData, false);
    }, 2000);

  }
  else{
    // else set from shared propertry
    // this happens when redirected from how-it-works page
    $scope.userFlightDetails = SharedProperties.getUserFlightData();
  }

  // set delivery location
  // wait until data loaded
  $scope.$watch('userFlightDetails', function(data){

    // if not loaded - return
    if(typeof data === 'undefined'){
      return;
    }
    if($scope.flightDataLoaded === false){
      return;
    }

    findDeliveryLocation(data.departureAirport);
    findDeliveryTime(data.departureTimeDetails);

    $scope.progress = 1;

  });

  // set delivery time to -2 hours scheduled time
  var findDeliveryTime = function(obj){

    var deptime = obj.scheduledTimeUTC,
        depDate = obj.scheduledDate;

    var dateWithSlash = $filter('formatDateDash')(depDate),
        day = moment(dateWithSlash, 'YYYY-MM-DD').utc(),
        time = moment(deptime, 'HH:mm:ss').subtract(2, 'hours'),
        splitDate = $filter('formatDateSplit')(day._i);

    time.date(splitDate[2]);
    time.month($filter('monthName')(parseInt(splitDate[1], 10)));
    time.year(splitDate[0]);

    $scope.booking = BookingObject.setDeliveryDateTime(time._d);

  };

  // set delivery location
  //$scope.deliveryLocation = {};
  //$scope.deliveryGeo = {};

  var findDeliveryLocation = function(obj){

    $scope.deliveryLocation = {
      name: obj.airportName + ', Terminal ' + obj.airportTerminal,
      shortName: obj.airportCode,
      addressLine1: '',
      addressLine2: '',
      addressLine3: '',
      addressTown: obj.airportCityName,
      addressPostCode: '',
      addressCounty: '',
      addressCountry: obj.airportCountryName
    };

    $scope.deliveryGeo = {
      latitude: parseFloat(obj.airportLatitude),
      longitude: parseFloat(obj.airportLongitude)
    };

    $scope.booking = BookingObject.setDeliveryLocation($scope.deliveryLocation);
    $scope.booking = BookingObject.setDeliveryGeo($scope.deliveryGeo);

    console.log($scope.booking);

  };

  // show flying soon panel on click of change flight btn
  $scope.changeFlightPanel = function(){
    $scope.showDetailPanel = false;
  };
  // check flight click, pass through if form is valid
  $scope.checkFlight = function(isValid){
    if(isValid){
      // call api service handler, pass in form field data
      $scope.false = true;
      flightDetailHandler($scope.flightDetails, true);
      $scope.deliveryLocation = {};
      $scope.deliveryGeo = {};
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
  var progressLuggage = false;

  $scope.setLuggage = function(isValid){

    if(isValid){
      $localstorage.setObject('luggageDetails', {
        bagCheckIn: parseInt($scope.luggageDetails.bagCheckIn, 10),
        bagCarryOn: parseInt($scope.luggageDetails.bagCarryOn, 10)
      });
    }

    if(!progressLuggage){
      progressLuggage = true;
      $scope.progress ++;
    }

  };

  //
  // Bag pick up time panel functions
  // --------------------------------------------------
  $scope.bagPickupTimeDetails = {};
  var progressbagPickupTime = false;
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

      console.log($scope.bagPickupTimeDetails);

      $scope.booking = BookingObject.setCollectionDateTime($scope.bagPickupTimeDetails);
      console.log($scope.booking);

      if(!progressbagPickupTime){
        progressbagPickupTime = true;
        $scope.progress ++;
      }

    }

  };

  //
  // Bag pick up location panel functions
  // --------------------------------------------------
  $scope.collectionLocation = {};
  $scope.collectionGeo = {};
  var progressCollectionLocation = false;

  $scope.setBagPickUpLocation = function(isValid){

    console.log(isValid);

    if(isValid){

      $timeout(function(){

        $scope.locationDetails = SharedProperties.getUserLocation();

        $scope.collectionLocation.name = $scope.locationDetails.formatted;
        $scope.collectionLocation.shortName = $scope.locationDetails.shortName;
        $scope.collectionLocation.addressLine1 = typeof $scope.locationDetails.addressLine1 !== 'undefined' ? $scope.locationDetails.addressLine1 : '';
        $scope.collectionLocation.addressLine2 = typeof $scope.locationDetails.addressLine2 !== 'undefined' ? $scope.locationDetails.addressLine2 : '';
        $scope.collectionLocation.addressLine3 = typeof $scope.locationDetails.addressLine3 !== 'undefined' ? $scope.locationDetails.addressLine3 : '';
        $scope.collectionLocation.addressTown = typeof $scope.locationDetails.addressTown !== 'undefined' ? $scope.locationDetails.addressTown : '';
        $scope.collectionLocation.addressPostCode =  typeof $scope.locationDetails.addressPostCode !== 'undefined' ? $scope.locationDetails.addressPostCode : $scope.locationDetails.addressPostCodePrefix;
        $scope.collectionLocation.addressCounty = typeof $scope.locationDetails.addressCounty !== 'undefined' ? $scope.locationDetails.addressCounty : '';
        $scope.collectionLocation.addressCountry = $scope.locationDetails.addressCountry;

        $scope.collectionGeo.latitude = $scope.locationDetails.latitude;
        $scope.collectionGeo.longitude = $scope.locationDetails.longitude;

        $localstorage.setObject('collectionLocation', {
          collectionLocationType: $scope.collectionLocation.type,
          collectionLocationAddress1: $scope.collectionLocation.addressLine1,
          collectionLocationAddress2: $scope.collectionLocation.addressLine2,
          collectionLocationAddress3: $scope.collectionLocation.addressLine3,
          collectionLocationAddressTown: $scope.collectionLocation.addressTown,
          collectionLocationAddressPostCode: $scope.collectionLocation.addressPostCode,
          collectionLocationAddressPostCodePrefix: $scope.collectionLocation.addressPostCodePrefix,
          collectionLocationAddressCounty: $scope.collectionLocation.addressCounty,
          collectionLocationAddressCountry: $scope.collectionLocation.addressCountry,
          collectionGeoLatitude: $scope.collectionGeo.latitude,
          collectionGeoLongitude: $scope.collectionGeo.longitude
        });

        $scope.booking = BookingObject.setCollectionLocation($scope.collectionLocation);
        $scope.booking = BookingObject.setCollectionGeo($scope.collectionGeo);
        console.log($scope.booking);

      }, 500);

      if(!progressCollectionLocation){
        progressCollectionLocation = true;
        $scope.progress ++;
      }
    }
    else{
      if(progressCollectionLocation){
        progressCollectionLocation = false;
        $scope.progress --;
      }
    }

  };

  //
  // Passenger panel functions
  // --------------------------------------------------
  $scope.passengers = [];
  $scope.passenger = {};
  $scope.passengers.push($scope.passenger);
  var progressPassengers = false;

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

      if(!progressPassengers){
        progressPassengers = true;
        $scope.progress ++;
      }

    }
    else{
      if(progressPassengers){
        progressPassengers = false;
        $scope.progress --;
      }
    }

  };

  //
  // Airline reservation panel functions
  // --------------------------------------------------
  $scope.airlineReservation = {};
  var progressReservation = false;

  $scope.setAirlineReservation = function(isValid){

    if(isValid){
      $localstorage.setObject('airlineReservation', {
        airlineReservationNumber: $scope.airlineReservation.airlineReservationNumber,
        executiveClubNumber: $scope.airlineReservation.executiveClubNumber,
      });

      $scope.booking = BookingObject.setPassengers($scope.passengers.passenger);

      console.log($scope.booking);

      if(!progressReservation){
        progressReservation = true;
        $scope.progress ++;
      }
    }
    else{
      if(progressReservation){
        progressReservation = false;
        $scope.progress --;
      }
    }

  };

  //
  // Passport panel functions
  // --------------------------------------------------
  $scope.passportListTemplate = portrGlobals.panelElements.passportList;
  $scope.showPassportEditForm = false;
  var progressPassport = false;

  $scope.setPassport = function(isValid){

    if(isValid){

      $scope.booking = BookingObject.setPassengers($scope.passengers.passenger);
      console.log($scope.booking);

      $scope.showPassportEditForm = false;

      if(!progressPassport){
        progressPassport = true;
        $scope.progress ++;
      }

    }
    else{
      if(progressPassport){
        progressPassport = false;
        $scope.progress --;
      }
    }

  };

  //
  // Confimration panel functions
  // --------------------------------------------------
  $scope.confirmationTemplate = portrGlobals.panels.confirmation;
  $scope.confirmationBagCount = parseInt($scope.luggageDetails.bagCheckIn, 10) + parseInt($scope.luggageDetails.bagCarryOn, 10);


}]);



/*eslint-enable */
