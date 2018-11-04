//
// Copyright (C) Mat Hopwood www.drmop.com
// For details of license see license.txt
//

//
// None standard extensions (Check FBInstant.ext is not undefined before using)
//
FBInstant.ext = {
    /**
     * Checks to see if the user is logged in
     * @return true if logged in
     */
    isLoggedIn: function() {
        return UserService.instance.GetProfileData() !== undefined;
    },
    /**
     * Gets the login type, e.g. anonymous, email, facebook etc..
     * @return Login network type
     */
    getLoginType: function() {
        var data = UserService.instance.GetProfileData();
        if (data === undefined)
            return "none";
        return data.network;
    },
    /**
     * Gets the date / time that the user first registered
     * @return List of games
     */
    getRegistrationDate: function() {
        var data = UserService.instance.GetProfileData();
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
            UserService.instance.LoginWithShortCode(shortcode, function(error, gamer) {
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
            UserService.instance.LoginAnonymously(FBInstant.options.userOptions.allowAnonymous, function(error, data) {
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
            UserService.instance.LoginWithCredentials(email, password, options, function(error, data) {
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
            UserService.instance.LoginWithFacebook(facebook_access_token, function(error, gamer) {
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
            UserService.instance.Logout(function(error) {
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
            UserService.instance.ConvertAccount(network, username_or_id, password_or_secret, function(error) {
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
            UserService.instance.LinkAccount(network, id, secret, function(error) {
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
            UserService.instance.ResetPassword(to_email, from_email, title, body, function(error) {
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
            UserService.instance.ChangePassword(new_password, function(error) {
                resolve(error);
            })
        });
    },
    /**
     * Gets list of games that the user has played
     * @return List of games
     */
    getGames: function() {
        return UserService.instance.GetGames();
    },
    /**
     * Sets the players profile data
     * @param profile {object} An object containing profile fields and data
     * @return error or null if no error
     */
    setProfileAsync: function(profile) {
        return new Promise(function(resolve, reject){
            UserService.instance.SetProfile(profile, function(error) {
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
            UserService.instance.AddFriend(id, function(success) {
                console.log(">>>>> addFriendAsync " + success)
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
            UserService.instance.RemoveFriend(id, function(success) {
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
            UserService.instance.ListUsers(match_pattern, start, limit, function(users) {
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
            MessagingService.instance.SendEvent(id, evt, function(error, data) {
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
            MessagingService.instance.GetAllEvents(function(events) {
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
            ReferralService.instance.GetReferralCode(function(code) {
                resolve(code);
            });
        });
    },
    /**
     * Consume a referral code
     * @return true if success
     */
    useReferralCodeAsync: function(code) {
        return new Promise(function(resolve, reject){
            ReferralService.instance.UseReferralCode(code, function(success) {
                resolve(success);
            });
        });
    },
    /**
     * Share on Twitter
     * @param options {object} message options, only text is supported at this time
     */
    shareTwitterAsync: function(options) {
        return new Promise(function(resolve, reject) {
            ShareService.instance.ShareService(options);
            resolve();
        });        
    },
}



