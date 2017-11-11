/* @namespace tealium */
define(function(require){

    "use strict";


    /* list of require dependencies */
    var merlinBase  = require('core/main'),
        $           = require('jquery'),
        win         = window,
        digitalData = win.digitalData,
        events      = require('events'),
        tealium     = require('components/tealium/main');



    /**
     * This is the base template for a module
     * @module tealium
     * @version 1.0
     * @requires component/one
     * @requires jquery
     * @returns Modified module
     */
    return (function(module){

        /** Module Defaults **/
        module.defaults = {
            track:"a,button,input[type=submit],.track,.trackable",
            untrack:'no-track',
            site:"",
            pageName:""
        };


        module.setName("tealium");

        /** Module Variables **/

        /** Module Public Methods **/
        /* @constructor */
        module.setup = function(){

            window.Merlin.linkTrack();

            if(!digitalData){
                digitalData = {};
            }

            if(!digitalData.site){
                console.log("DigitalData Site is undefined");
                digitalData.site = {};
                digitalData.site.name = "siteName";
            } else {
                this.options.site = digitalData.site.name;
            }

            if(!digitalData.page){
                digitalData.page = {};
                digitalData.page.pageInfo = {};
                digitalData.page.pageInfo.pageName = "pageName";
                this.options.pageName = digitalData.page.pageInfo.pageName;
            } else {
                if(digitalData.page.pageInfo.pageName){
                  var pn = digitalData.page.pageInfo.pageName.split('/');
                  if(pn.length === 0 || pn.length === 1){
                      this.options.pageName = digitalData.page.pageInfo.pageName;
                  } else {
                      for (var i=0;i<pn.length;i++){
                          if(i===0){
                              continue;
                          }
                          this.options.pageName += pn[i];
                          if(i!==(pn.length-1)){
                              this.options.pageName += ":";
                          }
                      }
                  }
                }


            }


            linkTracking.call(this);
        };

        /** Module Private / Instance / Static Methods **/

        /*  @this Module Instance
        *   @private
        * */
        function linkTracking(){
            var self = this;
            // var body = $('body');

            var $doc = document;
            var body = document.getElementsByTagName("body");

            console.log("Link Tracking Listening!");

        function addEvent(element, evnt, funct){
            if (element.attachEvent){
                return element.attachEvent('on'+evnt, funct);
            } else{
                return element.addEventListener(evnt, funct, false);
            }

        function removeEvent(elem,eventType,handler) {
                if (elem.removeEventListener){
                    elem.removeEventListener (eventType,handler,false);
                }
                if (elem.detachEvent){
                    elem.detachEvent ('on'+eventType,handler); 
                }
            }

            // addEvent(
            //     document.getElementById('myElement'),
            //     'click',
            //     function () { alert('hi!'); }
            // );

            removeEvent($doc, 'click')
            $(document).off("click").on("click",self.options.track,function(e){
                e.stopPropagation();
                var doNotTrack = ($(this).hasClass(self.options.untrack));

                if(doNotTrack){
                    return;
                }

                var linkName = $(this).attr('data-track-value') || $(this).html();
                if(linkName){
                    linkName.replace(/\s/g, '').toLowerCase();
                    var data = (self.options.site.toLowerCase()+":"+self.options.pageName.toLowerCase()+":"+linkName);
                    tealium.link(data);
                }
            });

            events.sub(events.link.tracking,function(v){
                console.log("TEALIUM : LINK TRACKING EVENT RECEIVED",v);
                if(v){
                    var data = (self.options.site.toLowerCase()+":"+self.options.pageName.toLowerCase()+":"+v);
                    tealium.link(data);
                }
            });

        }

        return module;

    }(Object.create(merlinBase)));


});
