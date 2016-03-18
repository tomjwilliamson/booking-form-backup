/*eslint-disable */

// bookingApp Filters
'use strict';

var portrBookingFilters = angular.module('portrBookingFilters', []);

portrBookingFilters.filter('encode', [function () {
  return function(str) {

    var strEncoded = btoa(str);
    return strEncoded;

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

portrBookingFilters.filter('formatDateSplit', [function () {
  return function(date) {

    var arr = [],
        newDate = [];

    arr = date.split('-');
    newDate = [arr[0], arr[1], arr[2]];

    return newDate;

  };
}]);

portrBookingFilters.filter('monthName', [function () {
  return function(val) {

    switch (val -1) {
      case 0:
        return 'Jan';
      case 1:
        return 'Feb';
      case 2:
        return 'Mar';
      case 3:
        return 'Apr';
      case 4:
        return 'May';
      case 5:
        return 'Jun';
      case 6:
        return 'Jul';
      case 7:
        return 'Aug';
      case 8:
        return 'Sep';
      case 9:
        return 'Oct';
      case 10:
        return 'Nov';
      case 11:
        return 'Dec';
    }

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



/*eslint-enable */
