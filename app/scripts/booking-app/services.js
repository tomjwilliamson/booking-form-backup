'use strict'; //jshint ignore:line

var PortrServices = angular.module('portrServices', []);

PortrServices.factory('DataService', [ '$http', function ($http) {

  var DataService = {};

  DataService.getData = function(path, data) {
    return $http.get(path, data);
  };

  DataService.postData = function(path, data) {
    return $http.post(path, data);
  };

  return DataService;

}]);

PortrServices.service('SharedProperties', [function () {

  var SharedProperties = {},
      flightDataObj,
      locationDetails;

  SharedProperties.setUserFlightData = function(obj){
    flightDataObj = obj;
    return flightDataObj;
  };
  SharedProperties.getUserFlightData = function(){
    return flightDataObj;
  };
  SharedProperties.setUserLocation = function(obj){
    locationDetails = obj;
    return locationDetails;
  };
  SharedProperties.getUserLocation = function(){
    return locationDetails;
  };

  return SharedProperties;

}]);

PortrServices.service('BookingObject', [function () {

  var GlobalBookingObject = {},
      booking = {
        'bookingType': 1,
        'userId': '20a68eb3-0fc9-4191-9cf4-f32ddfd1450a',
        'bookingJourney': [
          {
            'collectionLocation': {
              'geoCoord': {}
            },
            'collectionDateTime': '',
            'deliveryLocation': {
              'geoCoord': {}
            },
            'deliveryDateTime': '',
            'passenger': []
          }
        ],
        'bookingCompletion': {
          'collectionLocationDetails': true,
          'collectionDateTimeDetails': true,
          'deliveryLocationDetail': true,
          'deliveryDateTimeDetails': true,
          'passengerDetails': true
        }
      };

  GlobalBookingObject.setCollectionLocation = function(obj){

    booking.bookingJourney[0].collectionLocation = obj;

    return booking;
  };
  GlobalBookingObject.setCollectionGeo = function(obj){

    booking.bookingJourney[0].collectionLocation.geoCoord = obj;

    return booking;
  };
  GlobalBookingObject.setDeliveryLocation = function(obj){

    booking.bookingJourney[0].deliveryLocation = obj;

    return booking;
  };
  GlobalBookingObject.setDeliveryGeo = function(obj){

    booking.bookingJourney[0].deliveryLocation.geoCoord = obj;

    return booking;
  };
  GlobalBookingObject.setCollectionDateTime = function(obj){

    booking.bookingJourney[0].collectionDateTime = obj.date;

    return booking;
  };
  GlobalBookingObject.setDeliveryDateTime = function(obj){

    booking.bookingJourney[0].deliveryDateTime = obj;

    return booking;
  };
  GlobalBookingObject.setPassengers = function(obj){

    booking.bookingJourney[0].passenger = obj;

    return booking;
  };
  GlobalBookingObject.setReservationNumber = function(obj){

    booking.bookingJourney[0].passenger = obj;

    return booking;
  };

  return GlobalBookingObject;

}]);

PortrServices.factory('Auth', [ '$localstorage', function ($localstorage) {

  var thisUser = $localstorage.get('credentials');
  var setUser = function (user) {
    console.log(user);
    thisUser = { 'username': user.username };
    $localstorage.setObject('credentials', {
      username: user.username
    });
  };

  return {
    setUser: setUser,
    isLoggedIn: function () {
      return thisUser ? true : false;
    },
    getUser: function () {
      return thisUser;
    },
    logout: function () {
      $localstorage.removeObject('credentials');
      thisUser = null;
    }
  };
}]);

PortrServices.factory('$localstorage', ['$window', function($window) {
  return {
    set: function(key, value) {
      $window.localStorage[key] = value;
    },
    get: function(key, defaultValue) {
      return $window.localStorage[key] || defaultValue;
    },
    setObject: function(key, value) {
      $window.localStorage[key] = JSON.stringify(value);
    },
    getObject: function(key) {
      return JSON.parse($window.localStorage[key] || '{}');
    },
    removeObject: function(key){
      return $window.localStorage.removeItem(key);
    }
  };
}]);
