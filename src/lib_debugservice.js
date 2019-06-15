//
// Copyright (C) Mat Hopwood www.drmop.com
// For details of license see license.txt
//

function DebugService(name)
{
    this.service = LibUtils.ResolveService(name);
    if (this.service === undefined)
    {
        if (name === "unity")
            this.service = new LibUnity();
    }
    this.name = name;
    DebugService.instance = this;
    if (FBInstant.ext !== undefined && this.service !== undefined)
    {
        this.service.addSupportedAPI("debug");
    }
}

DebugService.prototype.Show = function(options)
{
    if (this.service === undefined)
        return;
    return this.service.ShowDebug(options);
}

DebugService.prototype.Clear = function()
{
    if (this.service === undefined)
        return;
    return this.service.ClearDebug();
}

DebugService.prototype.Log = function(string)
{
    if (this.service === undefined)
        return;
    return this.service.LogDebug(string);
}

