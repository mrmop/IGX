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
        else if (name === "unity")
            this.service = new LibUnity();
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

