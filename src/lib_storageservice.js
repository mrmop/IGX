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

