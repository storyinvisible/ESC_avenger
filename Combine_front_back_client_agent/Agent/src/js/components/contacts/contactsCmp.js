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
        console.log(JSON.stringify(e.data))
        const messageData = JSON.parse(e.data);
        console.log("sseSource listener: " + e.data);
        
        console.log("Share data customer email: " + $rootScope.customerEmail);
        console.log("SSE listener: new customer email: " + messageData.email);

        //newCustomers.push(messageData);
        console.log("sseSource listener: " + messageData.FirstName);
        newCustomer = messageData.FirstName;
        let userid = messageData.user_id;
        if (e.data != {} && ($rootScope.agentId ==  messageData.agent_id)){
          console.log("Agent ID matched!")
          $rootScope.customerEmail = messageData.email;
          console.log("$rootScope.customerEmail changed! Changed to: " + $rootScope.customerEmail);
          console.log("sseSource listener: customer email is: " + messageData.email)
          var this_customer=  rainbowSDK.contacts.getContactById(userid)
          console.log("This customer "+this_customer)
          rainbowSDK.conversations.openConversationForContact(this_customer).then(function(conversation){
            rainbowSDK.im.sendMessageToConversation(conversation, "Hello, I'm your agent!");
            
            rainbowSDK.im.sendMessageToConversation(conversation, "My name is Jessie");
            console.log("Message sent!!!!")
          })
        
          
          console.log("Jessie: searching for  : " + userid);
          rainbowSDK.contacts.searchById(userid).then(function(usersFound) {
            console.log("Jessie, contact found");
            rainbowSDK.conversations.openConversationForContact(usersFound).then(function(conversation){
              rainbowSDK.im.sendMessageToConversation(conversation, "Hello, I'm your agent!");
              
              console.log("Message sent!!!!")
            })
                    
                    //newCustomers.pop(newCustomers[i]);
              
            
        
          }).catch((err) =>{
            throw err;
          });
        }
      });

      $scope.sendMessage = function() {
        var data1={
          speciality:$rootScope.agentSpeciality,
          agent_id:$rootScope.agentId
    
      }
      
      var user_detail={}
      var post_message={
          type: 'POST',
          data: JSON.stringify(data1),
          contentType: 'application/json',
          url:'http://localhost:8080/dequeue',
          async: false,
          dataType: 'json',
          };
      var user_detail={}
      post_message.success = function(data){
        console.log("Sucess");
        console.log(JSON.stringify(data));
        user_detail=data;
      }
      
      $.ajax(post_message)
      
          
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

