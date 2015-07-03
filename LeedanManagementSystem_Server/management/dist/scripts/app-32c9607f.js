"use strict";function AddStockCtrl(t,e,a){t.employeeList=[],a.get(companyBasicUrl+"/employee").success(function(e){t.employeeList=e.objects.map(function(t){return{id:t._id,name:t.name}})}),t.ok=function(){/\d+/.test(t.stock_number)&&/\d+/.test(t.safety_stock)?(a.post(companyBasicUrl+"/stock",{title:t.title,sku_number:t.sku_number,keeper:t.keeper,stock_number:t.stock_number,safety_stock:t.safety_stock,unit:t.unit}).success(function(t){console.log("Success"),console.log(t)}).error(function(t){alert(t.massage)}),e.close()):alert("Input property error")},t.cancel=function(){e.dismiss("cancel")}}function AddSupplierCtrl(t,e,a){t.ok=function(){t.title&&""!=t.title?(a.post(companyBasicUrl+"/supplier",{title:t.title,tax_id:t.tax_id,post_address:t.post_address,phone:t.phone,fax:t.fax,contact:{name:t.contact_name,cellphone:t.contact_cellphone,phone:t.contact_phone,email:t.contact_email}}).success(function(t){console.log("Success"),console.log(t)}).error(function(t){alert(t.massage)}),e.close()):alert("Input property error")},t.cancel=function(){e.dismiss("cancel")}}angular.module("inspinia",["ngAnimate","ngCookies","ngTouch","ngSanitize","ngResource","ui.router","ui.bootstrap","datatables"]).config(["$stateProvider","$urlRouterProvider",function(t,e){t.state("index",{"abstract":!0,url:"/index",templateUrl:"components/common/content.html"}).state("index.main",{url:"/main",templateUrl:"app/main/main.html",data:{pageTitle:"Example view"}}).state("index.minor",{url:"/minor",templateUrl:"app/minor/minor.html",data:{pageTitle:"Example view"}}).state("index.stock",{url:"/stock",templateUrl:"app/stock_manager/stock.html",data:{pageTitle:"Stock"}}).state("index.supplier",{url:"/supplier",templateUrl:"app/stock_manager/supplier.html",data:{pageTitle:"Supplier"}}),e.otherwise("/index/main")}]);var basicUrl="http://localhost/api",companyId="557711ec6e266a8c9b250b18",companyBasicUrl=basicUrl+"/company/"+companyId;angular.module("inspinia").controller("MainCtrl",["$scope",function(){this.userName="Example user",this.helloText="Welcom to ASD",this.descriptionText="It is an application skeleton for a typical AngularJS web app. You can use it to quickly bootstrap your angular webapp projects."}]).controller("StockCtrl",["$scope","$modal","$http",function(t,e,a){function o(){a.get(companyBasicUrl+"/stock").success(function(e){t.stockList=e.objects.map(function(e){return t.employeeList.some(function(t){e.keeper==t.id&&(e.keeper_name=t.name)}),e})})}t.stockList=[],t.openAddStockModal=function(){var t=e.open({templateUrl:"app/stock_manager/add_stock.html",controller:AddStockCtrl});t.result.then(function(){o()},function(){})},a.get(companyBasicUrl+"/employee").success(function(e){t.employeeList=e.objects.map(function(t){return{id:t._id,name:t.name}}),o()})}]).controller("SupplierCtrl",["$scope","$modal","$http",function(t,e,a){function o(){a.get(companyBasicUrl+"/supplier").success(function(e){t.supplierList=e.objects.map(function(t){return console.log(t),t})})}t.openAddSupplierModal=function(){var t=e.open({templateUrl:"app/stock_manager/add_supplier.html",controller:AddSupplierCtrl});t.result.then(function(){o()},function(){})},o()}]),AddStockCtrl.$inject=["$scope","$modalInstance","$http"],AddSupplierCtrl.$inject=["$scope","$modalInstance","$http"],$(document).ready(function(){function t(){var t=$("body > #wrapper").height()-61;$(".sidebard-panel").css("min-height",t+"px");var e=$("nav.navbar-default").height(),a=$("#page-wrapper").height();e>a&&$("#page-wrapper").css("min-height",e+"px"),a>e&&$("#page-wrapper").css("min-height",$(window).height()+"px"),$("body").hasClass("fixed-nav")&&$("#page-wrapper").css("min-height",$(window).height()-60+"px")}$(window).bind("load resize scroll",function(){$("body").hasClass("body-small")||t()}),setTimeout(function(){t()})}),$(function(){$(window).bind("load resize",function(){$(this).width()<769?$("body").addClass("body-small"):$("body").removeClass("body-small")})}),angular.module("inspinia").directive("sideNavigation",["$timeout",function(t){return{restrict:"A",link:function(e,a){e.$watch("authentication.user",function(){t(function(){a.metisMenu()})})}}}]).directive("minimalizaSidebar",["$timeout",function(t){return{restrict:"A",template:'<a class="navbar-minimalize minimalize-styl-2 btn btn-primary " href="" ng-click="minimalize()"><i class="fa fa-bars"></i></a>',controller:["$scope","$element",function(e){e.minimalize=function(){angular.element("body").toggleClass("mini-navbar"),!angular.element("body").hasClass("mini-navbar")||angular.element("body").hasClass("body-small")?(angular.element("#side-menu").hide(),t(function(){angular.element("#side-menu").fadeIn(500)},100)):angular.element("#side-menu").removeAttr("style")}}]}}]),angular.module("inspinia").run(["$templateCache",function(t){t.put("app/minor/minor.html",'<div class="wrapper wrapper-content animated fadeInRight"><div class="row"><div class="col-lg-12"><div class="text-center m-t-lg"><h1>Simple example of second view 123</h1><small>Configure in app.js as index.minor state.</small></div></div></div></div>'),t.put("app/main/main.html",'<div class="wrapper wrapper-content animated fadeInRight"><div class="row"><div class="col-lg-12"><div class="text-center m-t-lg"><h1>{{main.helloText}}</h1><small>{{main.descriptionText}} <i class="glyphicon glyphicon-pencil"></i></small></div></div></div></div>'),t.put("app/stock_manager/add_stock.html",'<div class="modal-body"><div class="row"><div class="col-sm-6 b-r"><h3 class="m-t-none m-b">Add New Stock</h3><form role="form"><div class="form-group"><label>Title</label> <input type="text" placeholder="請輸入品名" class="form-control" ng-model="title"></div><div class="form-group"><label>SKU</label> <input type="text" placeholder="請輸入編號" class="form-control" ng-model="sku_number"></div><div class="form-group"><label>Keeper</label><select class="form-control m-b" ng-model="keeper" ng-options="employee.id as employee.name for employee in employeeList"><option>選擇負責人</option></select></div></form></div><div class="col-sm-6"><h3 class="m-t-none m-b">Current Status</h3><form role="form"><div class="form-group"><label>Stock Number</label> <input type="text" placeholder="請輸入現有數量" class="form-control" ng-model="stock_number"></div><div class="form-group"><label>Safety Stock</label> <input type="text" placeholder="請輸入安全庫存" class="form-control" ng-model="safety_stock"></div><div class="form-group"><label>Unit</label> <input type="text" placeholder="請輸入單位" class="form-control" ng-model="unit"></div><button class="btn btn-sm btn-primary pull-right m-t-n-xs" type="submit" ng-click="ok()"><strong>Add</strong></button></form></div></div></div>'),t.put("app/stock_manager/add_supplier.html",'<div class="modal-body"><div class="row"><div class="col-sm-6 b-r"><h3 class="m-t-none m-b">Add New Supplier</h3><form role="form"><div class="form-group"><label>Title</label> <input type="text" placeholder="請輸入供應商名稱" class="form-control" ng-model="title"></div><div class="form-group"><label>Tax ID</label> <input type="text" placeholder="請輸入統一編號" class="form-control" ng-model="tax_id"></div><div class="form-group"><label>Post Address</label> <input type="text" placeholder="請輸入地址" class="form-control" ng-model="post_address"></div><div class="form-group"><label>Phone</label> <input type="text" placeholder="請輸入電話" class="form-control" ng-model="phone"></div><div class="form-group"><label>Fax</label> <input type="text" placeholder="請輸入傳真" class="form-control" ng-model="fax"></div></form></div><div class="col-sm-6"><h3 class="m-t-none m-b">Contact</h3><form role="form"><div class="form-group"><label>Name</label> <input type="text" placeholder="請輸入連絡人姓名" class="form-control" ng-model="contact_name"></div><div class="form-group"><label>Cellphone</label> <input type="text" placeholder="請輸入連絡人手機" class="form-control" ng-model="contact_cellphone"></div><div class="form-group"><label>Phone</label> <input type="text" placeholder="請輸入連絡人電話" class="form-control" ng-model="contact_phone"></div><div class="form-group"><label>Email</label> <input type="text" placeholder="請輸入連絡人Email" class="form-control" ng-model="contact_email"></div><div class="form-group"><label></label> <button class="btn btn-sm btn-primary pull-right m-t-n-xs" type="submit" ng-click="ok()"><strong>Add</strong></button></div></form></div></div></div>'),t.put("app/stock_manager/stock.html",'<div class="wrapper wrapper-content animated fadeInRight" ng-controller="StockCtrl"><div class="row"><div class="col-lg-12"><button type="button" class="btn btn-w-m btn-primary" ng-click="openAddStockModal()">Add Stock</button></div></div><br><div class="row"><div class="col-lg-12"><div class="ibox-content"><table datatable="ng" class="table table-striped table-bordered table-hover dataTables-example"><thead><tr><th>Title</th><th>SKU</th><th>Stock Number</th><th>Safety Stock</th><th>Unit</th><th>Keeper</th></tr></thead><tbody><tr ng-repeat="stock in stockList"><td>{{ stock.title }}</td><td>{{ stock.sku_number }}</td><td>{{ stock.stock_number }}</td><td>{{ stock.safety_stock }}</td><td>{{ stock.unit }}</td><td>{{ stock.keeper_name }}</td></tr></tbody></table></div></div></div></div>'),t.put("app/stock_manager/supplier.html",'<div class="wrapper wrapper-content animated fadeInRight" ng-controller="SupplierCtrl"><div class="row"><div class="col-lg-12"><button type="button" class="btn btn-w-m btn-primary" ng-click="openAddSupplierModal()">Add Supplier</button></div></div><br><div class="row"><div class="col-lg-12"><div class="ibox-content"><table datatable="ng" class="table table-striped table-bordered table-hover dataTables-example"><thead><tr><th>Title</th><th>Tax</th><th>Post Address</th><th>Phone</th><th>Fax</th><th>Contact</th><th>Cellphone</th><th>Phone</th><th>Email</th></tr></thead><tbody><tr ng-repeat="supplier in supplierList"><td>{{ supplier.title }}</td><td>{{ supplier.tax_id }}</td><td>{{ supplier.post_address }}</td><td>{{ supplier.phone }}</td><td>{{ supplier.fax }}</td><td>{{ supplier.contact.name }}</td><td>{{ supplier.contact.cellphone }}</td><td>{{ supplier.contact.phone }}</td><td>{{ supplier.contact.email }}</td></tr></tbody></table></div></div></div></div>'),t.put("components/common/content.html",'<div id="wrapper"><div ng-include="\'components/common/navigation.html\'"></div><div id="page-wrapper" class="gray-bg {{$state.current.name}}"><div ng-include="\'components/common/topnavbar.html\'"></div><div ui-view=""></div><div ng-include="\'components/common/footer.html\'"></div></div></div>'),t.put("components/common/footer.html",'<div class="footer"><div class="pull-right">10GB of <strong>250GB</strong> Free.</div><div><strong>Copyright</strong> Example Company &copy; 2014-2015</div></div>'),t.put("components/common/ibox_tools.html",'<div class="ibox-tools dropdown" dropdown=""><a ng-click="showhide()"><i class="fa fa-chevron-up"></i></a> <a class="dropdown-toggle" href="" dropdown-toggle=""><i class="fa fa-wrench"></i></a><ul class="dropdown-menu dropdown-user"><li><a href="">Config option 1</a></li><li><a href="">Config option 2</a></li></ul><a ng-click="closebox()"><i class="fa fa-times"></i></a></div>'),t.put("components/common/navigation.html",'<nav class="navbar-default navbar-static-side" role="navigation"><div class="sidebar-collapse"><ul side-navigation="" class="nav metismenu" id="side-menu"><li class="nav-header"><div class="dropdown profile-element" dropdown=""><a class="dropdown-toggle" dropdown-toggle="" href=""><span class="clear"><span class="block m-t-xs"><strong class="font-bold">{{main.userName}}</strong></span> <span class="text-muted text-xs block">Example menu<b class="caret"></b></span></span></a><ul class="dropdown-menu animated fadeInRight m-t-xs"><li><a href="">Logout</a></li></ul></div><div class="logo-element">LDSM</div></li><li ui-sref-active="active"><a ui-sref="index.main"><i class="fa fa-cubes"></i> <span class="nav-label">庫存管理</span></a></li><li ui-sref-active="active"><a ui-sref="index.stock"><i class="fa fa-cubes"></i> <span class="nav-label">庫存管理</span></a></li><li ui-sref-active="active"><a ui-sref="index.supplier"><i class="fa fa-university"></i> <span class="nav-label">供應商管理</span></a></li></ul></div></nav>'),t.put("components/common/topnavbar.html",'<div class="row border-bottom"><nav class="navbar navbar-static-top white-bg" role="navigation" style="margin-bottom: 0"><div class="navbar-header"><span minimaliza-sidebar=""></span><form role="search" class="navbar-form-custom" method="post" action=""><div class="form-group"><input type="text" placeholder="Search for something..." class="form-control" name="top-search" id="top-search"></div></form></div><ul class="nav navbar-top-links navbar-right"><li><a href=""><i class="fa fa-sign-out"></i> Log out</a></li></ul></nav></div>')}]);