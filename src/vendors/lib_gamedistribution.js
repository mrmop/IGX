//
// Copyright (C) Mat Hopwood www.drmop.com
// For details of license see license.txt
//

function LibGameDistribution()
{
    LibGameDistribution.Log(">>>> GameDistribution: Created!");
    // NOTES:
    // Preloading is not supported
    // Interstitial is supported
    // Rewarded is supported
}

LibGameDistribution.Log = function(message)
{
    console.log(message);
}

LibGameDistribution.LogError = function(message)
{
    console.log(message);
}

//
// INIT
//

// options
// - appId - App ID provided by Game Distribution
// - startedCallback - Can be tapped into to mute audio during video playback
// - finishedCallback - Can be tapped into to unmute audio after video playback
LibGameDistribution.prototype.InitAds = function(options)
{
    LibGameDistribution.Log(">>>> GameDistribution: InitAds");
    var self = this;
    this.startedCallback = options.startedCallback;
    this.finishedCallback = options.finishedCallback;

    window["GD_OPTIONS"] = {
        "gameId": options.appId,
        "onEvent": function(event) {
            switch (event.name) {
                case "SDK_GAME_START":
                    LibGameDistribution.Log("GameDistribution: adFinished");
                    if (self.finishedCallback)
                        self.finishedCallback();
                    if (self.watchedCallback)
                        self.watchedCallback(null);
                    self.watchedCallback = undefined;
                    break;
                case "SDK_GAME_PAUSE":
                    LibGameDistribution.Log("GameDistribution: adStarted");
                    if (self.startedCallback)
                        self.startedCallback();
                    break;
                case "AD_ERROR":
                    LibGameDistribution.Log("GameDistribution: adError");
                    if (self.finishedCallback)
                        self.finishedCallback(false);
                    if (self.watchedCallback)
                        self.watchedCallback({code: "ADS_NOT_LOADED", message: "ADS_NOT_LOADED"});
                    self.watchedCallback = undefined;
                    break;
                case "SDK_ERROR":
                    LibGameDistribution.LogError("GameDistribution: SDK ERROR");
                    break;
                case "SDK_GDPR_TRACKING":
                    // this event is triggered when your user doesn't want to be tracked
                    break;
                case "SDK_GDPR_TARGETING":
                    // this event is triggered when your user doesn't want personalised targeting of ads and such
                    break;
            }
        },
    };

    var script = document.createElement("script");
    script.id = "gamedistribution-jssdk";
    script.src = "https://html5.api.gamedistribution.com/main.min.js";
    script.onload = function () {
        LibGameDistribution.Log(">>>> GameDistribution: Loaded");
    };
    document.head.appendChild(script)
}

LibGameDistribution.prototype.addSupportedAPI = function(type)
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
LibGameDistribution.prototype.PreloadAd = function(id, type, done_cb)
{
    done_cb(null);
}

LibGameDistribution.prototype.ShowAd = function(id, type, done_cb)
{
    LibGameDistribution.Log("GameDistribution: Requesting ad");
    
    if (gdsdk === undefined)
    {
        done_cb({code: "ADS_NOT_LOADED", message: "ADS_NOT_LOADED"});
        return;
    }
    if (type === "video")
    {
        this.watchedCallback = done_cb;
        gdsdk.showAd();
    }
    else
    if (type === "inter")
    {
        gdsdk.showAd();
        done_cb(null);
    }
    else
    {
        done_cb({code: "ADS_NOT_LOADED", message: "ADS_NOT_LOADED"});
    }
};




