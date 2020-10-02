//
// Copyright (C) Mat Hopwood www.drmop.com
// For details of license see license.txt
//
// Options:
//  container                   // Container element that hosts the game (best to wrap canvas in a div and use the div as the container)
//  apiKey                      // API Key
//  theme                       // Theme name
//  devMode                     // sandbox for debug, prod for no debug
//
// getLeaderboardAsync() accepts a second property called options which supplies the following options:
//  period: "weekly",           // Time period, can be alltime, daily, weekly, monthly
//  type: "standard",           // Type, standard or weekly. If weekly then scores for each day of week are returned, otherwise single score
//  targetDate: null,           // Target start date in format YYYY-MM-DD
//  useDaily: "no",             // Use score day instead of score post date
//  valueFormat: "default",     // Score value format, can be default, shortDuration, longDuration, seconds, ms
//
// LeaderboardSetScore() accepts a daily property in the extra meta parameter, passing true will cause the daily score to be set for the supplied date
//
// Other info:
// LeaderboardGetRank() returns a single leaderboard entry with a daily property that contains a list of daily scores

function LibSwag()
{
}

LibSwag.Log = function(message)
{
    console.log(message);
}

LibSwag.LogError = function(message)
{
    console.log(message);
}

//
// INIT
//
LibSwag.prototype.Init = function(options)
{
    console.log(">>>> Init SWAG API");
    this.gamerData = null;
    this.swagApi = SWAGAPI.getInstance({
        wrapper: options.container,
        api_key: options.apiKey,
        theme: (options.theme === undefined) ? "shockwave" : options.theme,
        debug: options.devMode === "sandbox"
      });
	console.log(this.swagApi);
}

LibSwag.prototype.InitLeaderboards = function(options)
{
}

LibSwag.prototype.InitAnalytics = function(options)
{
}

LibSwag.prototype.InitMessaging = function(options)
{
}

LibSwag.prototype.InitReferrals = function(options)
{
}

LibSwag.prototype.InitShare = function(options)
{
}

LibSwag.prototype.InitStorage = function(options)
{
}

LibSwag.prototype.InitUser = function(options)
{
}

LibSwag.prototype.addSupportedAPI = function(type)
{
    if (type === "leaderboards")
    {
        FBInstant.supportedAPIs.push("Leaderboard.getEntriesAsync");
        FBInstant.supportedAPIs.push("Leaderboard.getConnectedPlayerEntriesAsync");
        FBInstant.supportedAPIs.push("Leaderboard.getPlayerEntryAsync");
        FBInstant.supportedAPIs.push("Leaderboard.setScoreAsync");
        FBInstant.supportedAPIs.push("getLeaderboardAsync");
        FBInstant.supportedAPIs.push("ext.showLeaderboard");
    }
    else
    if (type === "storage")
    {
        FBInstant.supportedAPIs.push("player.getDataAsync");
        FBInstant.supportedAPIs.push("player.setDataAsync");
    }
    else
    if (type === "user")
    {
        FBInstant.supportedAPIs.push("ext.isLoggedIn");
//        FBInstant.supportedAPIs.push("ext.isSubscriber");
    }
    else
    if (type === "analytics")
    {
        FBInstant.supportedAPIs.push("logEvent");
    }
}

//
// LOGIN AND ACCOUNTS
//
LibSwag.prototype.Login = function(allow_anonymous, done_cb)
{
    LibSwag.Log(">>>> SWAG Starting session");
    var self = this;
    this.swagApi.startSession()
    .then(function()
    {
        LibSwag.Log(">>>> SWAG Session started");
        
        self.player = self.swagApi.getCurrentEntity();

        if (done_cb !== undefined)
            done_cb(null, null);
        self.gamerData = { network: "swag" };
    }); 
};

//
// PROFILE
//
LibSwag.prototype.GetGamerData = function()
{
    return this.gamerData;
}

LibSwag.prototype.GetProfileData = function()
{
    if (this.player === undefined)
    {
        return null;
    }
    return new UserService.Player(this.player._id, this.player.memberName, null, null, LibUtils.GetLocale());
}

//
// LEADERBOARDS
//
LibSwag.prototype.ShowLeaderboard = function(options)
{
    if (this.swagApi === undefined)
    {
        if (options.closed !== undefined)
            options.closed();
        return;
    }
    if (this.dialog_open)
        return;
    var self = this;
    this.dialog_open = true;
    this.swagApi.showDialog("scores", { title: options.title });
    this.swagApi.on('DIALOG_CLOSED', function() {
        if (options.closed !== undefined)
            options.closed();
        self.dialog_open = false;
    });
}
LibSwag.prototype.LeaderboardGetPaged = function(lbd, board_name, page_number, count, done_cb)
{
    console.log(">>>> SWAG LeaderboardGetPaged");
    if (this.swagApi === undefined)
    {
        if (done_cb !== undefined)
            done_cb(null);
        return;
    }
    var self = this;
    var options = lbd.options;
    this.swagApi.getScores({
        type: options.type,
        level_key: board_name,
        current_user: false,
        period: options.period,
        target_date: options.targetDate,
        use_daily: options.useDaily,
        value_formatter: options.valueFormat
    })
    .then(function(scores) {
        var entries = [];
        if (scores)
        {
            console.log(">>>> SWAG scores");
            console.log(scores);
            if (scores.message !== undefined)
            {
                if (done_cb !== undefined)
                    done_cb(null);
                return;
            }
            for (var d in scores)
            {
                var score = scores[d];
                var pos = parseInt(score.position);
                var value = score.value;
                if (value === undefined)
                    value = 0;
                var entry = new LeaderboardsService.LbdEntry(score.screen_name, pos, score.screen_name, value, null, null, score.date_created);
                entries.push(entry);
            }
        }
        if (done_cb !== undefined)
            done_cb(entries);
    });    
}

LibSwag.prototype.LeaderboardGetFriendsPaged = function(lbd, board_name, page_number, count, done_cb)
{
    if (done_cb !== undefined)
        done_cb(null);
}

LibSwag.prototype.LeaderboardGetRank = function(lbd, board_name, done_cb)
{
    console.log(">>>> SWAG LeaderboardGetRank");
    if (this.swagApi === undefined)
    {
        if (done_cb !== undefined)
            done_cb(null);
        return;
    }
    var self = this;
    var options = lbd.options;
    this.swagApi.getScores({
        type: options.type,
        level_key: board_name,
        current_user: true,
        period: options.period,
        target_date: options.targetDate,
        use_daily: options.useDaily,
        value_formatter: options.valueFormat
    })
    .then(function(scores) {
		console.log(scores)		
        var entry = new LeaderboardsService.LbdEntry(self.player._id, 0, self.player.memberName, 0, null, null, null);
        entry.daily = [];
        if (scores && scores.length > 0)
        {
            console.log(">>>> SWAG player scores");
            if (scores.message !== undefined)
            {
                if (done_cb !== undefined)
                    done_cb(null);
                return;
            }
            for (var d in scores)
            {
                var score = scores[d];
                var day = parseInt(score.day_sort);
                var pos = parseInt(score.position);
                var value = score.value;
                if (value === undefined)
                    value = 0;
                entry.daily.push({
                    day: day,
                    day_name: score.day_name,
                    pos: pos,
                    score: value
                });
            }
            entry.daily.sort(function(a, b) {
                return a.day - b.day;
            });
        }
        if (done_cb !== undefined)
            done_cb(entry);
    });
}

LibSwag.prototype.LeaderboardSetScore = function(lbd, board_name, score, extra, done_cb)
{
    if (this.swagApi === undefined)
    {
        if (done_cb !== undefined)
            done_cb(null);
        return;
    }
    if (extra !== undefined && extra !== null && extra.daily)
    {
        this.swagApi.postDailyScore(extra.date, board_name, score)
        .then(function(error) {
            console.log(">>>> LeaderboardSetScore postDailyScore");
            console.log(extra.date);
            console.log(error);
            if (done_cb !== undefined)
                done_cb(error === null);
        });
    }
    else
    {
        this.swagApi.postScore(board_name, score)
        .then(function(error) {
            console.log(">>>> LeaderboardSetScore postScore");
            console.log(error);
            if (done_cb !== undefined)
                done_cb(error === null);
        });
    }

}

//
// STORAGE
//
LibSwag.prototype.SetUserData = function(key, value, done_cb)
{
    if (this.swagApi === undefined)
    {
        if (done_cb !== undefined)
            done_cb(false);
        return;
    }
    console.log(">>>> SWAG Saving data");
    console.log(key);
    console.log(value);
    this.swagApi.postDatastore(key, value)
    .then(function() {
        console.log(">>>> SWAG Saved data");
        if (done_cb !== undefined)
            done_cb(true);
    });
}

LibSwag.prototype.GetUserData = function(key, done_cb)
{
    console.log(">>>> SWAG GetUserData");
    if (this.swagApi === undefined)
    {
        if (done_cb !== undefined)
            done_cb(false);
        return;
    }
    this.swagApi.getUserDatastore()
    .then(function(data) {
        console.log(">>>> SWAG Data loaded");
        console.log(data);
        if (done_cb !== undefined)
        {
            for (var t = 0; t < data.length; t++)
            {
                if (data[t].key === key)
                {
                    console.log(">>>> SWAG key found");
                    console.log(data);
                    console.log(data[t]);
                    done_cb(JSON.parse(data[t].value));
                    return;
                }
            }
            done_cb(null);
        }
    });
}

//
// ANALYTICS
//
LibSwag.prototype.LogEvent = function(event_name, value, params)
{
    if (event_name === "startGame")
    {
        this.swagApi.startGame()
        .then(function(res) {
            console.log(">>>> SWAG log event startGame");
            console.log(res);
            if (params.done_cb !== undefined)
            {
                params.done_cb(res);
            }
        });
    }
    else if (event_name === "endGame")
    {
        this.swagApi.endGame(params.options)
        .then(function(res) {
            console.log(">>>> SWAG log event endGame");
            console.log(res);
            if (params.done_cb !== undefined)
            {
                params.done_cb(res);
            }
        });
    }
}
