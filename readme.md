<h1>IGX - The replacement for FBInstant for Facebook Instant Game Developers</h1>

<h2>What is IGX?</h2>
IGX stands for Instant Games Extension, it is basically a replacement for the Facebook Instant Games API which enables developers to:
<ul>
<li>Deploy games created that use the Facebook Instants API to the web and beyond with little to no code changes</li>
<li>Build instant game features into existing games before deploying to the Instant Games platform, saving valuable time and money</li>
<li>Bolster the existing Instant Games platform with new features via FBInstant.ext, such as real time user to user communication</li>
</ul>

<h2>Why IGX?</h2>
IGX was created to enable developers to maximise their development time and money. It's difficult and time consuming to port games to Instant Games taking into consideration platform features, but its also more difficult to port games from Instant Games to web because so many features are lost. IGX attempts to replace some features that IG platform provides to enable the developer to retain functionality as much as possible.

<h2>What features are available?</h2>
The following features are available:
<ul>
<li>Initialilsation including entry point data via the url</li>
<li>User login / management (anonymous, credentials, Faceook and shortcode logins)</li>
<li>User data persistence on server</li>
<li>Facebook sharing</li>
<li>Leaderboards</li>
<li>Interstitial and Rewarded adverts</li>
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
<li>Payments</li>
<li>Contexts</li>
<li>Portal specific services</li>
</ul>

<h2>How to get started</h2>
Instead of linking to the Facebook Instants JS file, add igx_min.js and xtralife-3.2.1.min.js to your index page.
Note that the back-end used by IGX to provide server side features is called Xtralife (http://xtralife.cloud/), you will need to create a free account and add a game to obtain an API key and secret to use the API.

Once you have an account and have added a game to the system you will be given an API key and secret which you can use to access back-end features.

To set this up in code use:

```
FBInstant.options.ApiKey = "Your games Xtralife key";
FBInstant.options.ApiSecret = "Your games Xtralife secret";
FBInstant.options.DevMode = "sandbox";
new GameService("xtralife");	// Use Xtralife back-end
```

The IGX SDK is designed so that back-ends can be swapped, so if you are not happy with a specific API then you can replace it.

The IGX SDK consists of the following files:
<ul>
<li>fbinstantx.js - Contains the replacement FBInstant data and functions</li>
<li>fbinstantx_ext.js - Contains extra features that are not found in the Facebook Instant Games API</li>
<li>lib_ads.js - Ads interface</li>
<li>lib_gameservice.js - Game service interface which wraps game services</li>
<li>lib_socials - Wrappers for various social API's, Facebook is currently the only one implemented (provides login etc)</li>
<li>lib_xtralife - Xtralife implementation of game service</li>
<li>lib_crazygames - CrazyGames implementation of ads service</li>
</ul>

<h2>Extensions</h2>
A lot of extra functionality has been added to the IGX SDK which is not available in the FBInstant API. These are provided via the FBInstant.ext object. For example, to log in the user via Facebook you would call FBInstant.ext.loginWithFacebookAccessTokenAsync().

<h2>Logging the user in</h2>
The user is by default logged in anonymously. This creates an account for them with Xtralife which allows their game data to be stored and retrieved. It also allows them to submit leaderboard scores and retrieve leaderboards. You can disable anonymous login by setting FBInstant.options.AllowAnonymous to false. Lets take a look at an example that shows how to log the user in via Facebook:

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
In order for Facebook sharing to work via shareAsync, you must assign the URL which takes care of the sharing to FBInstant.options.ShareURI. Special parameters will be passed to this URL which enables Facebook to pull a proper preview of what is being shared. The destination URL will need to be a script that can handle the passed parameters. An example script is shown below:

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

<h2>Ads Services and Portals</h2>
Over time many portals and ad providers will be added to the IGX SDK. At the time of writing the following ad providers / portals have been added:
<ul>
<li>Crazy Games</li>
</ul>

<h2>Integrating Crazy Games</h2>
To integrate Crazy Games, sign up and create a developer account at https://developer.crazygames.com
Add the following script to your index.html:

```
	<script src="https://sdk.crazygames.com/crazygames-sdk-v1.js"></script>
```
In code, after you create the Game Service, create the ad service like this:

```
	new AdsService("crazygames");	// Use CrazyGames portal ads
```

Create a game in the Crazy Games dashboard and upload your game files as well as the sdk.html located in IGX\lib\vendors\crazygames. You may want to customise sdk.html to contain details about your particular game.

Note that preloading ads is not possible using the Crazy Games SDK so calls to loadAsync() will return successfully. Finally, ensure that you read the Crazy Games guidelines at https://developer.crazygames.com/sdk#Guidelines


