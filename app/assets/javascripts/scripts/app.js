var app = angular.module('app', ['templates' , 'datatables' ])
app
.filter('cmdate', [
  '$filter', function($filter) {
      return function(input, format) {
          return $filter('date')(new Date(input), format);
      };
    }
]);