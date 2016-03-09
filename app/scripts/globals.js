/*eslint-disable */

'use strict'; //jshint ignore:line
/* jshint unused:false */

var portrGlobals = (function(){ //eslint-disable-line no-use-before-define
  var jsonFolder = '/static_json/',
      //staging = '',
      //partialsFolder = '/templates/partials/',
      //panelsFolder = '/templates/panels/',
      api = 'http://portr2-dev-api.azurewebsites.net:80/api/',
      globals;

  globals = {
    paths: {
      panelOrder: jsonFolder + 'order.json',
      flightStatus: api + 'FlightStatus/GetFlightStatus'
    }
  };

  return globals;

})();


/*eslint-enable */
