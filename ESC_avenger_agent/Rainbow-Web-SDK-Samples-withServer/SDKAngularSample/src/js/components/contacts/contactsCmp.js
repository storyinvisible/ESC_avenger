angular.module("sample").component("rbxContacts", {
  bindings: {
    name: "@"
  },
  controller: function rbcConnectionCtrl(rainbowSDK, $rootScope, $scope) {
    $scope.isConnected = false;

    $scope.nbContacts = 0;

    $scope.contacts = [];

    var listeners = [];

    var sseSource = new EventSource('/new_customer');

    var newCustomer;

    this.$onInit = function() {
      var ctrl = $scope;
      $scope.isConnectedUser = false;

      // Subscribe to XMPP connection change
      listeners.push(
        document.addEventListener(
          rainbowSDK.connection.RAINBOW_ONSTARTED,
          onStarted
        )
      );

      // Subscribe to XMPP connection change
      listeners.push(
        document.addEventListener(
          rainbowSDK.connection.RAINBOW_ONCONNECTIONSTATECHANGED,
          onConnectionStateChangeEvent
        )
      );

      // Subscribe to XMPP connection change
      listeners.push(
        document.addEventListener(
          rainbowSDK.presence.RAINBOW_ONCONTACTPRESENCECHANGED,
          onContactPresenceChangeEvent
        )
      );

      // Subscribe to Contact information change connection changes
      listeners.push(
        document.addEventListener(
          rainbowSDK.contacts.RAINBOW_ONCONTACTINFORMATIONCHANGED,
          onContactInformationChangeEvent
        )
      );

      // Subscribe to XMPP connection change
      listeners.push(
        document.addEventListener(
          rainbowSDK.contacts.RAINBOW_ONCONTACTINFORMATIONCHANGED,
          onContactsInformationChanged
        )
      );
      
      // Server-sent event handler
      sseSource.addEventListener('message', function(e){
        const messageData = JSON.parse(e.data);
        console.log("sseSource listener: " + e.data);
        //newCustomers.push(messageData);
        console.log("sseSource listener: " + messageData.customer);
        newCustomer = messageData.customer;
      });

      $scope.sendMessage = function() {
        // for (i=0; i<newCustomers.length; i++){
        //   const name = newCustomers[i].customer.first_name;
        //   console.log("Jessie, send message: " + name);
          console.log("Jessie: send message to : " + newCustomer);
          rainbowSDK.contacts.searchByName(newCustomer, 1).then(function(usersFound) {
            
            if(usersFound.length > 0) {
                // At least one user has been found
                usersFound.forEach(function(user) {
                    // Do something with each contact returned
                    console.log("Jessie, contact found");
                    rainbowSDK.conversations.openConversationForContact(user).then(function(conversation){
                      rainbowSDK.im.sendMessageToConversation(conversation, "Hello, I'm your agent!");
                      
                      rainbowSDK.im.sendMessageToConversation(conversation, "My name is Jessie");
                      console.log("Message sent!!!!")
                    })
                    
                    //newCustomers.pop(newCustomers[i]);
                });
            }
            else {
                // No contact returned
                console.log("Jessie, no contact found")
            }
          }).catch((err) =>{
            throw err;
          });
        }
        
      // }
      
      // if(this.item.id === rainbowSDK.contacts.getConnectedUser().id) {
			// 	console.log("Remove button");
			// 	$scope.isConnectedUser = true;
			// }
    };

    this.$onDestroy = function() {
      var listener = listeners.pop();
      while (listener) {
        listener();
        listener = listeners.pop();
      }
    };

    var onContactInformationChangeEvent = function onContactInformationChangeEvent(
      event
    ) {
      console.log("DEMO :: Contact information changed to ", event.detail);
    };

    var onContactPresenceChangeEvent = function onContactPresenceChangeEvent(
      event
    ) {
      console.log("DEMO :: presence changed to ", event.detail);
    };

    var countNumberOfContacts = function countNumberOfContacts() {
      $scope.nbContacts = Object.keys($scope.contacts).length;
    };

    var onStarted = function onReady() {
      $scope.contacts = rainbowSDK.contacts.getAll();
    };

    var onConnectionStateChangeEvent = function onConnectionStateChangeEvent(
      event
    ) {
      var status = event.detail;
      if (status === rainbowSDK.connection.RAINBOW_CONNECTIONCONNECTED) {
        $scope.isConnected = true;
      } else {
        $scope.isConnected = false;
        $scope.nbContacts = 0;
        $scope.contacts = {};
      }
    };

    var onContactsInformationChanged = function onContactsInformationChanged(
      event
    ) {
      var contact = event.detail;
      if (!(contact.id in $scope.contacts)) {
        $scope.contacts[contact.id] = contact;
        countNumberOfContacts();
      } else {
        // Track changes
      }
    };
  },
  templateUrl: "./src/js/components/contacts/contactsCmp.template.html"
});

