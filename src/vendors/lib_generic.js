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

