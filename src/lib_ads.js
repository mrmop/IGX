//
// Copyright (C) Mat Hopwood www.drmop.com
// For details of license see license.txt
//

function AdsService(name)
{
    this.service = LibUtils.ResolveService(name);
    if (this.service === undefined)
    {
        if (name === "crazygames")
            this.service = new LibCrazyGames();
        else if (name === "gamedistribution")
            this.service = new LibGameDistribution();
    }
    this.name = name;
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
    if (this.service === undefined)
        return false;
    return this.service.InitAds(options);
}

AdsService.prototype.IsAdsSupported = function(id, type)
{
    if (this.service === undefined)
        return false;
    return this.service.IsAdsSupported(id, type);
}

//
// Ad requests
//
AdsService.prototype.PreloadAd = function(id, type, done_cb)
{
    if (this.service === undefined)
        return;
    return this.service.PreloadAd(id, type, done_cb);
}

AdsService.prototype.ShowAd = function(id, type, done_cb)
{
    if (this.service === undefined)
        return;
    return this.service.ShowAd(id, type, done_cb);
}











