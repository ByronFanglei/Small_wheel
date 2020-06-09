// ==UserScript==
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://*/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    var current = document.getElementsByClassName("active")[0]
    var iconlen = document.getElementsByClassName('icon-weibiaoti2').length
    var iconitem = document.getElementsByClassName('icon-weibiaoti2')

    setTimeout(function(){
        var src = document.getElementsByTagName('video')[0];
        src.playbackRate = 1
        src.volume = 0
        if(document.getElementById('quiz_wnd')){
          //document.getElementById('quiz_wnd').remove()
        }
    },5000)
     setTimeout(() => {
      videoplay()
     },6000)

      function videoplay() {
            var video = document.getElementsByTagName("video")[0]
                setInterval(function(){
                    if(video.ended){
                        for(var i = 0; i < iconlen; i++){
                            if(hasClassName(iconitem[i],'active')){
                                iconitem[i+1].click()
                                setTimeout(function(){
                                    document.getElementsByTagName("video")[0].play()
                                },5000)
                                break;
                            }
                        }
                    }
                },2000)
        }

    function hasClassName(obj,name){
      let tmpName = obj.className;
      let tmpReg = new RegExp(name,'g');
      if(tmpReg.test(tmpName)){
          return true;
      }else{
          return false;
      }
    }

})();



