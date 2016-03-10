'use strict'; //jshint ignore:line
/* global portrGlobals:false */
/**
 * @ngdoc overview
 * @name PortrBookingApp
 * @description
 * # Portr booking form front end application.
 *
 * Main module of the application.
 */

var portrBookingApp = angular.module('portrBookingApp', ['portrBookingControllers', 'portrBookingDirectives', 'portrServices', 'portrBookingFilters', 'ngRoute', 'ngSanitize', 'angular-inview', 'slick', 'angularMoment']);

portrBookingApp.config(['$routeProvider', '$locationProvider', '$interpolateProvider', function($routeProvider, $locationProvider, $interpolateProvider) {

  $locationProvider.html5Mode(false).hashPrefix('!');
  //$locationProvider.html5Mode(true);
  $interpolateProvider.startSymbol('{-');
  $interpolateProvider.endSymbol('-}');

  $routeProvider
    .when('/', {
      templateUrl: portrGlobals.templates.home,
      controller: 'homeController',
      reloadOnSearch: false
    })
    .when('/how-it-works', {
      templateUrl: portrGlobals.templates.howItWorks,
      controller: 'howItWorksController',
      reloadOnSearch: false
    })
    .when('/booking', {
      templateUrl: portrGlobals.templates.booking,
      controller: 'bookingController',
      reloadOnSearch: false
    })
    .otherwise({
      redirectTo: '/'
    });

}]);

portrBookingApp.config(['$httpProvider', function ($httpProvider) {
    $httpProvider.defaults.headers.common = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': 'Basic VFdpbGxpYW1zb25AcG9ydHIuY29tOnBhc3N3b3Jk'
    };
}]);
