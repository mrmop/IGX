# CrazyGames SDK
The CrazyGames SDK facilitates interaction with the CrazyGames platform. The SDK is currently under development, and new features will be added in the coming months.
Currently, the SDK focuses on incorporating advertisements in your game. Advertisements are displayed as an overlay on top of your game, while your game keeps running in the background. This enables you to request advertisement at strategic times when they are not intruisive for the end user. For example, when loading a new level, when a user has died, or even as a reward for the user (think of an extra life, a special starting item, ...).

At the moment we have two implementations: one for Unity games, and one for HTML5 / Javascript games. You can always contact us to integrate the SDK with other engines, or if your game engine supports integrating with JS you can always use the JS implementation.

# Unity

## Installation in Unity
The SDK comes with two parts. _First_, a new build template is provided for you that wraps your Unity game inside our branded game frame. _Second_, we provide a C# class that streamlines the interaction between your game and our game frame.

### Installation of the build template
In order to get everything up and running perform the following steps:

* Create a `WebGLTemplates` directory in your `assets` directory.
* Place the directory `CrazyTemplate` in this directory.
This will create a new build template that you can select in your build settings (see https://docs.unity3d.com/Manual/webgl-templates.html
).
* Go to File -> Build Settings, Player Settings and select CrazyTemplate

When you build and test your game you should get your game embedded within the CrazyGames game frame.

### Installation of the Unity code

* Place `CrazySDK.cs` into your assets folder.
* Create a `Plugins` directory in your `assets` directory.
* Place the `crazySDK.jslib` file into this directory.
* Place `SiteLock.cs` file into this directory.


## Usage

### Playing an Advertisement
The SDK is implemented using the singleton pattern. An instance can be retrieved using `CrazySDK.Instance`.
The SDK must be initialized before using it. This is done by calling `Initialize()` once.
Advertisements can then be requested using `crazySDK.RequestAd()`.

```C#
void Awake()
    {
        this.crazySDK = CrazySDK.Instance; // get singleton instance
        crazySDK.Initialize(); // call initialize once, must be done so that javascript can communicate with Unity
        crazySDK.RequestAd();
    }
```

Whenever you call `RequestAd()` you should wait for a corresponding event. Performing several `RequestAd()` calls in parallel (e.g., in the game update loop) will only request a single advertisement, and block all future calls until the first request has finished.

### Installing Event Listeners
Advertisements are displayed as an overlay on top of your game. Your game continues running in the background.
To ensure that the game does not interfere with the advertisement your sound must be muted when an advertisement starts playing, and must be enabled again when the advertisement has stopped playing. To this end, event listeners are used to (un)mute the game at the right time.

There are three kinds of events:

* `CrazySDKEvent.adStarted` is emited when an advertisement starts playing.
* `CrazySDKEvent.adFinished` is emited when an advertisement stops playing.
* `CrazySDKEvent.adError` is emited when an error has occured. This event is also emited when no advertisements are available.

The following code registers event listeners:

```C#
crazySDK.AddEventListener(CrazySDKEvent.adError, Unmute);
crazySDK.AddEventListener(CrazySDKEvent.adFinished, Unmute);
crazySDK.AddEventListener(CrazySDKEvent.adStarted, Mute);
```

To ensure that the event listeners do not fire when you move to a different scene the event listeners must be unregistered as well:

```C#
void OnDestroy()
    {
        // Remove event listeners
        crazySDK.RemoveEventListener(CrazySDKEvent.adError, Unmute);
        crazySDK.RemoveEventListener(CrazySDKEvent.adFinished, Unmute);
        crazySDK.RemoveEventListener(CrazySDKEvent.adStarted, Mute);
    }
```

### Ad Types
We support two different types of advertisements: midroll and rewarded. Midroll advertisements are advertisements that happen when a user died, a level has been completed, a user exits to the lobby etc.
Rewarded advertisements are advertisements that can be requested by the user, and in exchange he/she gets a reward. These rewards can be an additional life, a retry when the user died, a bonus starting item, extra starting health etc.
They are shown when the user explicitly consents to watch an advertisement.

By default `RequestAd()` shows a midroll advertisement. `RequestAd()` takes an optional argument that indicates the adtype.
You can request both types as follows:

```
crazySDK.RequestAd(CrazyAdType.midgame)
crazySDK.RequestAd(CrazyAdType.rewarded)
```


## Complete Example

```C#
using UnityEngine;
using System.Collections;
using UnityEngine.SceneManagement;

public class AdvertisementExample : MonoBehaviour
{
    private CrazySDK crazySDK;

    void Awake()
    {
        this.crazySDK = CrazySDK.Instance; // get singleton instance
        crazySDK.Initialize(); // call initialize once, must be done so that javascript can communicate with Unity

        // Install event listeners
        crazySDK.AddEventListener(CrazySDKEvent.adError, AdError);
        crazySDK.AddEventListener(CrazySDKEvent.adFinished, AdFinished);
        crazySDK.AddEventListener(CrazySDKEvent.adStarted, AdStarted);
    }

    void OnDestroy()
    {
        // Remove event listeners
        crazySDK.RemoveEventListener(CrazySDKEvent.adError, AdError);
        crazySDK.RemoveEventListener(CrazySDKEvent.adFinished, AdFinished);
        crazySDK.RemoveEventListener(CrazySDKEvent.adStarted, AdStarted);
    }

    void OnGUI()
    {
        Cursor.lockState = CursorLockMode.None;
        Cursor.visible = true;

        if (GUI.Button(new Rect((Screen.width / 2), (Screen.height / 2), 300, 40), "REQUEST AD"))
        {
            crazySDK.RequestAd(CrazyAdType.midgame); // play ad when pressing a button
        }

    }

    void AdError()
    {
        Debug.Log("Ad Error");
        // resume game
    }

    void AdFinished()
    {
        Debug.Log("Ad Finished");
        // resume game
    }

    void AdStarted()
    {
        Debug.Log("Ad Started");
        // pause
    }
}
```

## Sitelock
We automatically lock your game so that it can only run on crazygames.com (and its affiliated domains). The sitelock is performed when you call `Initialize`.
When your game is running on a disallowed domain it will *hang* with an infinite loop. Do not panick when your game freezes when using the sitelocked version on a non-allowed domain. It is the intended behavior.


# Javascript

### Installation
Add `<script src="https://sdk.crazygames.com/crazygames-js-v1.js"></script>` to your `index.html.

### Template
We provide a `sdk.html` page that uses our game loader and sdk to load your game. It assumes that `index.html` contains the html containing your game.
This lets your game run using the same setup as it would run on crazygames.com

Import note: when you upload your game we look at your `index.html` file, and provide the game loader and sdk for you. The `sdk.html` page will not be used: keep any logic out of that file, and make sure that your `index.html` does not include the game loader, or the end result will be our game loader embedding your game loader.


## Usage

### Playing an Advertisement
The SDK is implemented using a singleton pattern. An instance can be retrieved using `CrazyGames.CrazySDK.getInstance()`.
The SDK must be initialized before using it. This is done by calling `init()` once.
Advertisement can then be requested using `crazysdk.requestAd()`;
The shortest way to play an add is using the following code:

```javascript
const crazysdk = CrazySDK.getInstance();
crazysdk.init();
crazysdk.requestAd();
```

### Installing Event Listeners
Advertisements are displayed as an overlay on top of your game. Your game continues running in the background.
To ensure that the game does not interfere with the advertisement your sound must be muted when an advertisement starts playing, and must be enabled again when the advertisement has stopped playing. To this end, event listeners are used to (un)mute the game at the right time.

There are three kinds of events:

* `'adStarted'` is emited when an advertisement starts playing.
* `'adFinished'` is emited when an advertisement stops playing.
* `'adError'` is emited when an error has occured. This event is also emited when no advertisements are available.

The following code registers event listeners:

```javascript
crazysdk.addEventListener('adStarted', this.adStarted); // mute sound
crazysdk.addEventListener('adFinished', this.adFinished); // reenable sound, enable ui
crazysdk.addEventListener('adError', this.adError); // reenable sound, enable ui
```

To ensure that the event listeners are not called when they are no longer needed, event listeners must be removed as well:

```javascript
crazysdk.removeEventListener('adStarted', this.adStarted);
crazysdk.removeEventListener('adFinished', this.adFinished);
crazysdk.removeEventListener('adError', this.adError);
```

### Ad Types
We support two different types of advertisements: midroll and rewarded. Midroll advertisements are advertisements that happen when a user died, a level has been completed, a user exits to the lobby etc.
Rewarded advertisements are advertisements that can be requested by the user, and in exchange he/she gets a reward. These rewards can be an additional life, a retry when the user died, a bonus starting item, extra starting health etc.
They are shown when the user explicitly consents to watch an advertisement.

By default `requestAd()` shows a midroll advertisement. `requestAd()` takes an optional argument that indicates the adtype.
You can request both types as follows:

```javascript
crazysdk.requestAd('midgame')
crazysdk.requestAd('rewarded')
```


### Full Example in Javascript
The following example is made using the Phaser game engine to show where in the lifecycle of a component you can place the calls to the SDK.
This may be different for your game engine.

```javascript
class GameScene {

  init() {
    const { CrazySDK } = window.CrazyGames;
    this.crazysdk = CrazySDK.getInstance();
    this.crazysdk.init();
    this.adRequested = false;
    this.installListeners();
  }

  preload() {
    this.requestAd();
    // load other assets while ad is playing
  }

  update() {
    if (adRequested) {
      return;
    }
    /* game logic here */
    if (this.playerWon()) {
      this.gameFinished();
    }
  }

  gameFinished() {
    this.removeListeners();
  }

  installListeners() {
    crazysdk.addEventListener('adStarted', this.adStarted);
    crazysdk.addEventListener('adFinished', this.adFinished);
    crazysdk.addEventListener('adError', this.adError);
  }

  removeListeners() {
    crazysdk.removeEventListener('adStarted', this.adStarted);
    crazysdk.removeEventListener('adFinished', this.adFinished);
    crazysdk.removeEventListener('adError', this.adError);
  }

  requestAd() {
    this.adRequested = true;
    this.crazysdk.requestAd();
  }

  adStarted = () => {
    this.sound.mute = true;
  }

  adError = () => {
    this.sound.mute = false;
    this.adRequested = false;
  }

  adFinished = () => {
    this.sound.mute = false;
    this.adRequested = false;
  }
}
```

### Sitelock
We currently do not have a sitelock for plain Javascript games. One option is to use an obfuscator (eg.: 'https://obfuscator.io/') to obfuscate (part of) your game.
The domains you should whitelist are the following: *.crazygames.com, *.gioca.re, *.1001juegos.com, *.onlinegame.co.id, and *.speelspelletjes.nl.



# Testing
Advertisements are not always available, especially when visiting localhost.
To enforce an advertisement you can append `?testAds=true` to your url (e.g., http://localhost/?testAds=true ). This will display the testing advertisement of Google.

