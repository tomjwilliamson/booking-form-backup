// bookingApp Filters
'use strict';

var portrBookingFilters = angular.module('portrBookingFilters', []);

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

portrBookingFilters.filter('addLuggageToPassengers', [function () {

  return function(obj, type, count){

    for (var key in obj) {

      for(var c = 0; c <= count; c++){
        if (obj.hasOwnProperty(key)) {
          obj[key].holdLuggageQuantity = c;

        }

      }

      // for(var c = 1; c <= count; c++){

      //   console.log('thisItem', obj[key]);

      // }

      // if (obj.hasOwnProperty(key)) {

      //   for(var c = 1; c <= count; c++){

      //     console.log('thisItem', obj[key]);

      //     obj[key].holdLuggageQuantity = c;

      //     //console.log(obj);
      //   }

      // }
    }


  };

}]);
