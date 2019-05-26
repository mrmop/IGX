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
        else if (name === "kongregate")
            this.service = new LibKongregate();
        else if (name === "unity")
            this.service = new LibUnity();
    }
    this.name = name;
    AnalyticsService.instance = this;
    if (FBInstant.ext !== undefined && this.service !== undefined)
    {
        this.service.addSupportedAPI("analytics");
    }
}

//
// INIT
//
AnalyticsService.prototype.InitAnalytics = function(options)
{
    if (this.service === undefined)
        return false;
    return this.service.InitAnalytics(options);
}

AnalyticsService.prototype.IsSupported = function()
{
    return this.service !== undefined;
}

//
// Logging
//
AnalyticsService.prototype.LogEvent = function(event_name, value, params)
{
    if (this.service === undefined)
        return null;
    return this.service.LogEvent(event_name, value, params);
}

