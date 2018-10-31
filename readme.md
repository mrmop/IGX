<h1>IGX - The Facebook Instant Games Wrapper for Web and Facebook Instant Game Developers</h1>

<h2>What is IGX?</h2>
IGX stands for Instant Games Extension, it is basically a replacement object for the Facebook Instant Games FBInstant object which enables developers to:
<ul>
<li>Deploy games created that use the <a href="https://developers.facebook.com/docs/games/instant-games">Facebook Instant Games API</a> to the web and beyond with little to no code changes</li>
<li>Build instant game features into existing games before deploying to the Instant Games platform, saving valuable time and money</li>
<li>Bolster the existing Instant Games platform with new features via FBInstant.ext, such as real time user to user communication</li>
</ul>

<h2>Why IGX?</h2>
IGX was created to enable developers to maximise their development time and money. It's difficult and time consuming to port games to Instant Games taking into consideration platform features, but its also more difficult to port games from Instant Games to web because so many features are lost without considerable back-end work to replace them. IGX attempts to replace some features that the IG platform provides to enable the developer to retain as much functionality as possible.

<h2>What features are available?</h2>
The following features are available:
<ul>
<li>Initialisation including entry point data via the url</li>
<li>User login / management (anonymous, credentials, Facebook and shortcode logins)</li>
<li>User data persistence on server</li>
<li>Facebook sharing</li>
<li>Leaderboards</li>
<li>Interstitial and Rewarded adverts</li>
<li>Analytics</li>
<li>Payments</li>
</ul>

<h2>What other features are available?</h2>
The layer also includes additional functionality that is available outside of the Facebook Instants API, these features include:
<ul>
<li>Login status</li>
<li>User registration</li>
<li>Account conversion</li>
<li>Password management</li>
<li>Profile query and modification</li>
<li>Add / remove / find friends</li>
<li>Real time user to user messaging</li>
<li>Referral system</li>
<li>Sharing on Twitter</li>
</ul>

<h2>What features will be coming?</h2>
<ul>
<li>Contexts</li>
<li>Portal specific services</li>
</ul>

<h2>How to get started</h2>
Instead of linking to the Facebook Instants JS file, add igx_min.js and xtralife-3.2.1.min.js to your index page.
Note that the back-end used by IGX to provide server side features is called Xtralife (http://xtralife.cloud/), you will need to create a free account and add a game to obtain an API key and secret to use the API.

Once you have an account and have added a game to the system you will be given an API key and secret which you can use to access back-end features.

To set this up in code use:

```
FBInstant.options.apiKey = "Your games Xtralife key";
FBInstant.options.apiSecret = "Your games Xtralife secret";
FBInstant.options.devMode = "sandbox";
new GameService("xtralife");	// Use Xtralife back-end
```

The IGX SDK is designed so that back-ends can be swapped, so if you are not happy with a specific API then you can replace it. If you do not want to take advantage of any of the features then pass "none" in place of "xtralife".

The IGX SDK consists of the following files:
<ul>
<li>fbinstantx.js - Contains the replacement FBInstant data and functions</li>
<li>fbinstantx_ext.js - Contains extra features that are not found in the Facebook Instant Games API</li>
<li>lib_ads.js - Ads services interface</li>
<li>lib_analytics.js - Analytics services interface</li>
<li>lib_gameservice.js - Game service interface which wraps game services</li>
<li>lib_payments.js - Payment services interface</li>
<li>lib_socials - Wrappers for various social API's, Facebook is currently the only one implemented (provides login etc)</li>
<li>lib_utils.js - General utility code</li>
</ul>
Vendor specific files:
<ul>
<li>lib_crazygames.js - CrazyGames implementation of ads service</li>
<li>lib_gamedistribution.js - Game Distribution implementation of ads service</li>
<li>lib_googleanalytics.js - Google Analytics implementation of analytics service</li>
<li>lib_paypal.js - PayPal implementation of payments service using PayPal Checkout</li>
<li>lib_xtralife.js - Xtralife implementation of game service</li>
</ul>

<h2>Extensions</h2>
A lot of extra functionality has been added to the IGX SDK which is not available in the FBInstant API. These are provided via the FBInstant.ext object. For example, to log in the user via Facebook you would call FBInstant.ext.loginWithFacebookAccessTokenAsync().

<h2>Logging the user in</h2>
The user is by default logged in anonymously. This creates an account for them with Xtralife which allows their game data to be stored and retrieved. It also allows them to submit leaderboard scores and retrieve leaderboards. You can disable anonymous login by setting FBInstant.options.allowAnonymous to false. Lets take a look at an example that shows how to log the user in via Facebook:

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

<h2>Entry Point Data</h2>
Entry point data is passed via the URL in the data parameter. The data object passed must be url encoded. Note that when you make a call to shareAsync the data object passed in options.data will be sent with the URL. When a user clicks the link the data will be available via getEntryPointData().

<h2>Sharing</h2>
In order for Facebook sharing to work via shareAsync, you must assign the URL which takes care of the sharing to FBInstant.options.shareURI. Special parameters will be passed to this URL which enables Facebook to pull a proper preview of what is being shared. The destination URL will need to be a script that can handle the passed parameters. An example script is shown below:

```
<!DOCTYPE html> 
<html>  
<head>  
	<meta charset='utf-8'>  
	<meta name='description' content='Your Game Name'>
	<meta name='keywords' content=''>
	<title>Your Game Name</title>
	<meta property="og:type" content="article" />
	<meta property='og:image' content='https://yourdomain.com/your_nice_image.jpg' />
	<link rel='stylesheet' type='text/css' href='styles.css'>
<?php
	$title = $_GET['t'];
	if ($title != '')
	{
		$title = htmlspecialchars($title);
		echo "    <meta property='og:title' content='" . $title . "' />\n";
	}
	else
	{
		echo "    <meta property='og:title' content='Your Game Name' />";
	}

	$description = $_GET['d'];
	if ($description != '')
	{
		$description = htmlspecialchars(urldecode($description));
		echo "    <meta property='og:description' content='" . $description . "' />\n";
	}
	else
	{
		echo "    <meta property='og:description' content='<Enter a description here>' />";
	}
?>
</head>
<body>
</body>  
</html>
```

Note that many web portals do not support PHP index files so you will need to add your own generic custom OG tags to your index.html, e.g.:
```
	<meta property="og:type" content="article" />
	<meta property='og:image' content='https://yourdomain.com/your_nice_image.jpg' />
	<meta property='og:title' content='Your Game Name' />"
	<meta property='og:description' content='<Enter a description here>' />"
```
You do lose the custom title and description but at least you can still have a meaningful share preview image.

<h2>Analytics</h2>
IGX supports collection of user data for game analytics purposes. The following analytics providers are currrently supported:
<ul>
<li>Google Analytics</li>
</ul>

<h2>Ads Services and Portals</h2>
Over time many portals and ad providers will be added to the IGX SDK. At the time of writing the following ad providers / portals have been added:
<ul>
<li>Crazy Games</li>
<li>Game Distribution</li>
</ul>

<h2>Payment Services</h2>
Over time a variety of payment processing services will be added to the IGX SDK. At the time of writing the following payment services have been added:
<ul>
<li>PayPal Checkout</li>
</ul>

<h2>Important Notices!</h2>
<ul>
<li>Before releasing your game ensure that you switch from sandbox to production, users are not shared between the two.</li>
<li>This SDK is very heavily under development so things can change quite quickly.</li>
</ul>

<h2>Integrating Crazy Games</h2>
To integrate Crazy Games, sign up and create a developer account at https://developer.crazygames.com
Add the following script to your index.html:

```
	<script src="https://sdk.crazygames.com/crazygames-sdk-v1.js"></script>
```
Add the following code to set up the ad provider and create it:

```
FBInstant.options.adsOptions.startedCallback = PauseAudio;		// Function that will be called to pause audio during ad playback
FBInstant.options.adsOptions.finishedCallback = ResumeAudio;	// Function that will be called to resume audio post ad playback
new AdsService("crazygames");	// Use CrazyGames portal ads
```

Create a game in the Crazy Games dashboard and upload your game files.

Note that preloading ads is not possible using the Crazy Games SDK so calls to loadAsync() will return successfully. Finally, ensure that you read the Crazy Games guidelines at https://developer.crazygames.com/sdk#Guidelines

<h2>Integrating Game Distribution</h2>
To integrate Game Distribution, sign up and create a developer account at https://developer.gamedistribution.com

Create a game in the Game Distribution dashboard and copy the Game ID in the Upload section.

Add the following code to set up the ad provider and create it:

```
FBInstant.options.adsOptions.appId = "ENTER YOUR GAME ID HERE";
FBInstant.options.adsOptions.startedCallback = PauseAudio;		// Function that will be called to pause audio during ad playback
FBInstant.options.adsOptions.finishedCallback = ResumeAudio;	// Function that will be called to resume audio post ad playback
new AdsService("gamedistribution");	// Use Game Distribution ads
```
Note that preloading ads is not possible using the Game Distribution SDK so calls to loadAsync() will return successfully. 

<h2>Integrating Google Analytics</h2>
To integrate Google Analytics, sign up and create an account at https://analytics.google.com then go to the Admin section of Google Analytics and create a property for your game. You will be given a trackingId.

In code, after you create the Game Service, create the analytics service like this:

```
	FBInstant.options.analyticsOptions.trackingId = "PUT YOUR GOOGLE ANALYTICS TRACKING ID HERE";
	new AnalyticsService("google");	// Use Google Analytics
```

You can view the events sent from your game in the Events section in Google Analytics.

<h2>Integrating PayPal Checkout Payments</h2>
To integrate PayPal Checkout you will need to begin by creating an app on PayPal at https://developer.paypal.com/developer/applications/. Once yuou have an app you will be given a client ID for sandbox and a client ID for production. Whilst testing use the sandbox client ID as this enables you to use sandbox test users for trying out the implementation. Once you have these details you will need to set some information in FBInstant.options.paymentsOptions section, e.g.:

```
FBInstant.options.paymentsOptions.devMode = "sandbox";	// Set sandbox mode
FBInstant.options.paymentsOptions.sandboxId = "YOUR PAYPAL SANDBOX ID";			// You sandbox client ID
FBInstant.options.paymentsOptions.productionId = "YOUR PRODUCTION CLIENT ID";	// Not needed until you deploy to a production environment
FBInstant.options.paymentsOptions.products["product1"] = new PaymentsService.Product("Product1", "product1", "My first product", "", 10, "USD");	// Add a product called product1 that the user can purchase
```

In code, after you create the Game Service, create the analytics service like this:
```
	new PaymentsService("paypal");
```

Add the PayPal Checkout sdk to your index.html:
```
	<script src='https://www.paypalobjects.com/api/checkout.js' data-version-4></script>
```

Finally you need to add a div after the canvas in your index.html which can host the PayPal button that will be used to make the purchase. By default this div is called 

```
	<div id="paypal-button"></div>
```
For more PayPal options see lib_paypal.js

<h2>Issues</h2>
When switching from a sandbox to production environment, be aware that data from the sandbox session will still be stored in the browser, so when you try to log into the production environment old stale data from ths sandbox environment will be used. If this occurs you will see errors relating to 401 (Unauthorized) and possibly also No 'Access-Control-Allow-Origin' header is present on the requested resource. To fix this, clear the storage for your domain. For example, to do this in Chrome go to developer tools->Application->Clear storage then click the Clear Site Data button.

<h2>Future Integrations</h2>
Below is a list of planned integrations with the IGX SDK:
<ul>
<li>Game Analytics</li>
<li>Kongregate</li>
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
