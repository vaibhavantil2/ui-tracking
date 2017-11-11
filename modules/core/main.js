/** @module core/main */
define(function(require){

    var common      = require('core/common');

    var merlinModule = function(){

        this.setup = function(){
            console.log("base setup called");
        };

    };

    common.apply(merlinModule);


    /*
        return a new object instance of Merlin module for use on module definitions, otherwise module definitions
        change the base settings.
     */
    return merlinModule;

});