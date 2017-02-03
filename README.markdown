# Cross-pod Links (for Diaspora)

The Cross-pod Links (for Diaspora) user script makes it easy to insert permalinks to other Diaspora posts or comments in your own posts or comments that work on all pods. For instance, if Alice has a Diaspora account at Pod-A.com but follows Bob, who has a Diaspora account at Pod-B.com, then when alice follows a link in one of Bob's posts to another post on Diaspora (such as one on Bob's own home pod), she will not be able to interact with it. If Bob uses the convenience functions provided by this user script to create links in his posts, his links will send each person who follows them to the correct version of the post on their own home pod, without Bob having to know ahead of time which pod his contacts are on.

Here's what it looks like:

![Screenshot of Cross-pod Links (for Diaspora) popup with copy to clipboard buttons.](http://i.imgur.com/IuAJD4T.png)

## System requirements

The following software must be installed on your system before installing the user script.

### Google Chrome

If you use the [Google Chrome](https://chrome.google.com/) web browser (version 23 or higher), ensure you have the [Tampermonkey extension](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo) installed.

## Installing

To install this user script, go to [github.com/meitar/cross-pod-links](https://github.com/cross-pod-links/) and click the "[Download and install](https://github.com/meitar/cross-pod-links/raw/master/cross-pod-links.user.js)" near the middle of the page:

> [Download and install Cross-pod Links (for Diaspora)](https://github.com/meitar/cross-pod-links/raw/master/cross-pod-links.user.js)

If you enjoy this script, please consider [donating](http://maybemaimed.com/cyberbusking/) for your use of the script. :) Your donations are sincerely appreciated!

## Using

To use Cross-pod Links (for Diaspora), log in to your Diaspora account and click on the permalink for any post or comment, which is usually small gray text that says something like, "about *some time* ago" near the top or bottom of the post. Clicking on the permalink will reveal a popup that shows the full cross-pod link (a server-relative URL) and two buttons to copy the cross-pod link raw or as a Markdown-formatted hyperlink.

Click the "Copy as Markdown" button to copy the post title and cross-pod link as Markdown. Clicking "Copy to Clipboard" copies only the cross-pod link (the URL), without Markdown formatting. Clicking the "[X]" button closes the popup.

## Contributing

[Patches welcome](https://github.com/meitar/cross-pod-links/issues)!

## Change log

* Version 0.1.6:
    * Bugfix: Don't show permalink popup on single-post control icons.
* Version 0.1.5:
    * Bugfix: Button text color is now visible on latest Diaspora themes.
* Version 0.1.4:
    * Bugfix: Resharing, liking, or reporting a post on a single post page is no longer obscured by the cross-pod link pop-up.
* Version 0.1.3:
    * Bugfix: Deleting a comment no is no longer obscured by the cross-pod link pop-up.
* Version 0.1.2:
    * Compatible with Greasemonkey running in Firefox.
* Version 0.1.1:
    * Bugfix: "Show X more comments" links are no longer incorrectly recognized as post or comment permalinks.
* Version 0.1:
    * Initial release.
