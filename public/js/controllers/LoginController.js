
(function () {
  'use strict';

  angular
    .module('MetronicApp')
    .controller('LoginController', LoginController);

  function LoginController(authService) {

    var vm = this;

    vm.authService = authService;

  }
})();