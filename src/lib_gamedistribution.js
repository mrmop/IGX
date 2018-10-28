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
LibGameDistribution.prototype.Init = function(options)
{
    LibGameDistribution.Log(">>>> GameDistribution: Init");
    var self = this;
    this.startedCallback = options.startedCallback;
    this.finishedCallback = options.finishedCallback;

    window["GD_OPTIONS"] = {
        "gameId": options.appId,
        "onEvent": function(event) {
            switch (event.name) {
                case "SDK_GAME_START":
                    LibGameDistribution.Log("GameDistribution: adFinished");
                    if (self.finishedCallback !== undefined)
                        self.finishedCallback();
                    if (self.watchedCallback !== undefined)
                        self.watchedCallback(null);
                    self.watchedCallback = undefined;
                    break;
                case "SDK_GAME_PAUSE":
                    LibGameDistribution.Log("GameDistribution: adStarted");
                    if (self.startedCallback !== undefined)
                        self.startedCallback();
                    break;
                case "AD_ERROR":
                    LibGameDistribution.Log("GameDistribution: adError");
                    if (self.finishedCallback !== undefined)
                        self.finishedCallback(false);
                    if (self.watchedCallback !== undefined)
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
        console.log(">>>>>>>> main.min.js loaded")
    };
    document.head.appendChild(script)
}

LibGameDistribution.prototype.IsAdsSupported = function(type)
{
    return true;
}

LibGameDistribution.prototype.IsPaymentsSupported = function(type)
{
    return false;
}

//
// Ad requests
//
LibGameDistribution.prototype.PreloadAd = function(id, type, done_callback)
{
    done_callback(null);
}

LibGameDistribution.prototype.ShowAd = function(id, type, done_callback)
{
    LibGameDistribution.Log("GameDistribution: Requesting ad");
    console.log(gdsdk);
    console.log(window.gdsdk);
    
    if (typeof gdsdk !== "undefined" && gdsdk.showBanner !== "undefined")
    {
        done_callback(null);
    }
    if (type === "video")
    {
        this.watchedCallback = done_callback;
        gdsdk.showBanner();
    }
    else
    if (type === "inter")
    {
        gdsdk.showBanner();
        done_callback(null);
    }
    else
    {
        done_callback(null);
    }
};




