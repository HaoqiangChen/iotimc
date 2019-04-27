define(['require',
  'angular',
  'angular-route',
  'jquery',
  'app',
  'router'
], function (require, angular) {
  'use strict';
  require(['domReady!'], function (document) {
    console.log(document)
    angular.bootstrap(document, ['webapp']);
  });
});
