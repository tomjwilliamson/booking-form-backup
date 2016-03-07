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
      flightDataObj;

  SharedProperties.setUserFlightData = function(obj){
    flightDataObj = obj;
    return flightDataObj;
  };
  SharedProperties.getUserFlightData = function(){
    return flightDataObj;
  };

  return SharedProperties;


}]);
