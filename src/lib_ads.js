//
// Copyright (C) Mat Hopwood www.drmop.com
// For details of license see license.txt
//

function AdsService(name)
{
    this.service = null;
    this.name = name;
    // Some vendors support multiple services
    if (GameService.instance !== undefined && GameService.instance.name === name)
    {
        this.service = GameService.instance.service;
    }
    else if (PaymentsService.instance !== undefined && PaymentsService.instance.name === name)
    {
        this.service = PaymentsService.instance.service;
    }
    else
    {
        if (name === "crazygames")
            this.service = new LibCrazyGames();
        else if (name === "gamedistribution")
            this.service = new LibGameDistribution();
    }
    AdsService.instance = this;
    if (this.service !== undefined)
    {
        FBInstant.supportedAPIs.push("getInterstitialAdAsync");
        FBInstant.supportedAPIs.push("getRewardedVideoAsync");
        FBInstant.supportedAPIs.push("AdInstance.loadAsync");
        FBInstant.supportedAPIs.push("AdInstance.showAsync");
    }
}

//
// INIT
//
AdsService.prototype.InitAds = function(options)
{
    if (this.service === null)
        return false;
    return this.service.InitAds(options);
}

AdsService.prototype.IsAdsSupported = function(id, type)
{
    if (this.service === null)
        return false;
    return this.service.IsAdsSupported(id, type);
}

//
// Ad requests
//
AdsService.prototype.PreloadAd = function(id, type, done_cb)
{
    if (this.service === null)
        return;
    return this.service.PreloadAd(id, type, done_cb);
}

AdsService.prototype.ShowAd = function(id, type, done_cb)
{
    if (this.service === null)
        return;
    return this.service.ShowAd(id, type, done_cb);
}











