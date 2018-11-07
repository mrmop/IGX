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
    ResolveService: function(name)
    {
        if (GameService.instance !== undefined && GameService.instance.name === name)
        {
            return GameService.instance.service;
        }
        else if (UserService.instance !== undefined && UserService.instance.name === name)
        {
            return UserService.instance.service;
        }
        else if (LeaderboardsService.instance !== undefined && LeaderboardsService.instance.name === name)
        {
            return LeaderboardsService.instance.service;
        }
        else if (MessagingService.instance !== undefined && MessagingService.instance.name === name)
        {
            return MessagingService.instance.service;
        }
        else if (ReferralService.instance !== undefined && ReferralService.instance.name === name)
        {
            return ReferralService.instance.service;
        }
        else if (StorageService.instance !== undefined && StorageService.instance.name === name)
        {
            return StorageService.instance.service;
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
        else if (ChatService.instance !== undefined && ChatService.instance.name === name)
        {
            return ChatService.instance.service;
        }
    },
}

