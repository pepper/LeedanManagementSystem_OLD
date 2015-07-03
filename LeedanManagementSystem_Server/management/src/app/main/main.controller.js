'use strict';

var basicUrl = "/api";
var companyId = "557a9e588982f49c0750eb70";
var companyBasicUrl = basicUrl + "/company/" + companyId + "";

angular.module('inspinia')
.controller('MainCtrl', function ($scope) {
	this.userName = 'Example user';
	this.helloText = 'Welcom to ASD';
	this.descriptionText = 'It is an application skeleton for a typical AngularJS web app. You can use it to quickly bootstrap your angular webapp projects.';
}).controller("StockCtrl", function($scope, $modal, $http){
	$scope.stockList = [];
	$scope.openAddStockModal = function(){
		var modalInstance = $modal.open({
			templateUrl: 'app/stock_manager/add_stock.html',
			controller: AddStockCtrl
		});
		modalInstance.result.then(function(){
			getStockListFromBackend();
		}, function() {});
	};

	function getStockListFromBackend(){
		$http.get(companyBasicUrl + "/stock").success(function(data, status, headers, config) {
			$scope.stockList = data.objects.map(function(stock){
				$scope.employeeList.some(function(employee){
					if(stock.keeper == employee.id){
						stock.keeper_name = employee.name;
					}
				});
				stock.supplier_name_list = stock.supplier_list.map(function(supplierId){
					var name = "";
					$scope.supplierList.some(function(supplier){
						if(supplierId == supplier._id){
							name = supplier.title;
							return true;
						}
					});
					return name;
				});
				return stock;
			});
		});
	}

	$http.get(companyBasicUrl + "/employee").success(function(data, status, headers, config) {
		$scope.employeeList = data.objects.map(function(employee){
			return {
				id: employee._id,
				name: employee.name,
			}
		});
		$http.get(companyBasicUrl + "/supplier").success(function(data, status, headers, config) {
			$scope.supplierList = data.objects.map(function(supplier){
				return supplier;
			});
			getStockListFromBackend();
		});
	});
}).controller("SupplierCtrl", function($scope, $modal, $http){
	$scope.openAddSupplierModal = function(){
		var modalInstance = $modal.open({
			templateUrl: 'app/stock_manager/add_supplier.html',
			controller: AddSupplierCtrl
		});
		modalInstance.result.then(function(){
			getSupplierListFromBackend();
		}, function() {});
	};

	function getSupplierListFromBackend(){
		$http.get(companyBasicUrl + "/supplier").success(function(data, status, headers, config) {
			$scope.supplierList = data.objects.map(function(supplier){
				return supplier;
			});
		});
	}

	getSupplierListFromBackend();
});

function AddStockCtrl($scope, $modalInstance, $http){
	$scope.employeeList = [];
	$http.get(companyBasicUrl + "/employee").success(function(data, status, headers, config) {
		$scope.employeeList = data.objects.map(function(employee){
			return {
				id: employee._id,
				name: employee.name,
			}
		});
	});
	$http.get(companyBasicUrl + "/supplier").success(function(data, status, headers, config) {
		$scope.supplierList = data.objects.map(function(supplier){
			return {
				id: supplier._id,
				title: supplier.title,
			}
		});
	});
	$scope.ok = function(){
		if(/\d+/.test($scope.stock_number) && /\d+/.test($scope.safety_stock)){
			$http.post(companyBasicUrl + "/stock", {
				title: $scope.title,
				sku_number: $scope.sku_number,
				keeper: $scope.keeper,
				stock_number: $scope.stock_number,
				safety_stock: $scope.safety_stock,
				unit: $scope.unit,
				supplier: $scope.supplier,
			}).success(function(data, status, headers, config) {
				console.log("Success");
				console.log(data);
			}).
			error(function(data, status, headers, config) {
				alert(data.massage);
			});
			$modalInstance.close();
		}
		else{
			alert("Input property error");
		}
	};

	$scope.cancel = function(){
		$modalInstance.dismiss('cancel');
	};
}

function AddSupplierCtrl($scope, $modalInstance, $http){
	$scope.ok = function(){
		if($scope.title && $scope.title != ""){
			$http.post(companyBasicUrl + "/supplier", {
				title: $scope.title,
				tax_id: $scope.tax_id,
				post_address: $scope.post_address,
				phone: $scope.phone,
				fax: $scope.fax,
				contact:{
					name: $scope.contact_name,
					cellphone: $scope.contact_cellphone,
					phone: $scope.contact_phone,
					email: $scope.contact_email,
				}
			}).success(function(data, status, headers, config) {
				console.log("Success");
				console.log(data);
			}).
			error(function(data, status, headers, config) {
				alert(data.massage);
			});
			$modalInstance.close();
		}
		else{
			alert("Input property error");
		}
	};

	$scope.cancel = function(){
		$modalInstance.dismiss('cancel');
	};
}
