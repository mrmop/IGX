//
// Copyright (C) Mat Hopwood www.drmop.com
// For details of license see license.txt
//

function MessagingService(name)
{
    this.service = LibUtils.ResolveService(name);
    if (this.service === undefined)
    {
        if (name === "xtralife")
            this.service = new LibXtralife();
    }
    this.name = name;
    MessagingService.instance = this;
    if (this.service !== undefined)
    {
        FBInstant.supportedAPIs.push("ext.sendEventAsync");
        FBInstant.supportedAPIs.push("ext.getEventsAsync");
    }
}

//
// INIT
//
MessagingService.prototype.InitMessaging = function(options)
{
    if (this.service === undefined)
        return;
    return this.service.InitMessaging(options);
}

MessagingService.prototype.SendEvent = function(to_id, event_obj, done_cb)
{
    if (this.service === undefined)
    {
        if (done_cb !== undefined)
            done_cb({code: "CLIENT_UNSUPPORTED_OPERATION ", message: "CLIENT_UNSUPPORTED_OPERATION "});
    }
    else return this.service.SendEvent(to_id, event_obj, done_cb);
}

MessagingService.prototype.ListenForEvent = function(done_cb)
{
    if (this.service === undefined)
    {
        if (done_cb !== undefined)
            done_cb({code: "CLIENT_UNSUPPORTED_OPERATION ", message: "CLIENT_UNSUPPORTED_OPERATION "});
    }
    else return this.service.ListenForEvent(done_cb);
}

MessagingService.prototype.GetAllEvents = function(done_cb)
{
    if (this.service === undefined)
    {
        if (done_cb !== undefined)
            done_cb(null);
    }
    else return this.service.GetAllEvents(done_cb);
}
