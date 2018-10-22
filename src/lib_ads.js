function LibAds()
{
    this.service = null;
    AdsService.instance = this;
}

LibAds.Log = function(message)
{
    console.log(message);
}

LibAds.LogError = function(message)
{
    console.log(message);
}

//
// INIT
//
LibAds.prototype.Init = function(options)
{
    AdsService.instance.Init(options);
}

LibAds.prototype.IsSupported = function(id, type)
{
    return AdsService.instance.IsSupported(id, type);
}

LibAds.prototype.PreloadAd = function(id, type, done_callback)
{
    AdsService.instance.PreloadAd(id, type, done_callback);
}

LibAds.prototype.ShowAd = function(id, type, done_callback)
{
    AdsService.instance.ShowAd(id, type, done_callback);
}











