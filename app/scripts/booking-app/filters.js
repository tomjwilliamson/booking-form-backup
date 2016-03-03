// bookingApp Filters
'use strict';

var portrBookingFilters = angular.module('portrBookingFilters', []);

portrBookingFilters.filter('startFrom', [function () {
  return function(input, start) {
    if(input) {
      start = + start; //parse to int
      return input.slice(start);
    }
    return [];
  };
}]);
