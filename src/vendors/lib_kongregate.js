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