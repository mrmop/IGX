function GameService(name)
{
    this.service = null;
    this.name = name;
    if (name === "xtralife")
        this.service = new LibXtralife();
    GameService.instance = this;
}

GameService.LbdEntry = function(id, rank, name, score, extra, photo, timestamp)
{
    this.id = id;
    this.rank = rank;
    this.name = name;
    this.score = score;
    this.extra = extra;
    this.photo = photo;
    this.timestamp = timestamp;
    this.getPlayer = function()
    {
        var self = this;
        return {
            rank: this.rank,
            getName: function()
            {
                return self.name;
            },
            getPhoto: function()
            {
                return (self.photo !== undefined) ? self.photo : null;
            },
            getID: function()
            {
                return self.id;
            }
        }
    }
    this.getRank = function()
    {
        return this.rank;
    }
    this.getScore = function()
    {
        return this.score;
    }
    this.getExtraData = function()
    {
        return this.extra;
    }
    this.getTimestamp = function()
    {
        return this.timestamp;
    }
};

GameService.Player = function(id, name, photo, email, lang)
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

GameService.Game = function(id, name, login, icon, location)
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
GameService.prototype.Init = function(key, secret, env)
{
    return this.service.Init(key, secret, env);
}

//
// LOGIN AND ACCOUNTS
//
GameService.prototype.LoginAnonymously = function(allow_anonymous, done_callback)
{
    return this.service.LoginAnonymously(allow_anonymous, done_callback);
}

GameService.prototype.ResumeSession = function(gamer_id, gamer_secret, done_callback)
{
    return this.service.ResumeSession(gamer_id, gamer_secret, done_callback);
};

GameService.prototype.LoginWithCredentials = function(email, password, options, done_callback)
{
    return this.service.LoginWithCredentials(email, password, options, done_callback);
};

GameService.prototype.LoginWithShortCode = function(short_code, done_callback)
{
    return this.service.LoginWithShortCode(short_code, done_callback);
};

GameService.prototype.LoginWithFacebook = function(facebook_access_token, done_callback)
{
    return this.service.LoginWithFacebook (facebook_access_token, done_callback);
};

GameService.prototype.Logout = function(done_callback)
{
    return this.service.Logout(done_callback);
};

GameService.prototype.ConvertAccount = function(network, username_or_id, password_or_secret, done_callback)
{
    return this.service.ConvertAccount(network, username_or_id, password_or_secret, done_callback)
};

GameService.prototype.LinkAccount = function(network, id, secret, done_callback)
{
    return this.service.LinkAccount(network, id, secret, done_callback);
};

GameService.prototype.ResetPassword = function(to_email, from_email, title, body, done_callback)
{
    return this.service.ResetPassword(to_email, from_email, title, body, done_callback);
};

GameService.prototype.ChangePassword = function(new_password, done_callback)
{
    return this.service.ChangePassword(new_password, done_callback);
};

//
// PROFILE
//
GameService.prototype.GetGamerData = function()
{
    return this.service.GetGamerData();
}

GameService.prototype.GetProfileData = function(done_callback)
{
    return this.service.GetProfileData(done_callback);
}

GameService.prototype.GetProfile = function(done_callback)
{
    return this.service.GetProfile(done_callback);
}

GameService.prototype.SetProfile = function(profile_obj, done_callback)
{
    return this.service.SetProfile(profile_obj, done_callback);
}

GameService.prototype.GetGames = function()
{
    return this.service.GetGames();
}

//
// USER SEARCH
//
GameService.prototype.ListUsers = function(match_pattern, start, limit, done_callback)
{
    return this.service.ListUsers(match_pattern, start, limit, done_callback);
}

//
// LEADERBOARDS
//
GameService.prototype.LeaderboardGetPaged = function(board_name, page_number, count, done_callback)
{
    return this.service.LeaderboardGetPaged(board_name, page_number, count, done_callback);
}

GameService.prototype.LeaderboardGetFriendsPaged = function(board_name, page_number, count, done_callback)
{
    return this.service.LeaderboardGetFriendsPaged(board_name, page_number, count, done_callback);
}

GameService.prototype.LeaderboardGetRank = function(board_name, done_callback)
{
    return this.service.LeaderboardGetRank(board_name, done_callback);
}

GameService.prototype.LeaderboardSetScore = function(board_name, sort_order, score, extra, done_callback)
{
    return this.service.LeaderboardSetScore(board_name, sort_order, score, extra, done_callback)
}

GameService.prototype.SetUserData = function(key, value, done_callback)
{
    return this.service.SetUserData(key, value, done_callback);
}

GameService.prototype.GetUserData = function(key, done_callback)
{
    return this.service.GetUserData(key, done_callback);
}

//
// FRIENDS
//
GameService.prototype.GetFriends = function(done_callback)
{
    return this.service.GetFriends(done_callback);
}

GameService.prototype.AddFriend = function(gamer_id, done_callback)
{
    return this.service.AddFriend(gamer_id, done_callback);
}

GameService.prototype.RemoveFriend = function(gamer_id, done_callback)
{
    return this.service.RemoveFriend(gamer_id, done_callback);
}

//
// Events / Messaging
//
GameService.prototype.SendEvent = function(to_id, event_obj, done_callback)
{
    return this.service.SendEvent(to_id, event_obj, done_callback);
}

GameService.prototype.ListenForEvent = function(done_callback)
{
    return this.service.ListenForEvent(done_callback);
}

GameService.prototype.GetAllEvents = function(done_callback)
{
    return this.service.GetAllEvents(done_callback);
}

GameService.prototype.GetReferralCode = function(done_callback)
{
    return this.service.GetReferralCode(done_callback);
}

GameService.prototype.UseReferralCode = function(code, done_callback)
{
    return this.service.UseReferralCode(code, done_callback);
}
