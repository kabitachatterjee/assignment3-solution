(function () {
'use strict';

angular.module('NarrowItDownApp', [])
.controller('NarrowItDownAppController', NarrowItDownAppController)
.service('MenuSearchService', MenuSearchService)
.directive('foundItems', FoundItemsDirective)
.constant('ApiBasePath', "http://davids-restaurant.herokuapp.com");



function FoundItemsDirective() {
  var ddo = {
    restrict: 'E',
    templateUrl: 'foundItems.html',
    scope: {
      items: '<',
      onRemove: '&'
    },
    controller: NarrowItDownAppController,
    controllerAs: 'list',
    bindToController: true
  };

  return ddo;
}


// function FoundItemsDirectiveController() {
//   var list = this;
// list.found = function(){
//    return menu;
// };
// }


NarrowItDownAppController.$inject = ['MenuSearchService'];
function NarrowItDownAppController(MenuSearchService) {
  var menu = this;
  menu.matchedItems = [];
  //menu.items = [];
  menu.removeItem = function (itemIndex) {
    MenuSearchService.removeItem(itemIndex);
    };
  

  var promise = MenuSearchService.getMenuItems();

  promise.then(function (response) {
   menu.items = response.data.menu_items;
    })
  .catch(function (error) {
    console.log("Something went terribly wrong.");
  });

  menu.foundItems = function(searchTerm){
  var promise = MenuSearchService.getMatchedMenuItems();
  promise.then(function (response) {
      console.log(response.data.menu_items);
      menu.items = response.data.menu_items;
if (searchTerm == "") {
        return menu.items;
       }
   else{
       for(var i = 0; i <=menu.items.length; i++ ){
      var name = menu.items[i].name.toLowerCase();
      if(name.indexOf(searchTerm) !== -1){
        console.log(menu.items[i]);
         menu.matchedItems.push(menu.items[i]);
         //console.log(matchedItems);
        //return name;
      }
      else {
        return menu.items;
      }
     }
     //console.log(matchedItems);
      return menu.matchedItems;
    }
    })
    .catch(function (error) {
      console.log(error);
    })
  };
}


MenuSearchService.$inject = ['$http', 'ApiBasePath']
function MenuSearchService($http, ApiBasePath) {
  var service = this;

  service.getMenuItems = function () {
    var response = $http({
      method: "GET",
      url: (ApiBasePath + "/menu_items.json")
    });
    
    return response;
  };

  service.getMatchedMenuItems = function (){
    var response = $http({
      method: "GET",
      url: (ApiBasePath + "/menu_items.json")
      
    });
    return response;
  };

  service.removeItem = function (itemIndex) {
    items.splice(itemIndex, 1);
  };

}

})();
