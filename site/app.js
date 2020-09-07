	var app = angular.module("shoppingList", []);
	app.controller("shoppingListCtrl", function($scope, $http) {
		$scope.addItemVar = "";
		$scope.addItemCategory = "";
		$scope.CategoryVar = "";
		$scope.listID = "";
		$scope.selected = [];
		
		$scope.hashCode = function(s) {
			var h = 0, l = s.length, i = 0;
			if ( l > 0 )
				while (i < l)
					h = (h << 5) - h + s.charCodeAt(i++) | 0;
			return h;
		};
				
		$scope.parseList = function(data) {
			$scope.items = data;
			$scope.categories = Object.getOwnPropertyNames($scope.items);
			$scope.categories.sort();
			$scope.fixedCategories = [];
			for(x in $scope.categories) {
				$scope.fixedCategories.push({category: $scope.categories[x], hash: "a" + $scope.hashCode($scope.categories[x]).toString(), num: $scope.items[$scope.categories[x]].length});
			}
		}
		
		$scope.getList = function() {
			$http({method: "POST",
				   url: "/getList",
				   data: {listname: $scope.listname.substring(1)}}).then(function(response) {
					$scope.parseList(response.data);
			});
		}
		
		$scope.removeItems = function() {
			$scope.removedItems = [];
			for(var k in $scope.selected) {
				var currentObj = Object.getOwnPropertyNames($scope.selected[k]);
				for(var j in currentObj) {
					$scope.removedItems.push({category: k, item: currentObj[j]});
				}
			}
			$http({
				method: "POST",
				url: "/removeItems",
				data: {items: $scope.removedItems, listname: $scope.listname.substring(1)}
			}).then(function(response) {
				$scope.parseList(response.data);
			});
			$scope.selected = [];
		}
		
		$scope.createCategory = function() {
			$http({
				method: "POST",
				url: "/createCategory",
				data: {category: $scope.CategoryVar, listname: $scope.listname.substring(1)}
			}).then(function(response) {
				$scope.parseList(response.data);
				$scope.CategoryVar = "";
			});
		}
		
		$scope.addItem = function() {
			$scope.addItemData = {category: $scope.addItemCategory, item: $scope.addItemVar, listname: $scope.listname.substring(1)};
			$http({
				method: "POST",
				url: "/addItem",
				data: $scope.addItemData
			}).then(function(response) {
				$scope.parseList(response.data);
				$scope.addItemCategory = "";
				$scope.addItemVar = "";
			});
		}
		
		$scope.removeCategory = function() {
			$http({
				method: "POST",
				url: "/removeCategory",
				data: {category: $scope.CategoryVar, listname: $scope.listname.substring(1)}
			}).then(function(response) {
				$scope.parseList(response.data);
				$scope.CategoryVar = "";
			});
		}
		
		$scope.showAddItemModal = function(category) {
			var addItemCategorySelector = document.getElementById("categoryDropdown");
			console.log(addItemCategorySelector.options);
			for(var i = 0; i<addItemCategorySelector.options.length; i++) {
				console.log(addItemCategorySelector.options[i].text);
				if(addItemCategorySelector.options[i].text === $scope.categories[category]) {
					addItemCategorySelector.options[i].selected = true;
					$scope.addItemCategory = $scope.categories[category];
				}
			}
			$("#addItemModal").modal("show");
		}
		
		//Run things after function definitions as soon as the front end is loaded:
		
		$scope.listname = window.location.pathname
		$scope.getList();
	});
  
  