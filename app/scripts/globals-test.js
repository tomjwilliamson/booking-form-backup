/*eslint-disable */

'use strict'; //jshint ignore:line
/* jshint unused:false */

var portrGlobals = (function(){ //eslint-disable-line no-use-before-define
  var relativePath = '/portr-test',
      jsonFolder = '/static_json/',
      //staging = '',
      //partialsFolder = '/templates/partials/',
      //panelsFolder = '/templates/panels/',
      api = 'http://portr2-dev-api.azurewebsites.net:80/api/',
      globals;

  globals = {
    paths: {
      panelOrder: relativePath + jsonFolder + 'order.json',
      flightStatus: api + 'FlightStatus/GetFlightStatus'
    },
    templates: {
      home: relativePath + '/templates/partials/home.html',
      howItWorks: relativePath + '/templates/partials/how-it-works.html',
      booking: relativePath + '/templates/partials/booking.html'
    },
    panels: {
      loginRegister: relativePath + '/templates/panels/login-register.html',
      flyingSoon: relativePath + '/templates/panels/flying-soon.html',
      flightDetails: relativePath + '/templates/panels/flight-details.html',
      luggage: relativePath + '/templates/panels/luggage.html',
      bagPickUpTime: relativePath + '/templates/panels/bag-pickup-time.html',
      bagPickUpLocation: relativePath + '/templates/panels/bag-pickup-location.html',
      passengers: relativePath + '/templates/panels/passengers.html',
      airlineReservation: relativePath + '/templates/panels/your-airline-reservation.html',
      passportInformation: relativePath + '/templates/panels/passport-information.html',
      paymentDetails: relativePath + '/templates/panels/payment-details.html',
      confirmation: relativePath + '/templates/panels/confirmation.html'
    },
    panelElements: {
      passengerLead: relativePath + '/templates/panel-elements/passenger-layout-lead.html',
      passengerLayout: relativePath + '/templates/panel-elements/passenger-layout.html',
      passportList: relativePath + '/templates/panel-elements/passport-list-item.html'
    },
    sections: {
      header: relativePath + '/templates/partials/header.html',
      footer: relativePath + '/templates/partials/footer.html'
    }
  };

  return globals;

})();


/*eslint-enable */
