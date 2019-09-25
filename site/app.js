	var app = angular.module("shoppingList", []);
	app.controller("shoppingListCtrl", function($scope, $http) {
		$scope.addItemVar = "";
		$scope.addItemCategory = "";
		$scope.CategoryVar = "";
		$scope.selected = [];
		$scope.hashCode = function(s) {
			var h = 0, l = s.length, i = 0;
			if ( l > 0 )
				while (i < l)
					h = (h << 5) - h + s.charCodeAt(i++) | 0;
			return h;
		};
		
		$scope.getList = function() {
			$http.get("/getList").then(function(response) {
			$scope.items = response.data;
			$scope.categories = Object.getOwnPropertyNames($scope.items);
			$scope.categories.sort();
			$scope.fixedCategories = [];
			for(x in $scope.categories) {
				$scope.fixedCategories.push({category: $scope.categories[x], hash: "a" + $scope.hashCode($scope.categories[x]).toString(), num: $scope.items[$scope.categories[x]].length});
			}
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
				data: $scope.removedItems
			}).then(function(response) {
				$scope.getList();
			});
			$scope.selected = [];
		}
		
		$scope.createCategory = function() {
			$http({
				method: "POST",
				url: "/createCategory",
				data: {category: $scope.CategoryVar}
			}).then(function(response) {
				$scope.getList()
				$scope.CategoryVar = "";
			});
		}
		
		$scope.addItem = function() {
			$scope.addItemData = {category: $scope.addItemCategory, item: $scope.addItemVar};
			$http({
				method: "POST",
				url: "/addItem",
				data: $scope.addItemData
			}).then(function(response) {
				$scope.getList();
				$scope.addItemCategory = "";
				$scope.addItemVar = "";
			});
		}
		
		$scope.removeCategory = function() {
			$http({
				method: "POST",
				url: "/removeCategory",
				data: {category: $scope.CategoryVar}
			}).then(function(response) {
				$scope.getList();
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
			/*
			var foundCategory = addItemCategorySelector.options.find(function(e) {
				return e.text === $scope.categories[category];
			});
			if(foundCategory) {
				foundCategory.selected = true;
			}
			*/
			$("#addItemModal").modal("show");
		}
		
		$scope.getList();
	});
  
  