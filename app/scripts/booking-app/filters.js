// bookingApp Filters
'use strict';

var portrBookingFilters = angular.module('portrBookingFilters', []);

portrBookingFilters.filter('startFrom', [function () {
  return function(input, start) {
    if(input) {
      start = +start; //parse to int
      return input.slice(start);
    }
    return [];
  };
}]);

portrBookingFilters.filter('formatDateDash', [function () {
  return function(date) {

    var arr = [],
        newDate;

    arr = date.split('/');
    newDate = (arr[2] + '-' + arr[1] + '-' + arr[0]);

    return newDate;

  };
}]);

portrBookingFilters.filter('formatDateSlash', [function () {
  return function(date) {

    var arr = [],
        newDate;

    arr = date.split('-');
    newDate = (arr[0] + '/' + arr[1] + '/' + arr[2]);

    return newDate;

  };
}]);
