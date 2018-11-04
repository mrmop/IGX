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
        FBInstant.supportedAPIs.push("ext.getReferralCodeAsync");
        FBInstant.supportedAPIs.push("ext.useReferralCodeAsync");
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
