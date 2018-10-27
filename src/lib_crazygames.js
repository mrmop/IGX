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
LibCrazyGames.prototype.Init = function(options)
{
    LibCrazyGames.Log(">>>> CrazyGames: Init");
    var self = this;
    this.crazysdk  = window.CrazyGames.CrazySDK.getInstance();
    
    this.adRequested = false;
    this.startedCallback = options.startedCallback;
    this.finishedCallback = options.finishedCallback;

    this.crazysdk.init();

    this.crazysdk.addEventListener("adStarted", function() {
        LibCrazyGames.Log("CrazyGames: adStarted");
        if (self.startedCallback !== undefined)
            self.startedCallback();
    });
    this.crazysdk.addEventListener("adError", function() {
        LibCrazyGames.Log("CrazyGames: adError");
        self.adRequested = false;
        if (self.finishedCallback !== undefined)
            self.finishedCallback(false);
        if (self.watchedCallback !== undefined)
            self.watchedCallback({code: "ADS_NOT_LOADED", message: "ADS_NOT_LOADED"});
        self.watchedCallback = undefined;
    });
    this.crazysdk.addEventListener("adFinished", function() {
        LibCrazyGames.Log("CrazyGames: adFinished");
        self.adRequested = false;
        if (self.finishedCallback !== undefined)
            self.finishedCallback(true);
        if (self.watchedCallback !== undefined)
            self.watchedCallback(null);
        self.watchedCallback = undefined;
    });
}

LibCrazyGames.prototype.IsSupported = function(type)
{
    return true;
}

//
// Ad requests
//
LibCrazyGames.prototype.PreloadAd = function(id, type, done_callback)
{
    done_callback(null);
};

LibCrazyGames.prototype.ShowAd = function(id, type, done_callback)
{
    if (this.adRequested)
    {
        LibCrazyGames.Log("CrazyGames: Ad already requested");
        self.watchedCallback({code: "ADS_NOT_LOADED", message: "ADS_NOT_LOADED"});
    }
    LibCrazyGames.Log("CrazyGames: Requesting ad");
    
    this.adRequested = true;
    if (type === "video")
    {
        this.watchedCallback = done_callback;
        this.crazysdk.requestAd("rewarded");
    }
    else
    if (type === "inter")
    {
        this.crazysdk.requestAd("midgame");
        done_callback(null);
    }
    else
    {
        done_callback(null);
    }
};




