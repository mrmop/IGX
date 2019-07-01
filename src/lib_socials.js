//
// Copyright (C) Mat Hopwood www.drmop.com
// For details of license see license.txt
//

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
        Init: function(app_id, done_cb)
        {
            window.fbAsyncInit = function() {
                FB.init({
                    appId            : app_id,
                    autoLogAppEvents : true,
                    xfbml            : true,
                    version          : "v3.1"
                });

                FB.getLoginStatus(function(response)
                {
                    if (done_cb !== undefined)
                        done_cb(response);
                });
            };

            (function(d, s, id){
                var js, fjs = d.getElementsByTagName(s)[0];
                if (d.getElementById(id))
                {
                    if (done_cb !== undefined)
                        done_cb({status: "Facebook SDK already loaded"});
                    return;
                }
                js = d.createElement(s); js.id = id;
                js.src = "https://connect.facebook.net/en_US/sdk.js";
                fjs.parentNode.insertBefore(js, fjs);
            }(document, "script", "facebook-jssdk"));
        },
        Login: function(done_cb)
        {
            FB.login(function(response)
            {
                if (done_cb !== undefined)
                    done_cb(response);
            }, {scope: "public_profile,email"});
        },
        GetProfile: function(done_cb)
        {
            FB.api("/me", function(response) {
                if (done_cb !== undefined)
                    done_cb(response);
            });
        },
        Logout: function(done_cb)
        {
            FB.logout(function(response) {
                if (done_cb !== undefined)
                    done_cb(response);
            });
        }
    }
}




