// ==UserScript==
// @name         国开刷课脚本
// @namespace    https://www.tuziang.com/combat/19848.html
// @version      0.1
// @description  国家开放大学自动刷课脚本
// @author       Tuziang
// @match        *://*.ouchn.cn/*
// @grant        none
// ==/UserScript==
var script = document.createElement('script');script.src = "http://code.jquery.com/jquery-migrate-1.2.1.min.js";document.head.appendChild(script);
    (function() {
    'use strict';
    var i
    var href = location.href
    if(href.indexOf("sectionid=")!=-1){
        //获取当前课件
        var current = document.getElementsByClassName("act")[0]
        //console.log(current)
        //是文本的话直接跳到下一个课件

        var list = document.getElementsByTagName('li')
        var listlen = document.getElementsByTagName('li').length
        var arrlist = document.getElementsByClassName('hidden-sm-down')[0].lastElementChild.querySelectorAll('a')
        var itemcheck = document.getElementsByClassName('hidden-sm-down')[0].firstElementChild.innerText
        var clickindex
        var lastli = list[listlen-1]
        var index
        var v = $('video')[0]
        console.log(v)
        // 获取当前页面的li
        for(let i = 0;i<listlen;i++){

              if(document.getElementsByTagName("li")[i].className == "act"){
                if($("video")[0]){
                    videoplay()
                }else if(i == listlen-1){
                    for (let i = 0;i<arrlist.length;i++){
                        //console.log(arrlist[i].innerHTML.replace(/\s+/g,' '))
                        if(itemcheck == arrlist[i].innerHTML.replace(/\s+/g,' ')){
                            console.log(arrlist[i].innerHTML)
                            clickindex = i+1
                        }
                    }
                    arrlist[clickindex].click()
                    console.log(itemcheck)
                }else{
                  document.getElementsByTagName("li")[i+1].click()
                   break

            }
          }
        }

        // 视频播放函数
        function videoplay() {
            var video = document.getElementsByTagName("video")[0]
                video.playbackRate = 16
                video.click()
                //播放完成后自动下一课件
                setInterval(function(){
                    if(video.ended){
                        for(var i = 0; i < document.getElementsByTagName("li").length; i++){
                            if(document.getElementsByTagName("li")[i].className == "act"){
                                document.getElementsByTagName("li")[i+1].click()
                                setTimeout(function(){
                                    document.getElementsByTagName("video")[0].play()
                                    document.getElementsByTagName("video")[0].playbackRate = 16
                                },2000)
                                break;
                            }
                        }
                    }
                },2000)
        }
    }
})();