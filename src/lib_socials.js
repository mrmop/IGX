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




