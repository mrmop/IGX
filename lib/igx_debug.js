//
// Copyright (C) Mat Hopwood www.drmop.com
// For details of license see license.txt
//

var FBInstant = {
    options: {
        apiKey: "",                 // Game service back-end API key
        apiSecret: "",              // Game service back-end API secret
        devMode: "sandbox",         // sandbox or prod
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
        leaderboardOptions: {       // Leaderboard options
            sortOrder: "hightolow"  // Sort order
        }
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
        purchasingReadyCallback: null
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
                if (StorageService.instance !== undefined)
                {
                    StorageService.instance.GetUserData("userData", function(data) {
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
                }
                else
                {
                    var response = {};
                    var data = localStorage.getItem("userData");
                    data = JSON.parse(data);
                    if (data !== null) {
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
                var data = localStorage.getItem("userData");
                var obj = JSON.parse(data);
                if (obj === undefined || obj == null)
                    obj = {};
                for (var attr in data_object)
                    obj[attr] = data_object[attr];
                localStorage.setItem("userData", JSON.stringify(obj));
                if (StorageService.instance !== undefined)
                {
                    StorageService.instance.SetUserData("userData", JSON.stringify(obj), function(success) {
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
            return "en_US";
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
            resolve();
        });
    },

    startGameAsync: function() {
        return new Promise(function(resolve, reject){
            FBInstant.Log(">>>> startGameAsync");
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
        return 'WEB';
    },

    getSDKVersion: function() {
        return '6.2';
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
        else if (name === "kongregate")
        {
            new GameService(name);
            new UserService(name);
            new AnalyticsService(name);
            new PaymentsService(name);
            new ShareService("generic");
        }
        else if (name === "none")
        {
            new GameService(name);
            new UserService(name);
            new ShareService("generic");
        }
    }
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
        LeaderboardsService.instance.LeaderboardGetPaged(self.name, ((start / count) | 0) + 1, count, function(entries) {
            resolve(entries);
        });
    })
}

FBInstant.Leaderboard.prototype.getConnectedPlayerEntriesAsync = function(count, start)
{
    var self = this;
    return new Promise(function(resolve, reject) {
        LeaderboardsService.instance.LeaderboardGetFriendsPaged(self.name, ((start / count) | 0) + 1, count, function(entries) {
            resolve(entries);
        });
    })
}

FBInstant.Leaderboard.prototype.getPlayerEntryAsync = function()
{
    var self = this;
    return new Promise(function(resolve, reject) {
        LeaderboardsService.instance.LeaderboardGetRank(self.name, function(entry) {
            resolve(entry);
        });
    })
}

FBInstant.Leaderboard.prototype.setScoreAsync = function(score, meta)
{
    var self = this;
    return new Promise(function(resolve, reject) {
        LeaderboardsService.instance.LeaderboardSetScore(self.name, FBInstant.options.leaderboardOptions.sortOrder, score, meta, function(entry) {
            resolve(entry);
        });
    })
}



//
// Copyright (C) Mat Hopwood www.drmop.com
// For details of license see license.txt
//

//
// None standard extensions (Check FBInstant.ext is not undefined before using)
//
FBInstant.ext = {
    /**
     * Checks to see if the user is logged in
     * @return true if logged in
     */
    isLoggedIn: function() {
        return UserService.instance.GetProfileData() !== undefined;
    },
    /**
     * Gets the login type, e.g. anonymous, email, facebook etc..
     * @return Login network type
     */
    getLoginType: function() {
        var data = UserService.instance.GetProfileData();
        if (data === undefined)
            return "none";
        return data.network;
    },
    /**
     * Gets the date / time that the user first registered
     * @return List of games
     */
    getRegistrationDate: function() {
        var data = UserService.instance.GetProfileData();
        if (data === undefined)
            return null;
        return data.registerTime;
    },
    /**
     * Logs the player in with the supplied shortcode
     * @param shortcode {string} The Game service shortcode (sent by password reset usually)
     * @return error or null if no error, gamer contains the gamers data
     */
    loginWithShortCodeAsync: function(shortcode) {
        return new Promise(function(resolve, reject){
            UserService.instance.LoginWithShortCode(shortcode, function(error, gamer) {
                resolve(error, gamer);
            })
        });
    },
    /**
     * Logs the player in using the default login (anonymously usually)
     * @return error or null if no error, gamer contains the gamers data
     */
    loginAsync: function() {
        return new Promise(function(resolve, reject){
            UserService.instance.Login(FBInstant.options.userOptions.allowAnonymous, function(error, data) {
                if (error === null)
                {
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
    /**
     * Logs the player in with an email and password
     * @param email {string} The users email address
     * @param password {string} The users password
     * @param options {object} Login options
     * @return error or null if no error, gamer contains the gamers data
     */
    loginWithEmailAsync: function(email, password, options) {
        return new Promise(function(resolve, reject){
            UserService.instance.LoginWithCredentials(email, password, options, function(error, data) {
                if (error === null)
                {
                    FBInstant.Log(">> Login with email success");
                    resolve();
                }
                else
                {
                    FBInstant.Log(">> Login with email failed");
                    reject();
                }
            });
        });
    },
    /**
     * Logs the player in with the supplied Facebook access token
     * @param facebook_access_token {string} The Facebook access token, this can be retrieved from response.authResponse.accessToken in the FB.getLoginStatus() callback
     * @return error or null if no error, gamer contains the gamers data
     */
    loginWithFacebookAccessTokenAsync: function(facebook_access_token) {
        return new Promise(function(resolve, reject){
            UserService.instance.LoginWithFacebook(facebook_access_token, function(error, gamer) {
                resolve(error, gamer);
            })
        });
    },
    /**
     * Logs the player out
     * @return error or null if no error
     */
    logoutAsync: function() {
        return new Promise(function(resolve, reject){
            UserService.instance.Logout(function(error) {
                resolve(error);
            })
        });
    },
    /**
     * Converts an anonymous account to an email or social network account
     * @param network {string} Type of network to convert account to, email, facebook etc..
     * @param username_or_id {string} Email address for email or ID for Facebook
     * @param password_or_secret {string} Password for email or token for Facebook
     * @return error or null if no error
     */
    convertAccountAsync: function(network, username_or_id, password_or_secret) {
        return new Promise(function(resolve, reject){
            UserService.instance.ConvertAccount(network, username_or_id, password_or_secret, function(error) {
                resolve(error);
            })
        });
    },
    /**
     * Associates a social network account with a game service account
     * @param network {string} Type of network to convert account to, facebook, googleplus etc..
     * @param id {string} ID for Facebook
     * @param secret {string} Token for Facebook
     * @return error or null if no error
     */
    linkAccountAsync: function(network, id, secret) {
        return new Promise(function(resolve, reject){
            UserService.instance.LinkAccount(network, id, secret, function(error) {
                resolve(error);
            })
        });
    },
    /**
     * Sends an email to the players account with a shortcode that can be used to login
     * @param to_email {string} Users emali address
     * @param from_email {string} Your company support email address
     * @param title {string} Email title
     * @param body {Object} Email body, e.g. { body: "You can login with this <b>[[SHORTCODE]]</b>", html: true };
     * @return error or null if no error
     */
    resetPasswordAsync: function(to_email, from_email, title, body) {
        return new Promise(function(resolve, reject){
            UserService.instance.ResetPassword(to_email, from_email, title, body, function(error) {
                resolve(error);
            })
        });
    },
    /**
     * Changes the users account password
     * @param new_password {string} New password
     * @return error or null if no error
     */
    changePasswordAsync: function(new_password) {
        return new Promise(function(resolve, reject){
            UserService.instance.ChangePassword(new_password, function(error) {
                resolve(error);
            })
        });
    },
    /**
     * Gets list of games that the user has played
     * @return List of games
     */
    getGames: function() {
        return UserService.instance.GetGames();
    },
    /**
     * Sets the players profile data
     * @param profile {object} An object containing profile fields and data
     * @return error or null if no error
     */
    setProfileAsync: function(profile) {
        return new Promise(function(resolve, reject){
            UserService.instance.SetProfile(profile, function(error) {
                resolve(error);
            })
        });
    },
    /**
     * Adds a user as a friend
     * @param id {string} User ID of user to add as a friend
     * @return true if success
     */
    addFriendAsync: function(id) {
        return new Promise(function(resolve, reject){
            UserService.instance.AddFriend(id, function(success) {
                console.log(">>>>> addFriendAsync " + success)
                resolve(success);
            })
        });
    },
    /**
     * Removes a user as a friend
     * @param id {string} User ID of user to unfriend
     * @return true if success
     */
    removeFriendAsync: function(id) {
        return new Promise(function(resolve, reject){
            UserService.instance.RemoveFriend(id, function(success) {
                resolve(success);
            })
        });
    },
    /**
     * Searches for users using a pattern
     * @param match_pattern {string} A filter used to search for players
     * @param start {number} Index of first user to be returned
     * @param limit {number} Max number of users to return
     * @return List of found users or null if error
     */
    listUsersAsync: function(match_pattern, start, limit) {
        return new Promise(function(resolve, reject){
            UserService.instance.ListUsers(match_pattern, start, limit, function(users) {
                resolve(users);
            })
        });
    },
    /**
     * Send event to another user
     * @param id {string} User ID of user to receive event
     * @param evt {object} Event object to send
     * @return true if success
     */
    sendEventAsync: function(id, evt) {
        return new Promise(function(resolve, reject){
            MessagingService.instance.SendEvent(id, evt, function(error, data) {
                resolve(error === null);
            });
        });
    },
    /**
     * Collects any pending events
     * @return array of events or null if none
     */
    getEventsAsync: function() {
        return new Promise(function(resolve, reject){
            MessagingService.instance.GetAllEvents(function(events) {
                resolve(events);
            });
        });
    },
    /**
     * Get a generated referral code
     * @return a referral code or null if failed
     */
    getReferralCodeAsync: function() {
        return new Promise(function(resolve, reject){
            ReferralService.instance.GetReferralCode(function(code) {
                resolve(code);
            });
        });
    },
    /**
     * Consume a referral code
     * @return true if success
     */
    useReferralCodeAsync: function(code) {
        return new Promise(function(resolve, reject){
            ReferralService.instance.UseReferralCode(code, function(success) {
                resolve(success);
            });
        });
    },
    /**
     * Share on Twitter
     * @param options {object} message options, only text is supported at this time
     */
    shareTwitterAsync: function(options) {
        return new Promise(function(resolve, reject) {
            ShareService.instance.ShareService(options);
            resolve();
        });        
    },
}




//
// Copyright (C) Mat Hopwood www.drmop.com
// For details of license see license.txt
//

var LibUtils = {
    Log: function(message)
    {
        console.log(message);
    },
    
    LogError: function(message)
    {
        console.log(message);
    },
    ResolveService: function(name)
    {
        if (GameService.instance !== undefined && GameService.instance.name === name)
        {
            return GameService.instance.service;
        }
        else if (UserService.instance !== undefined && UserService.instance.name === name)
        {
            return UserService.instance.service;
        }
        else if (LeaderboardsService.instance !== undefined && LeaderboardsService.instance.name === name)
        {
            return LeaderboardsService.instance.service;
        }
        else if (MessagingService.instance !== undefined && MessagingService.instance.name === name)
        {
            return MessagingService.instance.service;
        }
        else if (ReferralService.instance !== undefined && ReferralService.instance.name === name)
        {
            return ReferralService.instance.service;
        }
        else if (StorageService.instance !== undefined && StorageService.instance.name === name)
        {
            return StorageService.instance.service;
        }
        else if (AnalyticsService.instance !== undefined && AnalyticsService.instance.name === name)
        {
            return AnalyticsService.instance.service;
        }
        else if (AdsService.instance !== undefined && AdsService.instance.name === name)
        {
            return AdsService.instance.service;
        }
        else if (PaymentsService.instance !== undefined && PaymentsService.instance.name === name)
        {
            return PaymentsService.instance.service;
        }
    },
}


//
// Copyright (C) Mat Hopwood www.drmop.com
// For details of license see license.txt
//

var LibSocial = {
    Log: function(message)
    {
        console.log(message);
    },
    
    LogError: function(message)
    {
        console.log(message);
    },

    Facebook: {
        StatusChangeCallback: undefined,
        Init: function(app_id, done_cb)
        {
            window.fbAsyncInit = function() {
                FB.init({
                    appId            : app_id,
                    autoLogAppEvents : true,
                    xfbml            : true,
                    version          : "v3.1"
                });

                FB.getLoginStatus(function(response)
                {
                    if (done_cb !== undefined)
                        done_cb(response);
                });
            };

            (function(d, s, id){
                var js, fjs = d.getElementsByTagName(s)[0];
                if (d.getElementById(id)) {return;}
                js = d.createElement(s); js.id = id;
                js.src = "https://connect.facebook.net/en_US/sdk.js";
                fjs.parentNode.insertBefore(js, fjs);
            }(document, "script", "facebook-jssdk"));
        },
        Login: function(done_cb)
        {
            FB.login(function(response)
            {
                if (done_cb !== undefined)
                    done_cb(response);
            }, {scope: "public_profile,email"});
        },
        GetProfile: function(done_cb)
        {
            FB.api("/me", function(response) {
                if (done_cb !== undefined)
                    done_cb(response);
            });
        },
        Logout: function(done_cb)
        {
            FB.logout(function(response) {
                if (done_cb !== undefined)
                    done_cb(response);
            });
        }
    }
}





//
// Copyright (C) Mat Hopwood www.drmop.com
// For details of license see license.txt
//

function GameService(name)
{
    this.service = LibUtils.ResolveService(name);
    if (this.service === undefined)
    {
        if (name === "xtralife")
            this.service = new LibXtralife();
        else if (name === "kongregate")
            this.service = new LibKongregate();
    }
    this.name = name;
    GameService.instance = this;
}

//
// INIT
//
GameService.prototype.Init = function(options)
{
    if (this.service === undefined)
        return;
    return this.service.Init(options);
}

//
// Copyright (C) Mat Hopwood www.drmop.com
// For details of license see license.txt
//

function UserService(name)
{
    this.service = LibUtils.ResolveService(name);
    if (this.service === undefined)
    {
        if (name === "xtralife")
            this.service = new LibXtralife();
        else if (name === "kongregate")
            this.service = new LibKongregate();
    }
    this.name = name;
    UserService.instance = this;
    if (FBInstant.ext !== undefined && this.service !== undefined)
    {
        this.service.addSupportedAPI("user");
    }
}

UserService.Player = function(id, name, photo, email, lang)
{
    this.id = id;
    this.name = name;
    this.photo = photo;
    this.email = email;
    this.lang = lang;
    this.getName = function()
    {
        return this.name;
    }
    this.getPhoto = function()
    {
        return (this.photo !== undefined) ? this.photo : null;
    }
    this.getID = function()
    {
        return this.id;
    }
    this.getEmail = function()
    {
        return this.email;
    }
    this.getLanguage = function()   // None standard IG
    {
        return this.lang;
    }
};

UserService.Game = function(id, name, login, icon, location)
{
    this.id = id;
    this.name = name;
    this.login = login;
    this.icon = icon;
    this.location = location;
};

//
// INIT
//
UserService.prototype.InitUser = function(options)
{
    if (this.service === undefined)
        return;
    return this.service.InitUser(options);
}

UserService.prototype.IsSupported = function()
{
    return this.service !== undefined;
}

//
// LOGIN AND ACCOUNTS
//
UserService.prototype.Login = function(allow_anonymous, done_cb)
{
    if (this.service === undefined)
    {
        if (done_cb !== undefined)
            done_cb({code: "CLIENT_UNSUPPORTED_OPERATION ", message: "CLIENT_UNSUPPORTED_OPERATION "}, null);
    }
    else return this.service.Login(allow_anonymous, done_cb);
}

UserService.prototype.ResumeSession = function(gamer_id, gamer_secret, done_cb)
{
    if (this.service === undefined)
    {
        if (done_cb !== undefined)
            done_cb({code: "CLIENT_UNSUPPORTED_OPERATION ", message: "CLIENT_UNSUPPORTED_OPERATION "}, null);
    }
    else return this.service.ResumeSession(gamer_id, gamer_secret, done_cb);
};

UserService.prototype.LoginWithCredentials = function(email, password, options, done_cb)
{
    if (this.service === undefined)
    {
        if (done_cb !== undefined)
            done_cb({code: "CLIENT_UNSUPPORTED_OPERATION ", message: "CLIENT_UNSUPPORTED_OPERATION "}, null);
    }
    else return this.service.LoginWithCredentials(email, password, options, done_cb);
};

UserService.prototype.LoginWithShortCode = function(short_code, done_cb)
{
    if (this.service === undefined)
    {
        if (done_cb !== undefined)
            done_cb({code: "CLIENT_UNSUPPORTED_OPERATION ", message: "CLIENT_UNSUPPORTED_OPERATION "}, null);
    }
    else return this.service.LoginWithShortCode(short_code, done_cb);
};

UserService.prototype.LoginWithFacebook = function(facebook_access_token, done_cb)
{
    if (this.service === undefined)
    {
        if (done_cb !== undefined)
            done_cb({code: "CLIENT_UNSUPPORTED_OPERATION ", message: "CLIENT_UNSUPPORTED_OPERATION "}, null);
    }
    else return this.service.LoginWithFacebook (facebook_access_token, done_cb);
};

UserService.prototype.Logout = function(done_cb)
{
    if (this.service === undefined)
    {
        if (done_cb !== undefined)
            done_cb({code: "CLIENT_UNSUPPORTED_OPERATION ", message: "CLIENT_UNSUPPORTED_OPERATION "});
    }
    else return this.service.Logout(done_cb);
};

UserService.prototype.ConvertAccount = function(network, username_or_id, password_or_secret, done_cb)
{
    if (this.service === undefined)
    {
        if (done_cb !== undefined)
            done_cb({code: "CLIENT_UNSUPPORTED_OPERATION ", message: "CLIENT_UNSUPPORTED_OPERATION "});
    }
    else return this.service.ConvertAccount(network, username_or_id, password_or_secret, done_cb)
};

UserService.prototype.LinkAccount = function(network, id, secret, done_cb)
{
    if (this.service === undefined)
    {
        if (done_cb !== undefined)
            done_cb({code: "CLIENT_UNSUPPORTED_OPERATION ", message: "CLIENT_UNSUPPORTED_OPERATION "});
    }
    else return this.service.LinkAccount(network, id, secret, done_cb);
};

UserService.prototype.ResetPassword = function(to_email, from_email, title, body, done_cb)
{
    if (this.service === undefined)
    {
        if (done_cb !== undefined)
            done_cb({code: "CLIENT_UNSUPPORTED_OPERATION ", message: "CLIENT_UNSUPPORTED_OPERATION "});
    }
    else return this.service.ResetPassword(to_email, from_email, title, body, done_cb);
};

UserService.prototype.ChangePassword = function(new_password, done_cb)
{
    if (this.service === undefined)
    {
        if (done_cb !== undefined)
            done_cb({code: "CLIENT_UNSUPPORTED_OPERATION ", message: "CLIENT_UNSUPPORTED_OPERATION "});
    }
    else return this.service.ChangePassword(new_password, done_cb);
};

//
// PROFILE
//
UserService.prototype.GetGamerData = function()
{
    if (this.service === undefined)
        return null;
    else return this.service.GetGamerData();
}

UserService.prototype.GetProfileData = function(done_cb)
{
    if (this.service === undefined)
        return null;
    else return this.service.GetProfileData(done_cb);
}

UserService.prototype.GetProfile = function(done_cb)
{
    if (this.service === undefined)
    {
        if (done_cb !== undefined)
            done_cb({code: "CLIENT_UNSUPPORTED_OPERATION ", message: "CLIENT_UNSUPPORTED_OPERATION "});
    }
    else return this.service.GetProfile(done_cb);
}

UserService.prototype.SetProfile = function(profile_obj, done_cb)
{
    if (this.service === undefined)
    {
        if (done_cb !== undefined)
            done_cb({code: "CLIENT_UNSUPPORTED_OPERATION ", message: "CLIENT_UNSUPPORTED_OPERATION "});
    }
    else return this.service.SetProfile(profile_obj, done_cb);
}

UserService.prototype.GetGames = function()
{
    if (this.service === undefined)
        return null;
    else return this.service.GetGames();
}

//
// USER SEARCH
//
UserService.prototype.ListUsers = function(match_pattern, start, limit, done_cb)
{
    if (this.service === undefined)
    {
        if (done_cb !== undefined)
            done_cb(null);
    }
    else return this.service.ListUsers(match_pattern, start, limit, done_cb);
}

//
// FRIENDS
//
UserService.prototype.GetFriends = function(done_cb)
{
    if (this.service === undefined)
    {
        if (done_cb !== undefined)
            done_cb(null);
    }
    else return this.service.GetFriends(done_cb);
}

UserService.prototype.AddFriend = function(gamer_id, done_cb)
{
    if (this.service === undefined)
    {
        if (done_cb !== undefined)
            done_cb(false);
    }
    else return this.service.AddFriend(gamer_id, done_cb);
}

UserService.prototype.RemoveFriend = function(gamer_id, done_cb)
{
    if (this.service === undefined)
    {
        if (done_cb !== undefined)
            done_cb(false);
    }
    else return this.service.RemoveFriend(gamer_id, done_cb);
}


//
// Copyright (C) Mat Hopwood www.drmop.com
// For details of license see license.txt
//

function StorageService(name)
{
    this.service = LibUtils.ResolveService(name);
    if (this.service === undefined)
    {
        if (name === "xtralife")
            this.service = new LibXtralife();
    }
    this.name = name;
    StorageService.instance = this;
    if (FBInstant.ext !== undefined && this.service !== undefined)
    {
        this.service.addSupportedAPI("storage");
    }
}

//
// INIT
//
StorageService.prototype.InitStorage = function(options)
{
    if (this.service === undefined)
        return;
    return this.service.InitStorage(options);
}

StorageService.prototype.IsSupported = function()
{
    return this.service !== undefined;
}

StorageService.prototype.SetUserData = function(key, value, done_cb)
{
    if (this.service === undefined)
    {
        if (done_cb !== undefined)
            done_cb(false);
    }
    else return this.service.SetUserData(key, value, done_cb);
}

StorageService.prototype.GetUserData = function(key, done_cb)
{
    if (this.service === undefined)
    {
        if (done_cb !== undefined)
            done_cb(null);
    }
    else return this.service.GetUserData(key, done_cb);
}


//
// Copyright (C) Mat Hopwood www.drmop.com
// For details of license see license.txt
//

function LeaderboardsService(name)
{
    this.service = LibUtils.ResolveService(name);
    if (this.service === undefined)
    {
        if (name === "xtralife")
            this.service = new LibXtralife();
    }
    this.name = name;
    LeaderboardsService.instance = this;
    if (FBInstant.ext !== undefined && this.service !== undefined)
    {
        this.service.addSupportedAPI("leaderboards");
    }
}

LeaderboardsService.LbdEntry = function(id, rank, name, score, extra, photo, timestamp)
{
    this.id = id;
    this.rank = rank;
    this.name = name;
    this.score = score;
    this.extra = extra;
    this.photo = photo;
    this.timestamp = timestamp;
    this.getPlayer = function()
    {
        var self = this;
        return {
            rank: this.rank,
            getName: function()
            {
                return self.name;
            },
            getPhoto: function()
            {
                return (self.photo !== undefined) ? self.photo : null;
            },
            getID: function()
            {
                return self.id;
            }
        }
    }
    this.getRank = function()
    {
        return this.rank;
    }
    this.getScore = function()
    {
        return this.score;
    }
    this.getExtraData = function()
    {
        return this.extra;
    }
    this.getTimestamp = function()
    {
        return this.timestamp;
    }
};

//
// INIT
//
LeaderboardsService.prototype.InitLeaderboards = function(options)
{
    if (this.service === undefined)
        return;
    return this.service.InitLeaderboards(options);
}

LeaderboardsService.prototype.IsSupported = function()
{
    return this.service !== undefined;
}

LeaderboardsService.prototype.LeaderboardGetPaged = function(board_name, page_number, count, done_cb)
{
    if (this.service === undefined)
    {
        if (done_cb !== undefined)
            done_cb(null);
    }
    else return this.service.LeaderboardGetPaged(board_name, page_number, count, done_cb);
}

LeaderboardsService.prototype.LeaderboardGetFriendsPaged = function(board_name, page_number, count, done_cb)
{
    if (this.service === undefined)
    {
        if (done_cb !== undefined)
            done_cb(null);
    }
    else return this.service.LeaderboardGetFriendsPaged(board_name, page_number, count, done_cb);
}

LeaderboardsService.prototype.LeaderboardGetRank = function(board_name, done_cb)
{
    if (this.service === undefined)
    {
        if (done_cb !== undefined)
            done_cb(null);
    }
    else return this.service.LeaderboardGetRank(board_name, done_cb);
}

LeaderboardsService.prototype.LeaderboardSetScore = function(board_name, sort_order, score, extra, done_cb)
{
    if (this.service === undefined)
    {
        if (done_cb !== undefined)
            done_cb(false);
    }
    else return this.service.LeaderboardSetScore(board_name, sort_order, score, extra, done_cb)
}

//
// Copyright (C) Mat Hopwood www.drmop.com
// For details of license see license.txt
//

function MessagingService(name)
{
    this.service = LibUtils.ResolveService(name);
    if (this.service === undefined)
    {
        if (name === "xtralife")
            this.service = new LibXtralife();
    }
    this.name = name;
    MessagingService.instance = this;
    if (FBInstant.ext !== undefined && this.service !== undefined)
    {
        this.service.addSupportedAPI("messaging");
    }
}

//
// INIT
//
MessagingService.prototype.InitMessaging = function(options)
{
    if (this.service === undefined)
        return;
    return this.service.InitMessaging(options);
}

MessagingService.prototype.IsSupported = function()
{
    return this.service !== undefined;
}

MessagingService.prototype.SendEvent = function(to_id, event_obj, done_cb)
{
    if (this.service === undefined)
    {
        if (done_cb !== undefined)
            done_cb({code: "CLIENT_UNSUPPORTED_OPERATION ", message: "CLIENT_UNSUPPORTED_OPERATION "});
    }
    else return this.service.SendEvent(to_id, event_obj, done_cb);
}

MessagingService.prototype.ListenForEvent = function(done_cb)
{
    if (this.service === undefined)
    {
        if (done_cb !== undefined)
            done_cb({code: "CLIENT_UNSUPPORTED_OPERATION ", message: "CLIENT_UNSUPPORTED_OPERATION "});
    }
    else return this.service.ListenForEvent(done_cb);
}

MessagingService.prototype.GetAllEvents = function(done_cb)
{
    if (this.service === undefined)
    {
        if (done_cb !== undefined)
            done_cb(null);
    }
    else return this.service.GetAllEvents(done_cb);
}

//
// Copyright (C) Mat Hopwood www.drmop.com
// For details of license see license.txt
//

function ReferralService(name)
{
    this.service = LibUtils.ResolveService(name);
    if (this.service === undefined)
    {
        if (name === "xtralife")
            this.service = new LibXtralife();
    }
    this.name = name;
    ReferralService.instance = this;
    if (FBInstant.ext !== undefined && this.service !== undefined)
    {
        this.service.addSupportedAPI("referrals");
    }
}

//
// INIT
//
ReferralService.prototype.InitReferrals = function(options)
{
    if (this.service === undefined)
        return;
    return this.service.InitReferrals(options);
}

ReferralService.prototype.IsSupported = function()
{
    return this.service !== undefined;
}

ReferralService.prototype.GetReferralCode = function(done_cb)
{
    if (this.service === undefined)
    {
        if (done_cb !== undefined)
            done_cb(null);
    }
    else return this.service.GetReferralCode(done_cb);
}

ReferralService.prototype.UseReferralCode = function(code, done_cb)
{
    if (this.service === undefined)
    {
        if (done_cb !== undefined)
            done_cb(false);
    }
    else return this.service.UseReferralCode(code, done_cb);
}

//
// Copyright (C) Mat Hopwood www.drmop.com
// For details of license see license.txt
//

function ShareService(name)
{
    this.service = LibUtils.ResolveService(name);
    if (this.service === undefined)
    {
        if (name === "generic")
            this.service = new LibGeneric();
    }
    this.name = name;
    ShareService.instance = this;
    if (FBInstant.ext !== undefined && this.service !== undefined)
    {
        this.service.addSupportedAPI("share");
    }
}

//
// INIT
//
ShareService.prototype.InitShare = function(options)
{
    if (this.service === undefined)
        return;
    return this.service.InitShare(options);
}

ShareService.prototype.IsSupported = function()
{
    return this.service !== undefined;
}

ShareService.prototype.SharePrimary = function(options)
{
    if (this.service === undefined)
        return;
    return this.service.SharePrimary(options);
}

ShareService.prototype.ShareFacebook = function(options)
{
    var opts = FBInstant.options.shareOptions;
    var title = (options.title !== undefined) ? options.title : "";
    var message = options.text;
    var url = encodeURIComponent(opts.shareURI + "?t=" + title + "&d=" + message);
    if (options.data !== undefined)
        url += "&data=" + JSON.stringify(options.data);
    window.open('https://www.facebook.com/sharer/sharer.php?u=' + url, 'pop', 'width=' + opts.dlgWidth + ', height=' + opts.dlgHeight + ', scrollbars=no');
}

ShareService.prototype.ShareTwitter = function(options)
{
    var opts = FBInstant.options.shareOptions;
    var message = options.text;
    var url = encodeURIComponent(message);
    window.open('https://twitter.com/intent/tweet?text=' + url, 'pop', 'width=' + opts.dlgWidth + ', height=' + opts.dlgHeight + ', scrollbars=no');
}

//
// Copyright (C) Mat Hopwood www.drmop.com
// For details of license see license.txt
//

function LibGeneric()
{
    // NOTES:
}

LibGeneric.Log = function(message)
{
    console.log(message);
}

LibGeneric.LogError = function(message)
{
    console.log(message);
}

//
// INIT
//

LibGeneric.prototype.InitShare = function(options)
{

}

LibGeneric.prototype.addSupportedAPI = function(type)
{
    if (type === "share")
    {
        FBInstant.supportedAPIs.push("shareAsync");
        FBInstant.supportedAPIs.push("ext.shareTwitterAsync");
    }
}

LibGeneric.prototype.SharePrimary = function(options)
{
    ShareService.instance.ShareFacebook(options);
}


//
// Copyright (C) Mat Hopwood www.drmop.com
// For details of license see license.txt
//

function LibXtralife()
{
}

LibXtralife.Log = function(message)
{
    console.log(message);
}

LibXtralife.LogError = function(message)
{
    console.log(message);
}

//
// INIT
//
LibXtralife.prototype.Init = function(options)
{
    this.clan = Clan(options.apiKey, options.apiSecret, options.devMode);
    var data = localStorage.getItem("gamer");
    if (data !== null)
        this.gamerData = JSON.parse(data);
}

LibXtralife.prototype.InitLeaderboards = function(options)
{
}

LibXtralife.prototype.InitMessaging = function(options)
{
}

LibXtralife.prototype.InitReferrals = function(options)
{
}

LibXtralife.prototype.InitShare = function(options)
{
}

LibXtralife.prototype.InitStorage = function(options)
{
}

LibXtralife.prototype.InitUser = function(options)
{
}

LibXtralife.prototype.addSupportedAPI = function(type)
{
    if (type === "leaderboards")
    {
        FBInstant.supportedAPIs.push("Leaderboard.getEntriesAsync");
        FBInstant.supportedAPIs.push("Leaderboard.getConnectedPlayerEntriesAsync");
        FBInstant.supportedAPIs.push("Leaderboard.getPlayerEntryAsync");
        FBInstant.supportedAPIs.push("Leaderboard.setScoreAsync");
        FBInstant.supportedAPIs.push("getLeaderboardAsync");
    }
    else
    if (type === "messaging")
    {
        FBInstant.supportedAPIs.push("ext.sendEventAsync");
        FBInstant.supportedAPIs.push("ext.getEventsAsync");
    }
    else
    if (type === "referrals")
    {
        FBInstant.supportedAPIs.push("ext.getReferralCodeAsync");
        FBInstant.supportedAPIs.push("ext.useReferralCodeAsync");
    }
    else
    if (type === "storage")
    {
        FBInstant.supportedAPIs.push("player.getDataAsync");
        FBInstant.supportedAPIs.push("player.setDataAsync");
    }
    else
    if (type === "user")
    {
        FBInstant.supportedAPIs.push("getLocale");
        FBInstant.supportedAPIs.push("player.getConnectedPlayersAsync");
        FBInstant.supportedAPIs.push("ext.isLoggedIn");
        FBInstant.supportedAPIs.push("ext.getLoginType");
        FBInstant.supportedAPIs.push("ext.getRegistrationDate");
        FBInstant.supportedAPIs.push("ext.loginWithShortCodeAsync");
        FBInstant.supportedAPIs.push("ext.loginAsync");
        FBInstant.supportedAPIs.push("ext.loginWithEmailAsync");
        FBInstant.supportedAPIs.push("ext.loginWithFacebookAccessTokenAsync");
        FBInstant.supportedAPIs.push("ext.logoutAsync");
        FBInstant.supportedAPIs.push("ext.convertAccountAsync");
        FBInstant.supportedAPIs.push("ext.linkAccountAsync");
        FBInstant.supportedAPIs.push("ext.resetPasswordAsync");
        FBInstant.supportedAPIs.push("ext.changePasswordAsync");
        FBInstant.supportedAPIs.push("ext.getGames");
        FBInstant.supportedAPIs.push("ext.setProfileAsync");
        FBInstant.supportedAPIs.push("ext.addFriendAsync");
        FBInstant.supportedAPIs.push("ext.removeFriendAsync");
        FBInstant.supportedAPIs.push("ext.listUsersAsync");
    }
}


//
// LOGIN AND ACCOUNTS
//
LibXtralife.prototype.Login = function(allow_anonymous, done_cb)
{
    if (this.gamerData)
    {
        this.ResumeSession(this.gamerData.gamer_id, this.gamerData.gamer_secret, done_cb);
        return;
    }
    if (!allow_anonymous)
    {
        LibXtralife.Log(">>>> Anonymous login disabled");
        if (done_cb !== undefined)
            done_cb(null, null);
        return;
    }
    this.clan.login(null, function(error, gamer)
    {
        LibXtralife.Log(">>>> Creating new anonymous player");
        if (error == null)
        {
            this.gamerData = gamer;
            localStorage.setItem("gamer", JSON.stringify(gamer));
        }
		
        //LibXtralife.Log(this.gamerData)
        if (done_cb !== undefined)
            done_cb(error, gamer);
    }.bind(this));
};

LibXtralife.prototype.ResumeSession = function(gamer_id, gamer_secret, done_cb)
{
    this.clan.resumeSession(gamer_id, gamer_secret, function(error, gamer)
    {
        LibXtralife.Log(">>>> Resuming session");
        if (error == null)
        {
            this.gamerData = gamer;
            localStorage.setItem("gamer", JSON.stringify(gamer));
        }
		
        if (done_cb !== undefined)
            done_cb(error, gamer);
    }.bind(this));
};

LibXtralife.prototype.LoginWithCredentials = function(email, password, options, done_cb)
{
    if (this.gamerData)
    {
        this.ResumeSession(this.gamerData.gamer_id, this.gamerData.gamer_secret, done_cb);
        return;
    }
    this.clan.login("email", email, password, options, function(error, gamer)
    {
        if (error == null)
        {
            this.gamerData = gamer;
            localStorage.setItem("gamer", JSON.stringify(gamer));
        }
        
        if (done_cb !== undefined)
            done_cb(error, gamer);
    }.bind(this));
};

LibXtralife.prototype.LoginWithShortCode = function(short_code, done_cb)
{
    if (this.gamerData)
    {
        this.ResumeSession(this.gamerData.gamer_id, this.gamerData.gamer_secret, done_cb);
        return;
    }
    this.clan.loginWithShortCode(short_code, function(error, gamer)
    {
        if (error == null)
        {
            this.gamerData = gamer;
            localStorage.setItem("gamer", JSON.stringify(gamer));
        }
	
        if (done_cb !== undefined)
            done_cb(error, gamer);
    }.bind(this));
};

LibXtralife.prototype.LoginWithFacebook = function(facebook_access_token, done_cb)
{
    if (this.gamerData)
    {
        this.ResumeSession(this.gamerData.gamer_id, this.gamerData.gamer_secret, done_cb);
        return;
    }
    this.clan.login("facebook", "", facebook_access_token, function(error, gamer)
    {
        if (error == null)
        {
            this.gamerData = gamer;
            localStorage.setItem("gamer", JSON.stringify(gamer));
        }

        if (done_cb !== undefined)
            done_cb(error, gamer);
    }.bind(this));
};

LibXtralife.prototype.Logout = function(done_cb)
{
    this.clan.logout(function(error)
    {
        if (done_cb !== undefined)
            done_cb(error);
    }.bind(this));
};

LibXtralife.prototype.ConvertAccount = function(network, username_or_id, password_or_secret, done_cb)
{
    if (this.gamerData)
    {
        this.clan.withGamer(this.gamerData).convertTo(network, username_or_id, password_or_secret, function(error, result)
        {
            if (done_cb !== undefined)
                done_cb(error, result);
        }.bind(this));
    }
    else
    {
        if (done_cb !== undefined)
            done_cb({code: "CLIENT_UNSUPPORTED_OPERATION ", message: "CLIENT_UNSUPPORTED_OPERATION "});
    }
};

LibXtralife.prototype.LinkAccount = function(network, id, secret, done_cb)
{
    if (this.gamerData)
    {
        console.log("LinkAccount: " + network + ", " + id + ", " + secret)
        this.clan.withGamer(this.gamerData).link(network, id, secret, function(error, result)
        {
            console.log("LinkAccount error: " + JSON.stringify(error));
            console.log("LinkAccount result: " + JSON.stringify(result));
            if (done_cb !== undefined)
                done_cb(error, result);
        }.bind(this));
    }
    else
    {
        if (done_cb !== undefined)
            done_cb({code: "CLIENT_UNSUPPORTED_OPERATION ", message: "CLIENT_UNSUPPORTED_OPERATION "});
    }
};

LibXtralife.prototype.ResetPassword = function(to_email, from_email, title, body, done_cb)
{
    this.clan.sendResetMailPassword(to_email, from_email, title, body, function(error, result)
    {
        if (done_cb !== undefined)
            done_cb(error, result);
    }.bind(this));
};

LibXtralife.prototype.ChangePassword = function(new_password, done_cb)
{
    if (this.gamerData)
    {
        this.clan.withGamer(this.gamerData).changePassword(new_password, function(error, result)
        {
            if (done_cb !== undefined)
                done_cb(error, result);
        }.bind(this));
    }
    else
    {
        if (done_cb !== undefined)
            done_cb({code: "CLIENT_UNSUPPORTED_OPERATION ", message: "CLIENT_UNSUPPORTED_OPERATION "});
    }
};

//
// PROFILE
//
LibXtralife.prototype.GetGamerData = function()
{
    return this.gamerData;
}

LibXtralife.prototype.GetProfileData = function()
{
    if (this.gamerData)
    {
        var prof = this.gamerData.profile;
        return new UserService.Player(this.gamerData.gamer_id, prof.displayName, prof.avatar, prof.email, prof.lang);
    }
    return null;
}

LibXtralife.prototype.GetProfile = function(done_cb)
{
    if (this.gamerData)
    {
        this.clan.withGamer(this.gamerData).profile().get(function(error, result) {
            if (done_cb !== undefined)
                done_cb(error, result);
        });
    }
    else
    {
        if (done_cb !== undefined)
            done_cb({code: "CLIENT_UNSUPPORTED_OPERATION ", message: "CLIENT_UNSUPPORTED_OPERATION "});
    }
}

LibXtralife.prototype.SetProfile = function(profile_obj, done_cb)
{
    var self = this;
    if (this.gamerData)
    {
        this.clan.withGamer(this.gamerData).profile().set(profile_obj, function(error, result) {
            if (error === null)
            {
                for (var p in profile_obj)
                {
                    self.gamerData.profile[p] = profile_obj[p];
                }
            }
            if (done_cb !== undefined)
                done_cb(error, result);
        });
    }
    else
    {
        if (done_cb !== undefined)
            done_cb({code: "CLIENT_UNSUPPORTED_OPERATION ", message: "CLIENT_UNSUPPORTED_OPERATION "});
    }
}

LibXtralife.prototype.GetGames = function()
{
    if (this.gamerData)
    {
        var xgames = this.gamerData.games;
        var games = [];
        for (var t = 0; t < xgames.length; t++)
            games.push(new UserService.Game(xgames[t].appid, xgames[t].appid, xgames[t].lastlogin, null, null));
        return games;
    }
    return null;
}


//
// USER SEARCH
//
LibXtralife.prototype.ListUsers = function(match_pattern, start, limit, done_cb)
{
    var self = this;
    if (this.gamerData)
    {
        this.clan.withGamer(this.gamerData).listUsers(encodeURIComponent(match_pattern), limit, start, function(error, result) {
            console.log("ListUsers error: " + JSON.stringify(error));
            console.log("ListUsers result: " + JSON.stringify(result));
            if (done_cb !== undefined)
            {
                if (error !== null)
                    done_cb(null);
                else
                    done_cb(result.result);
            }
        });
    }
    else
    {
        if (done_cb !== undefined)
            done_cb(null);
    }
}

//
// LEADERBOARDS
//
LibXtralife.prototype.LeaderboardGetPaged = function(board_name, page_number, count, done_cb)
{
    var self = this;
    if (this.gamerData)
    {
        this.clan.withGamer(this.gamerData).leaderboards(this.clan.privateDomain).getHighscores(board_name, Number(page_number), Number(count), function(error, result)
        {
            // If the operation went wrong for some reason
            if (error !== null)
            {
                LibXtralife.LogError("Leaderboard Get Paged error: " + error);
                if (done_cb !== undefined)
                    done_cb(null);
            }
            else
            {
                LibXtralife.Log("LeaderboardGetPaged: " + JSON.stringify(result));
                var entries = [];
                var board = result[board_name];
                if (board !== undefined)
                {
                    var entries = [];
                    for (var index = 0; index < board.scores.length; index++)
                    {
                        var lentry = board.scores[index];
                        if (lentry !== undefined)
                            entries.push(new LeaderboardsService.LbdEntry(lentry.gamer_id, board.rankOfFirst + index, lentry.profile.displayName, lentry.score.score, lentry.score.info, lentry.profile.avatar, lentry.score.timestamp));
                    }
                }
                if (done_cb !== undefined)
                    done_cb(entries);
            }
        });
    }
    else
    {
        if (done_cb !== undefined)
            done_cb(null);
    }
}

LibXtralife.prototype.LeaderboardGetFriendsPaged = function(board_name, page_number, count, done_cb)
{
    var self = this;
    if (this.gamerData)
    {
        this.clan.withGamer(this.gamerData).leaderboards(this.clan.privateDomain).getFriendsHighscores(board_name, Number(page_number), Number(count), function(error, result)
        {
            if (error !== null)
            {
                LibXtralife.LogError("Leaderboard Get Friends Paged error: " + error);
                if (done_cb !== undefined)
                    done_cb(null);
            }
            else
            {
                LibXtralife.Log("LeaderboardGetFriendsPaged: " + JSON.stringify(result));
                var entries = [];
                var board = result[board_name];
                if (board !== undefined)
                {
                    for (var index = 0; index < board.length; index++)
                    {
                        var lentry = board[index];
                        if (lentry !== undefined)
                            entries.push(new LeaderboardsService.LbdEntry(lentry.gamer_id, lentry.rank, lentry.profile.displayName, lentry.score.score, lentry.score.info, lentry.profile.avatar, lentry.score.timestamp));
                    }
                }
                if (done_cb !== undefined)
                    done_cb(entries);
            }
        });
    }
    else
    {
        if (done_cb !== undefined)
            done_cb(null);
    }
}

LibXtralife.prototype.LeaderboardGetRank = function(board_name, done_cb)
{
    var self = this;
    if (this.gamerData)
    {
        this.clan.withGamer(this.gamerData).leaderboards(this.clan.privateDomain).getCenteredHighscores(board_name, 1, function(error, result)
        {
            var entry = null;
            LibXtralife.Log(self.gamerData);
            if (error !== null)
            {
                LibXtralife.LogError("Could not get centered rank: " + JSON.stringify(error));
            }
            else
            {
                var board = result[board_name];
                if (board !== undefined)
                {
                    var score = board.scores[0];
                    if (score !== undefined)
                    {
                        LibXtralife.Log("LeaderboardGetRank: " + JSON.stringify(result));
                        entry = new LeaderboardsService.LbdEntry(score.gamer_id, board.rankOfFirst, score.profile.displayName, score.score.score, score.score.info, score.profile.avatar, score.score.timestamp);
                    }
                }
            }
            if (done_cb !== undefined)
                done_cb(entry);
        });
    }
    else
    {
        if (done_cb !== undefined)
            done_cb(null);
    }
}

LibXtralife.prototype.LeaderboardSetScore = function(board_name, sort_order, score, extra, done_cb)
{
    var self = this;
    if (this.gamerData)
    {
        var scoreObject = {"score": Number(score), "info": extra};
        this.clan.withGamer(this.gamerData).leaderboards(this.clan.privateDomain).set(board_name, sort_order, scoreObject, function(error, result)
        {
            if (error !== null)
            {
                LibXtralife.LogError("Leaderboard Set score error: " + error);
                if (done_cb !== undefined)
                    done_cb(false);
            }
            else
            {
                LibXtralife.Log("LeaderboardSetScore: " + JSON.stringify(result));
                if (done_cb !== undefined)
                    done_cb(true);
            }
        });
    }
    else
    {
        if (done_cb !== undefined)
            done_cb(false);
    }
}

LibXtralife.prototype.SetUserData = function(key, value, done_cb)
{
    if (this.gamerData)
    {
        this.clan.withGamer(this.gamerData).gamervfs(this.clan.privateDomain).setValue(key, value, function(error, result)
        {
            if (error !== null)
            {
                LibXtralife.LogError("Set user data error: " + JSON.stringify(error));
                if (done_cb !== undefined)
                    done_cb(false);
            }
            else
            {
                LibXtralife.LogError("User data set: " + result.result);
                if (done_cb !== undefined)
                    done_cb(true);
            }
        });
    }
    else
    {
        if (done_cb !== undefined)
            done_cb(false);
    }
}

LibXtralife.prototype.GetUserData = function(key, done_cb)
{
    if (this.gamerData)
    {
        this.clan.withGamer(this.gamerData).gamervfs(this.clan.privateDomain).getValue(key, function(error, result)
        {
            if (error !== null)
            {
                LibXtralife.LogError("Get user data error: " + JSON.stringify(error));
                if (done_cb !== undefined)
                    done_cb(null);
            }
            else
            {
                LibXtralife.Log("User data get: " + JSON.stringify(result));
                if (done_cb !== undefined)
                    done_cb(result.result[key]);
            }
        });
    }
    else
    {
        if (done_cb !== undefined)
            done_cb(null);
    }
}

//
// FRIENDS
//
LibXtralife.prototype.GetFriends = function(done_cb)
{
    if (this.gamerData)
    {
        this.clan.withGamer(this.gamerData).friends(this.clan.privateDomain).get(function(error, result)
        {
            if (error !== null)
            {
                LibXtralife.LogError("Get friends error: " + JSON.stringify(error));
                if (done_cb !== undefined)
                    done_cb(null);
            }
            else
            {
                LibXtralife.Log("Get friends: " + JSON.stringify(result));

                var players = [];
                var friends = result.friends;
                if (friends !== undefined)
                {
                    for (var index = 0; index < friends.length; index++)
                    {
                        var fentry = friends[index];
                        if (fentry !== undefined)
                            players.push(new UserService.Player(fentry.gamer_id, fentry.profile.displayName, fentry.profile.avatar, fentry.profile.email));
                    }
                }

                if (done_cb !== undefined)
                    done_cb(players);
            }
        });
    }
    else
    {
        if (done_cb !== undefined)
            done_cb(null);
    }
}

LibXtralife.prototype.AddFriend = function(gamer_id, done_cb)
{
    if (this.gamerData)
    {
        this.clan.withGamer(this.gamerData).friends(this.clan.privateDomain).status(gamer_id, "add", function(error, result)
        {
            if (error !== null)
            {
                LibXtralife.LogError("AddFriend error: " + JSON.stringify(error));
                if (done_cb !== undefined)
                    done_cb(false);
            }
            else
            {
                LibXtralife.Log("AddFriend: " + JSON.stringify(result));
                if (done_cb !== undefined)
                    done_cb(true);
            }
        });
    }
    else
    {
        if (done_cb !== undefined)
            done_cb(false);
    }
}

LibXtralife.prototype.RemoveFriend = function(gamer_id, done_cb)
{
    if (this.gamerData)
    {
        this.clan.withGamer(this.gamerData).friends(this.clan.privateDomain).status(gamer_id, "forget", function(error, result)
        {
            if (error !== null)
            {
                LibXtralife.LogError("RemoveFriend error: " + JSON.stringify(error));
                if (done_cb !== undefined)
                    done_cb(false);
            }
            else
            {
                LibXtralife.Log("RemoveFriend: " + JSON.stringify(result));
                if (done_cb !== undefined)
                    done_cb(true);
            }
        });
    }
    else
    {
        if (done_cb !== undefined)
            done_cb(false);
    }
}

//
// Events
//
LibXtralife.prototype.SendEvent = function(to_id, event_obj, done_cb)
{
    if (this.gamerData !== undefined)
    {
        this.clan.withGamer(this.gamerData).events(this.clan.privateDomain).send(to_id, event_obj, null, function(error, result)
        {
            if (error !== null)
            {
                LibXtralife.LogError("SendEvent error: " + JSON.stringify(error));
                if (done_cb !== undefined)
                    done_cb(error, result);
            }
            else
            {
                LibXtralife.Log("SendEvent: " + JSON.stringify(result));
                if (done_cb !== undefined)
                    done_cb(error, result);
            }
        });
    }
    else
    {
        if (done_cb !== undefined)
            done_cb({code: "CLIENT_UNSUPPORTED_OPERATION ", message: "CLIENT_UNSUPPORTED_OPERATION "});
    }
}

LibXtralife.prototype.ListenForEvent = function(done_cb)
{
    if (this.gamerData !== undefined)
    {
        this.clan.withGamer(this.gamerData).events(this.clan.privateDomain).receive("auto", function(error, result)
        {
            if (error !== null)
            {
                LibXtralife.LogError("ListenForEvent error: " + JSON.stringify(error));
                if (done_cb !== undefined)
                    done_cb(error, result);
            }
            else
            {
                LibXtralife.Log("ListenForEvent: " + JSON.stringify(result));
                if (done_cb !== undefined)
                    done_cb(error, result);
            }
        });
    }
    else
    {
        if (done_cb !== undefined)
            done_cb({code: "CLIENT_UNSUPPORTED_OPERATION ", message: "CLIENT_UNSUPPORTED_OPERATION "});
    }
}

LibXtralife.prototype.GetAllEvents = function(done_cb)
{
    if (this.gamerData === undefined)
    {
        if (done_cb !== undefined)
            done_cb(null);
        return;
    }
    var events = [];
    events_available = true;
    var self = this;
    var get_events = function()
    {
        self.ListenForEvent(function(error, result) {
            if (result !== null)
            {
                events.push(result);
                get_events();
            }
            else
            {
                if (done_cb !== undefined)
                    done_cb(events);
                        
            }
        });
    }
    get_events();
}

LibXtralife.prototype.GetReferralCode = function(done_cb)
{
    if (this.gamerData !== undefined)
    {
        this.clan.withGamer(this.gamerData).referral(this.clan.privateDomain).getCode(function(error, result)
        {
            if (result !== null)
            {
                if (done_cb !== undefined)
                    done_cb(result.godfathercode);
            }
            else
            {
                if (done_cb !== undefined)
                    done_cb(null);
            }
        });
    }
    else
    {
        if (done_cb !== undefined)
            done_cb(null);
    }
}

LibXtralife.prototype.UseReferralCode = function(code, done_cb)
{
    if (this.gamerData !== undefined)
    {
        this.clan.withGamer(this.gamerData).referral(this.clan.privateDomain).useCode(code, null, function(error, result)
        {
            if (error === null)
            {
                if (done_cb !== undefined)
                    done_cb(true);
            }
            else
            {
                if (done_cb !== undefined)
                    done_cb(false);
            }
        });
    }
    else
    {
        if (done_cb !== undefined)
            done_cb(false);
    }
}

//
// Copyright (C) Mat Hopwood www.drmop.com
// For details of license see license.txt
//

function LibKongregate()
{
    LibKongregate.Log(">>>> Kongregate: construct");
    this.loggedIn = false;
}

LibKongregate.Log = function(message)
{
    console.log(message);
}

LibKongregate.LogError = function(message)
{
    console.log(message);
}

//
// INIT
//
LibKongregate.prototype.Init = function(options)
{
    LibKongregate.Log(">>>> Kongregate: Init");
    LibKongregate.Log(kongregateAPI);
    var self = this;
    kongregateAPI.loadAPI(function() {
        LibKongregate.Log(">>>> Kongregate: API Loaded");
        self.kongregate = kongregateAPI.getAPI();
        LibKongregate.Log(self.kongregate);
        if (!self.kongregate.services.isGuest())
        {
            LibKongregate.Log(">>>> Kongregate: Already logged in");
            self.loggedIn = true;
        }
        else
        {
            LibKongregate.Log(">>>> Kongregate: Not logged in");
            self.kongregate.services.addEventListener('login', function() {
                LibKongregate.Log(">>>> Kongregate: Logged in");
                self.loggedIn = true;
                if (self.loggedinCallback !== undefined)
                    self.loggedinCallback();
            });
        }
    });
}

LibKongregate.prototype.InitAnalytics = function(options)
{
}

LibKongregate.prototype.InitPayments = function(options)
{
}

LibKongregate.prototype.InitUser = function(options)
{
}

LibKongregate.prototype.addSupportedAPI = function(type)
{
    if (type === "user")
    {
        FBInstant.supportedAPIs.push("getLocale");
        FBInstant.supportedAPIs.push("player.getConnectedPlayersAsync");
        FBInstant.supportedAPIs.push("ext.isLoggedIn");
        FBInstant.supportedAPIs.push("ext.loginAsync");
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
}

//
// LOGIN AND ACCOUNTS
//
LibKongregate.prototype.Login = function(allow_anonymous, done_cb)
{
    if (this.loggedIn)
    {
        if (done_cb !== undefined)
            done_cb(null, null);
    }
    if (!allow_anonymous)
    {
        this.loggedinCallback = function()
        {
            if (done_cb !== undefined)
                done_cb(null, null);
        }
        this.kongregate.services.showRegistrationBox();
    }
    else
    {
        LibKongregate.Log(">>>> Kongregate: Anonymouse login");
        if (done_cb !== undefined)
            done_cb(null, null);
    }
};

//
// PROFILE
//
LibKongregate.prototype.GetProfileData = function()
{
    if (!this.loggedIn)
    {
        return null;
    }
    return new UserService.Player(this.kongregate.services.getUserId(), this.kongregate.services.getUsername(), null, null, "en_US");
}

LibKongregate.prototype.GetFriends = function(done_cb)
{
    if (done_cb !== undefined)
        done_cb([]);
}

//
// ANALYTICS
//
LibKongregate.prototype.LogEvent = function(event_name, value, params)
{
    if (!this.loggedIn)
    {
        return ({code: "ANALYTICS_POST_EXCEPTION ", message: "ANALYTICS_POST_EXCEPTION "});
    }

    this.kongregate.analytics.addEvent(event_name, { 
        value: value
    });

    return null;
}

//
// PURCHASING
//
LibKongregate.prototype.GetProducts = function(done_cb)
{
    LibKongregate.Log(">>>> Kongregate: GetProducts");
    if (!this.loggedIn)
    {
        done_cb({code: "PAYMENTS_NOT_INITIALIZED", message: "PAYMENTS_NOT_INITIALIZED"}, null);
        return;
    }
    this.kongregate.mtx.requestItemList([], function(result) {
        if (result.success)
        {
            var products = [];
            for (var t = 0; t < result.data.length; t++)
            {
                var prod = result.data[t];
                var p = new PaymentsService.Product(prod.name, prod.id, prod.description, prod.image_url, prod.price, "");
                p.identifier = prod.identifier;
                p.tags = prod.tags;
                products.push(p);
            }
            done_cb(null, products);
        }
        else
        {
            done_cb({code: "NETWORK_FAILURE", message: "NETWORK_FAILURE"}, null);
        }
    });
}

LibKongregate.prototype.PurchaseProduct = function(options, done_cb)
{
    LibKongregate.Log(">>>> Kongregate: PurchaseProduct");
    if (!this.loggedIn)
    {
        done_cb({code: "PAYMENTS_NOT_INITIALIZED", message: "PAYMENTS_NOT_INITIALIZED"}, null);
        return;
    }

    this.kongregate.mtx.purchaseItems([options.productID], function(result) {
        LibKongregate.Log(">>>> Kongregate: purchase result");
        LibKongregate.Log(result);
        if (result.success)
        {
            var pdata = new PaymentsService.Purchase(options.developerPayload, "", options.productID, Date.now, "", null);
            done_cb(null, pdata);
        }
        else
        {
            done_cb({code: "NETWORK_FAILURE", message: "NETWORK_FAILURE"}, null);
        }
    });
}

LibKongregate.prototype.RefundProduct = function(options, done_cb)
{
    done_cb({code: "CLIENT_UNSUPPORTED_OPERATION", message: "CLIENT_UNSUPPORTED_OPERATION"});
}

LibKongregate.prototype.ConsumeProduct = function(purchaseToken, done_cb)
{
    LibKongregate.Log(">>>> Kongregate: ConsumeProduct");
    if (!this.loggedIn)
    {
        done_cb({code: "PAYMENTS_NOT_INITIALIZED", message: "PAYMENTS_NOT_INITIALIZED"});
        return;
    }

    this.kongregate.mtx.useItemInstance(purchaseToken, function(result) {
        if (result.success)
        {
            done_cb(null);
        }
        else
        {
            done_cb({code: "NETWORK_FAILURE", message: "NETWORK_FAILURE"});
        }
    });
}

LibKongregate.prototype.GetPurchases = function(done_cb)
{
    LibKongregate.Log(">>>> Kongregate: GetPurchases");
    if (!this.loggedIn)
    {
        done_cb({code: "PAYMENTS_NOT_INITIALIZED", message: "PAYMENTS_NOT_INITIALIZED"}, null);
        return;
    }

    this.kongregate.mtx.requestUserItemList(null, function(result) {
        if (result.success)
        {
            var purchases = [];
            for (var t = 0; t < result.data.length; t++)
            {
                var purchase = result.data[t];
                var p = new PaymentsService.Purchase("", purchase.id, purchase.identifier, null, null, null);
                p.data = purchase.data;
                p.remainingUses = purchase.remaining_uses;
                purchases.push(p);
            }
            done_cb(null, purchases);
        }
        else
        {
            done_cb({code: "NETWORK_FAILURE", message: "NETWORK_FAILURE"}, null);
        }
    });
}

LibKongregate.prototype.ShowPurchaseDialog = function(options)
{
    LibKongregate.Log(">>>> Kongregate: ShowPurchaseDialog");
    if (!this.loggedIn)
    {
        done_cb({code: "PAYMENTS_NOT_INITIALIZED", message: "PAYMENTS_NOT_INITIALIZED"}, null);
        return;
    }

    this.kongregate.mtx.showKredPurchaseDialog(options.type);
}
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
    if (this.adRequested)
    {
        LibCrazyGames.Log("CrazyGames: Ad already requested");
        self.watchedCallback({code: "ADS_NOT_LOADED", message: "ADS_NOT_LOADED"});
    }
    LibCrazyGames.Log("CrazyGames: Requesting ad");
    
    this.adRequested = true;
    if (type === "video")
    {
        this.watchedCallback = done_cb;
        this.crazysdk.requestAd("rewarded");
    }
    else
    if (type === "inter")
    {
        this.crazysdk.requestAd("midgame");
        done_cb(null);
    }
    else
    {
        done_cb({code: "ADS_NOT_LOADED", message: "ADS_NOT_LOADED"});
    }
};





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
        gdsdk.showBanner();
    }
    else
    if (type === "inter")
    {
        gdsdk.showBanner();
        done_cb(null);
    }
    else
    {
        done_cb({code: "ADS_NOT_LOADED", message: "ADS_NOT_LOADED"});
    }
};





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





//
// Copyright (C) Mat Hopwood www.drmop.com
// For details of license see license.txt
//

function LibGoogleAnalytics()
{
    LibGoogleAnalytics.Log(">>>> GoogleAnalytics: Created!");
    // NOTES:
}

LibGoogleAnalytics.Log = function(message)
{
    console.log(message);
}

LibGoogleAnalytics.LogError = function(message)
{
    console.log(message);
}

//
// INIT
//

// options
// - trackingId - Tracking ID provided by Google Analytics
LibGoogleAnalytics.prototype.InitAnalytics = function(options)
{
    LibGoogleAnalytics.Log(">>>> GoogleAnalytics: InitAnalytics");
    var self = this;

    (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
        (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
        m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
        })(window,document,"script","https://www.google-analytics.com/analytics.js","ga");
        
    ga("create", options.trackingId, "auto");
}

LibGoogleAnalytics.prototype.addSupportedAPI = function(type)
{
    if (type === "analytics")
    {
        FBInstant.supportedAPIs.push("logEvent");
    }
}

LibGoogleAnalytics.prototype.LogEvent = function(event_name, value, params)
{
    LibGoogleAnalytics.Log(">>>> GoogleAnalytics: LogEvent " + event_name);
    ga("send", "event", "game", event_name, value);
    return true;
}


//
// Copyright (C) Mat Hopwood www.drmop.com
// For details of license see license.txt
//

function LibPayPal()
{
    LibPayPal.Log(">>>> GoogleAnalytics: Created!");
    // NOTES:
    // Only PurchaseProduct is supported
    // GetProducts returns the list of developer supplied products in FBInstant.options.paymentsOptions.products
}

LibPayPal.Log = function(message)
{
    console.log(message);
}

LibPayPal.LogError = function(message)
{
    console.log(message);
}

// Default options
FBInstant.options.paymentsOptions.style = {
    size: "responsive",
    color: "blue",
    shape: "pill",
    label: 'checkout',
    tagline: 'true'
};
FBInstant.options.paymentsOptions.locale = "en_US";
FBInstant.options.paymentsOptions.currency = "USD";
FBInstant.options.paymentsOptions.buttonId = "#paypal-button";
FBInstant.options.paymentsOptions.products = {};

//
// INIT
//
// options
// - sandboxId - Sandbox client id
// - productionId - Production client id
// - style - Style of button, defauklt is small gold pill shaped
// - locale - Locale, default is en_US
// - currency - Users currency, default is USD
// - buttonId - Id of div that will hold the buttonm default is #paypal-button
// - products - A set of PaymentsService.Product objects that defines the inventory
LibPayPal.prototype.InitPayments = function(options, done_cb)
{
    LibPayPal.Log(">>>> PayPal: InitPayments");
    done_cb(null);
}

LibPayPal.prototype.addSupportedAPI = function(type)
{
    if (type === "payments")
    {
        FBInstant.supportedAPIs.push("payments.getCatalogAsync");
        FBInstant.supportedAPIs.push("payments.purchaseAsync");
        FBInstant.supportedAPIs.push("payments.getPurchasesAsync");
        FBInstant.supportedAPIs.push("payments.consumePurchaseAsync");
        FBInstant.supportedAPIs.push("payments.purchaseAsync");
    }
}

LibPayPal.prototype.GetProducts = function(done_cb)
{
    done_cb(null, FBInstant.options.paymentsOptions.products);
}

LibPayPal.prototype.PurchaseProduct = function(options, done_cb)
{
    var gopt = FBInstant.options.paymentsOptions;
    LibPayPal.Log(">>>> PayPal: PurchaseProduct - env " + gopt.devMode);
    var product = gopt.products[options.productID];
    if (product === undefined)
    {
        done_cb({code: "INVALID_PARAM", message: "INVALID_PARAM"}, null);
        return;
    }
    paypal.Button.render({
        // Configure environment
        env: gopt.devMode,
        client: {
            sandbox: gopt.sandboxId,
            production: gopt.productionId
        },
        // Customize button (optional)
        locale: gopt.locale,
        style: gopt.style,
        // Set up a payment
        payment: function(data, actions) {
            return actions.payment.create({
            transactions: [{
                amount: {
                    total: "" + product.price,
                    currency: product.priceCurrencyCode
                },
                description: product.description
            }]
            });
        },
        onAuthorize: function(data, actions) {
            return actions.payment.execute().then(function() {
                var pdata = new PaymentsService.Purchase(options.developerPayload, data.paymentID, product.productID, Date.now, data.paymentToken, null);
                pdata.orderID = data.orderID;
                pdata.returnUrl = data.returnUrl;
                done_cb(null, data);
            });
        },
        onCancel: function (data, actions) {
            done_cb({code: "USER_INPUT", message: "USER_INPUT"}, null);
        }
    }, gopt.buttonId);
}

LibPayPal.prototype.RefundProduct = function(options, done_cb)
{
    done_cb({code: "CLIENT_UNSUPPORTED_OPERATION", message: "CLIENT_UNSUPPORTED_OPERATION"}, null);
}

LibPayPal.prototype.ConsumeProduct = function(options, done_cb)
{
    done_cb({code: "CLIENT_UNSUPPORTED_OPERATION", message: "CLIENT_UNSUPPORTED_OPERATION"}, null);
}

LibPayPal.prototype.GetPurchases = function(done_cb)
{
    done_cb({code: "CLIENT_UNSUPPORTED_OPERATION", message: "CLIENT_UNSUPPORTED_OPERATION"}, null);
}

//
// Copyright (C) Mat Hopwood www.drmop.com
// For details of license see license.txt
//

function AdsService(name)
{
    this.service = LibUtils.ResolveService(name);
    if (this.service === undefined)
    {
        if (name === "crazygames")
            this.service = new LibCrazyGames();
        else if (name === "gamedistribution")
            this.service = new LibGameDistribution();
        else if (name === "adinplay")
            this.service = new LibAdInPlay();
    }
    this.name = name;
    AdsService.instance = this;
    if (FBInstant.ext !== undefined && this.service !== undefined)
    {
        this.service.addSupportedAPI("ads");
    }
}

//
// INIT
//
AdsService.prototype.InitAds = function(options)
{
    if (this.service === undefined)
        return false;
    return this.service.InitAds(options);
}

AdsService.prototype.IsSupported = function()
{
    return this.service !== undefined;
}

//
// Ad requests
//
AdsService.prototype.PreloadAd = function(id, type, done_cb)
{
    if (this.service === undefined)
        return;
    return this.service.PreloadAd(id, type, done_cb);
}

AdsService.prototype.ShowAd = function(id, type, done_cb)
{
    if (this.service === undefined)
        return;
    return this.service.ShowAd(id, type, done_cb);
}












//
// Copyright (C) Mat Hopwood www.drmop.com
// For details of license see license.txt
//

PaymentsService.Product = function(title, product_id, description, image_url, price, currency_code)
{
    this.title = title;
    this.productID = product_id;
    this.description = description;
    this.imageURI = image_url;
    this.price = price;
    this.priceCurrencyCode = currency_code;
};

PaymentsService.Purchase = function(payload, payment_id, product_id, purchase_time, purchase_token, signed_request)
{
    this.developerPayload = payload;
    this.paymentID = payment_id;
    this.productID = product_id;
    this.purchaseTime = purchase_time;
    this.purchaseToken = purchase_token;
    this.signedRequest = signed_request;
};

function PaymentsService(name)
{
    this.service = LibUtils.ResolveService(name);
    if (this.service === undefined)
    {
        if (name === "paypal")
            this.service = new LibPayPal();
        else if (name === "kongregate")
            this.service = new LibKongregate();
    }
    this.name = name;
    PaymentsService.instance = this;
    if (FBInstant.ext !== undefined && this.service !== undefined)
    {
        this.service.addSupportedAPI("payments");
    }
}

//
// INIT
//
PaymentsService.prototype.InitPayments = function(options, done_cb)
{
    if (this.service === undefined)
        return false;
    return this.service.InitPayments(options, done_cb);
}

PaymentsService.prototype.IsSupported = function()
{
    return this.service !== undefined;
}

//
// Ad requests
//
PaymentsService.prototype.GetProducts = function(done_cb)
{
    if (this.service === undefined)
        return;
    return this.service.GetProducts(done_cb);
}

PaymentsService.prototype.PurchaseProduct = function(options, done_cb)
{
    if (this.service === undefined)
        return;
    return this.service.PurchaseProduct(options, done_cb);
}

PaymentsService.prototype.RefundProduct = function(options, done_cb)
{
    if (this.service === undefined)
        return;
    return this.service.RefundProduct(options, done_cb);
}

PaymentsService.prototype.ConsumeProduct = function(options, done_cb)
{
    if (this.service === undefined)
        return;
    return this.service.ConsumeProduct(options, done_cb);
}

PaymentsService.prototype.GetPurchases = function(done_cb)
{
    if (this.service === undefined)
        return;
    return this.service.GetPurchases(done_cb);
}


//
// Copyright (C) Mat Hopwood www.drmop.com
// For details of license see license.txt
//

function AnalyticsService(name)
{
    this.service = LibUtils.ResolveService(name);
    if (this.service === undefined)
    {
        if (name === "google")
            this.service = new LibGoogleAnalytics();
        else if (name === "kongregate")
            this.service = new LibKongregate();
    }
    this.name = name;
    AnalyticsService.instance = this;
    if (FBInstant.ext !== undefined && this.service !== undefined)
    {
        this.service.addSupportedAPI("analytics");
    }
}

//
// INIT
//
AnalyticsService.prototype.InitAnalytics = function(options)
{
    if (this.service === undefined)
        return false;
    return this.service.InitAnalytics(options);
}

AnalyticsService.prototype.IsSupported = function()
{
    return this.service !== undefined;
}

//
// Logging
//
AnalyticsService.prototype.LogEvent = function(event_name, value, params)
{
    if (this.service === undefined)
        return null;
    return this.service.LogEvent(event_name, value, params);
}

