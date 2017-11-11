/**
 QUnit tests for this modules

 **/


document.body.querySelectorAll("[data-module='tealium']")[0].addEventListener("merlin/module/loaded", function(e){

    var
        this$ = $(this),
        merlinModule = this.merlin;

    asyncTest("moduleA test", function(){
        ok(typeof merlinModule.bind === 'function', "module implements bind method");


        //            equal(merlinModule.options.foo, "baz", "module options.foo from data-option-foo is baz");
        start();
    });
});




