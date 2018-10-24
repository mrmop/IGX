var LibSocial = {
    Log: function(message)
    {
        console.log(message);
    },
    
    LogError: function(message)
    {
        console.log(message);
    },

    Facebook: {
        StatusChangeCallback: undefined,
        Init: function(app_id, done_callback)
        {
            window.fbAsyncInit = function() {
                FB.init({
                    appId            : app_id,
                    autoLogAppEvents : true,
                    xfbml            : true,
                    version          : 'v3.1'
                });

                FB.getLoginStatus(function(response)
                {
                    if (done_callback !== undefined)
                        done_callback(response);
                });
            };
            
            (function(d, s, id){
                var js, fjs = d.getElementsByTagName(s)[0];
                if (d.getElementById(id)) {return;}
                js = d.createElement(s); js.id = id;
                js.src = "https://connect.facebook.net/en_US/sdk.js";
                fjs.parentNode.insertBefore(js, fjs);
            }(document, 'script', 'facebook-jssdk'));
        },
        Login: function(done_callback)
        {
            FB.login(function(response)
			{
                if (done_callback !== undefined)
                    done_callback(response);
			}, {scope: "public_profile,email"});
        },
        GetProfile: function(done_callback)
        {
            FB.api('/me', function(response) {
                if (done_callback !== undefined)
                    done_callback(response);
            });
        },
        Logout: function(done_callback)
        {
            FB.logout(function(response) {
                if (done_callback !== undefined)
                    done_callback(response);
            });
        }
    }
    
}





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
    if (this.gamerData)
    {
        this.clan.withGamer(this.gamerData).profile().set(profile_obj, function(error, result) {
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
//            LibXtralife.LogError("GetReferralCode error: " + JSON.stringify(error));
//            LibXtralife.LogError("GetReferralCode result: " + JSON.stringify(result));
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
//            LibXtralife.LogError("UseReferralCode error: " + JSON.stringify(error));
//            LibXtralife.LogError("UseReferralCode result: " + JSON.stringify(result));
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






function LibCrazyGames()
{
    // NOTES:
    // Preloading is not supported
    // Interstitial is supported
    // Rewarded is supported
}

LibCrazyGames.Log = function(message)
{
    console.log(message);
}

LibCrazyGames.LogError = function(message)
{
    console.log(message);
}

//
// INIT
//

// options
// - startedCallback - Can be tapped into to mute audio during video playback
// - finishedCallback - Can be tapped into to unmute audio after video playback
LibCrazyGames.prototype.Init = function(options)
{
    LibCrazyGames.Log(">>>> CrazyGames: Init");
    var self = this;
    this.crazysdk  = window.CrazyGames.CrazySDK.getInstance();
    
    this.adRequested = false;
    this.startedCallback = options.startedCallback;
    this.finishedCallback = options.finishedCallback;

    this.crazysdk.init();

    this.crazysdk.addEventListener("adStarted", function() {
        LibCrazyGames.Log("CrazyGames: adStarted");
        if (self.startedCallback !== undefined)
            self.startedCallback();
    });
    this.crazysdk.addEventListener("adError", function() {
        LibCrazyGames.Log("CrazyGames: adError");
        self.adRequested = false;
        if (self.finishedCallback !== undefined)
            self.finishedCallback(false);
        if (self.watchedCallback !== undefined)
            self.watchedCallback({code: "ADS_NOT_LOADED", message: "ADS_NOT_LOADED"});
        self.watchedCallback = undefined;
    });
    this.crazysdk.addEventListener("adFinished", function() {
        LibCrazyGames.Log("CrazyGames: adFinished");
        self.adRequested = false;
        if (self.finishedCallback !== undefined)
            self.finishedCallback(true);
        if (self.watchedCallback !== undefined)
            self.watchedCallback(null);
        self.watchedCallback = undefined;
    });
}

LibCrazyGames.prototype.IsSupported = function(type)
{
    LibCrazyGames.Log(">>>> CrazyGames: Ads supported");
    return true;
}

//
// Ad requests
//
LibCrazyGames.prototype.PreloadAd = function(id, type, done_callback)
{
    done_callback(null);
};

LibCrazyGames.prototype.ShowAd = function(id, type, done_callback)
{
    if (this.adRequested)
    {
        LibCrazyGames.Log("CrazyGames: Ad already requested");
        self.watchedCallback({code: "ADS_NOT_LOADED", message: "ADS_NOT_LOADED"});
    }
    LibCrazyGames.Log("CrazyGames: Requesting ad");
    
    this.adRequested = true;
    if (type === "video")
    {
        this.watchedCallback = done_callback;
        this.crazysdk.requestAd("rewarded");
    }
    else
    if (type === "inter")
    {
        this.crazysdk.requestAd("midgame");
        done_callback(null);
    }
    else
    {
        done_callback(null);
    }
};





function AdsService(name)
{
    this.service = null;
    this.name = name;
    if (name === "crazygames")
        this.service = new LibCrazyGames();
    AdsService.instance = this;
    if (this.service !== undefined)
    {
        FBInstant.supportedAPIs.push("getInterstitialAdAsync");
        FBInstant.supportedAPIs.push("getRewardedVideoAsync");
        FBInstant.supportedAPIs.push("AdInstance.loadAsync");
        FBInstant.supportedAPIs.push("AdInstance.showAsync");
    }
}

//
// INIT
//
AdsService.prototype.Init = function(options)
{
    if (this.service === null)
        return false;
    return this.service.Init(options);
}

AdsService.prototype.IsSupported = function(id, type)
{
    if (this.service === null)
        return false;
    return this.service.IsSupported(id, type);
}

//
// Ad requests
//
AdsService.prototype.PreloadAd = function(id, type, done_callback)
{
    if (this.service === null)
        return;
    return this.service.PreloadAd(id, type, done_callback);
}

AdsService.prototype.ShowAd = function(id, type, done_callback)
{
    if (this.service === null)
        return;
    return this.service.ShowAd(id, type, done_callback);
}












var FBInstant = {
    options: {
        AllowAnonymous: true,   // When set to true new users will be auto logged in with an anonymous account
        ApiKey: "",             // Game service back-end API key
        ApiSecret: "",          // Game service back-end API secret
        DevMode: "sandbox",     // sandbox or prod
        ShareURI: "http://yourdomain.com/index.php", // URI used by shareAsync dialog
        ShareDlgWidth: 600,     // shareAsync dialog width
        ShareDlgHeight: 400,    // shareAsync dialog height
        AdsOptions: { },        // Ads options
    },
    supportedAPIs: [
        "player.getDataAsync",
        "player.setDataAsync",
        "player.getConnectedPlayersAsync",
        "getLocale",
        "initializeAsync",
        "setLoadingProgress",
        "startGameAsync",
        "getEntryPointData",
        "shareAsync",
        "Leaderboard.getEntriesAsync",
        "Leaderboard.getConnectedPlayerEntriesAsync",
        "Leaderboard.getPlayerEntryAsync",
        "Leaderboard.setScoreAsync",
        "getLeaderboardAsync",
        //"updateAsync",
        //"getEntryPointAsync",
        //"switchGameAsync",
        //"logEvent",
        //"canCreateShortcutAsync",
        //"getInterstitialAdAsync",
        //"getRewardedVideoAsync",
        //"AdInstance.loadAsync",
        //"AdInstance.showAsync",
        //"context.chooseAsync",
        //"context.switchAsync",
        //"context.createAsync",
        //"context.getPlayersAsync",
        //"payments.getCatalogAsync",
        //"payments.purchaseAsync",
        //"payments.getPurchasesAsync",
        //"payments.consumePurchaseAsync",
        //"payments.purchaseAsync",
        "ext.isLoggedIn",
        "ext.getLoginType",
        "ext.getRegistrationDate",
        "ext.loginWithShortCodeAsync",
        "ext.loginAnonymouslyAsync",
        "ext.loginWithEmailAsync",
        "ext.loginWithFacebookAccessTokenAsync",
        "ext.logoutAsync",
        "ext.convertAccountAsync",
        "ext.linkAccountAsync",
        "ext.resetPasswordAsync",
        "ext.changePasswordAsync",
        "ext.getGames",
        "ext.setProfileAsync",
        "ext.addFriendAsync",
        "ext.removeFriendAsync",
        "ext.listUsersAsync",
        "ext.sendEventAsync",
        "ext.getEventsAsync",
        "ext.getReferralCodeAsync",
        "ext.useReferralCodeAsync",
        "ext.shareTwitterAsync",
    ],
    __state: {
        initialized: false
    },
    Log: function(message)
    {
        console.log(message);
    },
    player : {
        getName: function() {
            var data = GameService.instance.GetProfileData();
            if (data === null)
                return null;
            return data.name;
        },
        getPhoto: function() {
            var data = GameService.instance.GetProfileData();
            if (data === null)
                return null;
            var photo = data.photo;
            console.log("photo = " + photo);
            return (photo !== undefined) ? photo : null;
        },
        getID: function() {
            var data = GameService.instance.GetProfileData();
            if (data === null)
                return null;
            return data.gamer_id;
        },
        getDataAsync: function(keys) {
            return new Promise(function(resolve, reject){
                GameService.instance.GetUserData("userData", function(data) {
                    var response = {};
                    if (data === null) {
                        data = localStorage.getItem("userData");
                        data = JSON.parse(data);
                    }
                    else
                    {
                        localStorage.setItem("userData", JSON.stringify(data));
                    }
                    if (data !== null) {
                        keys.forEach(function(key){
                            if (data[key] !== "undefined") {
                                response[key] = data[key];
                            }
                        });
                    }
                    resolve(response);
                });
            });
        },
        setDataAsync: function(data_object) {
            return new Promise(function(resolve, reject) {
                var data = localStorage.getItem("userData");
                var obj = JSON.parse(data);
                if (obj === undefined || obj == null)
                    obj = {};
                for (var attr in data_object)
                    obj[attr] = data_object[attr];
                localStorage.setItem("userData", JSON.stringify(obj));
                GameService.instance.SetUserData("userData", JSON.stringify(obj), function(success) {
                    resolve();
                });
            });
        },
        getStatsAsync: function(keys) {
            // TODO:
        },
        setStatsAsync: function(obj) {
            // TODO:
        },
        incrementStatsAsync: function(obj) {
            // TODO:
        },
        flushDataAsync: function(obj) {
            // TODO:
        },
        getConnectedPlayersAsync: function() {
            return new Promise(function(resolve, reject) {
                GameService.instance.GetFriends(function(friends) {
                    resolve(friends);
                })
            });
        },
        getSignedPlayerInfoAsync: function() {
            // TODO:
            return new Promise(function(resolve, reject) {
                resolve(null);
            });
        }
    },
    context : {
        getID: function() {
            return null;
        },
        chooseAsync: function() {
            // TODO:
            return new Promise(function(resolve, reject) {
                resolve();
            });
        },
        switchAsync: function(contextId) {
            // TODO:
            return new Promise(function(resolve, reject) {
                resolve();
            });
        },
        createAsync: function(userId) {
            // TODO:
            return new Promise(function(resolve, reject) {
                resolve();
            });
        },
        getType: function() {
            // TODO:
            return "SOLO";
        },
        isSizeBetween: function(minSize, maxSize) {
            // TODO:
            return true;
        },
        getPlayersAsync: function() {
            // TDOO:
            return new Promise(function(resolve, reject) {
                var players = [];
                resolve(players);
            });
        }
    },

    payments: {
        getCatalogAsync: function() {
            // TODO:
            return new Promise(function(resolve, reject) {
                reject();
            });
        },
        purchaseAsync: function(product) {
            // TODO:
            return new Promise(function(resolve, reject) {
                reject();
            });
        },
        getPurchasesAsync: function() {
            // TODO:
            return new Promise(function(resolve, reject) {
                reject();
            });
        },
        consumePurchaseAsync: function(purchaseToken) {
            // TODO:
            return new Promise(function(resolve, reject) {
                reject();
            });
        },
        onReady: function(callback) {
        }
    },

    getSupportedAPIs: function()
    {
        return FBInstant.supportedAPIs;
    },

    getLocale: function() {
        var data = GameService.instance.GetProfileData();
        if (data === undefined)
            return "en_US";
        var locale = data.lang;
        return locale + "_";
    },

    initializeAsync: function() {
        return new Promise(function(resolve, reject){
            FBInstant.Log(">>>> initializeAsync");
            var options = FBInstant.options;
            GameService.instance.Init(options.ApiKey, options.ApiSecret, options.DevMode);
            if (AdsService.instance !== undefined)
                AdsService.instance.Init(options.AdsOptions);
            resolve();
        });
    },

    setLoadingProgress: function(progress) {
        return new Promise(function(resolve, reject) {
            resolve();
        });
    },

    startGameAsync: function() {
        return new Promise(function(resolve, reject){
            FBInstant.Log(">>>> startGameAsync");
            GameService.instance.LoginAnonymously(FBInstant.options.AllowAnonymous, function(error, data) {
                if (error === null)
                {
                    FBInstant.__state.initialized = true;
                    FBInstant.Log(">> Login success");
                    resolve();
                }
                else
                {
                    FBInstant.Log(">> Login failed");
                    reject();
                }
            });
        });
    },

    quit: function() {
        // TODO:
    },

    updateAsync: function(config) {
        // TODO:
        return new Promise(function(resolve, reject){
            resolve();
        });
    },

    getEntryPointData: function() {
        FBInstant.Log(">>>> getEntryPointData");
        var data = window.location.search;
        if (data.startsWith("?"))
            data = data.substring(1);
        var prms = data.split('&');
        for (var t = 0; t < prms.length; t++)
        {
            if (prms[t].startsWith("data"))
            {
                var p = prms[t].split('=');
                if (p[1] !== undefined && p[1] !== "")
                {
                    data = decodeURIComponent(p[1]);
                    data = JSON.parse(data);
                    FBInstant.Log(data);
                }
                return data !== undefined ? data : null;
            }
        }
        return null;
    },

    getEntryPointAsync: function() {
        // TODO:
        return new Promise(function(resolve, reject){
            resolve('admin_message');
        });
    },

    setSessionData: function(object) {
        // TODO:
    },

    getPlatform: function() {
        return 'WEB';
    },

    getSDKVersion: function() {
        return '6.2';
    },

    shareAsync: function(options) {
        return new Promise(function(resolve, reject) {
            var title = (options.title !== undefined) ? options.title : "";
            var message = options.text;
            var url = encodeURIComponent(FBInstant.options.ShareURI + "?t=" + title + "&d=" + message);
            if (options.data !== undefined)
                url += "&data=" + JSON.stringify(options.data);
            window.open('https://www.facebook.com/sharer/sharer.php?u=' + url, 'pop', 'width=' + FBInstant.options.ShareDlgWidth + ', height=' + FBInstant.options.ShareDlgHeight + ', scrollbars=no');
            resolve();
        });        
    },

    switchGameAsync: function(appId) {
        return Promise.reject(new Error('Not available'))
    },

    logEvent: function(eventName, value, parameters) {
        // TODO:
        return null;
    },

    onPause: function(callback) {
        window.onblur = function() {
            callback();
        };
    },

    canCreateShortcutAsync: function()
    {
        return Promise.resolve(false);
    },

    Leaderboard: function(name)
    {
        this.name = name;
    },

    getLeaderboardAsync: function(name)
    {
        return new Promise(function(resolve, reject) {
            resolve(new FBInstant.Leaderboard(name));
        });
    },

    AdInstance: function(id, type)
    {
        this.id = id;
        this.type = type;
    },

    getInterstitialAdAsync: function(id)
    {
        return new Promise(function(resolve, reject) {
            if (AdsService.instance.IsSupported(id, "inter"))
                resolve(new FBInstant.AdInstance(id, "inter"));
            else
                reject({code: "CLIENT_UNSUPPORTED_OPERATION", message: "CLIENT_UNSUPPORTED_OPERATION"});
        });        
    },

    getRewardedVideoAsync: function(id)
    {
        return new Promise(function(resolve, reject) {
            if (AdsService.instance.IsSupported(id, "video"))
                resolve(new FBInstant.AdInstance(id, "video"));
            else
                reject({code: "CLIENT_UNSUPPORTED_OPERATION", message: "CLIENT_UNSUPPORTED_OPERATION"});
        });        
    },
};

FBInstant.AdInstance.prototype.getPlacementID = function()
{
    return this.id;
}

FBInstant.AdInstance.prototype.loadAsync = function()
{
    var self = this;
    return new Promise(function(resolve, reject) {
        AdsService.instance.PreloadAd(self.id, self.type, function(error) {
            if (error === null)
                resolve();
            else
                reject(error);
        })
    });        
}

FBInstant.AdInstance.prototype.showAsync = function()
{
    var self = this;
    return new Promise(function(resolve, reject) {
        AdsService.instance.ShowAd(self.id, self.type, function(error) {
            if (error === null)
                resolve();
            else
                reject(error);
        })
    });        
}

FBInstant.Leaderboard.prototype.getEntriesAsync = function(count, start)
{
    var self = this;
    return new Promise(function(resolve, reject) {
        GameService.instance.LeaderboardGetPaged(self.name, ((start / count) | 0) + 1, count, function(entries) {
            resolve(entries);
        });
    })
}

FBInstant.Leaderboard.prototype.getConnectedPlayerEntriesAsync = function(count, start)
{
    var self = this;
    return new Promise(function(resolve, reject) {
        GameService.instance.LeaderboardGetFriendsPaged(self.name, ((start / count) | 0) + 1, count, function(entries) {
            resolve(entries);
        });
    })
}

FBInstant.Leaderboard.prototype.getPlayerEntryAsync = function()
{
    var self = this;
    return new Promise(function(resolve, reject) {
        GameService.instance.LeaderboardGetRank(self.name, function(entry) {
            resolve(entry);
        });
    })
}

FBInstant.Leaderboard.prototype.setScoreAsync = function(score, meta)
{
    var self = this;
    return new Promise(function(resolve, reject) {
        GameService.instance.LeaderboardSetScore(self.name, "hightolow", score, meta, function(entry) {
            resolve(entry);
        });
    })
}

//
// None standard extensions (Check FBInstant.ext is not undefined before using)
//
FBInstant.ext = {
    /**
     * Checks to see if the user is logged in
     * @return true if logged in
     */
    isLoggedIn: function() {
        return GameService.instance.GetProfileData() !== undefined;
    },
    /**
     * Gets the login type, e.g. anonymous, email, facebook etc..
     * @return Login network type
     */
    getLoginType: function() {
        var data = GameService.instance.GetProfileData();
        if (data === undefined)
            return "none";
        return data.network;
    },
    /**
     * Gets the date / time that the user first registered
     * @return List of games
     */
    getRegistrationDate: function() {
        var data = GameService.instance.GetProfileData();
        if (data === undefined)
            return null;
        return data.registerTime;
    },
    /**
     * Logs the player in with the supplied shortcode
     * @param shortcode {string} The Game service shortcode (sent by password reset usually)
     * @return error or null if no error, gamer contains the gamers data
     */
    loginWithShortCodeAsync: function(shortcode) {
        return new Promise(function(resolve, reject){
			GameService.instance.LoginWithShortCode(shortcode, function(error, gamer) {
                resolve(error, gamer);
			})
        });
    },
    /**
     * Logs the player in anonymously
     * @return error or null if no error, gamer contains the gamers data
     */
    loginAnonymouslyAsync: function() {
        return new Promise(function(resolve, reject){
            GameService.instance.LoginAnonymously(FBInstant.options.AllowAnonymous, function(error, data) {
                if (error === null)
                {
                    FBInstant.Log(">> Login success");
                    resolve();
                }
                else
                {
                    FBInstant.Log(">> Login failed");
                    reject();
                }
            });
        });
    },
    /**
     * Logs the player in with an email and password
     * @param email {string} The users email address
     * @param password {string} The users password
     * @param options {object} Login options
     * @return error or null if no error, gamer contains the gamers data
     */
    loginWithEmailAsync: function(email, password, options) {
        return new Promise(function(resolve, reject){
            GameService.instance.LoginWithCredentials(email, password, options, function(error, data) {
                if (error === null)
                {
                    FBInstant.Log(">> Login with email success");
                    resolve();
                }
                else
                {
                    FBInstant.Log(">> Login with email failed");
                    reject();
                }
            });
        });
    },
    /**
     * Logs the player in with the supplied Facebook access token
     * @param facebook_access_token {string} The Facebook access token, this can be retrieved from response.authResponse.accessToken in the FB.getLoginStatus() callback
     * @return error or null if no error, gamer contains the gamers data
     */
    loginWithFacebookAccessTokenAsync: function(facebook_access_token) {
        return new Promise(function(resolve, reject){
			GameService.instance.LoginWithFacebook(facebook_access_token, function(error, gamer) {
                resolve(error, gamer);
			})
        });
    },
    /**
     * Logs the player out
     * @return error or null if no error
     */
    logoutAsync: function() {
        return new Promise(function(resolve, reject){
			GameService.instance.Logout(function(error) {
                resolve(error);
			})
        });
    },
    /**
     * Converts an anonymous account to an email or social network account
     * @param network {string} Type of network to convert account to, email, facebook etc..
     * @param username_or_id {string} Email address for email or ID for Facebook
     * @param password_or_secret {string} Password for email or token for Facebook
     * @return error or null if no error
     */
    convertAccountAsync: function(network, username_or_id, password_or_secret) {
        return new Promise(function(resolve, reject){
			GameService.instance.ConvertAccount(network, username_or_id, password_or_secret, function(error) {
                resolve(error);
			})
        });
    },
    /**
     * Associates a social network account with a game service account
     * @param network {string} Type of network to convert account to, facebook, googleplus etc..
     * @param id {string} ID for Facebook
     * @param secret {string} Token for Facebook
     * @return error or null if no error
     */
    linkAccountAsync: function(network, id, secret) {
        return new Promise(function(resolve, reject){
			GameService.instance.LinkAccount(network, id, secret, function(error) {
                resolve(error);
			})
        });
    },
    /**
     * Sends an email to the players account with a shortcode that can be used to login
     * @param to_email {string} Users emali address
     * @param from_email {string} Your company support email address
     * @param title {string} Email title
     * @param body {Object} Email body, e.g. { body: "You can login with this <b>[[SHORTCODE]]</b>", html: true };
     * @return error or null if no error
     */
    resetPasswordAsync: function(to_email, from_email, title, body) {
        return new Promise(function(resolve, reject){
			GameService.instance.ResetPassword(network, id, secret, function(error) {
                resolve(error);
			})
        });
    },
    /**
     * Changes the users account password
     * @param new_password {string} New password
     * @return error or null if no error
     */
    changePasswordAsync: function(new_password) {
        return new Promise(function(resolve, reject){
			GameService.instance.ChangePassword(new_password, function(error) {
                resolve(error);
			})
        });
    },
    /**
     * Gets list of games that the user has played
     * @return List of games
     */
    getGames: function() {
        return GameService.instance.GetGames();
    },
    /**
     * Sets the players profile data
     * @param profile {object} An object containing profile fields and data
     * @return error or null if no error
     */
    setProfileAsync: function(profile) {
        return new Promise(function(resolve, reject){
			GameService.instance.SetProfile(profile, function(error) {
                resolve(error);
			})
        });
    },
    /**
     * Adds a user as a friend
     * @param id {string} User ID of user to add as a friend
     * @return true if success
     */
    addFriendAsync: function(id) {
        return new Promise(function(resolve, reject){
			GameService.instance.AddFriend(id, function(success) {
                console.log(">>>>>. addFriendAsync " + success)
                resolve(success);
			})
        });
    },
    /**
     * Removes a user as a friend
     * @param id {string} User ID of user to unfriend
     * @return true if success
     */
    removeFriendAsync: function(id) {
        return new Promise(function(resolve, reject){
			GameService.instance.RemoveFriend(id, function(success) {
                resolve(success);
			})
        });
    },
    /**
     * Searches for users using a pattern
     * @param match_pattern {string} A filter used to search for players
     * @param start {number} Index of first user to be returned
     * @param limit {number} Max number of users to return
     * @return List of found users or null if error
     */
    listUsersAsync: function(match_pattern, start, limit) {
        return new Promise(function(resolve, reject){
			GameService.instance.ListUsers(match_pattern, start, limit, function(users) {
                resolve(users);
			})
        });
    },
    /**
     * Send event to another user
     * @param id {string} User ID of user to receive event
     * @param evt {object} Event object to send
     * @return true if success
     */
    sendEventAsync: function(id, evt) {
        return new Promise(function(resolve, reject){
            GameService.instance.SendEvent(id, evt, function(error, data) {
                resolve(error === null);
            });
        });
    },
    /**
     * Collects any pending events
     * @return array of events or null if none
     */
    getEventsAsync: function() {
        return new Promise(function(resolve, reject){
            GameService.instance.GetAllEvents(function(events) {
                resolve(events);
            });
        });
    },
    /**
     * Get a generated referral code
     * @return a referral code or null if failed
     */
    getReferralCodeAsync: function() {
        return new Promise(function(resolve, reject){
            GameService.instance.GetReferralCode(function(code) {
                resolve(code);
            });
        });
    },
    /**
     * Get a generated referral code
     * @return a referral code or null if failed
     */
    useReferralCodeAsync: function(code) {
        return new Promise(function(resolve, reject){
            GameService.instance.UseReferralCode(code, function(success) {
                resolve(success);
            });
        });
    },
    /**
     * Consume a referral code
     * @param options {object} message options, only text is supported at this time
     * @return true if success
     */
    shareTwitterAsync: function(options) {
        return new Promise(function(resolve, reject) {
            var message = options.text;
            var url = encodeURIComponent(message);
            window.open('https://twitter.com/intent/tweet?text=' + url, 'pop', 'width=' + FBInstant.options.ShareDlgWidth + ', height=' + FBInstant.options.ShareDlgHeight + ', scrollbars=no');
            resolve();
        });        
    },
}



