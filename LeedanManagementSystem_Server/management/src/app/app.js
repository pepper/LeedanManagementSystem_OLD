'use strict';

angular.module('inspinia', ['ngAnimate', 'ngCookies', 'ngTouch', 'ngSanitize', 'ngResource', 'ui.router', 'ui.bootstrap', 'datatables'])
  .config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider

        .state('index', {
            abstract: true,
            url: "/index",
            templateUrl: "components/common/content.html",
        })
        .state('index.main', {
            url: "/main",
            templateUrl: "app/main/main.html",
            data: { pageTitle: 'Example view' }
        })
        .state('index.minor', {
            url: "/minor",
            templateUrl: "app/minor/minor.html",
            data: { pageTitle: 'Example view' }
        })
        .state("index.stock", {
            url: "/stock",
            templateUrl: "app/stock_manager/stock.html",
            data: { pageTitle: 'Stock' },
        })
        .state("index.supplier", {
            url: "/supplier",
            templateUrl: "app/stock_manager/supplier.html",
            data: { pageTitle: 'Supplier' },
        });

    $urlRouterProvider.otherwise('/index/main');
  })
;
