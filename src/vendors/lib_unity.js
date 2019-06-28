//
// Copyright (C) Mat Hopwood www.drmop.com
// For details of license see license.txt
//

function LibUnity()
{
    LibUnity.Log(">>>> Unity: construct");
    this.iap_init = false;
    this.profile = new UserService.Player("User", "", "", "", "us");
    this.gamerData = null;
}

LibUnity.Log = function(message)
{
    console.log(message);
}

LibUnity.LogError = function(message)
{
    console.log(message);
}
LibUnity.MessageQ = [];
LibUnity.MessageQSendInterval = 50;

LibUnity.SendMessages = function(message)
{
    if (LibUnity.MessageQ.length > 0)
    {
        window.location.href = "igx://" + LibUnity.MessageQ[0];
        LibUnity.MessageQ.shift();
    }
}
setInterval(LibUnity.SendMessages, LibUnity.MessageQSendInterval);

// NB: You cannot send more than one message per frame to Unity so they have to be queued
LibUnity.SendMessageToUnity = function(message)
{
    LibUnity.MessageQ.push(message);
}

LibUnity.ShowAdCallback = function(message)
{
    LibUnity.Log(">>>> Unity: ShowAdCallback " + message);
    var service = AdsService.instance.service;
    if (message === "ok")
    {
        var callback = service.watchedCallback;
        if (callback !== undefined)
            callback(null);
        if (service.finishedCallback !== undefined)
            service.finishedCallback(true);
        service.watchedCallback = undefined;
    }
    else if (message === "error" || message === "skip")
    {
        var callback = service.watchedCallback;
        if (callback !== undefined)
            callback({code: "ADS_NOT_LOADED", message: "ADS_NOT_LOADED"});
        if (service.finishedCallback !== undefined)
            service.finishedCallback(false);
        service.watchedCallback = undefined;
    }
}

LibUnity.LoadAdCallback = function(message)
{
    LibUnity.Log(">>>> Unity: LoadAdCallback " + message);
    var service = AdsService.instance.service;
    if (message === "ok")
    {
        if (service.loadCallback !== undefined)
        {
            service.loadCallback(null, null);
        }
        service.loadCallback = undefined;
    }
    else if (message === "error")
    {
        if (service.loadCallback !== undefined)
        {
            service.loadCallback({code: "ADS_NOT_LOADED", message: "ADS_NOT_LOADED"});
        }
        service.loadCallback = undefined;
    }
}

LibUnity.LoadRewardedAdCallback = function(message)
{
    LibUnity.Log(">>>> Unity: LoadAdCallback " + message);
    var service = AdsService.instance.service;
    if (message === "ok")
    {
        if (service.loadRewardedCallback !== undefined)
        {
            service.loadRewardedCallback(null, null);
        }
        service.loadRewardedCallback = undefined;
    }
    else if (message === "error")
    {
        if (service.loadRewardedCallback !== undefined)
        {
            service.loadRewardedCallback({code: "ADS_NOT_LOADED", message: "ADS_NOT_LOADED"});
        }
        service.loadRewardedCallback = undefined;
    }
}

LibUnity.IAPCallback = function(message, products)
{
    LibUnity.Log(">>>> Unity: IAPCallback " + message);
    var service = PaymentsService.instance.service;
    if (message === "success")
    {
        // Upate product prices
        var product_info = FBInstant.options.paymentsOptions.products;
        for (var product in product_info)
        {
            for (var t = 0; t < products.length; t++)
            {
                if (product_info[product].productID === products[t].id)
                {
                    product_info[product].price = products[t].price;
                    //console.log(">>>>>>>> JS: " + product_info[product].productID + " - " + product_info[product].price);
                }
            }
        }
        service.iap_init = true;
        service.iap_initialised(null);
    }
    else if (message === "error")
    {
        service.iap_init = false;
        service.iap_initialised();
    }
}

LibUnity.PurchaseCallback = function(message, product_id)
{
    LibUnity.Log(">>>> Unity: PurchaseCallback " + message);
    var service = PaymentsService.instance.service;
    if (message === "success")
    {
        if (service.purchase_complete !== undefined)
        {
            service.purchase_complete(null, new PaymentsService.Purchase("", "", product_id, Date.now, "", null));
            service.purchase_complete = undefined;
        }
    }
    else if (message === "error")
    {
        if (service.purchase_complete !== undefined)
        {
            service.purchase_complete({code: "NETWORK_FAILURE", message: "NETWORK_FAILURE"}, null);
            service.purchase_complete = undefined;
        }
    }
}

LibUnity.LoginCallback = function(success, user)
{
    LibUnity.Log(">>>> Unity: LoginCallback " + success);
    var service = UserService.instance.service;
    if (service.login_complete !== undefined)
    {
        if (success)
        {
            service.gamerData = { network: "unity" };
            service.login_complete(null, user);
        }
        else
        {
            service.login_complete({code: "NETWORK_FAILURE", message: "NETWORK_FAILURE"}, user);
        }
        service.login_complete = undefined;
        service.profile = user;
    }
}

LibUnity.SetScoreCallback = function(success)
{
    LibUnity.Log(">>>> Unity: SubmitScoreCallback");
    var service = LeaderboardsService.instance.service;
    if (service.setscore_complete !== undefined)
    {
        service.setscore_complete(success);
        service.setscore_complete = undefined;
    }
}

LibUnity.LoadPlayerScoreCallback = function(entry)
{
    LibUnity.Log(">>>> Unity: LoadPlayerScoreCallback");
    var service = LeaderboardsService.instance.service;
    if (service.getscore_complete !== undefined)
    {
        if (entry !== null)
            service.getscore_complete(entry);
        else
            service.getscore_complete(null);
        service.getscore_complete = undefined;
    }
}

LibUnity.LoadScoresCallback = function(entries)
{
    LibUnity.Log(">>>> Unity: LoadScoresCallback");
    var service = LeaderboardsService.instance.service;
    if (service.loadscores_complete !== undefined)
    {
        if (entries !== null)
            service.loadscores_complete(entries);
        else
            service.loadscores_complete(null);
        service.loadscores_complete = undefined;
    }
}

LibUnity.SetLocale = function(locale)
{
    var service = UserService.instance.service;
    service.profile.lang = locale;
}

//
// INIT
//
LibUnity.prototype.Init = function(options)
{
    LibUnity.Log(">>>> Unity: Init");
    LibUnity.SendMessageToUnity("init");
}

// options
// - startedCallback - Can be tapped into to mute audio during video playback
// - finishedCallback - Can be tapped into to unmute audio after video playback
LibUnity.prototype.InitAds = function(options)
{
    LibUnity.Log(">>>> Unity: InitAds");
    this.startedCallback = options.startedCallback;
    this.finishedCallback = options.finishedCallback;
    LibUnity.SendMessageToUnity("initAds" + options.vendor + "," + options.appId);
}

LibUnity.prototype.InitAnalytics = function(options)
{
}

LibUnity.prototype.InitPayments = function(options, done_cb)
{
    LibUnity.Log(">>>> Unity: InitPayments");
    var self = this;
    this.iap_initialised = done_cb;
    var product_info = FBInstant.options.paymentsOptions.products;
    var products = "";
    for (var product in product_info)
    {
        products += product_info[product].productID + ",";
    }
    LibUnity.SendMessageToUnity("initIAP" + products);
}

LibUnity.prototype.InitUser = function(options)
{
    LibUnity.Log(">>>> Unity: InitUser");
    LibUnity.SendMessageToUnity("initSocial");
}

LibUnity.prototype.InitLeaderboards = function(options)
{
}

LibUnity.prototype.InitShare = function(options)
{
}

LibUnity.prototype.addSupportedAPI = function(type)
{
    if (type === "leaderboards")
    {
        FBInstant.supportedAPIs.push("Leaderboard.getEntriesAsync");
        FBInstant.supportedAPIs.push("Leaderboard.getConnectedPlayerEntriesAsync");
        FBInstant.supportedAPIs.push("Leaderboard.getPlayerEntryAsync");
        FBInstant.supportedAPIs.push("Leaderboard.setScoreAsync");
        FBInstant.supportedAPIs.push("getLeaderboardAsync");
        FBInstant.supportedAPIs.push("ext.showLeaderboard");
    }
    else if (type === "user")
    {
        FBInstant.supportedAPIs.push("getLocale");
        FBInstant.supportedAPIs.push("player.getConnectedPlayersAsync");
        FBInstant.supportedAPIs.push("ext.isLoggedIn");
        FBInstant.supportedAPIs.push("ext.loginAsync");
    }
    else if (type === "share")
    {
        FBInstant.supportedAPIs.push("shareAsync");
    }
    else if (type === "ads")
    {
        FBInstant.supportedAPIs.push("getInterstitialAdAsync");
        FBInstant.supportedAPIs.push("getRewardedVideoAsync");
        FBInstant.supportedAPIs.push("AdInstance.loadAsync");
        FBInstant.supportedAPIs.push("AdInstance.showAsync");
    }
    else if (type === "analytics")
    {
        FBInstant.supportedAPIs.push("logEvent");
    }
    else if (type === "payments")
    {
        FBInstant.supportedAPIs.push("payments.getCatalogAsync");
        FBInstant.supportedAPIs.push("payments.purchaseAsync");
        FBInstant.supportedAPIs.push("payments.getPurchasesAsync");
        FBInstant.supportedAPIs.push("payments.consumePurchaseAsync");
        FBInstant.supportedAPIs.push("payments.purchaseAsync");
    }
    else if (type === "debug")
    {
        FBInstant.supportedAPIs.push("ext.debug.show");
        FBInstant.supportedAPIs.push("ext.debug.log");
    }
}

//
// LOGIN AND ACCOUNTS
//
LibUnity.prototype.Login = function(allow_anonymous, done_cb)
{
    if (allow_anonymous)
    {
        LibUnity.Log(">>>> LibUnity: Anonymous login");
        if (done_cb !== undefined)
            done_cb(null, null);
    }
    else
    {
        this.login_complete = done_cb;
        LibUnity.SendMessageToUnity("login");
    }
}

//
// PROFILE
//
LibUnity.prototype.GetProfileData = function()
{
    return this.profile;
}

LibUnity.prototype.SetProfile = function(profile)
{
    this.profile = profile;
}

LibUnity.prototype.GetFriends = function(done_cb)
{
    if (done_cb !== undefined)
        done_cb([]);
}

//
// Ad requests
//
LibUnity.prototype.PreloadAd = function(id, type, done_cb)
{
    LibUnity.Log("Unity: Loading ad");
    
    if (type === "video")
    {
        this.loadRewardedCallback = done_cb;
        LibUnity.SendMessageToUnity("loadVideo");
    }
    else
    if (type === "inter")
    {
        this.loadCallback = done_cb;
        LibUnity.SendMessageToUnity("loadInter");
    }
    else
    {
        done_cb({code: "ADS_NOT_LOADED", message: "ADS_NOT_LOADED"});
    }
}

LibUnity.prototype.ShowAd = function(id, type, done_cb)
{
    LibUnity.Log("Unity: Showing ad");
    
    if (type === "video")
    {
        this.watchedCallback = done_cb;
        LibUnity.SendMessageToUnity("showVideo");
        if (this.startedCallback !== undefined)
            this.startedCallback();
    }
    else
    if (type === "inter")
    {
        LibUnity.SendMessageToUnity("showInter");
        done_cb(null);
        if (this.startedCallback !== undefined)
            this.startedCallback();
    }
    else
    {
        done_cb({code: "ADS_NOT_LOADED", message: "ADS_NOT_LOADED"});
    }
}

//
// ANALYTICS
//
LibUnity.prototype.LogEvent = function(event_name, value, params)
{
    var data = "logEvent" + event_name;
    for (var p in params)
    {
        data += "," + p + "," + params[p];
    }
    LibUnity.SendMessageToUnity(data);
    return null;
}

//
// PURCHASING
//
LibUnity.prototype.GetProducts = function(done_cb)
{
    done_cb(null, FBInstant.options.paymentsOptions.products);
}

LibUnity.prototype.PurchaseProduct = function(options, done_cb)
{
    if (!this.iap_init)
    {
        done_cb({code: "PAYMENTS_NOT_INITIALIZED", message: "PAYMENTS_NOT_INITIALIZED"}, null);
        return;
    }

    var gopt = FBInstant.options.paymentsOptions;
    this.purchase_complete = done_cb;
    LibUnity.SendMessageToUnity("purchase" + options.productID);
}

LibUnity.prototype.RefundProduct = function(options, done_cb)
{
    done_cb({code: "CLIENT_UNSUPPORTED_OPERATION", message: "CLIENT_UNSUPPORTED_OPERATION"}, null);
}

LibUnity.prototype.ConsumeProduct = function(purchaseToken, done_cb)
{
    done_cb({code: "CLIENT_UNSUPPORTED_OPERATION", message: "CLIENT_UNSUPPORTED_OPERATION"}, null);
}

LibUnity.prototype.GetPurchases = function(done_cb)
{
    done_cb({code: "CLIENT_UNSUPPORTED_OPERATION", message: "CLIENT_UNSUPPORTED_OPERATION"}, null);
}

//
// LEADERBOARDS
//
LibUnity.prototype.LeaderboardGetPaged = function(lbd, board_name, page_number, count, done_cb)
{
    this.loadscores_complete = done_cb;
    LibUnity.SendMessageToUnity("scores" + board_name + ",global");
}

LibUnity.prototype.LeaderboardGetFriendsPaged = function(lbd, board_name, page_number, count, done_cb)
{
    this.loadscores_complete = done_cb;
    LibUnity.SendMessageToUnity("scores" + board_name + ",friends");
}

LibUnity.prototype.LeaderboardGetRank = function(lbd, board_name, done_cb)
{
    this.getscore_complete = done_cb;
    LibUnity.SendMessageToUnity("getscore" + board_name);
}

LibUnity.prototype.LeaderboardSetScore = function(lbd, board_name, score, extra, done_cb)
{
    this.setscore_complete = done_cb;
    LibUnity.SendMessageToUnity("setscore" + board_name + "," + score);
}

LibUnity.prototype.ShowLeaderboard = function(options)
{
    LibUnity.SendMessageToUnity("showlbd");
}

//
// SHARING
//
LibUnity.prototype.SharePrimary = function(options)
{
    if (options.image !== undefined)
    {
		var data = options.image.replace(/^data:image\/(png|jpeg);base64,/, "");
        // Upload the image
		data = data.replace(/\+/g, "$");   // // WebView strips out + signs so we have to replace them then put them back Unity side
        var len = data.length;
        console.log("########## Total len " + len);
        var index = 0;
        var chunk_size = 15000;
        while (len > 0)
        {
            if (len < chunk_size)
                LibUnity.SendMessageToUnity("ud" + data.substr(index, len));
            else
                LibUnity.SendMessageToUnity("ud" + data.substr(index, chunk_size));
            index += chunk_size;
            len -= chunk_size;
            console.log("########## " + len);
        }
        LibUnity.SendMessageToUnity("share" + options.title + "," + options.text + "," + "image");
    }
    else
        LibUnity.SendMessageToUnity("share" + options.title + "," + options.text + ",");
}

LibUnity.prototype.OpenURL = function(options)
{
    LibUnity.SendMessageToUnity("openurl" + options.url);
}

//
// DEBUG
//
LibUnity.prototype.ShowDebug = function(options)
{
    if (options === true)
        LibUnity.SendMessageToUnity("showdbg1");
    else
        LibUnity.SendMessageToUnity("showdbg0");
}

LibUnity.prototype.ClearDebug = function()
{
    LibUnity.SendMessageToUnity("clog");
}

LibUnity.prototype.LogDebug = function(string)
{
    LibUnity.SendMessageToUnity("dlog" + string);
}

