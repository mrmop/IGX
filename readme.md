<h1>IGX - The Facebook Instant Games Wrapper for Web and Facebook Instant Game Developers</h1>

## What is IGX?
IGX stands for Instant Games Extension, it is basically a replacement object for the Facebook Instant Games FBInstant object which enables developers to:
<ul>
<li>Deploy games created that use the <a href="https://developers.facebook.com/docs/games/instant-games">Facebook Instant Games API</a> to the web and mobile with little to no code changes</li>
<li>Deploy HTML5 web games to mobile</li>
<li>Provide a common API across web portals</li>
<li>Build instant game features into existing games before deploying to the Instant Games platform, saving valuable time and money</li>
<li>Bolster the existing Instant Games platform with new features via FBInstant.ext, such as real time user to user communication</li>
</ul>

## Why IGX?
IGX was created to enable HTML5 and Facebook Instant Game developers to maximise their development time and money. It's difficult and time consuming to port games to Instant Games taking into consideration platform features, but its also more difficult to port games from Instant Games to web and mobile because so many features are lost without considerable back-end work to replace them. IGX attempts to replace some features that the IG platform provides to enable the developer to retain as much functionality as possible.

With the aid of Unity, IGX has evolved into an easy to use solution that enables web developers to put their web games and apps onto mobile platforms such as Android and iOS.

## What features are available?
The following features are available:
<ul>
<li><a href="https://github.com/mrmop/IGX/wiki/Getting-Started">Initialisation</a> including <a href="https://github.com/mrmop/IGX/wiki/Social-Sharing">entry point data</a> via the url</li>
<li><a href="https://github.com/mrmop/IGX/wiki/User-Login-and-Management">User login / management (anonymous, credentials, Facebook and shortcode logins)</a></li>
<li><a href="https://github.com/mrmop/IGX/wiki/Data-Persistence">User data persistence on server</a></li>
<li><a href="https://github.com/mrmop/IGX/wiki/Social-Sharing">Facebook sharing</a></li>
<li><a href="https://github.com/mrmop/IGX/wiki/Leaderboards">Leaderboards</a></li>
<li><a href="https://github.com/mrmop/IGX/wiki/Monetisation">Interstitial and Rewarded adverts</a></li>
<li><a href="https://github.com/mrmop/IGX/wiki/Analytics">Analytics</a></li>
<li><a href="https://github.com/mrmop/IGX/wiki/Monetisation">Payments</a></li>
<li>Deployment to Androiid and iOS</li>
</ul>

## What other features are available?
The layer also includes additional functionality that is available outside of the Facebook Instants API, these features include:
<ul>
<li>Login status</li>
<li>User registration</li>
<li>Account conversion</li>
<li>Password management</li>
<li>Profile query and modification</li>
<li>Add / remove / find friends</li>
<li>Real time user to user messaging</li>
<li>User chat</li>
<li>Referral system</li>
<li>Sharing on Twitter and other networks</li>
<li>File upload</li>
</ul>

## What features will be coming?
<ul>
<li>Contexts</li>
<li>Portal specific services</li>
</ul>

## How to get started
Instead of linking to the Facebook Instants JS file, add igx_min.js and xtralife-3.2.3.min.js to your index page.
Note that the back-end used by IGX to provide server side features is called Xtralife (http://xtralife.cloud/), you will need to create a free account and add a game to obtain an API key and secret to use the API.

Once you have an account and have added a game to the system you will be given an API key and secret which you can use to access back-end features.

To set this up in code use:

```
FBInstant.options.apiKey = "Your games Xtralife key";
FBInstant.options.apiSecret = "Your games Xtralife secret";
FBInstant.options.devMode = "sandbox";
FBInstant.createDefaultServices("xtralife");	// Use Xtralife back-end by default
```

The IGX SDK is designed so that different parts of the back-end can be replaced, so if you are not happy with a specific API then you can replace it. 

The IGX SDK consists of the following files:
<ul>
<li>fbinstantx.js - Contains the replacement FBInstant data and functions</li>
<li>fbinstantx_ext.js - Contains extra features that are not found in the Facebook Instant Games API</li>
<li>lib_adsservice.js - Ads services interface</li>
<li>lib_analyticsservice.js - Analytics services interface</li>
<li>lib_chatservice.js - Chat services interface</li>
<li>lib_gameservice.js - Game service interface</li>
<li>lib_leaderboardservice.js - Leaderboards service interface</li>
<li>lib_messagingservice.js - User to user messaging service interface</li>
<li>lib_paymentsservice.js - Payment services interface</li>
<li>lib_referralservice.js - User referral services interface</li>
<li>lib_shareservice.js - Sharing services interface</li>
<li>lib_socials - Wrappers for various social API's, Facebook is currently the only one implemented (provides login etc)</li>
<li>lib_storageservice.js - Server side storage services interface</li>
<li>lib_userservice.js - User services interface</li>
<li>lib_utils.js - General utility code</li>
</ul>
Vendor specific files:
<ul>
<li>lib_adinplay.js - AdInPlay implementation of ads service</li>
<li>lib_crazygames.js - CrazyGames implementation of ads service</li>
<li>lib_gamedistribution.js - Game Distribution implementation of ads service</li>
<li>lib_generic.js - Generic service</li>
<li>lib_googleanalytics.js - Google Analytics implementation of analytics service</li>
<li>lib_kongregate.js - Kongregate implementation of game services</li>
<li>lib_paypal.js - PayPal implementation of payments service using PayPal Checkout</li>
<li>lib_unity.js - Unity implementation of IGX</li>
<li>lib_xtralife.js - Xtralife implementation of game services</li>
</ul>
Unity files:
<ul>
<li>igx.unitypackage - IGX for Unity package</li>
</ul>

## Extensions
A lot of extra functionality has been added to the IGX SDK which is not available in the FBInstant API. These are provided via the FBInstant.ext object. For example, to log in the user via Facebook you would call FBInstant.ext.loginWithFacebookAccessTokenAsync().

## Modules and Vendors
IGX uses a system of modules that can work together or independently to provide various features. For each module you would like to use you need to instantiate it using the following format:

```
new ModuleName("vendor_name");
```
Where module name is the name of the module you would like to create, for example GameService would create the game service moduke. vendor_name is the name of the vendor that you would like to provide the implementation of the module, for example xtralife. An example set up may look like this:

```
new GameService("xtralife");
new StorageService("xtralife");
new UserService("xtralife");
new LeaderboardsService("xtralife");
new MessagingService("xtralife");
new ReferralService("xtralife");
new ShareService("generic");

new AnalyticsService("google");
new AdsService("crazygames");
new PaymentsService("paypal");
```

This looks a bit long winded so a utility function is provided to add the first 7 modules allowing the above 7 lines of code to be replaced with:

```
FBInstant.createDefaultServices("xtralife");
```

This sets up xtralife as the default back-end for all game related services.

## Logging the user in
The user is by default logged in anonymously. This creates an account for them with Xtralife which allows their game data to be stored and retrieved. It also allows them to submit leaderboard scores and retrieve leaderboards. You can disable anonymous login by setting FBInstant.options.usersOptions.allowAnonymous to false. Lets take a look at an example that shows how to log the user in via Facebook:

```
	if (FBInstant.ext !== undefined)
	{
		LibSocial.Facebook.Login(function(response) {
			FBInstant.ext.loginWithFacebookAccessTokenAsync(response.authResponse.accessToken).then(function(error, gamer) {
				// User is now logged in with Facebook and Xtralife
			});
		});
	}
```

Note that if the user is already logged in anonymously then you can log in via the Facebook SDK and convert the account from anonymous using:

```
	if (FBInstant.ext !== undefined)
	{
		FBInstant.ext.convertAccountAsync("facebook", response.authResponse.userID, response.authResponse.accessToken, function(error) {
			// Account was converted
		});
	}
```

You can read more about user management on the <a href="https://github.com/mrmop/IGX/wiki/User-Authentication-and-Management">User Authentication and Management wiki page</a>.

## Entry Point Data
Entry point data is passed via the URL in the data parameter. The data object passed must be url encoded. Note that when you make a call to shareAsync the data object passed in options.data will be sent with the URL. When a user clicks the link the data will be available via getEntryPointData().

## User Management
IGX supports user login and mangagement. The following user providers are currently supported:
<ul>
<li>Xtralife</li>
<li>Kongregate</li>
<li>Unity (Google Play Games and Game Centre)</li>
</ul>

## Server Side Data Persistence
IGX supports server side data persistence for sharing data across devices. The following storage providers are currently supported:
<ul>
<li>Xtralife</li>
</ul>

See the <a href="https://github.com/mrmop/IGX/wiki/Data-Persistence">Data Persistence wiki page</a> for more info.

## Sharing
IGX supports social sharing. The following social sharing providers are currently supported:
<ul>
<li>Facebook</li>
<li>Twitter</li>
<li>Kongregate</li>
<li>Unity</li>
</ul>

See the <a href="https://github.com/mrmop/IGX/wiki/Social-Sharing">Leaderboards wiki page</a> for more info.

## Leaderboards
IGX supports leaderboards. The following leaderboard providers are currently supported:
<ul>
<li>Xtralife</li>
<li>Unity (Google Play Games and Game Centre)</li>
</ul>

See the <a href="https://github.com/mrmop/IGX/wiki/Leaderboards">Social Sharing wiki page</a> for more info.

## Analytics
IGX supports collection of user data for game analytics purposes. The following analytics providers are currently supported:
<ul>
<li>Google Analytics</li>
<li>Kongregate</li>
<li>Unity</li>
</ul>

See the <a href="https://github.com/mrmop/IGX/wiki/Analytics">Analytics wiki page</a> for more info.

## Ads Services and Portals
Over time many portals and ad providers will be added to the IGX SDK. At the time of writing the following ad providers / portals have been added:
<ul>
<li>AdInPlay</li>
<li>Crazy Games</li>
<li>Game Distribution</li>
<li>Unity</li>
</ul>

See the <a href="https://github.com/mrmop/IGX/wiki/Monetisation">Monetisation wiki page</a> for more info.

## Payment Services
Over time a variety of payment processing services will be added to the IGX SDK. At the time of writing the following payment services have been added:
<ul>
<li>Kongregate</li>
<li>PayPal Checkout</li>
<li>App stores via Unity</li>
</ul>

See the <a href="https://github.com/mrmop/IGX/wiki/Monetisation">Monetisation wiki page</a> for more info.

## Chat Services
Over time a variety of user chat services will be added to the IGX SDK. At the time of writing the following chat services have been added:
<ul>
<li>Kongregate</li>
<li>Unity</li>
</ul>

## User to User Game Messaging Services
IGX supports user to user game messaging. The following providers are currently supported:
<ul>
<li>Xtralife</li>
</ul>

See the <a href="https://github.com/mrmop/IGX/wiki/User-to-User-Messaging">User to User Messaging wiki page</a> for more info.

## Important Notices!
<ul>
<li>Before releasing your game ensure that you switch from sandbox to production, users are not shared between the two.</li>
<li>This SDK is very heavily under development so things can change quite quickly.</li>
</ul>

## Integrating Guides
Check the <a href="https://github.com/mrmop/IGX/wiki/Integration-Guides">Integration Guides wiki page</a> for more info

## Issues
When switching from a sandbox to production environment, be aware that data from the sandbox session will still be stored in the browser, so when you try to log into the production environment old stale data from ths sandbox environment will be used. If this occurs you will see errors relating to 401 (Unauthorized) and possibly also No 'Access-Control-Allow-Origin' header is present on the requested resource. To fix this, clear the storage for your domain. For example, to do this in Chrome go to developer tools->Application->Clear storage then click the Clear Site Data button.

## Future Integrations
Below is a list of planned integrations with the IGX SDK:
<ul>
<li>Game Analytics</li>
<li>Miniclip</li>
<li>Newgrounds.io</li>
<li>Poki</li>
<li>Y8</li>
</ul>

Other possible integrations with the IGX SDK:
<ul>
<li>Armor Games</li>
<li>Spil Games</li>
<li>Kizi</li>
</ul>

## Android and iOS App Stores
You can nnow deploy your games and apps  to mobile app stores using the IGX SDK using IGX for Unity.

## Examples of games using IGX
<ul>
<li><a href="http://m.me/725255924476151?game=mergebabies">Merge Babies on Facebook Instant Games</a>.</li>
<li><a href="https://www.crazygames.com/game/merge-babies">Merge Babies on Crazy Games</a>.</li>
<li><a href="https://gamedistribution.com/games/merge-babies">Merge Babies on Game Distribution</a>.</li>
<li><a href="https://www.kongregate.com/games/drmop/mergebabies">Merge Babies on Kongregate</a>.</li>
<li><a href="https://itunes.apple.com/us/app/merge-babies/id1444521624">Merge Babies on the App Store</a>.</li>
<li><a href="https://play.google.com/store/apps/details?id=com.drmop.mergebabies">Merge Babies on Google Play</a>.</li>
</ul>

## Wiki
Read more about IGX on the <a href="https://github.com/mrmop/IGX/wiki">IGX wiki</a>.

## Community
Join the <a href="https://www.facebook.com/IGXSDK/">IGX SDK community on Facebook</a>.

***
Help keep this project alive by donating
[![paypal](https://www.paypalobjects.com/en_US/GB/i/btn/btn_donateCC_LG.gif)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=HJFSS5LUSNKMG)
