//
// Copyright (C) Mat Hopwood www.drmop.com
// For details of license see license.txt
//

function UserService(name)
{
    this.service = LibUtils.ResolveService(name);
    if (this.service === undefined)
    {
        if (name === "xtralife")
            this.service = new LibXtralife();
        else if (name === "kongregate")
            this.service = new LibKongregate();
    }
    this.name = name;
    UserService.instance = this;
    if (FBInstant.ext !== undefined && this.service !== undefined)
    {
        this.service.addSupportedAPI("user");
    }
}

UserService.Player = function(id, name, photo, email, lang)
{
    this.id = id;
    this.name = name;
    this.photo = photo;
    this.email = email;
    this.lang = lang;
    this.getName = function()
    {
        return this.name;
    }
    this.getPhoto = function()
    {
        return (this.photo !== undefined) ? this.photo : null;
    }
    this.getID = function()
    {
        return this.id;
    }
    this.getEmail = function()
    {
        return this.email;
    }
    this.getLanguage = function()   // None standard IG
    {
        return this.lang;
    }
};

UserService.Game = function(id, name, login, icon, location)
{
    this.id = id;
    this.name = name;
    this.login = login;
    this.icon = icon;
    this.location = location;
};

//
// INIT
//
UserService.prototype.InitUser = function(options)
{
    if (this.service === undefined)
        return;
    return this.service.InitUser(options);
}

UserService.prototype.IsSupported = function()
{
    return this.service !== undefined;
}

//
// LOGIN AND ACCOUNTS
//
UserService.prototype.Login = function(allow_anonymous, done_cb)
{
    if (this.service === undefined)
    {
        if (done_cb !== undefined)
            done_cb(null, null);
    }
    else return this.service.Login(allow_anonymous, done_cb);
}

UserService.prototype.ResumeSession = function(gamer_id, gamer_secret, done_cb)
{
    if (this.service === undefined)
    {
        if (done_cb !== undefined)
            done_cb({code: "CLIENT_UNSUPPORTED_OPERATION ", message: "CLIENT_UNSUPPORTED_OPERATION "}, null);
    }
    else return this.service.ResumeSession(gamer_id, gamer_secret, done_cb);
};

UserService.prototype.LoginWithCredentials = function(email, password, options, done_cb)
{
    if (this.service === undefined)
    {
        if (done_cb !== undefined)
            done_cb({code: "CLIENT_UNSUPPORTED_OPERATION ", message: "CLIENT_UNSUPPORTED_OPERATION "}, null);
    }
    else return this.service.LoginWithCredentials(email, password, options, done_cb);
};

UserService.prototype.LoginWithShortCode = function(short_code, done_cb)
{
    if (this.service === undefined)
    {
        if (done_cb !== undefined)
            done_cb({code: "CLIENT_UNSUPPORTED_OPERATION ", message: "CLIENT_UNSUPPORTED_OPERATION "}, null);
    }
    else return this.service.LoginWithShortCode(short_code, done_cb);
};

UserService.prototype.LoginWithFacebook = function(facebook_access_token, done_cb)
{
    if (this.service === undefined)
    {
        if (done_cb !== undefined)
            done_cb({code: "CLIENT_UNSUPPORTED_OPERATION ", message: "CLIENT_UNSUPPORTED_OPERATION "}, null);
    }
    else return this.service.LoginWithFacebook (facebook_access_token, done_cb);
};

UserService.prototype.Logout = function(done_cb)
{
    if (this.service === undefined)
    {
        if (done_cb !== undefined)
            done_cb(null);
    }
    else return this.service.Logout(done_cb);
};

UserService.prototype.ConvertAccount = function(network, username_or_id, password_or_secret, done_cb)
{
    if (this.service === undefined)
    {
        if (done_cb !== undefined)
            done_cb({code: "CLIENT_UNSUPPORTED_OPERATION ", message: "CLIENT_UNSUPPORTED_OPERATION "});
    }
    else return this.service.ConvertAccount(network, username_or_id, password_or_secret, done_cb)
};

UserService.prototype.LinkAccount = function(network, id, secret, done_cb)
{
    if (this.service === undefined)
    {
        if (done_cb !== undefined)
            done_cb({code: "CLIENT_UNSUPPORTED_OPERATION ", message: "CLIENT_UNSUPPORTED_OPERATION "});
    }
    else return this.service.LinkAccount(network, id, secret, done_cb);
};

UserService.prototype.ResetPassword = function(to_email, from_email, title, body, done_cb)
{
    if (this.service === undefined)
    {
        if (done_cb !== undefined)
            done_cb({code: "CLIENT_UNSUPPORTED_OPERATION ", message: "CLIENT_UNSUPPORTED_OPERATION "});
    }
    else return this.service.ResetPassword(to_email, from_email, title, body, done_cb);
};

UserService.prototype.ChangePassword = function(new_password, done_cb)
{
    if (this.service === undefined)
    {
        if (done_cb !== undefined)
            done_cb({code: "CLIENT_UNSUPPORTED_OPERATION ", message: "CLIENT_UNSUPPORTED_OPERATION "});
    }
    else return this.service.ChangePassword(new_password, done_cb);
};

//
// PROFILE
//
UserService.prototype.GetGamerData = function()
{
    if (this.service === undefined)
        return null;
    else return this.service.GetGamerData();
}

UserService.prototype.GetProfileData = function()
{
    if (this.service === undefined)
        return null;
    else return this.service.GetProfileData();
}

UserService.prototype.GetProfile = function(done_cb)
{
    if (this.service === undefined)
    {
        if (done_cb !== undefined)
            done_cb({code: "CLIENT_UNSUPPORTED_OPERATION ", message: "CLIENT_UNSUPPORTED_OPERATION "});
    }
    else return this.service.GetProfile(done_cb);
}

UserService.prototype.SetProfile = function(profile_obj, done_cb)
{
    if (this.service === undefined)
    {
        if (done_cb !== undefined)
            done_cb({code: "CLIENT_UNSUPPORTED_OPERATION ", message: "CLIENT_UNSUPPORTED_OPERATION "});
    }
    else return this.service.SetProfile(profile_obj, done_cb);
}

UserService.prototype.GetGames = function()
{
    if (this.service === undefined)
        return null;
    else return this.service.GetGames();
}

//
// USER SEARCH
//
UserService.prototype.ListUsers = function(match_pattern, start, limit, done_cb)
{
    if (this.service === undefined)
    {
        if (done_cb !== undefined)
            done_cb(null);
    }
    else return this.service.ListUsers(match_pattern, start, limit, done_cb);
}

//
// FRIENDS
//
UserService.prototype.GetFriends = function(done_cb)
{
    if (this.service === undefined)
    {
        if (done_cb !== undefined)
            done_cb(null);
    }
    else return this.service.GetFriends(done_cb);
}

UserService.prototype.AddFriend = function(gamer_id, done_cb)
{
    if (this.service === undefined)
    {
        if (done_cb !== undefined)
            done_cb(false);
    }
    else return this.service.AddFriend(gamer_id, done_cb);
}

UserService.prototype.RemoveFriend = function(gamer_id, done_cb)
{
    if (this.service === undefined)
    {
        if (done_cb !== undefined)
            done_cb(false);
    }
    else return this.service.RemoveFriend(gamer_id, done_cb);
}

