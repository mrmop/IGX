//
// Copyright (C) Mat Hopwood www.drmop.com
// For details of license see license.txt
//

var FBInstant = {
    options: {
        AllowAnonymous: true,   // When set to true new users will be auto logged in with an anonymous account
        ApiKey: "",             // Game service back-end API key
        ApiSecret: "",          // Game service back-end API secret
        DevMode: "sandbox",     // sandbox or prod
        ShareURI: "http://yourdomain.com/index.php", // URI used by shareAsync dialog
        ShareDlgWidth: 600,     // shareAsync dialog width
        ShareDlgHeight: 400,    // shareAsync dialog height
        AdsOptions: { },        // Ads options
    },
    supportedAPIs: [
        "player.getDataAsync",
        "player.setDataAsync",
        "player.getConnectedPlayersAsync",
        "getLocale",
        "initializeAsync",
        "setLoadingProgress",
        "startGameAsync",
        "getEntryPointData",
        "shareAsync",
        "Leaderboard.getEntriesAsync",
        "Leaderboard.getConnectedPlayerEntriesAsync",
        "Leaderboard.getPlayerEntryAsync",
        "Leaderboard.setScoreAsync",
        "getLeaderboardAsync",
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
        //"payments.getCatalogAsync",
        //"payments.purchaseAsync",
        //"payments.getPurchasesAsync",
        //"payments.consumePurchaseAsync",
        //"payments.purchaseAsync",
        "ext.isLoggedIn",
        "ext.getLoginType",
        "ext.getRegistrationDate",
        "ext.loginWithShortCodeAsync",
        "ext.loginAnonymouslyAsync",
        "ext.loginWithEmailAsync",
        "ext.loginWithFacebookAccessTokenAsync",
        "ext.logoutAsync",
        "ext.convertAccountAsync",
        "ext.linkAccountAsync",
        "ext.resetPasswordAsync",
        "ext.changePasswordAsync",
        "ext.getGames",
        "ext.setProfileAsync",
        "ext.addFriendAsync",
        "ext.removeFriendAsync",
        "ext.listUsersAsync",
        "ext.sendEventAsync",
        "ext.getEventsAsync",
        "ext.getReferralCodeAsync",
        "ext.useReferralCodeAsync",
        "ext.shareTwitterAsync",
    ],
    __state: {
        initialized: false
    },
    Log: function(message)
    {
        console.log(message);
    },
    player : {
        getName: function() {
            var data = GameService.instance.GetProfileData();
            if (data === null)
                return null;
            return data.name;
        },
        getPhoto: function() {
            var data = GameService.instance.GetProfileData();
            if (data === null)
                return null;
            var photo = data.photo;
            console.log("photo = " + photo);
            return (photo !== undefined) ? photo : null;
        },
        getID: function() {
            var data = GameService.instance.GetGamerData();
            if (data === null)
                return null;
            return data.gamer_id;
        },
        getDataAsync: function(keys) {
            return new Promise(function(resolve, reject){
                GameService.instance.GetUserData("userData", function(data) {
                    var response = {};
                    if (data === null) {
                        data = localStorage.getItem("userData");
                        data = JSON.parse(data);
                    }
                    else
                    {
                        localStorage.setItem("userData", JSON.stringify(data));
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
            });
        },
        setDataAsync: function(data_object) {
            return new Promise(function(resolve, reject) {
                var data = localStorage.getItem("userData");
                var obj = JSON.parse(data);
                if (obj === undefined || obj == null)
                    obj = {};
                for (var attr in data_object)
                    obj[attr] = data_object[attr];
                localStorage.setItem("userData", JSON.stringify(obj));
                GameService.instance.SetUserData("userData", JSON.stringify(obj), function(success) {
                    resolve();
                });
            });
        },
        getStatsAsync: function(keys) {
            // TODO:
        },
        setStatsAsync: function(obj) {
            // TODO:
        },
        incrementStatsAsync: function(obj) {
            // TODO:
        },
        flushDataAsync: function(obj) {
            // TODO:
        },
        getConnectedPlayersAsync: function() {
            return new Promise(function(resolve, reject) {
                GameService.instance.GetFriends(function(friends) {
                    resolve(friends);
                })
            });
        },
        getSignedPlayerInfoAsync: function() {
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
            // TODO:
            return new Promise(function(resolve, reject) {
                reject();
            });
        },
        purchaseAsync: function(product) {
            // TODO:
            return new Promise(function(resolve, reject) {
                reject();
            });
        },
        getPurchasesAsync: function() {
            // TODO:
            return new Promise(function(resolve, reject) {
                reject();
            });
        },
        consumePurchaseAsync: function(purchaseToken) {
            // TODO:
            return new Promise(function(resolve, reject) {
                reject();
            });
        },
        onReady: function(callback) {
        }
    },

    getSupportedAPIs: function()
    {
        return FBInstant.supportedAPIs;
    },

    getLocale: function() {
        var data = GameService.instance.GetProfileData();
        if (data === null)
            return "en_US";
        return data.lang + "_";
    },

    initializeAsync: function() {
        return new Promise(function(resolve, reject){
            FBInstant.Log(">>>> initializeAsync");
            var options = FBInstant.options;
            GameService.instance.Init(options.ApiKey, options.ApiSecret, options.DevMode);
            if (AdsService.instance !== undefined)
                AdsService.instance.Init(options.AdsOptions);
            resolve();
        });
    },

    setLoadingProgress: function(progress) {
        return new Promise(function(resolve, reject) {
            resolve();
        });
    },

    startGameAsync: function() {
        return new Promise(function(resolve, reject){
            FBInstant.Log(">>>> startGameAsync");
            GameService.instance.LoginAnonymously(FBInstant.options.AllowAnonymous, function(error, data) {
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
        return 'WEB';
    },

    getSDKVersion: function() {
        return '6.2';
    },

    shareAsync: function(options) {
        return new Promise(function(resolve, reject) {
            var title = (options.title !== undefined) ? options.title : "";
            var message = options.text;
            var url = encodeURIComponent(FBInstant.options.ShareURI + "?t=" + title + "&d=" + message);
            if (options.data !== undefined)
                url += "&data=" + JSON.stringify(options.data);
            window.open('https://www.facebook.com/sharer/sharer.php?u=' + url, 'pop', 'width=' + FBInstant.options.ShareDlgWidth + ', height=' + FBInstant.options.ShareDlgHeight + ', scrollbars=no');
            resolve();
        });        
    },

    switchGameAsync: function(appId) {
        return Promise.reject(new Error('Not available'))
    },

    logEvent: function(eventName, value, parameters) {
        // TODO:
        return null;
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

    getLeaderboardAsync: function(name)
    {
        return new Promise(function(resolve, reject) {
            resolve(new FBInstant.Leaderboard(name));
        });
    },

    AdInstance: function(id, type)
    {
        this.id = id;
        this.type = type;
    },

    getInterstitialAdAsync: function(id)
    {
        return new Promise(function(resolve, reject) {
            if (AdsService.instance.IsSupported(id, "inter"))
                resolve(new FBInstant.AdInstance(id, "inter"));
            else
                reject({code: "CLIENT_UNSUPPORTED_OPERATION", message: "CLIENT_UNSUPPORTED_OPERATION"});
        });
    },

    getRewardedVideoAsync: function(id)
    {
        return new Promise(function(resolve, reject) {
            if (AdsService.instance.IsSupported(id, "video"))
                resolve(new FBInstant.AdInstance(id, "video"));
            else
                reject({code: "CLIENT_UNSUPPORTED_OPERATION", message: "CLIENT_UNSUPPORTED_OPERATION"});
        });
    },
};

FBInstant.AdInstance.prototype.getPlacementID = function()
{
    return this.id;
}

FBInstant.AdInstance.prototype.loadAsync = function()
{
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
    var self = this;
    return new Promise(function(resolve, reject) {
        GameService.instance.LeaderboardGetPaged(self.name, ((start / count) | 0) + 1, count, function(entries) {
            resolve(entries);
        });
    })
}

FBInstant.Leaderboard.prototype.getConnectedPlayerEntriesAsync = function(count, start)
{
    var self = this;
    return new Promise(function(resolve, reject) {
        GameService.instance.LeaderboardGetFriendsPaged(self.name, ((start / count) | 0) + 1, count, function(entries) {
            resolve(entries);
        });
    })
}

FBInstant.Leaderboard.prototype.getPlayerEntryAsync = function()
{
    var self = this;
    return new Promise(function(resolve, reject) {
        GameService.instance.LeaderboardGetRank(self.name, function(entry) {
            resolve(entry);
        });
    })
}

FBInstant.Leaderboard.prototype.setScoreAsync = function(score, meta)
{
    var self = this;
    return new Promise(function(resolve, reject) {
        GameService.instance.LeaderboardSetScore(self.name, "hightolow", score, meta, function(entry) {
            resolve(entry);
        });
    })
}


