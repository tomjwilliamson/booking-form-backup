'use strict'; //jshint ignore:line

/**
 * @ngdoc overview
 * @name PortrBookingApp
 * @description
 * # Portr booking form front end application.
 *
 * Main module of the application.
 */

var portrBookingApp = angular.module('portrBookingApp', ['portrBookingControllers', 'portrBookingDirectives', 'portrServices', 'portrBookingFilters', 'ngRoute', 'ngSanitize', 'angular-inview']);

portrBookingApp.config(['$routeProvider', '$locationProvider', '$interpolateProvider', function($routeProvider, $locationProvider, $interpolateProvider) {

  $locationProvider.html5Mode(false).hashPrefix('!');
  //$locationProvider.html5Mode(true);
  $interpolateProvider.startSymbol('{-');
  $interpolateProvider.endSymbol('-}');

  $routeProvider
    .when('/', {
      templateUrl: '/templates/partials/home.html',
      controller: 'homeController',
      reloadOnSearch: false
    })
    .when('/booking', {
      templateUrl: '/templates/partials/booking.html',
      controller: 'bookingController',
      reloadOnSearch: false
    })
    .otherwise({
      redirectTo: '/'
    });

}]);
