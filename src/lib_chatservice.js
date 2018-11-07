//
// Copyright (C) Mat Hopwood www.drmop.com
// For details of license see license.txt
//

ChatService.Message = function(message, user, method, room)
{
    this.message = message;
    this.user = user;
    this.method = method;
    this.room = room;
    this.time = Date.now;
};

function ChatService(name)
{
    this.service = LibUtils.ResolveService(name);
    if (this.service === undefined)
    {
        if (name === "kongregate")
            this.service = new LibKongregate();
    }
    this.name = name;
    ChatService.instance = this;
    if (FBInstant.ext !== undefined && this.service !== undefined)
    {
        this.service.addSupportedAPI("chat");
    }
}

//
// INIT
//
ChatService.prototype.InitChat = function(options)
{
    if (this.service === undefined)
        return false;
    return this.service.InitChat(options);
}

ChatService.prototype.IsSupported = function()
{
    return this.service !== undefined;
}

//
// Logging
//
ChatService.prototype.StartChat = function(options)
{
    if (this.service === undefined)
        return false;
    return this.service.StartChat(options);
}

ChatService.prototype.EndChat = function(options)
{
    if (this.service === undefined)
        return false;
    return this.service.EndChat(options);
}

ChatService.prototype.SendChatMessage = function(options)
{
    if (this.service === undefined)
        return false;
    return this.service.SendChatMessage(options);
}

