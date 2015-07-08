app
  .directive("navigationApp", [
    "$rootScope",
    function directive($rootScope)
    {
      return {
        "restrict": "A",
        "scope": true,
        "link": function onLink(scope, element, attributeSet){
          element.bind("click",
            function(){
              $rootScope.$broadcast("hide");
              $rootScope.$broadcast("show-" + attributeSet.navigationApp);
            });
        }
      }
    }
  ])
  .directive("template", [
    "$rootScope",
    function directive($rootScope)
    {
      return {
        "restrict": "A",
        "scope": true,
        "link": function onLink(scope, element, attributeSet){

          scope.$on("show-" + attributeSet.template,
            function(){
              element.removeClass("hidden");
            });

          scope.$on("hide",
            function(){
              element.addClass("hidden");
            });
        }
      }
    }
  ])
  .directive("templateName", [
    "$rootScope",
    function directive($rootScope)
    {
      return {
        "restrict": "A",
        "scope": true,
        "templateUrl": function onLoad(element, attributeSet){
          // alert(attributeSet.templateName);
          return attributeSet.templateName;

        }
      }
    }
  ])
  .directive("templateCtrl", [
    "$rootScope",
    function directive($rootScope)
    {
      return {
        "restrict": "A",
        "scope": true,
        "controller": "@",
        "name": "templateCtrl"
      }
    }
  ]);