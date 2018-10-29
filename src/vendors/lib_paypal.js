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

LibPayPal.prototype.IsPaymentsSupported = function(type)
{
    return true;
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
