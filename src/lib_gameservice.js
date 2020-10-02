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
        else if (name === "unity")
            this.service = new LibUnity();
        else if (name === "poki")
            this.service = new LibPoki();
        else if (name === "swag")
            this.service = new LibSwag();
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

GameService.prototype.SetLoadingProgress = function(options)
{
    if (!this.service || !this.service.SetLoadingProgress)
        return;
    return this.service.SetLoadingProgress(options);
}

GameService.prototype.FinishedLoading = function(options)
{
    if (!this.service || !this.service.FinishedLoading)
        return;
    return this.service.FinishedLoading(options);
}
