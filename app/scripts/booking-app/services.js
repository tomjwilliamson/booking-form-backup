'use strict'; //jshint ignore:line

var PortrServices = angular.module('portrServices', []);

PortrServices.factory('DataService', [ '$http', function ($http) {

  var DataService = {};

  DataService.getData = function(path, params) {
    return $http.get(path, {params: params});
  };

  DataService.postData = function(path, params) {
    return $http.post(path, {params: params});
  };

  return DataService;

}]);
