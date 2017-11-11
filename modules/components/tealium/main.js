/* @namespace components/tealium */
define(function (require) {

    "use strict";


    /* list of require dependencies */
    var events = require('events'),
        dd = window.digitalData || {},
        submissionTimer = null;

    /**
     * This is the base template for a module
     * @module tealium
     * @version 1.0
     * @requires component/one
     * @requires jquery
     * @returns Modified module
     */
    var tealium = {

        udo: (function () {
            return dd;
        })(),

        set: function (data, section) {
            if (!section) {
                section = "";
            }
            dd[section] = data;
        },

        transaction: (function () {

            return {
                removeItem: function (sku) {
                    if (dd.cart) {
                        var items = dd.cart.item || [];
                        for (var i = 0; i < items.length; i++) {

                            if (items[i].productInfo.sku === sku) {
                                items.splice(i, 1);
                            }

                        }

                        // Update s.products in the page for omniture
                        if(window.s){
                            if(window.s.products){
                                var sProductArray = (window.s.products).split(',');

                                for (var a=0;a<sProductArray.length;a++){
                                    if(sProductArray[a].match(sku)){
                                        sProductArray.splice(a, 1);
                                    }
                                }
                            }

                        }
                        console.log("Removing Items from digitalData...", items, items.length);
                    }


                },
                addItems: function (data, handler) {

                    if (data) {
                        if (data.order) {

                            // reset items
                            dd.cart.item = [];

                            if (data.order.commerceItems.length > 0) {

                                // add items from commerceItems
                                var items = data.order.commerceItems;
                                var sProducts = "";
                                for (var i = 0; i < items.length; i++) {
                                    var item = {
                                        price: {
                                            retailPrice: tealium.dollarStringToInt(items[i].baseListPrice),
                                            finalPrice: tealium.dollarStringToInt(items[i].discountPrice || items[i].baseListPrice)
                                        },
                                        productInfo: {
                                            productName: items[i].cartTitle,
                                            productID: items[i].productId,
                                            sku: items[i].catalogRefId
                                        },
                                        quantity: items[i].quantity
                                    };
                                    dd.cart.item.push(item);

                                    // Update s.products in the page for omniture
                                    if(i!==0){
                                        sProducts += ",";
                                    }
                                    sProducts += ";"+item.productInfo.sku+";"+item.quantity+";"+item.price.retailPrice*parseInt(item.quantity,10)+";;";
                                }

                                if(window.s){
                                    window.s.products = sProducts;
                                }
                            }

                            if (handler) {
                                handler(dd);
                            }
                        }
                    }


                    console.log("Adding Items to digitalData...", data);
                }
            };

        })(),

        filter: function (type, filterForm, tilesDestination, selections, results) {
            var data = {};
            data.selections = selections;
            data.results = results;


            if (submissionTimer) {
                clearTimeout(submissionTimer);
                submissionTimer = null;
            }

            $('a,button').on('click', function () {
                data.selections = [];
                data.results = [];

                $('input[type=checkbox]', filterForm).each(function () {
                    if ($(this).is(':checked')) {
                        var value = $(this).val();
                        var id = $(this).attr('name');
                        data.selections.push({id: id, name: value});
                    }
                });

                $('> li', tilesDestination).each(function () {
                    if ($(this).is(':visible')) {
                        var id = $(this).attr('id');
                        data.results.push(id);
                    }
                });

                if (data.selections.length > 0 && data.results.length > 0 && submissionTimer) {
                    console.log("Filter Event : Submitting Filtering data : SubActivity", data);
                    tealium.event(type, 'filter', dd.page.pageInfo.pageName, data);
                }

                clearTimeout(submissionTimer);
                submissionTimer = null;

            });

            submissionTimer = setTimeout(function () {
                if (data.selections.length > 0 && data.results.length > 0) {
                    console.log("Filter Event : Submitting Filtering data", data);
                    tealium.event(type, 'filter', dd.page.pageInfo.pageName, data);
                }
                submissionTimer = null;
            }, 5000);

        },

        send: function (data) {
            if (!data) {
                data = dd;
            }
            console.log("UTAG EVENT Pre-Submission");
            if (window.utag) {
                var stat = window.utag.link(data);
                console.log("UTAG Event Submission Success", stat, data);
                delete dd.event;
            }

        },

        accordion: (function () {

            return {
                page: function (subCategory1) {
                    if (dd.page) {
                        dd.page.category.subCategory1 = subCategory1;
                    }
                    tealium.send(dd);
                },
                event: function () {
                    // coming soon!
                }

            };

        })(),

        event: function (name, action, cat, attr) {
            if (!attr || (typeof attr !== 'object')) {
                attr = {};
            }

            dd.event = [{
                eventInfo: {
                    eventName: name,
                    eventAction: action
                },
                category: {
                    primaryCategory: cat
                },
                attributes: attr
            }];

            console.log('Tealium Event: ', name, action, dd.event, dd);

            tealium.send(dd);

        },

        link: function (source) {
            dd.event = [{
                eventInfo: {
                    eventName: "link",
                    eventAction: "link_tracking"
                },
                attributes: {
                    source: source
                }
            }];

            console.log('Tealium Link Tracking Event: ', source, dd.event);

            tealium.send(dd);

        },

        form: (function () {

            !dd.form ? dd.form = {} : "";
            !dd.site ? dd.site = {} : "";
            !dd.page ? dd.page = {pageInfo: {}} : "";

            return {
                setFormName: function (name, form, checkout) {
                    if (!name) {
                        dd.form.name = dd.page.pageInfo.pageName;
                    } else {
                        dd.form.name = name;
                    }

                    if (checkout) {
                        console.log("Tealium : Set Form Name (CHECKOUT)");
                        this.checkoutFormsInit(form);
                    }
                    console.log("Tealium : Set Form Name", dd.form);
                },
                init: function () {
                    console.log("Tealium : Interaction with form");
                    tealium.event("form", "interaction", dd.site.section, {});
                },
                submit: function () {
                    console.log("Tealium : Form Submission");
                    tealium.event("form", "submit", dd.site.section, {});
                },
                checkoutFormsInit: function (form) {
                    tealium.event("form", form, "checkout");
                },
                error: function (errors) {
                    console.log("Tealium : Preparing form errors");
                    tealium.event("form", "error", dd.site.section, {
                        formName: dd.form.name,
                        formErrors: errors
                    });

                }
            };

        })(),

        dollarStringToInt: function (variable) {
            var price = variable;
            price = Number(price.replace(/[^0-9\.]+/g, ""));
            console.log("Tealium: Converting Dollar amount ", variable, " to ", price);
            return price;
        }


    };

    return tealium;

});