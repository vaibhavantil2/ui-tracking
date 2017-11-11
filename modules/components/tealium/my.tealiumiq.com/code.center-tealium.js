var utag_data = {
    _utag_event : "", // name of event being tracking eg. view, link
    page_type : "", // Type of page eg. home,section,category,product,search,cart,checkout,receipt,account
    event_type : "", // Type of event triggered eg. cart_add,cart_remove
    page_name : "", // A unique name for the page (s.pageName)
    site_name : "", // Abbreviated name for site (s.evar50) eg. bb
    site_section : "", // The high-level sections of your site (s.channel) eg. Fitness Programs,Supplements,etc.
    page_group : "", // The primary group of pages (s.prop1) eg. catalog
    page_subgroup : "", // The sub group of pages (s.prop2) eg. catalog:sups
    search_keyword : "", // Value of search text entered by user (s.evar1) eg. p90x
    search_results : "", // Number of results returned by search (s.prop6,s.evar63)  eg. 120
    search_type : "", // Search type (s.evar61)
    currency_code : "", // Currency code for the site eg. USD,GBP,EUR,CAD
    customer_id : "", // Contains the unique customer ID (s.evar29)
    customer_email : "", // Contains the customer's email address.
    customer_city : "", // Contains the customer's city of residence.
    customer_state : "", // Contains the customer's state of residence.
    customer_postal_code : "", // Contains the customer's postal code (s.eVar10)
    customer_country : "", // Contains the customer's country of residence.
    order_discount_amount : "", // Contains the order-level discount amount. eg. 10.00
    order_grand_total : "", // Total amount for the current order including tax,shipping and discounts.
    order_id : "", // Contains the unique order ID (s.evar17)
    order_payment_method : "", // Contains the method of payment (s.evar23) eg. visa,paypal
    order_payment_type : "", // Contains the type of payment (s.evar24) eg. visa,paypal
    order_promo_code : "", // String list of comma separated promotion codes.
    order_shipping_amount : "", // Contains the total value for shipping.
    order_shipping_type : "", // Contains the type of shipping (s.eVar16) eg. 'FedEx Priority'.
    order_subtotal : "", // Total amount of all items,including all discounts at the order and product level,but not including tax nor shipping.
    order_tax_amount : "", // Total tax amount for this order.
    product_id : "", // An array of product IDs
    product_sku : "", // An array of product skus
    product_name : "", // An array of product names.
    product_original_price : "", // An array of original products prices,before mark-downs and promotional discounts
    product_price : "", // An array of product selling prices
    product_quantity : "", // An array of quantities for each product.
    product_category : "", // An array of product categories
    product_subcategory : "", // An array of product sub-categories
    video_name : "", // Name of video played (s.prop20,s.evar65)
    video_segment : "", // Segment of video played (s.evar66)
    basket_id : "", // (s.prop34)
    file_download_name : "", // Name of file/pdf downloaded (s.prop40/evar40)
    form_errors : "", // List of form errors,in checkout path (s.prop16)
    campaign_id : "", // (s.evar2)
    activity_id : "", // (s.evar3)
    external_campaign_code : "", // (s.evar4)
    marketing_activity_id : "", // (s.evar6) - separate from s.evar3
    offer_id : "", // (s.evar5)
    credit_card_type : "", // Type of credit card used during checkout (s.evar9)
    find_method : "", // (s.evar11)
    contact_id : "", // (s.evar13)
    product_test_group : "", // (s.evar20)
    upsell_type : "", // (s.evar22)
    chat_type : "", // (s.evar41)
    chat_agent_id : "", // (s.evar42)
    average_rating : "", // (s.evar58)
    number_of_reviews : "", // (s.evar59)
    organic_search : "", // (s.evar68)
    sem_search_query : "", // (s.evar69)
    fit_club_finder_search_criteria : "", // (s.evar72)6
    source_code : "", // s.evar8 - source code
    channel_manager_source_code : "", // s.evar37 - channel manager source code
    search_internal_type : "", // Internal search type/status page.attribute.onsiteSearchStatus (s.prop5)
    search_internal_page : "", // Internal search referral page,use s.prevPage/s.prop11 (s.prop4)
    sc_account : "", // SiteCatalyst report suite
    logged_in_status : "", // Logged in true/false
    checkout_logged_in_status : "", //
    is_mobile : "", //
    event_name : "", //
    video_milestone : "", // Video milestone tracking eg M:1:25
    video_position : "", // The current position in the video MIN:SEC eg. 1:59
    video_duration : "", // The length of the video in MIN:SEC eg. 19:34
    video_title : "", // The title of the video
    checkout_event : "", // Checkout specific events
    sc_video_title : "", // SiteCat video title has page_subgroup prefix
    sc_events : "", // Internal SiteCat events var
    video_current_time : "", // Number of seconds into the video
    video_play_time : "", // Accumulated number of seconds elapsed while playing video
    sc_video_id : "", // SiteCat video ID (taken from URL)
    click_data_prop30 : "", // Start CDJ Workout
    link_tracking : "", // eVar30 &amp; prop30
    form_name : "", // Form Name s.prop17
    in_iframe : "", // Returns true or false if utag.js is loading within an iframe
    filter_results : "", // Coming Soon
    filter_selections : "" // Coming Soon
}