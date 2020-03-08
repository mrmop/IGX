"use strict";

var WebUtils = {};

//
// Shares
//

// CSS
/*
body {
    background-color: #201020;
}

#igx_share_container
{
	display: block;
	visibility: hidden;
	width:70%;
	height:50%;
	top:10%;
	left:15%;
	position: absolute;
	background-color: rgb(255, 255, 255);
	text-align: center;
	font-size: 2em;
	font-family: Arial;
	border-radius: 25px;
	border:2px solid black;
}

#igx_name_text
{
	color: black;
}
*/

WebUtils.CreateShareUI = function(element)
{
	 var igx_share_container = document.createElement("div");
	 igx_share_container.id = "igx_share_container";
	 var igx_share = document.createElement("div");
	 igx_share.id = "igx_share";
	 igx_share.className = "container";
	 var row1 = document.createElement("div");
	 row1.className = "row";
	 var row2 = document.createElement("div");
	 row2.className = "row";
	 var row3 = document.createElement("div");
	 row3.className = "row";
	 var row4 = document.createElement("div");
	 row4.className = "row";
	 var hr1 = document.createElement("hr");
	 var h1 = document.createElement("h1");
	 h1.id = "igx_title";
	 var input = document.createElement("input");
	 input.id = "igx_url";
	 input.type = "text";
	 var hr2 = document.createElement("hr");
	 var button1 = document.createElement("button");
	 button1.id = "igx_copy_button";
	 button1.className = "btn btn-success btn-lg";
	 button1.innerText = "Copy";
	 
	 igx_share_container.appendChild(igx_share);
	 igx_share.appendChild(row1);
	 igx_share.appendChild(row2);
	 igx_share.appendChild(row3);
	 igx_share.appendChild(row4);
	 row1.appendChild(hr1);
	 row1.appendChild(h1);
	 row2.appendChild(input);
	 row3.appendChild(hr2);
	 row4.appendChild(button1);
	 
	 if (!element)
		element = "gamecanvas";
	 var canvas = document.getElementById(element);
	 document.body.appendChild(igx_share_container);
	 
	 WebUtils.ShareUICreated = true;	 
}

WebUtils.ShareDataURL = function(data, title, done_callback)
{
    if (data)
        data = {data: data};
    else
        data = {};

    FBInstant.ext.getShareURLAsync(data)
    .then(function(url){
        WebUtils.ShowShareLink(true, url, title);
        if (done_callback !== undefined)
            done_callback(url);
    });
};

WebUtils.ShowShareLink = function(show, url, title)
{
	if (!WebUtils.ShareUICreated)
		WebUtils.CreateShareUI();
		
	var namentry_container = document.getElementById("igx_share_container");
    var title_text = document.getElementById("igx_title");
    var url_text = document.getElementById("igx_url");
    var copybutton = document.getElementById("igx_copy_button");
    title_text.innerText = title;
    url_text.value = url;
	if (show)
	{
		namentry_container.style.visibility = "visible";
		copybutton.onclick = function()
		{
            WebUtils.CopyToClipboard(url);
			namentry_container.style.visibility = "hidden";
		}
	}
	else
	{
		okbutton.onclick = undefined;
        namentry_container.style.visibility = "hidden";
	}
}

WebUtils.CopyToClipboard = function(str)
{
    var el = document.createElement('textarea');
    el.value = str;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
};

WebUtils.SendShareInvite = function(text, done_callback)
{
	if (!text)
		text = "Share the url below to invite friends to play.";
    WebUtils.ShareDataURL(undefined, text);
};





