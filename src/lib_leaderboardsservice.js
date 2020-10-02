//
// Copyright (C) Mat Hopwood www.drmop.com
// For details of license see license.txt
//

function LeaderboardsService(name)
{
    this.service = LibUtils.ResolveService(name);
    if (this.service === undefined)
    {
        if (name === "xtralife")
            this.service = new LibXtralife();
        else if (name === "unity")
            this.service = new LibUnity();
        else if (name === "swag")
            this.service = new LibSwag();
    }
    this.name = name;
    LeaderboardsService.instance = this;
    if (FBInstant.ext !== undefined && this.service !== undefined)
    {
        this.service.addSupportedAPI("leaderboards");
    }
}

LeaderboardsService.LbdEntry = function(id, rank, name, score, extra, photo, timestamp)
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

//
// INIT
//
LeaderboardsService.prototype.InitLeaderboards = function(options)
{
    if (this.service === undefined)
        return;
    return this.service.InitLeaderboards(options);
}

LeaderboardsService.prototype.IsSupported = function()
{
    return this.service !== undefined;
}

LeaderboardsService.prototype.LeaderboardGetPaged = function(lbd, board_name, page_number, count, done_cb)
{
    if (this.service === undefined)
    {
        if (done_cb !== undefined)
            done_cb(null);
    }
    else return this.service.LeaderboardGetPaged(lbd, board_name, page_number, count, done_cb);
}

LeaderboardsService.prototype.LeaderboardGetFriendsPaged = function(lbd, board_name, page_number, count, done_cb)
{
    if (this.service === undefined)
    {
        if (done_cb !== undefined)
            done_cb(null);
    }
    else return this.service.LeaderboardGetFriendsPaged(lbd, board_name, page_number, count, done_cb);
}

LeaderboardsService.prototype.LeaderboardGetRank = function(lbd, board_name, done_cb)
{
    if (this.service === undefined)
    {
        if (done_cb !== undefined)
            done_cb(null);
    }
    else return this.service.LeaderboardGetRank(lbd, board_name, done_cb);
}

LeaderboardsService.prototype.LeaderboardSetScore = function(lbd, board_name, score, extra, done_cb)
{
    if (this.service === undefined)
    {
        if (done_cb !== undefined)
            done_cb(false);
    }
    else return this.service.LeaderboardSetScore(lbd, board_name, score, extra, done_cb)
}

LeaderboardsService.prototype.ShowLeaderboard = function(options)
{
    if (this.service === undefined)
    {
        if (done_cb !== undefined)
            done_cb(false);
    }
    else return this.service.ShowLeaderboard(options);
}
