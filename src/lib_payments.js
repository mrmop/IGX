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
    this.service = null;
    this.name = name;
    // Some vendors support multiple services
    if (GameService.instance !== undefined && GameService.instance.name === name)
    {
        this.service = GameService.instance.service;
    }
    else if (AdsService.instance !== undefined && AdsService.instance.name === name)
    {
        this.service = AdsService.instance.service;
    }
    else
    {
//        if (name === "paypal")
//            this.service = new LibPayPal();
    }
    PaymentsService.instance = this;
    if (this.service !== undefined)
    {
        FBInstant.supportedAPIs.push("payments.getCatalogAsync");
        FBInstant.supportedAPIs.push("payments.purchaseAsync");
        FBInstant.supportedAPIs.push("payments.getPurchasesAsync");
        FBInstant.supportedAPIs.push("payments.consumePurchaseAsync");
        FBInstant.supportedAPIs.push("payments.purchaseAsync");
    }
}

//
// INIT
//
PaymentsService.prototype.InitPayments = function(options, done_cb)
{
    if (this.service === null)
        return false;
    return this.service.InitPayments(options, done_cb);
}

PaymentsService.prototype.IsPaymentsSupported = function()
{
    if (this.service === null)
        return false;
    return this.service.IsPaymentsSupported();
}

//
// Ad requests
//
PaymentsService.prototype.GetProducts = function(done_cb)
{
    if (this.service === null)
        return;
    return this.service.GetProducts(done_cb);
}

PaymentsService.prototype.PurchaseProduct = function(options, done_cb)
{
    if (this.service === null)
        return;
    return this.service.PurchaseProduct(options, done_cb);
}

PaymentsService.prototype.RefundProduct = function(options, done_cb)
{
    if (this.service === null)
        return;
    return this.service.RefundProduct(options, done_cb);
}

PaymentsService.prototype.ConsumeProduct = function(options, done_cb)
{
    if (this.service === null)
        return;
    return this.service.ConsumeProduct(options, done_cb);
}

PaymentsService.prototype.GetPurchases = function(done_cb)
{
    if (this.service === null)
        return;
    return this.service.GetPurchases(options, done_cb);
}

