var sample = angular.module("sample", ["sdk"]);

sample.controller("sampleController", [
  "$rootScope",
  "rainbowSDK",
  function($rootScope, sdk) {
    "use strict";

    /*********************************************************/
    /**                INITIALIZATION STUFF                 **/
    /*********************************************************/

    console.log("[DEMO] :: Rainbow IM Application");

    var appId = "e78b583059f511eabf7e77d14e87b936";
    var appSecret = "U3LdMSRdTzkjDbCkKajXWSQj3URPO5EfQStjACIVQLHsc45WQOc6v0dpWxusgSnv";

    var onReady = function onReady() {
      console.log("[DEMO] :: Rainbow SDK is ready!");
    };

    var onLoaded = function onLoaded() {
      console.log("[DEMO] :: Rainbow SDK has been loaded!");

      sdk
        .initialize(appId, appSecret)
        .then(function() {
          console.log("[DEMO] :: Rainbow SDK is initialized!");
        })
        .catch(function() {
          console.log("[DEMO] :: Something went wrong with the SDK...");
        });
    };

    document.addEventListener(sdk.RAINBOW_ONREADY, onReady);

    document.addEventListener(sdk.RAINBOW_ONLOADED, onLoaded);

    sdk.load();

    return true;
  }
]);
