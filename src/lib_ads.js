//
// Copyright (C) Mat Hopwood www.drmop.com
// For details of license see license.txt
//

function AdsService(name)
{
    this.service = null;
    this.name = name;
    if (name === "crazygames")
        this.service = new LibCrazyGames();
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
AdsService.prototype.Init = function(options)
{
    if (this.service === null)
        return false;
    return this.service.Init(options);
}

AdsService.prototype.IsSupported = function(id, type)
{
    if (this.service === null)
        return false;
    return this.service.IsSupported(id, type);
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











