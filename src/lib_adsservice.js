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
        else if (name === "adinplay")
            this.service = new LibAdInPlay();
        else if (name === "unity")
            this.service = new LibUnity();
    }
    this.name = name;
    AdsService.instance = this;
    if (FBInstant.ext !== undefined && this.service !== undefined)
    {
        this.service.addSupportedAPI("ads");
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

AdsService.prototype.IsSupported = function()
{
    return this.service !== undefined;
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











