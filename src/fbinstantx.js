//
// Copyright (C) Mat Hopwood www.drmop.com
// For details of license see license.txt
//

var FBInstant = {
    options: {
        name: "",                   // Game name
        apiKey: "",                 // Game service back-end API key
        apiSecret: "",              // Game service back-end API secret
        devMode: "sandbox",         // sandbox or prod
        container: null,            // Container element
        generalOptions: {           // General options
        },
        shareOptions: {             // Ads service options
            shareURI: "",           // URI used by shareAsync dialog
            dlgWidth: 600,          // shareAsync dialog width
            dlgHeignht: 400,        // shareAsync dialog height
        },
        adsOptions: { },            // Ads service options
        paymentsOptions: { },       // Payments service options
        analyticsOptions: { },      // Analytics service options
        storageOptions: { },        // Storage service options
        userOptions: {              // User service options
            allowAnonymous: true,   // When set to true new users will be auto logged in with an anonymous account
        },
        messagingOptions: { },      // Messaging service options
        leaderboardsOptions: { },   // Leaderboard service options
        referralsOptions: { },      // Referral service options
        chatOptions: { },           // Chat service options
    },
    supportedAPIs: [
        "initializeAsync",
        "setLoadingProgress",
        "startGameAsync",
        "getEntryPointData",
        //"updateAsync",
        //"getEntryPointAsync",
        //"switchGameAsync",
        //"logEvent",
        //"canCreateShortcutAsync",
        //"getInterstitialAdAsync",
        //"getRewardedVideoAsync",
        //"AdInstance.loadAsync",
        //"AdInstance.showAsync",
        //"context.chooseAsync",
        //"context.switchAsync",
        //"context.createAsync",
        //"context.getPlayersAsync",
    ],
    __state: {
        initialized: false,
        purchasingReadyCallback: null,
        platform: "WEB"
    },
    Log: function(message)
    {
        console.log(message);
    },
    player : {
        getName: function() {
            var data = UserService.instance.GetProfileData();
            if (data === null)
                return null;
            return data.name;
        },
        getPhoto: function() {
            var data = UserService.instance.GetProfileData();
            if (data === null)
                return null;
            return (data.photo !== undefined) ? data.photo : null;
        },
        getID: function() {
            var data = UserService.instance.GetProfileData();
            if (data === null || data === undefined)
                return null;
            return data.id;
        },
        getDataAsync: function(keys) {
            return new Promise(function(resolve, reject){
                var store_name = FBInstant.options.name + "userData";
                if (StorageService.instance !== undefined)
                {
                    StorageService.instance.GetUserData(store_name, function(data) {
                        var response = {};
                        if (data === null) {
                            data = localStorage.getItem(store_name);
                            data = JSON.parse(data);
                        }
                        else
                        {
                            localStorage.setItem(store_name, JSON.stringify(data));
                        }
                        if (data !== null) {
                            keys.forEach(function(key){
                                if (data[key] !== "undefined") {
                                    response[key] = data[key];
                                }
                            });
                        }
                        resolve(response);
                    });
                }
                else
                {
                    var response = {};
                    var data = localStorage.getItem(store_name);
                    data = JSON.parse(data);
                    if (data === null)  // TEMP: Loads previous games before storage scoping change
                    {
                        data = localStorage.getItem("userData");
                        data = JSON.parse(data);
                    }
                    if (data !== null)
                    {
                        keys.forEach(function(key){
                            if (data[key] !== "undefined") {
                                response[key] = data[key];
                            }
                        });
                    }
                    resolve(response);
                }
            });
        },
        setDataAsync: function(data_object) {
            return new Promise(function(resolve, reject) {
                var store_name = FBInstant.options.name + "userData";
                var data = localStorage.getItem(store_name);
                var obj = JSON.parse(data);
                if (obj === undefined || obj == null)
                    obj = {};
                for (var attr in data_object)
                    obj[attr] = data_object[attr];
                localStorage.setItem(store_name, JSON.stringify(obj));
                if (StorageService.instance !== undefined)
                {
                    StorageService.instance.SetUserData(store_name, JSON.stringify(obj), function(success) {
                        resolve();
                    });
                }
                else
                {
                    resolve();
                }
            });
        },
        getStatsAsync: function(keys) {
            // TODO:
        },
        setStatsAsync: function(obj) {
            return new Promise(function(resolve, reject) {
                resolve();
            });
        },
        incrementStatsAsync: function(obj) {
            // TODO:
        },
        flushDataAsync: function(obj) {
            // TODO:
        },
        getConnectedPlayersAsync: function() {
            return new Promise(function(resolve, reject) {
                UserService.instance.GetFriends(function(friends) {
                    resolve(friends);
                })
            });
        },
        getSignedPlayerInfoAsync: function() {
            // TODO:
            return new Promise(function(resolve, reject) {
                resolve(null);
            });
        },
        canSubscribeBotAsync: function() {
            // TODO:
            return new Promise(function(resolve, reject) {
                resolve(false);
            });
        },
        subscribeBotAsync: function() {
            // TODO:
            return new Promise(function(resolve, reject) {
                resolve(null);
            });
        }
    },
    context : {
        getID: function() {
            return null;
        },
        chooseAsync: function() {
            // TODO:
            return new Promise(function(resolve, reject) {
                resolve();
            });
        },
        switchAsync: function(contextId) {
            // TODO:
            return new Promise(function(resolve, reject) {
                resolve();
            });
        },
        createAsync: function(userId) {
            // TODO:
            return new Promise(function(resolve, reject) {
                resolve();
            });
        },
        getType: function() {
            // TODO:
            return "SOLO";
        },
        isSizeBetween: function(minSize, maxSize) {
            // TODO:
            return true;
        },
        getPlayersAsync: function() {
            // TDOO:
            return new Promise(function(resolve, reject) {
                var players = [];
                resolve(players);
            });
        }
    },

    payments: {
        getCatalogAsync: function() {
            return new Promise(function(resolve, reject) {
                PaymentsService.instance.GetProducts(function(error, products) {
                    if (error === null)
                        resolve(products);
                    else
                        reject(error);
                })
            });
        },
        purchaseAsync: function(options) {
            return new Promise(function(resolve, reject) {
                PaymentsService.instance.PurchaseProduct(options, function(error, purchase) {
                    if (error === null)
                        resolve(purchase);
                    else
                        reject(error);
                })
            });
        },
        getPurchasesAsync: function() {
            return new Promise(function(resolve, reject) {
                PaymentsService.instance.GetPurchases(function(error, purchases) {
                    if (error === null)
                        resolve(purchases);
                    else
                        reject(error);
                })
            });
        },
        consumePurchaseAsync: function(purchaseToken) {
            return new Promise(function(resolve, reject) {
                PaymentsService.instance.ConsumeProduct(purchaseToken, function(error) {
                    if (error === null)
                        resolve();
                    else
                        reject(error);
                })
            });
        },
        onReady: function(callback) {
            FBInstant.__state.purchasingReadyCallback = callback;
        }
    },

    getSupportedAPIs: function()
    {
        return FBInstant.supportedAPIs;
    },

    getLocale: function() {
        var data = UserService.instance.GetProfileData();
        if (data === null)
            return LibUtils.GetLocale();
        return data.lang + "_";
    },

    initializeAsync: function() {
        return new Promise(function(resolve, reject){
            var opts = FBInstant.options;
            FBInstant.Log(">>>> initializeAsync");
            GameService.instance.Init(opts);
            if (StorageService.instance !== undefined)
                StorageService.instance.InitStorage(opts.storageOptions);
            if (UserService.instance !== undefined)
                UserService.instance.InitUser(opts.usersOptions);
            if (AnalyticsService.instance !== undefined)
                AnalyticsService.instance.InitAnalytics(opts.analyticsOptions);
            if (MessagingService.instance !== undefined)
                MessagingService.instance.InitMessaging(opts.messagingOptions);
            if (ShareService.instance !== undefined)
                ShareService.instance.InitShare(opts.shareOptions);
            if (LeaderboardsService.instance !== undefined)
                LeaderboardsService.instance.InitLeaderboards(opts.leaderboardsOptions);
            if (AdsService.instance !== undefined)
                AdsService.instance.InitAds(opts.adsOptions);
            if (ReferralService.instance !== undefined)
                ReferralService.instance.InitReferrals(opts.referralsOptions);
            if (ChatService.instance !== undefined)
                ChatService.instance.InitChat(opts.chatOptions);
            if (PaymentsService.instance !== undefined)
            {
                PaymentsService.instance.InitPayments(opts.paymentsOptions, function(error) {
                    if (error === null && FBInstant.__state.purchasingReadyCallback !== null)
                        FBInstant.__state.purchasingReadyCallback();
                });
            }
            resolve();
        });
    },

    setLoadingProgress: function(progress) {
        return new Promise(function(resolve, reject) {
            if (GameService.instance && GameService.instance.service && GameService.instance.service.SetLoadingProgress)
                GameService.instance.service.SetLoadingProgress(progress);
            resolve();
        });
    },

    startGameAsync: function() {
        return new Promise(function(resolve, reject){
            FBInstant.Log(">>>> startGameAsync");
            if (GameService.instance && GameService.instance.service && GameService.instance.service.FinishedLoading)
                GameService.instance.service.FinishedLoading();
            UserService.instance.Login(FBInstant.options.userOptions.allowAnonymous, function(error, data) {
                if (error === null)
                {
                    FBInstant.__state.initialized = true;
                    FBInstant.Log(">> Login success");
                    resolve();
                }
                else
                {
                    FBInstant.Log(">> Login failed");
                    reject();
                }
            });
        });
    },

    quit: function() {
        // TODO:
    },

    updateAsync: function(config) {
        // TODO:
        return new Promise(function(resolve, reject){
            resolve();
        });
    },

    getEntryPointData: function() {
        FBInstant.Log(">>>> getEntryPointData");
        var data = window.location.search;
        if (data.startsWith("?"))
            data = data.substring(1);
        var prms = data.split('&');
        for (var t = 0; t < prms.length; t++)
        {
            if (prms[t].startsWith("data"))
            {
                var p = prms[t].split('=');
                if (p[1] !== undefined && p[1] !== "")
                {
                    data = decodeURIComponent(p[1]);
                    data = JSON.parse(data);
                    FBInstant.Log(data);
                }
                return data !== undefined ? data : null;
            }
        }
        return null;
    },

    getEntryPointAsync: function() {
        // TODO:
        return new Promise(function(resolve, reject){
            resolve('admin_message');
        });
    },

    setSessionData: function(object) {
        // TODO:
    },

    getPlatform: function() {
        return FBInstant.__state.platform;
    },

    getSDKVersion: function() {
        return '6.2';
    },

    postSessionScore: function() {
        // TODO: Will be part of lib_leaderboardservice
    },

    shareAsync: function(options) {
        return new Promise(function(resolve, reject) {
            if (ShareService.instance === undefined)
                reject({code: "CLIENT_UNSUPPORTED_OPERATION", message: "CLIENT_UNSUPPORTED_OPERATION"});
            else
            {
                ShareService.instance.SharePrimary(options);
                resolve();
            }
        });        
    },

    switchGameAsync: function(appId) {
        return Promise.reject(new Error('Not available'))
    },

    logEvent: function(eventName, value, parameters) {
        if (AnalyticsService.instance === undefined)
            return {code: "CLIENT_UNSUPPORTED_OPERATION", message: "CLIENT_UNSUPPORTED_OPERATION"};
        return AnalyticsService.instance.LogEvent(eventName, value, parameters);
    },

    onPause: function(callback) {
        window.onblur = function() {
            callback();
        };
    },

    canCreateShortcutAsync: function()
    {
        return Promise.resolve(false);
    },

    Leaderboard: function(name)
    {
        this.name = name;
    },

    getLeaderboardAsync: function(name, options)
    {
        return new Promise(function(resolve, reject) {
            var lbd = new FBInstant.Leaderboard(name);
            if (options === undefined)
                options = {};
            lbd.options = options;
            resolve(lbd);
        });
    },

    AdInstance: function(id, type)
    {
        this.id = id;
        this.type = type;
    },

    getInterstitialAdAsync: function(id)
    {
        if (AdsService.instance === undefined)
            return;
        return new Promise(function(resolve, reject) {
            if (AdsService.instance.IsSupported(id, "inter"))
                resolve(new FBInstant.AdInstance(id, "inter"));
            else
                reject({code: "CLIENT_UNSUPPORTED_OPERATION", message: "CLIENT_UNSUPPORTED_OPERATION"});
        });
    },

    getRewardedVideoAsync: function(id)
    {
        if (AdsService.instance === undefined)
            return;
        return new Promise(function(resolve, reject) {
            if (AdsService.instance.IsSupported(id, "video"))
                resolve(new FBInstant.AdInstance(id, "video"));
            else
                reject({code: "CLIENT_UNSUPPORTED_OPERATION", message: "CLIENT_UNSUPPORTED_OPERATION"});
        });
    },

    createDefaultServices: function(name)
    {
        if (name === "xtralife")
        {
            new GameService(name);
            new StorageService(name);
            new UserService(name);
            new LeaderboardsService(name);
            new MessagingService(name);
            new ReferralService(name);
            new ShareService("generic");
        }
        else if (name === "unity")
        {
            new GameService(name);
            new UserService(name);
            new AnalyticsService(name);
            new LeaderboardsService(name);
            new PaymentsService(name);
            new AdsService(name);
            new ShareService(name);
            new DebugService(name);
        }
        else if (name === "kongregate")
        {
            new GameService(name);
            new UserService(name);
            new AnalyticsService(name);
            new PaymentsService(name);
            new ShareService(name);
            new ChatService(name);
        }
        else if (name === "poki")
        {
            new GameService(name);
            new UserService("none");
            new AdsService(name);
            new ShareService("generic");
        }
        else if (name === "none")
        {
            new GameService(name);
            new UserService(name);
            new ShareService("generic");
        }
        else if (name === "swag")
        {
            new GameService(name);
            new StorageService(name);
            new UserService(name);
            new AnalyticsService(name);
            new LeaderboardsService(name);
            new ShareService("generic");
        }
    },

    matchPlayerAsync: function(matchTag, switchContextWhenMatched, offlineMatch)
    {
        // TODO: Will be part of lib_matchmakingservice
        return new Promise(function(resolve, reject) {
            reject({code: "CLIENT_UNSUPPORTED_OPERATION", message: "CLIENT_UNSUPPORTED_OPERATION"});
        });
    },

    checkCanPlayerMatchAsync : function()
    {
        // TODO: Will be part of lib_matchmakingservice
        return new Promise(function(resolve, reject) {
            reject({code: "CLIENT_UNSUPPORTED_OPERATION", message: "CLIENT_UNSUPPORTED_OPERATION"});
        });
    }
};

FBInstant.AdInstance.prototype.getPlacementID = function()
{
    return this.id;
}

FBInstant.AdInstance.prototype.loadAsync = function()
{
    if (AdsService.instance === undefined)
        return;
    var self = this;
    return new Promise(function(resolve, reject) {
        AdsService.instance.PreloadAd(self.id, self.type, function(error) {
            if (error === null)
                resolve();
            else
                reject(error);
        })
    });
}

FBInstant.AdInstance.prototype.showAsync = function()
{
    if (AdsService.instance === undefined)
        return;
    var self = this;
    return new Promise(function(resolve, reject) {
        AdsService.instance.ShowAd(self.id, self.type, function(error) {
            if (error === null)
                resolve();
            else
                reject(error);
        })
    });
}

FBInstant.Leaderboard.prototype.getEntriesAsync = function(count, start)
{
    if (LeaderboardsService.instance === undefined)
        return;
    var self = this;
    return new Promise(function(resolve, reject) {
        LeaderboardsService.instance.LeaderboardGetPaged(self, self.name, ((start / count) | 0) + 1, count, function(entries) {
            resolve(entries);
        });
    })
}

FBInstant.Leaderboard.prototype.getConnectedPlayerEntriesAsync = function(count, start)
{
    if (LeaderboardsService.instance === undefined)
        return;
    var self = this;
    return new Promise(function(resolve, reject) {
        LeaderboardsService.instance.LeaderboardGetFriendsPaged(self, self.name, ((start / count) | 0) + 1, count, function(entries) {
            resolve(entries);
        });
    })
}

FBInstant.Leaderboard.prototype.getPlayerEntryAsync = function()
{
    if (LeaderboardsService.instance === undefined)
        return;
    var self = this;
    return new Promise(function(resolve, reject) {
        LeaderboardsService.instance.LeaderboardGetRank(self, self.name, function(entry) {
            resolve(entry);
        });
    })
}

FBInstant.Leaderboard.prototype.setScoreAsync = function(score, meta)
{
    if (LeaderboardsService.instance === undefined)
        return;
    var self = this;
    return new Promise(function(resolve, reject) {
        LeaderboardsService.instance.LeaderboardSetScore(self, self.name, score, meta, function(entry) {
            resolve(entry);
        });
    })
}


