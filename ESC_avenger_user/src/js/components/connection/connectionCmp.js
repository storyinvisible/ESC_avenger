angular.module("sample").component("rbxConnection", {
  bindings: {
    name: "@"
  },
  controller: function rbcConnectionCtrl(rainbowSDK, $rootScope, $scope) {
    $scope.isConnected = false;

    $scope.isLoading = false;

    $scope.state = rainbowSDK.connection.getState();

    $scope.hosts = [
      {
        id: 0,
        value: "sandbox",
        name: "Rainbow Sandbox"
      },
      {
        id: 1,
        value: "rainbow",
        name: "Rainbow Official"
      }
    ];

    $scope.selectedItem = $scope.hosts[0];

    var handlers = [];
    
    $scope.signin = function() {
        var data={}
      $scope.isLoading = true;
        console.log($scope.user.password);
      saveToStorage();
    var data1={
            request:'username_password',
            }
        console.log(data)
    var post_message={
        type: 'POST',
        data: JSON.stringify(data1),
        contentType: 'application/json',
        url:'http://localhost:3001/message',
        async: false,
        dataType: 'json',
    };
        var user_detail={}
        post_message.success = function(data){
		  console.log("Sucess");
          console.log(JSON.stringify(data));
          user_detail=data;
        }
        $.ajax(post_message);
      var userdetail= JSON.parse(JSON.stringify(user_detail));
      var user = user_detail.user;
      var password=user_detail.password;
        
      console.log("user :"+user);
      console.log('password :' + password);
      console.log(typeof userdetail);
      switch ($scope.selectedItem.value) {
        case "rainbow":
          rainbowSDK.connection
            .signinOnRainbowOfficial(user, password)
            .then(function(account) {
              console.log("[DEMO] :: Successfully signed!");
              $scope.isLoading = false;
              $scope.isConnected = true;
            })
            .catch(function(err) {
              console.log("[DEMO] :: Error when sign-in", err);
              $scope.isLoading = false;
              $scope.isConnected = false;
            });
          break;
        default:
          rainbowSDK.connection
            .signin(user,password)
            .then(function(account) {
              console.log("[DEMO] :: Successfully signed!");
              $scope.isLoading = false;
              $scope.isConnected = true;
            })
            .catch(function(err) {
              console.log("[DEMO] :: Error when sign-in", err);
              $scope.isLoading = false;
              $scope.isConnected = false;
            });
          break;
      }
    };

    $scope.signout = function() {
      $scope.isLoading = true;
      rainbowSDK.connection.signout().then(function() {
        $scope.isLoading = false;
        $scope.isConnected = false;
      });
    };

    var saveToStorage = function() {
      sessionStorage.connection = angular.toJson($scope.user);
      sessionStorage.host = angular.toJson($scope.selectedItem);
    };

    var readFromStorage = function() {
      if (sessionStorage.connection) {
        $scope.user = angular.fromJson(sessionStorage.connection);
      } else {
        $scope.user = { name: "", password: "" };
      }

      if (sessionStorage.host) {
        $scope.selectedItem =
          $scope.hosts[angular.fromJson(sessionStorage.host).id];
      } else {
        $scope.selectedItem = $scope.hosts[0];
      }
    };

    var onConnectionStateChangeEvent = function onConnectionStateChangeEvent(
      event
    ) {
      $scope.state = rainbowSDK.connection.getState();
    };

    this.$onInit = function() {
      // Subscribe to XMPP connection change
      handlers.push(
        document.addEventListener(
          rainbowSDK.connection.RAINBOW_ONCONNECTIONSTATECHANGED,
          onConnectionStateChangeEvent
        )
      );
    };

    this.$onDestroy = function() {
      var handler = handlers.pop();
      while (handler) {
        handler();
        handler = handlers.pop();
      }
    };

    var initialize = function() {
      readFromStorage();
    };

    initialize();
  },
  templateUrl: "./src/js/components/connection/connectionCmp.template.html"
});
