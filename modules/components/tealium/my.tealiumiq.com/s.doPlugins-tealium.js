/************************** PLUGIN CONFIG  **************************/
s.usePlugins=true

function s_doPlugins(s)
{
    /* Basic Page Information */
    s.eVar1 = "D=pageName";
    s.prop10 = document.domain;
    s.prop11 = s.getPreviousValue(s.pageName, 'gpv', '');
    if(s.events === 'event43'){
        s.prop17 = "checkout:shipping";
    }
    if(!bIsChromecast)
    {
        s.prop12 = "D=User-Agent";
    }
    if(bIsChromecast)
    {
        s.prop12 = navigator.userAgent;
    }
    s.prop13 = "D=g"; //url
    s.eVar18 = "D=s_vi"; //visitorID

    /* Timeparting */
    s.prop16 = s.getTimeParting('h', '-8') + "|" + s.getTimeParting('d', '-8'); //hour|day

    /* Setup Link Tracking */
    s.hbx_lt="auto";
    s.setupLinkTrack("prop41,prop42,prop43", "SC_LINKS");
    /* Exit Links */
    s.exitURL = s.exitLinkHandler()
    if(s.exitURL)
    {
        s.linkTrackVars = "pageName";
        s.linkTrackEvents = "";
        s.linkName = s.prop42.toLowerCase();
        s.linkName = s.pageName + ' | ' + s.linkName + ' | ' + s.exitURL;
    }
    /* Download Links */
    s.downloadURL = s.downloadLinkHandler()
    if(s.downloadURL)
    {
        s.linkTrackVars = "prop40,eVar40,events";
        s.linkTrackEvents = "event41";
        s.linkName = s.prop42.toLowerCase();
        s.prop40 = 'D=v40';
        s.eVar40 = s.pageName + ' | ' + s.linkName + ' | ' + s.downloadURL;
        s.linkName = s.eVar40;
        s.events = s.linkTrackEvents;
    }

    /* Internal Campaign Tracking Codes */
    s.eVar56=s.getQueryParam('icid');

    /* Epsilon/Email Parameters */
    if(!s.eVar27)
    {
        s.eVar27 = s.getQueryParam('ep_rid');
    }
    if(!s.eVar28)
    {
        s.eVar28 = s.getQueryParam('ep_mid');
    }




    /* campaign tracking codes with link id */
    if(s.getQueryParam('code') && s.getQueryParam('lid'))
    {
        s.eVar7 = s.getQueryParam('code').toUpperCase() + ' | ' + s.getQueryParam('lid').toUpperCase();
    }

    /* Capture Code or Tracking Parameter */
    if(!s.eVar8 && !s.campaign && s.getQueryParam('code'))
    {
        s.campaign = s.eVar8 = s.getQueryParam('code');
    }
    else if(!s.eVar8 && !s.campaign && !s.getQueryParam('code') && s.getQueryParam('tracking'))
    {
        s.campaign = s.eVar8 = s.getQueryParam('tracking');
    }

    /* New/Repeat Visitors AND Visit Number */
    s.prop31 = s.getNewRepeat(30, 's_getNewRepeat');


    /* Locale Data */
    if(s.prop14)
    {
        s.eVar48 = s.prop14; //language
        s.prop15 = 'D=c14+":"+pageName'; //language+pagename
    }

    /* Purchase Information */
    if(s.purchaseID)
    {
        s.transactionID = s.eVar17 = s.purchaseID;
    }

    /* Channel Manager/Cross Visit items - Exclude Internal Codes */
    if(s.getQueryParam('code').indexOf('BTN_') == -1 && s.getQueryParam('code').indexOf('CONTINUESHOP') == -1)
        s.channelManager('code,tracking', '', '0', '', 's_dl');
    if(s._channel)
    {
        if(s._channel == "Other Natural Referrers")
            s._channel = "Referrers";
        if(s._channel == "Referrers" && s._referringDomain.toLowerCase() == "www.beachbody.com")
            s._channel = "Beachbody Other";
        if(s._campaignID && s._referringDomain.toLowerCase()=="www.ultimatereset.com")
            s._channel = "Ultimate Reset " + s._channel;
        s.eVar31 = s._channel;
        s.mailRef = s._referringDomain.indexOf('.mail.')
        if(s.mailRef > -1)
            s._referringDomain = s._referringDomain.substring(s.mailRef + 1);
        s.eVar34 = s._referringDomain;
        if(s.eVar31 && !s.eVar34)
            s.eVar34 = 'n/a';
        s.eVar31 = s.getValOnce(s.eVar31, 's_cmc', 0);
        s.eVar34 = s.getValOnce(s.eVar34, 's_cmrf', 0);
        s.tempcode = s.getValOnce(s.eVar8, 's_tempcode', 0);
    }
    if(s.eVar31 || s.eVar34 || s.tempcode)
    {
        s.eVar31 = s._channel;
        // Determine Branded/Non-Branded Paid Search
        if(s.eVar31 == 'Paid Search' && s.eVar8 && s.eVar8.indexOf('SEMB') > -1)
            s.eVar31 = 'Branded Paid Search';
        else if(s.eVar31 == 'Paid Search')
            s.eVar31 = 'Non-Branded Paid Search';
        s.eVar32 = s._partner;
        // Fill eVar32 with n/a if partner/search engine can't be found
        if(s.eVar31 && !s.eVar32)
            s.eVar32 = 'n/a';
        // Get the keywords
        s.eVar33 = s._keywords;
        // If the referring domain doesn't exist in a Paid Search, fill in Search Engine/Keyword used with Unknown
        if(s.eVar31 && (s.eVar31.indexOf('Paid Search') > -1 && s.eVar32 == 'n/a'))
            s.eVar32 = 'Unknown Search Engine';
        if(s.eVar31 && (s.eVar31.indexOf('Paid Search') > -1 && s.eVar33 == 'n/a'))
            s.eVar33 = 'Unknown Keyword';
        // Get the referringDomain
        s.eVar34 = s._referringDomain;
        // Fill eVar34 with n/a if referring domain can't be found
        if(s.eVar31 && !s.eVar34) s.eVar34 = 'n/a';
        // Set the Direct Load Channel and Referring Domain
        if(s.eVar31 == 'Typed/Bookmarked') s.eVar31 = s.eVar34 = 'Home Page Direct/Bookmarked';
        // Change the Unknown Paid Channel to be Unrecognized
        if(s.eVar31 == 'Unknown Paid Channel')
        {
            if(s.eVar8.indexOf('DOTCOM') > -1) s.eVar31 = 'Branded Direct';
            else s.eVar31 = 'Unrecognized Channel';
        }
        // Fix for SEO Vanity URLs
        if(s.eVar31 == 'Non-Branded Paid Search')
        {
            if(s.eVar8.indexOf('DOTCOM') > -1) s.eVar31 = 'Branded Direct';
        }
        // Cross-visit Participation
        if(s.campaign)
        {
            var cvp35 = s.campaign;
        }
        else
        {
            var cvp35 = s.eVar31;
        }
        s.eVar35 = s.crossVisitParticipation(cvp35, 's_ev35', '90', '10', '>', '', 1);
        s.eVar36 = s.crossVisitParticipation(s.eVar31, 's_ev31', '90', '10', '>', '', 1);
        // Source Code
        if(s.eVar8 && s.eVar8.indexOf('BTN_') == -1 && s.eVar8.indexOf('PARSE') == -1)
        {
            s.eVar37 = s.eVar8;
        }
        else
        {
            s.eVar37 = s.eVar31 + ': ' + s.eVar34
        }
        if(s.eVar31.indexOf('Home Page Direct') > -1)
        {
            s.eVar37 = s.eVar31;
        }
    }

    s.prop32 = "2xx" //release version
    s.prop33 = s.getPercentPageViewed(); //% viewed


    /* Visitor ID Tracking */
    if(s.visitorID||s.c_r('s_ev29'))
    {
        if(!s.visitorID)
        {
            s.visitorID=s.c_r('s_ev29');
        }
        s.eVar29=s.visitorID;
        var e = new Date()
        s.one_day = 1000 * 60 * 60 * 24;
        s.c_w('s_ev29',s.visitorID,e.getTime()+(1825*s.one_day));
    }

}
s.doPlugins = s_doPlugins
