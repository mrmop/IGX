function AdsService(name)
{
    this.service = null;
//    if (name === "custom")
//        this.service = new YourAdsService();
    AdsService.instance = this;
}

AdsService.Log = function(message)
{
    console.log(message);
}

AdsService.LogError = function(message)
{
    console.log(message);
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
AdsService.prototype.PreloadAd = function(id, type, done_callback)
{
    if (this.service === null)
        return;
    return this.service.PreloadAd(id, type, done_callback);
}

AdsService.prototype.ShowAd = function(id, type, done_callback)
{
    if (this.service === null)
        return;
    return this.service.ShowAd(id, type, done_callback);
}











