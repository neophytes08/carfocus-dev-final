app
  .controller('dashBoardCtrl', [
    "$scope",
    "$http",
    "CarServer",
    function controller($scope, $http, CarServer)
    {
      console.log("dashBoardCtrl");
      $scope.manufacturerData = {};

      $scope.submitManufacturer = function submitManufacturer(){
        CarServer.request("post", '/manufacturers/submitManufacturer',
        function(response){
          console.log(response);
          $('#settings').modal('hide');
        }, $scope.manufacturerData);
      }
    }
  ])
  .controller('inventoryViewCtrl', [
    "$scope",
    "$http",
    "CarServer",
    "$timeout",
    function controller($scope, $http, CarServer, $timeout)
    {
      console.log("inventoryViewCtrl");
      $scope.onStockList = {};
      $scope.dirPurchList = {};
      $scope.productOrderList = {};
      $scope.displayModalInfo = {};
      $scope.statusActive = false;
      $scope.tableHeadings1 = true;


      /*----- Get list of On Stock -----*/
      $scope.displayOnStockList = function displayOnStockList(){
        CarServer.request("get", "/inventories/getInventoryStocks",
        function(response){
          console.log( response );
          $scope.onStockList = response;
        });
      }
      /*----- Get list of Direct Purchase -----*/
      $scope.displayDirectPurchaseList = function displayDirectPurchaseList(){
        CarServer.request("get", "/inventories/getDirectPurchases",
        function(response){
          console.log( response );
          $scope.dirPurchList = response;
        });
      }
      /*----- Get list of Product Order -----*/
      $scope.displayDirectPurchaseList = function displayDirectPurchaseList(){
        CarServer.request("get", "/inventories/getProductOrderList",
        function(response){
          console.log( response );
          $scope.productOrderList = response;
        });
      }

      /*----- Load list after adding data -----*/
      $scope.$on( 'loadTableData', 
        function( evt , data ){
          console.log( data )
          if (data === 'onStock') {
            $scope.displayOnStockList();
          }else if( data === 'directPurchase' ) {
            $scope.displayDirectPurchaseList();
          }else if( data === 'productOrder' ) {
            $scope.displayDirectPurchaseList();
          }
        } );

      /*----- View Individual Product on Tables -----*/
      // $scope.viewProduct = function viewProduct( id ){
      //   CarServer.request("get", "/inventories/getInventoryStocks",
      //   function(response){
      //     console.log( response );
      //   });
      // }
      
      /*----- Transfer Info to modal -----*/
      $scope.displayProductInfo = function displayProductInfo( list , action ){
        console.log( action );
        $scope.tableHeadings = [];

        if ( action == 'viewOnStock' ) {
          $scope.tableHeadings1 = true;    
          $scope.displayModalInfo = list;
        }else if( action == 'edit' ) {
          $scope.displayModalInfo = list;
        }
      }

      /*----- Edit Individual Product on Tables -----*/
      $scope.editProductInfo = function editProductInfo( ){
        console.log($scope.displayModalInfo);
        CarServer.request("post", "/inventories/"+$scope.displayModalInfo.id+"/updateInventoryStocks",
          function(response){
            console.log( response );
            $('#productModalInfoEdit').modal('hide');
        }, $scope.displayModalInfo); 
      }
      
      /*----- Delete Individual Product on Tables -----*/
      $scope.removeProduct = function removeProduct( list , category ){
        var uri = "";
        var dataObj = {};
        if( confirm("Are you sure you want to delete this item?") ){
          switch( category ) {
            case 'on-stock':
              uri = 'deleteInventoryStock';
              dataObj = $scope.onStockList;
              break;
            case 'direct-purchase':
              uri = 'deleteDirectPurchase';
              dataObj = $scope.dirPurchList;
              break;
            case 'product-order':
              uri = '';
              dataObj = {}; 
              break;
            default:
              break;
          }
          CarServer.request("get", "/inventories/"+list.id+"/"+uri,
            function(response){
              console.log( response );
              dataObj.splice( dataObj.indexOf(list) , 1 );
          });
        }
      }



       // get total
      $scope.getTotal = function getTotal(){
        var total = 0;
        var total = 0;
        for(var i = 0; i < $scope.inventoryList.length; i++){
            var product = $scope.inventoryList[i];
            total += (product.price * product.quantity);
        }
        return total;
      }

      /* Display all inventory table Lists */
      $scope.displayOnStockList();
      $scope.displayDirectPurchaseList();
    }
  ])
  .controller('inventoryAddCtrl', [
    "$scope",
    "$http",
    "CarServer",
    "$timeout",
    "$rootScope",
    function controller($scope, $http, CarServer , $timeout, $rootScope)
    {
      console.log("inventoryAddCtrl");
      $scope.categoryList = {};
      $scope.manufacturerList = {};
      $scope.list = {};
      $scope.category = {};
      $scope.inventoryData = {};
      $scope.inventoryList = {};
      $scope.categoryShow = 'on-stock';
      $scope.total = {};
      $scope.dataEdit = {};
      $scope.dataStored = {};
      $scope.showLoadState = false;
      $scope.successLoadState = false;
      $scope.alertmsg = false;
      $scope.errormsg = false;
      $scope.msg = "";
      $scope.orderHolder = [];
      $scope.addOnStock = [];

      $scope.lists = [ 
          { 'value' : 'on-stock' , 'category' : 'On Stock'  }, 
          { 'value' : 'direct-purchase' , 'category' : 'Direct Purchase'  }, 
          { 'value' : 'product-order' , 'category' : 'Product Order'  }
      ];
      $scope.category.list = $scope.lists[0];
      var totalAmount = 0;

      /*----- Disable button -----*/
      disabledButton();

      // Get list of services
      $scope.categories = function categories(){
        CarServer.request("get", "/categories",
        function(response){
          $scope.categoryList = response;
          console.log($scope.categoryList);

        });
      }

      /*----- Get list of Manufacturers -----*/
      $scope.manufacturers = function manufacturers(){
        CarServer.request("get", "/inventories/getManufacturerList",
        function(response){
          console.log( response );
          $scope.manufacturerList = response;
        });
      }

      // Add On Stock to Basket 
       $scope.addToBasketStock = function addToBasketStock(){
        

        console.log( 'Added to On Stock basket' );
        console.log($scope.inventoryData);
        var today = new Date();
        var randomID = new Date().getTime() + '-' + Math.random().toString(36).slice(2);
        var totalQuantityPrice = parseFloat( $scope.inventoryData.price ) * parseFloat( $scope.inventoryData.quantity );
        var htmlList = '<li>'
                     + '<button priceQtyValue="'+totalQuantityPrice+'" id="' + randomID + '" class="btn btn-default btn-remove-stock-order" data-toggle="tooltip" data-placement="left" title="Click to Remove"><i class="fa fa-minus"></i></button>' 
                     + '<label><a href="#" id="'+ randomID +'" data-toggle="modal" class="edit-selection" data-target="#modal-edit-selection" >'+ $scope.inventoryData.product_name +'</a></label>'
                     + '<span class="price pull-right">Php <span class="price-value">' + totalQuantityPrice + '</span></span>'
                     + '</li>';
        $( '#basket-ordered-lists' ).append( htmlList );

        $scope.addOnStock.push({ 
          'cartID'            : randomID,
          'category_id'       : 1 ,  
          'transaction_date'  : today.toISOString().substring(0, 10) ,
          'product_name'      : $scope.inventoryData.product_name ,
          'product_details'   : $scope.inventoryData.product_details ,
          'product_type'      : $scope.inventoryData.product_type,
          'price'             : $scope.inventoryData.price ,
          'quantity'          : $scope.inventoryData.quantity
        });

        disabledButton();
         console.log($scope.addOnStock.length);
        $scope.inventoryData.price = "";
        $scope.inventoryData.product_name = "";
        $scope.inventoryData.product_details = "";
        $scope.inventoryData.product_type = "";
        $scope.inventoryData.quantity = "";

        getTotal( totalQuantityPrice , '+' );
       
       }


      // Add Direct Purchase to Basket 
      $scope.addToBasketDirPurch = function addToBasketDirPurch(){
        disabledButton();
        console.log( 'Added to On Stock basket' );
        console.log($scope.inventoryData);
        var today = new Date();
        var randomID = new Date().getTime() + '-' + Math.random().toString(36).slice(2);
        var totalQuantityPrice = parseFloat( $scope.inventoryData.price ) * parseFloat( $scope.inventoryData.quantity );
        var htmlList = '<li>'
                     + '<button priceQtyValue="'+totalQuantityPrice+'" id="' + randomID + '" class="btn btn-default btn-remove-stock-order" data-toggle="tooltip" data-placement="left" title="Click to Remove"><i class="fa fa-minus"></i></button>' 
                     + '<label><a href="#" id="'+ randomID +'" data-toggle="modal" class="edit-selection" data-target="#modal-edit-selection" >'+ $scope.inventoryData.product_name +'</a></label>'
                     + '<span class="price pull-right">Php <span class="price-value">' + totalQuantityPrice + '</span></span>'
                     + '</li>';
        $( '#basket-ordered-lists' ).append( htmlList );  
        
        $scope.addOnStock.push({ 
          'cartID'           : randomID,
          'category_id'      : 2,  
          'transaction_date' : today.toISOString().substring(0, 10),
          'or_no'            : $scope.inventoryData.or_no,
          'in_charge'        : $scope.inventoryData.in_charge,
          'cash_on_hand'     : $scope.inventoryData.cash_on_hand,
          'store_name'       : $scope.inventoryData.store_name,
          'product_name'     : $scope.inventoryData.product_name, 
          'quantity'         : $scope.inventoryData.quantity, 
          'price'            : $scope.inventoryData.price,
          'details'          : $scope.inventoryData.details
        } );

        $scope.inventoryData.product_name = "";
        $scope.inventoryData.product_details = "";
        $scope.inventoryData.price = "";
        $scope.inventoryData.quantity = "";  
        
        getTotal( totalQuantityPrice , '+' );
      }

      // Add Product Order to Basket 
      $scope.addToBasketProdOrder = function addToBasketProdOrder(){
        disabledButton();
        console.log( 'Added to Prodct Order basket' );
        console.log($scope.inventoryData);

        var today = new Date();
        var randomID = new Date().getTime() + '-' + Math.random().toString(36).slice(2);
        var totalQuantityPrice = parseFloat( $scope.inventoryData.price ) * parseFloat( $scope.inventoryData.quantity );
        var htmlList = '<li>'
                     + '<button priceQtyValue="'+totalQuantityPrice+'" id="' + randomID + '" class="btn btn-default btn-remove-stock-order" data-toggle="tooltip" data-placement="left" title="Click to Remove"><i class="fa fa-minus"></i></button>' 
                     + '<label><a href="#" id="'+ randomID +'" data-toggle="modal" class="edit-selection" data-target="#modal-edit-selection" >'+ $scope.inventoryData.product_name +'</a></label>'
                     + '<span class="price pull-right">Php <span class="price-value">' + totalQuantityPrice + '</span></span>'
                     + '</li>';
        $( '#basket-ordered-lists' ).append( htmlList );  

        $scope.addOnStock.push({ 
          'cartID'            : randomID,
          'category_id'       : 3,
          'transaction_date'  : today.toISOString().substring(0, 10) ,
          'manufacturer_id'   : $scope.inventoryData.manufacturer_id ,
          'product_name'      : $scope.inventoryData.product_name ,
          'quantity'          : $scope.inventoryData.quantity,
          'price'             : $scope.inventoryData.price ,
          'product_type'      : $scope.inventoryData.product_type ,
          'product_details'   : $scope.inventoryData.product_details
        });

        $scope.inventoryData.product_name = "";
        $scope.inventoryData.quantity = "";
        $scope.inventoryData.price = "";
        $scope.inventoryData.product_type = "";
        $scope.inventoryData.product_details = "";
        
        getTotal( totalQuantityPrice , '+' );
      }

       // To Remove the Added Product
       $( 'body' ).delegate( '.btn-remove-stock-order' , 'click' , function(){
          var ID = $( this ).attr( 'id' );
          var pqv = $( this ).attr( 'priceQtyValue' );
          var priceValue = parseFloat( pqv );
          getTotal( priceValue , '-' );

          $.each( $scope.addOnStock , function(i){
              if($scope.addOnStock[i].cartID === ID) {
                  $scope.addOnStock.splice(i,1);
                  return false;
              }
          });
          console.log($scope.addOnStock);
          $( '#' + ID ).parent().remove();
          disabledButton();
       } );

       // Pass data to modal edit form
       $( 'body' ).delegate( '.edit-selection' , 'click' , function(){
        var ID = $( this ).attr( 'id' );
         $.each( $scope.addOnStock , function(i){
            console.log( $scope.addOnStock[i] );
            if ( $scope.addOnStock[i].cartID == ID ) {
              $timeout(function(){
                $scope.dataEdit.cartID = ID;
                $scope.dataEdit.price = $scope.addOnStock[i].price;
                $scope.dataEdit.product_name = $scope.addOnStock[i].product_name;
                $scope.dataEdit.product_details = $scope.addOnStock[i].product_details;
                $scope.dataEdit.product_type = $scope.addOnStock[i].product_type;
                $scope.dataEdit.quantity = $scope.addOnStock[i].quantity;
              },10);
            };

          });
       } );

       // Make all Changes for ordered items 
       $scope.updateOrderedProduct = function updateOrderedProduct() {
          console.log( $scope.dataEdit );
          $.each( $scope.addOnStock , function(i){
              $scope.addOnStock[i] = $scope.dataEdit;
          });
       } 

      function getTotal( orderValue , operation ) {
        var total = 0;
        if ( operation == '+' ) {
          total = totalAmount + orderValue;
        } else if( operation == '-' ) {
          total = totalAmount - orderValue;
        }
        totalAmount = total;
        $( '#totalBasketPrice' ).text( total.toLocaleString() );
      }

      function disabledButton() {
        if( $scope.addOnStock.length < 1 ) {
          $( '#submitProductBasket' ).attr( 'disabled' , true );
        }else {
          $( '#submitProductBasket' ).removeAttr( 'disabled' );
        }
      }

      // add inventory data
      $scope.showCategoryForm = function showCategoryForm( categoryType ) {
        
        if (categoryType.value == 'on-stock') {
          $( '.form-wrapper' ).css( 'display','none' );
          $( '.form-' + categoryType.value ).show();

        } else if(categoryType.value == 'direct-purchase') {
          $( '.form-wrapper' ).css( 'display','none' );
          $( '.form-' + categoryType.value ).show();

        } else if(categoryType.value == 'product-order') {
          $( '.form-wrapper' ).css( 'display','none' );
          $( '.form-' + categoryType.value ).show();

        } else {
          $( '.form-wrapper' ).css( 'display','none' );
          $( '.form-on-stock' ).show();
        };
        totalAmount = 0;
        resetData();
      }
      $scope.showCategoryForm(false);

      function resetData() {
        $( '#basket-ordered-lists li' ).remove();
        $scope.inventoryData = {};
        $scope.addOnStock = [];
        $( '#totalBasketPrice' ).text( '0.00' );
      }

      // Create Inventory  -- call
      $scope.createInventory = function createInventory(){

        CarServer.request("post", '/inventories/createInventory',
          function(response){
            console.log(console);
          }, $scope.addOnStock);
      }

      // Insert All Selected Products
      $scope.storeSelectedData = function storeSelectedData() {
        $scope.createInventory();

        for( x in $scope.addOnStock ) {
          $scope.showLoadState = true;
          $scope.hideLoadState = true;

          if ( $scope.addOnStock.length > 0 ) {
            switch( $scope.addOnStock[x].category_id ) {
              case 1: // Insert On Stock Products
              console.log($scope.addOnStock[x]);
                CarServer.request( "post" , "/inventories/submitStock" , 
                  function( response ) {
                    console.log( 'success on-stock' )
                    $scope.showLoadState = false;
                    $scope.hideLoadState = true;
                    $scope.successLoadState = true;  
                    $timeout( function(){
                      $scope.successLoadState = false;
                      $scope.hideLoadState = false;
                      resetData();
                    }, 3000 );
                    $rootScope.$broadcast( 'loadTableData', 'onStock' );
                } , $scope.addOnStock[x] );
                break;

              case 2: // Insert Direct Purchase Products
                CarServer.request( "post" , "/inventories/submitDirectPurchase" , 
                  function( response ) {
                    console.log( 'success direct-purchase' );
                    console.log( $scope.addOnStock[x] );
                    $scope.showLoadState = false;
                    $scope.hideLoadState = true;
                    $scope.successLoadState = true;  
                    $timeout( function(){
                      $scope.successLoadState = false;
                      $scope.hideLoadState = false;
                    }, 3000 );
                    resetData();
                    $rootScope.$broadcast( 'loadTableData', 'directPurchase' );
                } , $scope.addOnStock[x] );
                break;

              case 3: // Insert Product Orders
              console.log($scope.addOnStock[x]);
                CarServer.request( "post" , "/inventories/submitProductOrder" , 
                  function( response ) {
                    console.log( 'success product-order' );
                    $scope.showLoadState = false;
                    $scope.hideLoadState = true;
                    $scope.successLoadState = true;  
                    $timeout( function(){
                      $scope.successLoadState = false;
                      $scope.hideLoadState = false;
                      resetData();
                    }, 3000 );
                    $rootScope.$broadcast( 'loadTableData', 'productOrder' );
                } , $scope.addOnStock[x] );
                break;

              default:
                console.log( 'Error daw' );
                break;
            }
          }
        }


        // if ( $scope.addOnStock.length < 1 ) {
        //     $scope.errormsg = true;
        //     $scope.msg = "Empty/Invalid entry.";
        //     $timeout( function() {
        //       $scope.errormsg = false;
        //     },3000 );
        // };
        disabledButton();
        console.log($scope.addOnStock.length);
      }

      // get inventories
      $scope.getInventories = function getInventories(){
        var forTotal =  {}
        CarServer.request("get", '/inventories/getInventories',
          function(response){
            $scope.inventoryList = response;
          });
      }


      // get total
      $scope.getTotal = function getTotal(){
        var total = 0;
        for(var i = 0; i < $scope.inventoryList.length; i++){
            var product = $scope.inventoryList[i];
            total += (product.price * product.quantity);
        }
        return total;
      }
      // get stocks
      $scope.getInventoryStocks = function getInventoryStocks(){
        CarServer.request("get",'/inventories/getInventoryStocks',
          function(response){
            console.log(response)
          });
      }


      // load functions
      $scope.getInventoryStocks();
      // $scope.getInventories();
      $scope.categories();
      $scope.manufacturers();
    }
  ])
  .controller('expenseAddCtrl', [
    "$scope",
    "$http",
    "CarServer",
    function controller($scope, $http, CarServer)
    {
      console.log("expenseAddCtrl");
    }
  ])
  .controller('expenseViewCtrl', [
    "$scope",
    "$http",
    "CarServer",
    function controller($scope, $http, CarServer)
    {
      console.log("expenseViewCtrl");
    }
  ])
  .controller('esitmationAddCtrl', [
    "$scope",
    "$http",
    "CarServer",
    function controller($scope, $http, CarServer)
    {
      console.log("esitmationAddCtrl");
    }
  ])
  .controller('estimationViewCtrl', [
    "$scope",
    "$http",
    "CarServer",
    function controller($scope, $http, CarServer)
    {
      console.log("estimationViewCtrl");
    }
  ])
  .controller('summaryViewCtrl', [
    "$scope",
    "$http",
    "CarServer",
    function controller($scope, $http, CarServer)
    {
      console.log("summaryViewCtrl");
    }
  ]);
