//
// Copyright (C) Mat Hopwood www.drmop.com
// For details of license see license.txt
//

function LibGoogleAnalytics()
{
    LibGoogleAnalytics.Log(">>>> GoogleAnalytics: Created!");
    // NOTES:
}

LibGoogleAnalytics.Log = function(message)
{
    console.log(message);
}

LibGoogleAnalytics.LogError = function(message)
{
    console.log(message);
}

//
// INIT
//

// options
// - trackingId - Tracking ID provided by Google Analytics
LibGoogleAnalytics.prototype.InitAnalytics = function(options)
{
    LibGoogleAnalytics.Log(">>>> GoogleAnalytics: InitAnalytics");
    var self = this;

    (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
        (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
        m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
        })(window,document,"script","https://www.google-analytics.com/analytics.js","ga");
        
    ga("create", options.trackingId, "auto");
}

LibGoogleAnalytics.prototype.addSupportedAPI = function(type)
{
    if (type === "analytics")
    {
        FBInstant.supportedAPIs.push("logEvent");
    }
}

LibGoogleAnalytics.prototype.LogEvent = function(event_name, value, params)
{
    LibGoogleAnalytics.Log(">>>> GoogleAnalytics: LogEvent " + event_name);
    ga("send", "event", "game", event_name, value);
    return true;
}

