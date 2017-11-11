var com = com || {};
com.tealium = com.tealium || {};
com.tealium.version = '1.0';

com.tealium.init= function(dst) {
    dst.category_path = [];
};

com.tealium.init_product_arrays = function(dst) {
    dst.product_id = [];
    dst.product_sku = [];
    dst.product_name = [];
    dst.product_original_price = [];
    dst.product_price = [];
    dst.product_quantity = [];
    dst.product_category = [];
    dst.product_subcategory = [];
    dst.product_gift_card_revenue = [];
};

com.tealium.w3c_to_udo = function(x, dst) {

    function populate_product(prod, obj) {
        if(prod.quantity) {
            obj.product_quantity.push(prod.quantity);
        } else {
            obj.product_quantity.push("0");
        }

        // Product ID, Name, SKU
        if(prod.productInfo) {
            if(prod.productInfo.productID) {
                obj.product_id.push(prod.productInfo.productID);
            } else {
                obj.product_id.push("");
            }

            if(prod.productInfo.productName) {
                obj.product_name.push(prod.productInfo.productName);
            } else {
                obj.product_name.push("");
            }

            if(prod.productInfo.sku) {
                obj.product_sku.push(prod.productInfo.sku);
            } else {
                obj.product_sku.push("");
            }
        }

        // Product Detail Page can have an array of prices
        if(prod.price) {

            if(prod.price.retailPrice) {
                obj.product_original_price.push( prod.price.retailPrice );
            }

            if(prod.price.finalPrice) {
                obj.product_price.push( prod.price.finalPrice );
            }
        }

        // Product Category
        if(prod.category) {
            if(prod.category.primaryCategory) {
                obj.product_category.push(prod.category.primaryCategory);
            } else {
                obj.product_category.push("");
            }
            if(prod.category.subCategory) {
                obj.product_subcategory.push(prod.category.subCategory);
            } else {
                obj.product_subcategory.push("");
            }
        }
        // Product Reviews
        if(prod.reviews) {
            if(prod.reviews.number) {
                obj.number_of_reviews.push(prod.reviews.number);
            } else {
                obj.number_of_reviews.push("");
            }
            if(prod.reviews.rating) {
                obj.average_rating.push(prod.reviews.rating);
            } else {
                obj.average_rating.push("");
            }
        }

    }

    // -----------------------------------------------------------------------------------
    // Events Vars
    // -----------------------------------------------------------------------------------
    if(x.event && x.event instanceof Array && x.event[0]) {
        var e = x.event[0];

        if(e.eventInfo) {
            if(e.eventInfo.eventName) {

                if('upsell' == e.eventInfo.eventName) {
                    // upsell data
                    // {
                    //   "category": {
                    //    "primaryCategory": "transaction"
                    //  },
                    //  "eventInfo": {
                    //    "eventName": "upsell",
                    //    "eventAction": "buy"
                    //  },
                    //  "attributes": {
                    //    "shippingRevenue": 6.95,
                    //    "order": "20020616",
                    //    "skuID": "SUPRECO2105-1U",
                    //    "upsellPageNumber": 3,
                    //    "productID": "SUPRECO1102-1U",
                    //    "units": 1,
                    //    "revenue": 49.95
                    //  }
                    //}
                    if(e.attributes) {
                        if(e.attributes.productID) dst.upsell_product_id = [e.attributes.productID];
                        if(e.attributes.skuID) dst.upsell_product_sku = [e.attributes.skuID];

                        if(e.attributes.order) dst.upsell_order = e.attributes.order;
                        if(e.attributes.revenue) {
                            dst.upsell_revenue = e.attributes.revenue;
                            dst.upsell_product_price = [e.attributes.revenue];
                        }

                        if(e.attributes.units) {
                            dst.upsell_units = e.attributes.units;
                            dst.upsell_product_quantity = [e.attributes.units];
                        }
                        if(e.attributes.shippingRevenue) dst.upsell_shipping_revenue = e.attributes.shippingRevenue;
                    }
                }
                if('order' == e.eventInfo.eventName) {
                    if('removed' == e.eventInfo.eventAction) {
                        if(e.attributes) {
                            if(e.attributes.revenue) dst.removed_revenue = e.attributes.revenue;
                            if(e.attributes.units) dst.removed_units = e.attributes.units;
                            if(e.attributes.shippingRevenue) dst.removed_order = e.attributes.order;
                        }
                    }
                    if('swap' == e.eventInfo.eventAction) {
                        if(e.attributes) {
                            if(e.attributes.revenue) dst.product_swap_revenue = e.attributes.revenue;
                            if(e.attributes.units) dst.product_swap_units = e.attributes.units;
                            if(e.attributes.order) dst.product_swap_order = e.attributes.order;
                            if(e.attributes.shippingRevenue) dst.product_swap_shipping_revenue = parseFloat(e.attributes.shippingRevenue).toFixed(2);
                        }
                    }
                    if('checkout' == e.eventInfo.eventAction) {
                        if(e.attributes) {
                            if(e.attributes.shipTo) dst.checkout_ship_tp = e.attributes.shipTo;
                            if(e.attributes.shipMethod) dst.checkout_ship_method = e.attributes.shipMethod;
                            if(e.attributes.payment) dst.checkout_payment = e.attributes.payment;
                            if(e.attributes.checkout) dst.event_type = 'checkout_begin';
                            if(e.attributes.review) dst.event_type = 'checkout_review';
                            if(e.attributes.purchase) dst.event_type = 'checkout_purchase';
                        }
                    }
                }
                if('form' == e.eventInfo.eventName) {
                    if(x.form){
                        if(x.form.name){
                            dst.form_name = x.form.name;
                        } else {
                            dst.form_name = "unknown on "+ x.page.pageInfo.pageName;
                        }
                    }
                    if('interaction' == e.eventInfo.eventAction) dst.event_type = 'form_interaction';
                    if('submit' == e.eventInfo.eventAction) dst.event_type = 'form_submit';

                    if('error' == e.eventInfo.eventAction) {
                        dst.event_type = 'form_error';
                        dst.form_name = e.attributes.formName;
                        dst.form_errors = e.attributes.formErrors;
                    }

                    // checkout forms events
                    if('shipping' == e.eventInfo.eventAction) dst.event_type = 'checkout_shipping';
                    if('payment' == e.eventInfo.eventAction) dst.event_type = 'checkout_payment';
                    if('account' == e.eventInfo.eventAction) dst.event_type = 'checkout_register';
                }
                if('user' == e.eventInfo.eventName) {
                    if('session' == e.eventInfo.eventAction) dst.event_type = 'session';
                    if('register' == e.eventInfo.eventAction) dst.event_type = 'user_register';
                    if('search' == e.eventInfo.eventAction) dst.event_type = 'member_search';
                }
                if('video' == e.eventInfo.eventName) {
                    if('view' == e.eventInfo.eventAction) dst.event_type = 'video_view';
                    if(e.attributes) {
                        if(e.attributes.timePlayed) {
                            dst.event_type = 'video_time_played';
                            dst.video_segment = e.attributes.timePlayed;
                        }
                    }
                }
                if('checkout' == e.eventInfo.eventName) {
                    if('shippingUpgrade' == e.eventInfo.eventAction) dst.event_type = 'upgrade_shipping';
                    if('shipping' == e.eventInfo.eventAction) dst.event_type = 'initial_shipping';
                    if('giftCardRevenue' == e.eventInfo.eventAction) dst.event_type = 'gift_card_revenue';
                }
                if('search' == e.eventInfo.eventName) {
                    if('noResults' == e.eventInfo.eventAction) dst.event_type = 'search_no_results';
                }
                if('file' == e.eventInfo.eventName) {
                    if('download' == e.eventInfo.eventAction) dst.event_type = 'file_download';
                }
                if('cart' == e.eventInfo.eventName) {
                    if('view' == e.eventInfo.eventAction) dst.event_type = 'cart_view';
                    if('add' == e.eventInfo.eventAction) dst.event_type = 'cart_add';
                    if('remove' == e.eventInfo.eventAction) dst.event_type = 'cart_remove';

                    if(e.attributes.productID) dst.cart_product_id = [e.attributes.productID];
                    if(e.attributes.skuID) dst.cart_product_sku = [e.attributes.skuID];
                }
                if('link' == e.eventInfo.eventName) {
                    dst.event_type = "link_tracking";
                    dst.link_tracking = [e.attributes.source]
                }
                if('productFilter' == e.eventInfo.eventName){
                    if('filter' == e.eventInfo.eventAction){
                        dst.event_type = 'filter';

                        dst.filter_results = e.attributes.results;
                        dst.filter_selections = e.attributes.selections;
                        dst.filter_results_count = e.attributes.results.length;
                    }

                }
            }
        }
    }

    // -----------------------------------------------------------------------------------
    // Site Vars
    // -----------------------------------------------------------------------------------
    if(x.site) {
        if(x.site.name) dst.site_name = x.site.name;
        if(x.site.env) dst.site_env = x.site.env;
        if(x.site.section) dst.site_section = x.site.section;
        if(x.site.country) dst.site_country = x.site.country;
        if(x.site.locale) dst.site_locale = x.site.locale;
    }

    // -----------------------------------------------------------------------------------
    // Page
    // -----------------------------------------------------------------------------------
    if(x.page) {
        if(x.page.category) {
            if(x.page.category.pageType) {
                var dd_type = x.page.category.pageType;
                // W3C type  : Tealium type
                var type_map = {
                    'home'              : 'home',
                    'cdp'               : 'category',
                    'pdp'               : 'product',
                    'search results'    : 'search',
                    'checkout'          : 'checkout',
                    'confirmation'      : 'order'
                };
                dst.page_type = type_map[dd_type] || dd_type;
            }

            if(x.page.category.siteName) dst.site_name = x.page.category.siteName;
            if(x.page.category.primaryCategory) dst.page_group = x.page.category.primaryCategory;
            if(x.page.category.primaryCategory == 'Order Confirmation Page') dst.page_type = 'order';
            if(x.page.category.subCategory1) dst.page_subgroup = x.page.category.subCategory1;
            if(x.page.category.subCategory2) dst.page_subgroup = x.page.category.subCategory2;
        }
        if(x.page.attribute) {
            if(x.page.attribute.onsiteSearchStatus) dst.search_internal_type = x.page.attribute.onsiteSearchStatus;
        }
        if(x.page.pageInfo) {
            if(x.page.pageInfo.pageName) dst.page_name = x.page.pageInfo.pageName;
            if(x.page.pageInfo.pageName) dst.page_name_dup = x.page.pageInfo.pageName;
            if(x.page.pageInfo.logged_in_status) dst.logged_in_status = x.page.pageInfo.logged_in_status;
            if(x.page.pageInfo.currencyCode) dst.currency_code = x.page.pageInfo.currencyCode;

            // Customer
            if(x.page.pageInfo.customerID) dst.customer_id = x.page.pageInfo.customerID;

            // Search
            if(x.page.pageInfo.onsiteSearchTerm) dst.search_keyword = x.page.pageInfo.onsiteSearchTerm;
            if(x.page.pageInfo.onsiteSearchResults) dst.search_results = x.page.pageInfo.onsiteSearchResults;
        }
    }

    if(x.marketing) {
        if(x.marketing.search) {
            // Search
            if(x.marketing.search.type) dst.search_type = x.marketing.search.type;
        }
    }

    // -----------------------------------------------------------------------------------
    // User
    // "user": {
    //     "profile": {
    //         "address": {
    //             "city": "San Diego",
    //             "stateProvince": "CA",
    //             "postalCode": "92121",
    //             "country": "US"
    //         },
    //         "profileInfo": {
    //             "profileID": "3390069"
    //         }
    //     }
    // }
    // -----------------------------------------------------------------------------------
    if(x.user) {
        if(x.user.profile) {
            if(x.user.profile.profileInfo) {
                if(x.user.profile.profileInfo.profileID) dst.customer_id = x.user.profile.profileInfo.profileID;
                if(x.user.profile.profileInfo.customerType) dst.customer_type = x.user.profile.profileInfo.customerType;
            }
            if(x.user.profile.address) {
                if(x.user.profile.address.city) dst.customer_city = x.user.profile.address.city;
                if(x.user.profile.address.stateProvince) dst.customer_state = x.user.profile.address.stateProvince;
                if(x.user.profile.address.postalCode) dst.customer_postal_code = x.user.profile.address.postalCode;
                if(x.user.profile.address.country) dst.customer_country = x.user.profile.address.country;
            }
        }
    }

    // -----------------------------------------------------------------------------------
    // Marketing
    // -----------------------------------------------------------------------------------
    if(x.marketing) {
        if(x.marketing.testGroup) dst.product_test_group = x.marketing.testGroup;
        if(x.marketing.externalCampaignCode) dst.external_campaign_code = x.marketing.externalCampaignCode;

        if(x.marketing.email) {
            if(x.marketing.email.contactID) dst.contact_id = x.marketing.email.contactID;
            if(x.marketing.email.campaignID) dst.campaign_id = x.marketing.email.campaignID;
            if(x.marketing.email.activityID) dst.activity_id = x.marketing.email.activityID;
            if(x.marketing.email.offerID) dst.offer_id = x.marketing.email.offerID;
            if(x.marketing.email.marketingActivityID) dst.marketing_activity_id = x.marketing.email.marketingActivityID;
        }
        // Search
        if(x.marketing.search) {
            if(x.marketing.search.organic) dst.organic_search = x.marketing.search.organic;
            if(x.marketing.search.query) dst.sem_search_query = x.marketing.search.query;
            if(x.marketing.search.fitFinder) dst.fit_club_finder_search_criteria = x.marketing.search.fitFinder;
        }
    }


    if(x.referralInformation){
        if(x.referralInformation.referrer) dst.referralInformation = x.referralInformation.referrer;
    }

    // -----------------------------------------------------------------------------------
    // Video
    // -----------------------------------------------------------------------------------
    if(x.video) {
        if(x.video.name) dst.video_name = x.video.name;
        if(x.video.segment) dst.video_segment = x.video.segment;
    }

    // -----------------------------------------------------------------------------------
    // Chat/Support
    // -----------------------------------------------------------------------------------
    if(x.support) {
        if(x.support.chat) {
            if(x.support.chat.type) dst.chat_type = x.support.chat.type;
            if(x.support.chat.agentID) dst.chat_agent_id = x.support.chat.agentID;
        }
    }

    // -----------------------------------------------------------------------------------
    // Product Page
    // -----------------------------------------------------------------------------------
    if(x.product) {
        if(x.product.productInfo){
            if(x.product.productInfo.product_finding_method){
                dst.product_finding_method = x.product.productInfo.product_finding_method;
            }

            if(x.product.productInfo.product_finding_trigger){
                dst.product_finding_trigger = x.product.productInfo.product_finding_trigger;
            }
        }
    }

    // -----------------------------------------------------------------------------------
    // Cart
    // -----------------------------------------------------------------------------------
    if(x.cart) {
        if(x.cart.cartID) dst.basket_id = x.cart.cartID;

        com.tealium.init_product_arrays(dst);
        if(x.cart.item && x.cart.item instanceof Array) {
            for (var i = 0; i < x.cart.item.length; i++) {
                var item = x.cart.item[i];
                populate_product(item, dst);
            }
        }
    }

    // -----------------------------------------------------------------------------------
    // Order Confirmation
    // -----------------------------------------------------------------------------------
    if(x.transaction && dst.page_type == 'order') {

        // ------------------------------------------------------------------------------------
        // Products
        // ------------------------------------------------------------------------------------
        com.tealium.init_product_arrays(dst);
        var itemsArray = x.transaction.item || x.transaction.items;
        for (var h = 0; h < itemsArray.length; h++) {
            var items = itemsArray[h];
            populate_product(items, dst);
        }

        dst.order_grand_total     = "0.00";
        dst.order_subtotal        = "0.00";
        dst.order_shipping_amount = "0.00";
        dst.order_tax_amount      = "0.00";
        dst.order_discount_amount = "0.00";

        // ------------------------------------------------------------------------------------
        // Order Details
        // ------------------------------------------------------------------------------------
        if (x.transaction.transactionID) dst.order_id = x.transaction.transactionID.toLowerCase();


        if (x.transaction.total) {
            if(x.transaction.total.shipping) dst.order_shipping_amount = x.transaction.total.shipping;
            if(x.transaction.total.shippingMethod) dst.order_shipping_type = x.transaction.total.shippingMethod;
            if(x.transaction.total.transactionalTotal) dst.order_grand_total = x.transaction.total.transactionalTotal;

            if (x.transaction.total.paymentMethod) dst.order_payment_method = x.transaction.total.paymentMethod;
            if (x.transaction.total.subtotal) dst.order_subtotal = x.transaction.total.subtotal;

            if(x.transaction.total.discount) dst.order_discount_amount = x.transaction.total.discount;
            if(x.transaction.total.voucherCode) dst.order_promo_code = x.transaction.total.voucherCode;
            if(x.transaction.total.tax) dst.order_tax_amount = x.transaction.total.tax;
            if(x.transaction.total.currency) dst.currency_code = x.transaction.total.currency;
        }

        // ------------------------------------------------------------------------------------
        // User
        // ------------------------------------------------------------------------------------
        if(x.user.profile) {
            if(x.user.profile.profileInfo) {
                if(x.user.profile.profileInfo.profileID) dst.customer_id = x.user.profile.profileInfo.profileID;
            }
            if(x.user.address) {
                if(x.user.address.city)             dst.customer_city = x.user.profile.profileInfo.city;
                if(x.user.address.stateProvince)    dst.customer_state = x.user.profile.profileInfo.stateProvince;
                if(x.user.address.postalCode)       dst.customer_postal_code = x.user.profile.profileInfo.postalCode;
                if(x.user.address.country)          dst.customer_country = x.user.profile.profileInfo.country;
            }
        }
    } // end order
};

var utag_data = utag_data || {};
com.tealium.init(utag_data);
com.tealium.w3c_to_udo(digitalData, utag_data);
