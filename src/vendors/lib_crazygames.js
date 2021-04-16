//
// Copyright (C) Mat Hopwood www.drmop.com
// For details of license see license.txt
//

function LibCrazyGames()
{
    // NOTES:
    // Preloading is not supported
    // Interstitial is supported
    // Rewarded is supported
}

LibCrazyGames.Log = function(message)
{
    console.log(message);
}

LibCrazyGames.LogError = function(message)
{
    console.log(message);
}

//
// INIT
//

// options
// - startedCallback - Can be tapped into to mute audio during video playback
// - finishedCallback - Can be tapped into to unmute audio after video playback
// - bannerRenderedCallback = Called when a banner has rendered
// - bannerErrorCallback = Called when there is a banner error
LibCrazyGames.prototype.InitAds = function(options)
{
    LibCrazyGames.Log(">>>> CrazyGames: InitAds");
    var self = this;
    this.crazysdk  = window.CrazyGames.CrazySDK.getInstance();
    
    this.adRequested = false;
    this.startedCallback = options.startedCallback;
    this.finishedCallback = options.finishedCallback;

    this.crazysdk.init();

    this.crazysdk.addEventListener("adStarted", function() {
        LibCrazyGames.Log("CrazyGames: adStarted");
        if (self.startedCallback)
            self.startedCallback();
    });
    this.crazysdk.addEventListener("adError", function() {
        LibCrazyGames.Log("CrazyGames: adError");
        self.adRequested = false;
        if (self.finishedCallback)
            self.finishedCallback(false);
        if (self.watchedCallback)
            self.watchedCallback({code: "ADS_NOT_LOADED", message: "ADS_NOT_LOADED"});
        self.watchedCallback = undefined;
    });
    this.crazysdk.addEventListener("adFinished", function() {
        LibCrazyGames.Log("CrazyGames: adFinished");
        self.adRequested = false;
        if (self.finishedCallback)
            self.finishedCallback(true);
        if (self.watchedCallback)
            self.watchedCallback(null);
        self.watchedCallback = undefined;
    });

    this.crazysdk.addEventListener('bannerRendered', (event) => {
        LibCrazyGames(`Banner for container ${event.containerId} has been rendered!`);
        if (self.bannerRenderedCallback)
            self.bannerRenderedCallback();
    });
    this.crazysdk.addEventListener('bannerError', (event) => {
        LibCrazyGames(`Banner render error: ${event.error}`);
        if (self.bannerErrorCallback)
            self.bannerErrorCallback();
    });
}

LibCrazyGames.prototype.addSupportedAPI = function(type)
{
    if (type === "ads")
    {
        FBInstant.supportedAPIs.push("getInterstitialAdAsync");
        FBInstant.supportedAPIs.push("getRewardedVideoAsync");
        FBInstant.supportedAPIs.push("AdInstance.loadAsync");
        FBInstant.supportedAPIs.push("AdInstance.showAsync");
    }
}

//
// Ad requests
//
LibCrazyGames.prototype.PreloadAd = function(id, type, done_cb)
{
    done_cb(null);
};

LibCrazyGames.prototype.ShowAd = function(id, type, done_cb)
{
    if (this.adRequested && type !== "banner")
    {
        LibCrazyGames.Log("CrazyGames: Ad already requested");
        done_cb({code: "ADS_NOT_LOADED", message: "ADS_NOT_LOADED"});
    }
    LibCrazyGames.Log("CrazyGames: Requesting ad");
    
    if (type === "video")
    {
        this.watchedCallback = done_cb;
        this.crazysdk.requestAd("rewarded");
		this.adRequested = true;
    }
    else
    if (type === "inter")
    {
        this.watchedCallback = done_cb;
        this.crazysdk.requestAd("midgame");
		this.adRequested = true;
    }
    else
    if (type === "banner")
    {
        this.crazysdk.requestBanner([
            {
                containerId: id.containerId,
                size: id.size,
            }
        ]);
    }
    else
    {
        done_cb({code: "ADS_NOT_LOADED", message: "ADS_NOT_LOADED"});
    }
};




