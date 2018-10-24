function LibXtralife()
{
}

LibXtralife.Log = function(message)
{
    console.log(message);
}

LibXtralife.LogError = function(message)
{
    console.log(message);
}

//
// INIT
//
LibXtralife.prototype.Init = function(key, secret, env)
{
    this.clan = Clan(key, secret, env);
    var data = localStorage.getItem("gamer");
    if (data !== null)
        this.gamerData = JSON.parse(data);
}

//
// LOGIN AND ACCOUNTS
//
LibXtralife.prototype.LoginAnonymously = function(allow_anonymous, done_callback)
{
    if (this.gamerData)
    {
        this.ResumeSession(this.gamerData.gamer_id, this.gamerData.gamer_secret, done_callback);
        return;
    }
    if (!allow_anonymous)
    {
        LibXtralife.Log(">>>> Anonymous login disabled");
        if (done_callback !== undefined)
            done_callback(null, null);
        return;
    }
    this.clan.login(null, function(error, gamer)
    {
        LibXtralife.Log(">>>> Creating new anonymous player");
        if (error == null)
        {
            this.gamerData = gamer;
            localStorage.setItem("gamer", JSON.stringify(gamer));
        }
		
        //LibXtralife.Log(this.gamerData)
        if (done_callback !== undefined)
            done_callback(error, gamer);
    }.bind(this));
};

LibXtralife.prototype.ResumeSession = function(gamer_id, gamer_secret, done_callback)
{
    this.clan.resumeSession(gamer_id, gamer_secret, function(error, gamer)
    {
        LibXtralife.Log(">>>> Resuming session");
        if (error == null)
        {
            this.gamerData = gamer;
            localStorage.setItem("gamer", JSON.stringify(gamer));
        }
		
        if (done_callback !== undefined)
            done_callback(error, gamer);
    }.bind(this));
};

LibXtralife.prototype.LoginWithCredentials = function(email, password, options, done_callback)
{
    if (this.gamerData)
    {
        this.ResumeSession(this.gamerData.gamer_id, this.gamerData.gamer_secret, done_callback);
        return;
    }
    this.clan.login("email", email, password, options, function(error, gamer)
    {
        if (error == null)
        {
            this.gamerData = gamer;
            localStorage.setItem("gamer", JSON.stringify(gamer));
        }
        
        if (done_callback !== undefined)
            done_callback(error, gamer);
    }.bind(this));
};

LibXtralife.prototype.LoginWithShortCode = function(short_code, done_callback)
{
    if (this.gamerData)
    {
        this.ResumeSession(this.gamerData.gamer_id, this.gamerData.gamer_secret, done_callback);
        return;
    }
    this.clan.loginWithShortCode(short_code, function(error, gamer)
    {
        if (error == null)
        {
            this.gamerData = gamer;
            localStorage.setItem("gamer", JSON.stringify(gamer));
        }
	
        if (done_callback !== undefined)
            done_callback(error, gamer);
    }.bind(this));
};

LibXtralife.prototype.LoginWithFacebook = function(facebook_access_token, done_callback)
{
    if (this.gamerData)
    {
        this.ResumeSession(this.gamerData.gamer_id, this.gamerData.gamer_secret, done_callback);
        return;
    }
    this.clan.login("facebook", "", facebook_access_token, function(error, gamer)
    {
        if (error == null)
        {
            this.gamerData = gamer;
            localStorage.setItem("gamer", JSON.stringify(gamer));
        }

        if (done_callback !== undefined)
            done_callback(error, gamer);
    }.bind(this));
};

LibXtralife.prototype.Logout = function(done_callback)
{
    this.clan.logout(function(error)
    {
        if (done_callback !== undefined)
            done_callback(error);
    }.bind(this));
};

LibXtralife.prototype.ConvertAccount = function(network, username_or_id, password_or_secret, done_callback)
{
    if (this.gamerData)
    {
        this.clan.withGamer(this.gamerData).convertTo(network, username_or_id, password_or_secret, function(error, result)
        {
            if (done_callback !== undefined)
                done_callback(error, result);
        }.bind(this));
    }
    else
    {
        if (done_callback !== undefined)
            done_callback(null);
    }
};

LibXtralife.prototype.LinkAccount = function(network, id, secret, done_callback)
{
    if (this.gamerData)
    {
        console.log("LinkAccount: " + network + ", " + id + ", " + secret)
        this.clan.withGamer(this.gamerData).link(network, id, secret, function(error, result)
        {
            console.log("LinkAccount error: " + JSON.stringify(error));
            console.log("LinkAccount result: " + JSON.stringify(result));
            if (done_callback !== undefined)
                done_callback(error, result);
        }.bind(this));
    }
    else
    {
        if (done_callback !== undefined)
            done_callback(null);
    }
};

LibXtralife.prototype.ResetPassword = function(to_email, from_email, title, body, done_callback)
{
    this.clan.sendResetMailPassword(to_email, from_email, title, body, function(error, result)
    {
        if (done_callback !== undefined)
            done_callback(error, result);
    }.bind(this));
};

LibXtralife.prototype.ChangePassword = function(new_password, done_callback)
{
    if (this.gamerData)
    {
        this.clan.withGamer(this.gamerData).changePassword(new_password, function(error, result)
        {
            if (done_callback !== undefined)
                done_callback(error, result);
        }.bind(this));
    }
    else
    {
        if (done_callback !== undefined)
            done_callback(null);
    }
};

//
// PROFILE
//
LibXtralife.prototype.GetGamerData = function()
{
    return this.gamerData;
}

LibXtralife.prototype.GetProfileData = function()
{
    if (this.gamerData)
    {
        var prof = this.gamerData.profile;
        return new GameService.Player(this.gamerData.gamer_id, prof.displayName, prof.avatar, prof.email, prof.lang);
    }
    return null;
}

LibXtralife.prototype.GetProfile = function(done_callback)
{
    if (this.gamerData)
    {
        this.clan.withGamer(this.gamerData).profile().get(function(error, result) {
            if (done_callback !== undefined)
                done_callback(error, result);
        });
    }
    else
    {
        if (done_callback !== undefined)
            done_callback(null);
    }
}

LibXtralife.prototype.SetProfile = function(profile_obj, done_callback)
{
    var self = this;
    if (this.gamerData)
    {
        this.clan.withGamer(this.gamerData).profile().set(profile_obj, function(error, result) {
            if (error === null)
            {
                for (var p in profile_obj)
                {
                    self.gamerData.profile[p] = profile_obj[p];
                }
            }
            if (done_callback !== undefined)
                done_callback(error, result);
        });
    }
    else
    {
        if (done_callback !== undefined)
            done_callback(null);
    }
}

LibXtralife.prototype.GetGames = function()
{
    if (this.gamerData)
    {
        var xgames = this.gamerData.games;
        var games = [];
        for (var t = 0; t < xgames.length; t++)
            games.push(new GameService.Game(xgames[t].appid, xgames[t].appid, xgames[t].lastlogin, null, null));
        return games;
    }
    return null;
}


//
// USER SEARCH
//
LibXtralife.prototype.ListUsers = function(match_pattern, start, limit, done_callback)
{
    var self = this;
    if (this.gamerData)
    {
        this.clan.withGamer(this.gamerData).listUsers(encodeURIComponent(match_pattern), limit, start, function(error, result) {
            console.log("ListUsers error: " + JSON.stringify(error));
            console.log("ListUsers result: " + JSON.stringify(result));
            if (done_callback !== undefined)
            {
                if (error !== null)
                    done_callback(null);
                else
                    done_callback(result.result);
            }
        });
    }
    else
    {
        if (done_callback !== undefined)
            done_callback(null);
    }
}

//
// LEADERBOARDS
//
LibXtralife.prototype.LeaderboardGetPaged = function(board_name, page_number, count, done_callback)
{
    var self = this;
    if (this.gamerData)
    {
        this.clan.withGamer(this.gamerData).leaderboards(this.clan.privateDomain).getHighscores(board_name, Number(page_number), Number(count), function(error, result)
        {
            // If the operation went wrong for some reason
            if (error !== null)
            {
                LibXtralife.LogError("Leaderboard Get Paged error: " + error);
                if (done_callback !== undefined)
                    done_callback(null);
            }
            else
            {
                LibXtralife.Log("LeaderboardGetPaged: " + JSON.stringify(result));
                var entries = [];
                var board = result[board_name];
                if (board !== undefined)
                {
                    var entries = [];
                    for (var index = 0; index < board.scores.length; index++)
                    {
                        var lentry = board.scores[index];
                        if (lentry !== undefined)
                            entries.push(new GameService.LbdEntry(lentry.gamer_id, board.rankOfFirst + index, lentry.profile.displayName, lentry.score.score, lentry.score.info, lentry.profile.avatar, lentry.score.timestamp));
                    }
                }
                if (done_callback !== undefined)
                    done_callback(entries);
            }
        });
    }
    else
    {
        if (done_callback !== undefined)
            done_callback(null);
    }
}

LibXtralife.prototype.LeaderboardGetFriendsPaged = function(board_name, page_number, count, done_callback)
{
    var self = this;
    if (this.gamerData)
    {
        this.clan.withGamer(this.gamerData).leaderboards(this.clan.privateDomain).getFriendsHighscores(board_name, Number(page_number), Number(count), function(error, result)
        {
            if (error !== null)
            {
                LibXtralife.LogError("Leaderboard Get Friends Paged error: " + error);
                if (done_callback !== undefined)
                    done_callback(null);
            }
            else
            {
                LibXtralife.Log("LeaderboardGetFriendsPaged: " + JSON.stringify(result));
                var entries = [];
                var board = result[board_name];
                if (board !== undefined)
                {
                    for (var index = 0; index < board.length; index++)
                    {
                        var lentry = board[index];
                        if (lentry !== undefined)
                            entries.push(new GameService.LbdEntry(lentry.gamer_id, lentry.rank, lentry.profile.displayName, lentry.score.score, lentry.score.info, lentry.profile.avatar, lentry.score.timestamp));
                    }
                }
                if (done_callback !== undefined)
                    done_callback(entries);
            }
        });
    }
    else
    {
        if (done_callback !== undefined)
            done_callback(null);
    }
}

LibXtralife.prototype.LeaderboardGetRank = function(board_name, done_callback)
{
    var self = this;
    if (this.gamerData)
    {
        this.clan.withGamer(this.gamerData).leaderboards(this.clan.privateDomain).getCenteredHighscores(board_name, 1, function(error, result)
        {
            var success = null;
            LibXtralife.Log(self.gamerData);
            if (error !== null)
            {
                LibXtralife.LogError("Could not get centered rank: " + JSON.stringify(error));
            }
            else
            {
                var board = result[board_name];
                if (board !== undefined)
                {
                    var score = board.scores[0];
                    if (score !== undefined)
                    {
                        LibXtralife.Log("LeaderboardGetRank: " + JSON.stringify(result));
                        success = new GameService.LbdEntry(score.gamer_id, board.rankOfFirst, score.profile.displayName, score.score.score, score.score.info, score.profile.avatar, score.score.timestamp);
                    }
                }
            }
            if (done_callback !== undefined)
                done_callback(success);
        });
    }
    else
    {
        if (done_callback !== undefined)
            done_callback(null);
    }
}

LibXtralife.prototype.LeaderboardSetScore = function(board_name, sort_order, score, extra, done_callback)
{
    var self = this;
    if (this.gamerData)
    {
        var scoreObject = {"score": Number(score), "info": extra};
        this.clan.withGamer(this.gamerData).leaderboards(this.clan.privateDomain).set(board_name, sort_order, scoreObject, function(error, result)
        {
            if (error !== null)
            {
                LibXtralife.LogError("Leaderboard Set score error: " + error);
                if (done_callback !== undefined)
                    done_callback(false);
            }
            else
            {
                LibXtralife.Log("LeaderboardSetScore: " + JSON.stringify(result));
                if (done_callback !== undefined)
                    done_callback(true);
            }
        });
    }
    else
    {
        if (done_callback !== undefined)
            done_callback(false);
    }
}

LibXtralife.prototype.SetUserData = function(key, value, done_callback)
{
    if (this.gamerData)
    {
        this.clan.withGamer(this.gamerData).gamervfs(this.clan.privateDomain).setValue(key, value, function(error, result)
        {
            if (error !== null)
            {
                LibXtralife.LogError("Set user data error: " + JSON.stringify(error));
                if (done_callback !== undefined)
                    done_callback(false);
            }
            else
            {
                LibXtralife.LogError("User data set: " + result.result);
                if (done_callback !== undefined)
                    done_callback(true);
            }
        });
    }
    else
    {
        if (done_callback !== undefined)
            done_callback(false);
    }
}

LibXtralife.prototype.GetUserData = function(key, done_callback)
{
    if (this.gamerData)
    {
        this.clan.withGamer(this.gamerData).gamervfs(this.clan.privateDomain).getValue(key, function(error, result)
        {
            if (error !== null)
            {
                LibXtralife.LogError("Get user data error: " + JSON.stringify(error));
                if (done_callback !== undefined)
                    done_callback(null);
            }
            else
            {
                LibXtralife.Log("User data get: " + JSON.stringify(result));
                if (done_callback !== undefined)
                    done_callback(result.result[key]);
            }
        });
    }
    else
    {
        if (done_callback !== undefined)
            done_callback(null);
    }
}

//
// FRIENDS
//
LibXtralife.prototype.GetFriends = function(done_callback)
{
    if (this.gamerData)
    {
        this.clan.withGamer(this.gamerData).friends(this.clan.privateDomain).get(function(error, result)
        {
            if (error !== null)
            {
                LibXtralife.LogError("Get friends error: " + JSON.stringify(error));
                if (done_callback !== undefined)
                    done_callback(null);
            }
            else
            {
                LibXtralife.Log("Get friends: " + JSON.stringify(result));

                var players = [];
                var friends = result.friends;
                if (friends !== undefined)
                {
                    for (var index = 0; index < friends.length; index++)
                    {
                        var fentry = friends[index];
                        if (fentry !== undefined)
                            players.push(new GameService.Player(fentry.gamer_id, fentry.profile.displayName, fentry.profile.avatar, fentry.profile.email));
                    }
                }

                if (done_callback !== undefined)
                    done_callback(players);
            }
        });
    }
    else
    {
        if (done_callback !== undefined)
            done_callback(null);
    }
}

LibXtralife.prototype.AddFriend = function(gamer_id, done_callback)
{
    if (this.gamerData)
    {
        this.clan.withGamer(this.gamerData).friends(this.clan.privateDomain).status(gamer_id, "add", function(error, result)
        {
            if (error !== null)
            {
                LibXtralife.LogError("AddFriend error: " + JSON.stringify(error));
                if (done_callback !== undefined)
                    done_callback(false);
            }
            else
            {
                LibXtralife.Log("AddFriend: " + JSON.stringify(result));
                if (done_callback !== undefined)
                    done_callback(true);
            }
        });
    }
    else
    {
        if (done_callback !== undefined)
            done_callback(false);
    }
}

LibXtralife.prototype.RemoveFriend = function(gamer_id, done_callback)
{
    if (this.gamerData)
    {
        this.clan.withGamer(this.gamerData).friends(this.clan.privateDomain).status(gamer_id, "forget", function(error, result)
        {
            if (error !== null)
            {
                LibXtralife.LogError("RemoveFriend error: " + JSON.stringify(error));
                if (done_callback !== undefined)
                    done_callback(false);
            }
            else
            {
                LibXtralife.Log("RemoveFriend: " + JSON.stringify(result));
                if (done_callback !== undefined)
                    done_callback(true);
            }
        });
    }
    else
    {
        if (done_callback !== undefined)
            done_callback(false);
    }
}

//
// Events
//
LibXtralife.prototype.SendEvent = function(to_id, event_obj, done_callback)
{
    if (this.gamerData !== undefined)
    {
        this.clan.withGamer(this.gamerData).events(this.clan.privateDomain).send(to_id, event_obj, null, function(error, result)
        {
            if (error !== null)
            {
                LibXtralife.LogError("SendEvent error: " + JSON.stringify(error));
                if (done_callback !== undefined)
                    done_callback(error, result);
            }
            else
            {
                LibXtralife.Log("SendEvent: " + JSON.stringify(result));
                if (done_callback !== undefined)
                    done_callback(error, result);
            }
        });
    }
    else
    {
        if (done_callback !== undefined)
            done_callback(null);
    }
}

LibXtralife.prototype.ListenForEvent = function(done_callback)
{
    if (this.gamerData !== undefined)
    {
        this.clan.withGamer(this.gamerData).events(this.clan.privateDomain).receive("auto", function(error, result)
        {
            if (error !== null)
            {
                LibXtralife.LogError("ListenForEvent error: " + JSON.stringify(error));
                if (done_callback !== undefined)
                    done_callback(error, result);
            }
            else
            {
                LibXtralife.Log("ListenForEvent: " + JSON.stringify(result));
                if (done_callback !== undefined)
                    done_callback(error, result);
            }
        });
    }
    else
    {
        if (done_callback !== undefined)
            done_callback(null);
    }
}

LibXtralife.prototype.GetAllEvents = function(done_callback)
{
    if (this.gamerData === undefined)
    {
        if (done_callback !== undefined)
            done_callback(null);
        return;
    }
    var events = [];
    events_available = true;
    var self = this;
    var get_events = function()
    {
        self.ListenForEvent(function(error, result) {
            if (result !== null)
            {
                events.push(result);
                get_events();
            }
            else
            {
                if (done_callback !== undefined)
                    done_callback(events);
                        
            }
        });
    }
    get_events();
}

LibXtralife.prototype.GetReferralCode = function(done_callback)
{
    if (this.gamerData !== undefined)
    {
        this.clan.withGamer(this.gamerData).referral(this.clan.privateDomain).getCode(function(error, result)
        {
            if (result !== null)
            {
                if (done_callback !== undefined)
                    done_callback(result.godfathercode);
            }
            else
            {
                if (done_callback !== undefined)
                    done_callback(null);
            }
        });
    }
    else
    {
        if (done_callback !== undefined)
            done_callback(null);
    }
}

LibXtralife.prototype.UseReferralCode = function(code, done_callback)
{
    if (this.gamerData !== undefined)
    {
        this.clan.withGamer(this.gamerData).referral(this.clan.privateDomain).useCode(code, null, function(error, result)
        {
            if (error === null)
            {
                if (done_callback !== undefined)
                    done_callback(true);
            }
            else
            {
                if (done_callback !== undefined)
                    done_callback(false);
            }
        });
    }
    else
    {
        if (done_callback !== undefined)
            done_callback(false);
    }
}
