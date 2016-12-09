/**
 * Created by ega on 13.05.2016.
 */
(function () {
  'use strict';
  // set namespace containing cubx.demo.audio-player functions
  window.cubx_demo_audio_player = {
      // Hook function to propagate the value of the button when it is clicked
      playButtonClicked: function (clicked, next) {
          next ('play');
      },
      // Hook function to propagate the value of the button when it is clicked
      pauseButtonClicked: function (clicked, next) {
          next ('pause');
      },
      // Hook function to propagate the value of the button when it is clicked
      stopButtonClicked: function (clicked, next) {
          next ('stop');
      }
  };
})();
