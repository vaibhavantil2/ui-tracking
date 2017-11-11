/** @module core/common */
define(function(require){

    var utility = require('utility');
    var $ = require('jquery');

    var Common = function(){

        this.elem = null;
        this.defaults = {};
        this.ector = "merlin/module";
        this.type = "module";

        this.bind = function(context,options){

            this.elem = context;
            this.options = options;
            this.init();

            if(this.type === "module"){
                context.merlin = this;
                var evt = document.createEvent("Event");
                // does this propogate, and is it cancelable?
                evt.initEvent("merlin/module/loaded",true,false);
                context.dispatchEvent(evt);

            }


        };

        this.init = function() {
            var metadata = {},
                self    = this;

            if (this.elem){
                $.each($(this.elem).data(),function(i,v){
                    //boolean check, make sure booleans are imported into modules as booleans
                    // to do: find out why this is not converting boolean values to boolean when passed to module
                    // v = utility.boolCheck(v);

                    // remvoving data-option attribute
                    if (i==='module'){
                        return;
                    } else {
                        // BUG - data-attrribute comes back as optionOptionvalue, when passed in as option-optionValue:
                        // need to keep original camel casing, or stick to single words lowercase.
                        i = i.replace('option', '');
                        //convert result to camelCase
                        i = i.substring(0, 1).toLowerCase() + i.substring(1);

                        // look for nested data options ie: data-option-optionObject.optionObject.optionProp= "foo"
                        if( i.indexOf(".") !== -1) {
                            self.parseParamToObj(metadata, i + "=" + v);
                        } else {
                           metadata[i] = v;
                        }

                    }

                });


            }

            // added ability to pass in options - unsure what should trump what.
            this.options = $.extend( {}, this.defaults, this.options, metadata );
            //every module must have a setup() method
            if(this.setup){
                this.setup();
            }else {
                //TODO: Throw some error condition as this module is not valid
                console.log('watch out - im gonna throw an error at some point');

            }
            return this;
        };

        /**
         * @function parseParamToObj()
         * @param obj
         * @param str
         * @returns {object}
         */
        this.parseParamToObj = function(obj, str) {
            var path = str.split("=")[0],
                path_arr = path.split("."),
                val = str.split("=")[1],
                ref = obj,
                self = this;

            for(var i = 0; i < path_arr.length; i++)
            {
                if(i === path_arr.length - 1)
                {
                    //if its the last dot . assign the val to it
                    ref = self.addPropertyTo(ref, path_arr[i], utility.boolCheck(val)); //check if val is true/false, if so convert to boolean
                }else
                {
                    //if the ref doesn't already have an object with this name ie whateverobj.whateverProp, create whateverProp and set it equal to an empty object
                    var new_ref;
                    if(ref[ path_arr[i] ] === undefined || ref[ path_arr[i] ] === null)
                    {
                        //ref is always undefined or null here,
                        //so it will always create a new object whose name is path_arr[i] and set it equal to {} an empty object
                        new_ref = self.addPropertyTo(ref, path_arr[i], {});
                    }
                    else
                    {
                        //if it already has this property or object, just set it equal to itself
                        new_ref = ref[ path_arr[i] ];
                    }
                    ref = new_ref;
                }

            }
            return obj;
        };


        /**
         * @function addPropertyTo()
         * @param obj
         * @param propName
         * @param propVal
         * @returns {object}
         */
        this.addPropertyTo = function(obj, propName, propVal){
            if(obj === null || obj === undefined)
            {
                obj = {};
            }

            obj[ propName ] = propVal;
            return obj[ propName ];
        };

        /**
         *
         * @param option
         * @param value
         * @returns {update}
         */
        this.update = function(option,value) {
            this.options[option] = value;

            return this;
        };


        /**
         * @function updateAll()
         * @description Updates options with new values. Will overwrite the same option if a new value is passed in
         * @param optionsObj
         */
        this.updateAll = function (optionsObj) {
            utility.extend(this.options,optionsObj);
        };

        /**
         * @function setDefaults
         * @description Sets defaults for options. If the option has already been set it will not overwrite the option
         * @param defaults
         */
        this.setDefaults = function (defaults){
            //create a
            var combine = utility.extend({}, defaults,this.options);
            utility.extend(this.options, combine);
        };

        /**
         *
         * @param hookName
         */
        this.hook = function (hookName){
            if (this.options[hookName] !== undefined) {
                // Call the user defined function.
                // Scope is set to the jQuery element we are operating on.
                this.options[hookName].call(this,this.$elem);
            }
        };

        this.getOption = function (whatToGet){
            return this.options[whatToGet];
        };

        this.destroy = function(){
        };

        this.setName = function(val){
          this.ector = val;
        };

        this.getName = function(){
            return this.ector;
        };
    };

    return Common;
});