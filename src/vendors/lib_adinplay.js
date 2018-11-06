//
// Copyright (C) Mat Hopwood www.drmop.com
// For details of license see license.txt
//

function LibAdInPlay()
{
    // NOTES:
    // Preloading is not supported
    // Interstitial is supported
    // Rewarded is supported
}

LibAdInPlay.Log = function(message)
{
    console.log(message);
}

LibAdInPlay.LogError = function(message)
{
    console.log(message);
}

//
// INIT
//

// options
// - adWidth - The width of the ad holder (default is 960)
// - adHeight - The height  of the ad holder (default is 540)
// - startedCallback - Can be tapped into to mute audio during video playback
// - finishedCallback - Can be tapped into to unmute audio after video playback
LibAdInPlay.prototype.InitAds = function(options)
{
    LibAdInPlay.Log("LibAdInPlay: InitAds");

    this.adWidth = 960;
    this.adHeight = 540;
    if (options.adWidth !== undefined)
        this.adWidth = options.adWidth;
    if (options.adHeight !== undefined)
        this.adHeight = options.adHeight;
    this.startedCallback = options.startedCallback;
    this.finishedCallback = options.finishedCallback;
}

LibAdInPlay.prototype.addSupportedAPI = function(type)
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
LibAdInPlay.prototype.PreloadAd = function(id, type, done_cb)
{
    done_cb(null);
};

LibAdInPlay.prototype.ShowAd = function(id, type, done_cb)
{
    LibAdInPlay.Log("LibAdInPlay: Requesting ad");

    var self = this;
    if (this.aiptag === undefined)
    {
        this.aiptag = aiptag || {};
        this.aiptag.cmd = this.aiptag.cmd || [];
        this.aiptag.cmd.player = this.aiptag.cmd.player || [];
        // Settings
        this.aiptag.consented = true; // GDPR setting, please set this value to false if an EU user has declined or not yet accepted marketing cookies, for users outside the EU please use true and for users accepted the GDPR also use true
        this.aiptag.cmd.player.push(function() {
            adplayer = new aipPlayer({
                AD_WIDTH: self.adWidth,
                AD_HEIGHT: self.adHeight,
                AD_FULLSCREEN: false,
                AD_CENTERPLAYER: false,
                LOADING_TEXT: 'loading advertisement',
                PREROLL_ELEM: function(){return document.getElementById('preroll')},
                AIP_COMPLETE: function ()  {
                    LibAdInPlay.Log("AdInPlay: adFinished");
                    self.adRequested = false;
                    if (self.finishedCallback !== undefined)
                        self.finishedCallback(true);
                    if (self.watchedCallback !== undefined)
                        self.watchedCallback(null);
                    self.watchedCallback = undefined;
                },
                AIP_REMOVE: function ()  {
                    // Here it's save to remove the PREROLL_ELEM from the page.
                    // But it's not necessary.
                }
            });
        });
    }

    if (this.aiptag === undefined)
    {
        done_cb({code: "ADS_NOT_LOADED", message: "ADS_NOT_LOADED"});
        return;
    }

    if (type === "video")
    {
        this.watchedCallback = done_cb;
        this.aiptag.cmd.player.push(function() { adplayer.startPreRoll(); });
        if (this.startedCallback !== undefined)
            this.startedCallback();
    }
    else
    if (type === "inter")
    {
        this.aiptag.cmd.player.push(function() { adplayer.startPreRoll(); });
        done_cb(null);
        if (this.startedCallback !== undefined)
            this.startedCallback();
    }
    else
    {
        done_cb({code: "ADS_NOT_LOADED", message: "ADS_NOT_LOADED"});
    }
};




