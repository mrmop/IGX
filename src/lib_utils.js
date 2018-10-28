//
// Copyright (C) Mat Hopwood www.drmop.com
// For details of license see license.txt
//

var LibUtils = {
    Log: function(message)
    {
        console.log(message);
    },
    
    LogError: function(message)
    {
        console.log(message);
    },
    ResolveService: function()
    {
        if (GameService.instance !== undefined && GameService.instance.name === name)
        {
            return GameService.instance.service;
        }
        else if (AnalyticsService.instance !== undefined && AnalyticsService.instance.name === name)
        {
            return AnalyticsService.instance.service;
        }
        else if (AdsService.instance !== undefined && AdsService.instance.name === name)
        {
            return AdsService.instance.service;
        }
        else if (PaymentsService.instance !== undefined && PaymentsService.instance.name === name)
        {
            return PaymentsService.instance.service;
        }
    },
}

