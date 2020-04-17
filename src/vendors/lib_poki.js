//
// Copyright (C) Mat Hopwood www.drmop.com
// For details of license see license.txt
//

function LibPoki()
{
    // NOTES:
    // Preloading is not supported
    // Interstitial is supported
    // Rewarded is supported
}

LibPoki.Log = function(message)
{
    console.log(message);
}

LibPoki.LogError = function(message)
{
    console.log(message);
}

//
// INIT
//

LibPoki.prototype.Init = function(options)
{
    LibPoki.Log(">>>> Poki: Init");

    var start_loading = function()
    {
        PokiSDK.gameLoadingStart();
    }

    PokiSDK.init().then(start_loading)
    .catch(
        () => {
            LibPoki.Log('>>>> adblock');
            start_loading();
        }
     );
}

// options
// - startedCallback - Can be tapped into to mute audio during video playback
// - finishedCallback - Can be tapped into to unmute audio after video playback
LibPoki.prototype.InitAds = function(options)
{
    LibPoki.Log(">>>> Poki: InitAds");
    this.adfinished_callback = options.finishedCallback;
    this.adstarted_callback = options.startedCallback;
}

LibPoki.prototype.addSupportedAPI = function(type)
{
    if (type === "ads")
    {
        FBInstant.supportedAPIs.push("getInterstitialAdAsync");
        FBInstant.supportedAPIs.push("getRewardedVideoAsync");
        FBInstant.supportedAPIs.push("AdInstance.loadAsync");
        FBInstant.supportedAPIs.push("AdInstance.showAsync");
        FBInstant.supportedAPIs.push("setLoadingProgress");
    }
}

//
// GameService
//
LibPoki.prototype.SetLoadingProgress = function(progress)
{
    PokiSDK.gameLoadingProgress({
        percentageDone: progress / 10
    });
}

LibPoki.prototype.FinishedLoading = function(progress)
{
    PokiSDK.gameLoadingFinished();
}

//
// Ad requests
//
LibPoki.prototype.PreloadAd = function(id, type, done_cb)
{
    done_cb(null);
};

LibPoki.prototype.ShowAd = function(id, type, done_cb)
{
    LibPoki.Log("Poki: Requesting ad");

    var self = this;
    if (type === "video")
    {
        if (this.adstarted_callback)
            this.adstarted_callback();
        PokiSDK.rewardedBreak().then(
            (rewarded) => {
                LibPoki.Log("Poki: rewarded ad done " + rewarded);
                if (rewarded)
                    done_cb(null);
                else
                    done_cb({code: "ADS_NOT_LOADED", message: "ADS_NOT_LOADED"});
                if (self.adfinished_callback)
                    self.adfinished_callback();
            }
        )        
    }
    else
    if (type === "inter")
    {
        if (this.adstarted_callback)
            this.adstarted_callback();
        PokiSDK.commercialBreak()
        .then(() => {
            LibPoki.Log("Poki: inter ad done");
            done_cb(null);
            if (self.adfinished_callback)
                self.adfinished_callback();
        });
    }
    else
    {
        done_cb({code: "ADS_NOT_LOADED", message: "ADS_NOT_LOADED"});
    }
};

//
// Events
//
LibPoki.prototype.GameEvent = function(options)
{
    if (options.type === "gameplayStart")
        PokiSDK.gameplayStart();
    else
    if (options.type === "gameplayStop")
        PokiSDK.gameplayStop();
    else
    if (options.type === "happyTime")
        PokiSDK.happyTime(options.value);
}




