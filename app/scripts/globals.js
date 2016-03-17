/*eslint-disable */

'use strict'; //jshint ignore:line
/* jshint unused:false */

var portrGlobals = (function(){ //eslint-disable-line no-use-before-define
  var testingPath = '/portr-test/',
      jsonFolder = '/static_json/',
      //staging = '',
      //partialsFolder = '/templates/partials/',
      //panelsFolder = '/templates/panels/',
      api = 'http://portr2-dev-api.azurewebsites.net:80/api/',
      globals;

  globals = {
    paths: {
      panelOrder: jsonFolder + 'order.json',
      flightStatus: api + 'FlightStatus/GetFlightStatus',
      login: api + 'User/Login'
    },
    templates: {
      home: '/templates/partials/home.html',
      howItWorks: '/templates/partials/how-it-works.html',
      booking: '/templates/partials/booking.html'
    },
    panels: {
      loginRegister: '/templates/panels/login-register.html',
      flyingSoon: '/templates/panels/flying-soon.html',
      flightDetails: '/templates/panels/flight-details.html',
      luggage: '/templates/panels/luggage.html',
      bagPickUpTime: '/templates/panels/bag-pickup-time.html',
      bagPickUpLocation: '/templates/panels/bag-pickup-location.html',
      passengers: '/templates/panels/passengers.html',
      airlineReservation: '/templates/panels/your-airline-reservation.html',
      passportInformation: '/templates/panels/passport-information.html',
      paymentDetails: '/templates/panels/payment-details.html',
      confirmation: '/templates/panels/confirmation.html'
    },
    panelElements: {
      passengerLead: '/templates/panel-elements/passenger-layout-lead.html',
      passengerLayout: '/templates/panel-elements/passenger-layout.html',
      passportList: '/templates/panel-elements/passport-list-item.html'
    },
    sections: {
      header: '/templates/partials/header.html',
      footer: '/templates/partials/footer.html'
    }
  };

  return globals;

})();


/*eslint-enable */
