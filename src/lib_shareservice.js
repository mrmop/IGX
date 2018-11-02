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
    if (this.service !== undefined)
    {
        FBInstant.supportedAPIs.push("shareAsync");
        FBInstant.supportedAPIs.push("ext.shareTwitterAsync");
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
