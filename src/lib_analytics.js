//
// Copyright (C) Mat Hopwood www.drmop.com
// For details of license see license.txt
//

function AnalyticsService(name)
{
    this.service = LibUtils.ResolveService(name);
    if (this.service === undefined)
    {
        if (name === "google")
            this.service = new LibGoogleAnalytics();
    }
    this.name = name;
    AnalyticsService.instance = this;
    if (this.service !== undefined)
    {
        FBInstant.supportedAPIs.push("logEvent");
    }
}

//
// INIT
//
AnalyticsService.prototype.InitAnalytics = function(options)
{
    if (this.service === null)
        return false;
    return this.service.InitAnalytics(options);
}

AnalyticsService.prototype.IsAnalyticsSupported = function()
{
    if (this.service === null)
        return false;
    return this.service.IsAnalyticsSupported();
}

//
// Logging
//
AnalyticsService.prototype.LogEvent = function(event_name, value, params)
{
    if (this.service === null)
        return null;
    return this.service.LogEvent(event_name, value, params);
}

