/**
 * This is a Greasemonkey script and must be run using a Greasemonkey-compatible browser.
 */
// ==UserScript==
// @name           Cross-pod Links (for Diaspora)
// @version        0.1.4
// @author         maymay <meitar@joindiaspora.com>
// @namespace      net.maymay.diaspora.cross
// @updateURL      https://github.com/meitar/cross-pod-links/raw/master/cross-pod-links.user.js
// @description    Click a Diaspora post's permalink to copy a server-relative URL to your clipboard. Makes it easy to write links in your Diaspora posts that will work across pods when the people you are sharing with are on a different pod than you.
// @require        https://code.jquery.com/jquery-1.10.2.min.js
// TODO: Can the include be restricted based on a known podlist?
// @include        https://*/*
// @grant          GM_xmlhttpRequest
// @grant          GM_addStyle
// @grant          GM_log
// @grant          GM_setClipboard
// ==/UserScript==

D_PERMALINKER = {};
D_PERMALINKER.CONFIG = {
    'debug': false // switch to true to debug.
};

// Utility debugging function.
D_PERMALINKER.log = function (msg) {
    if (!D_PERMALINKER.CONFIG.debug) { return; }
    GM_log('CROSS-POD LINKS: ' + msg);
};

// Initializations.
GM_addStyle('\
.cross-pod-links-popup.tooltip.bottom .tooltip-arrow {\
    left: 35%;\
}\
.cross-pod-links-popup .tooltip-inner {\
    text-align: left;\
    max-width: 100%;\
    padding: 10px;\
}\
.cross-pod-links-popup button {\
    float: right;\
    margin: 0 0 10px 10px;\
    opacity: 1;\
    background: #FFF;\
}\
.cross-pod-links-popup .tooltip-inner a {\
    font-size: larger;\
    display: block;\
    clear: both;\
    text-align: center;\
}\
.cross-pod-links-popup .tooltip-inner a:hover {\
    text-decoration: underline;\
}\
');
D_PERMALINKER.init = function () {
    // Set up a Mutation Observer to listen for new stream contents.
    var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
    var observer = new MutationObserver(function (mutations) {
        D_PERMALINKER.log('Observing mutations:');
        mutations.forEach(function (mutation) {
            var links = mutation.target.querySelectorAll('a[href]');
            for (var i = 0; i < links.length; i++) {
                if (links[i].pathname && links[i].pathname.match(/^\/posts\/[0-9a-f]+/)) {
                    D_PERMALINKER.main(links[i]);
                }
            }
        });
    });
    var el = document.getElementById('main_stream')
        || document.getElementById('container');
    // TODO: Figure out how to get this working for the notification dropdown, too.
        //|| document.getElementById('notification_dropdown');
    try {
        observer.observe(el, {
            'childList': true,
            'subtree': true
    });
    } catch (e) {
        console.log(e);
    }
};
window.addEventListener('DOMContentLoaded', D_PERMALINKER.init);

D_PERMALINKER.setPermalinkGUID = function (anchor_node, guid) {
    // translate the post URL on this pod
    // to a post URL for a server-relative cross-pod GUID
    var new_url = '/posts/' + guid;
    if (anchor_node.search) {
        new_url += anchor_node.search;
    }
    if (anchor_node.hash) {
        new_url += anchor_node.hash;
    }
    anchor_node.setAttribute('href', new_url);
};

D_PERMALINKER.getCrossPodUrl = function (anchor_node) {
    var new_url = anchor_node.pathname;
    if (anchor_node.search) {
        new_url += anchor_node.search;
    }
    if (anchor_node.hash) {
        new_url += anchor_node.hash;
    }
    return new_url;
};

D_PERMALINKER.getPostRoot = function (node) {
    var el = jQuery(node).closest('.stream_element');
    if (0 === el.length) {
        el = jQuery(node).closest('#single-post-container');
    }
    if (undefined === el.get(0)) {
        D_PERMALINKER.log('No post root element found for node ' + node);
        return false;
    } else {
        return el.get(0);
    }
}

D_PERMALINKER.setDataAttributes = function (anchor_node, data) {
    el = jQuery(D_PERMALINKER.getPostRoot(anchor_node));
    el.attr('data-post-title', data.title); // Why won't .data() work here?
};

D_PERMALINKER.updatePermalink = function (anchor_node) {
    var url = window.location.protocol + '//' + window.location.host + anchor_node.pathname + '.json';
    GM_xmlhttpRequest({
        'method': 'GET',
        'url': url,
        'onload': function (response) {
            try {
                var json = JSON.parse(response.responseText);
            } catch (e) {
                D_PERMALINKER.log('Error parsing received JSON from ' + url);
                D_PERMALINKER.log(response.responseText);
            }
            D_PERMALINKER.setPermalinkGUID(anchor_node, json.guid);
            D_PERMALINKER.setDataAttributes(anchor_node, json);
        }
    });
};

D_PERMALINKER.createSimplePopUp = function (node) {
    var div = document.createElement('div');
    div.setAttribute('class', 'cross-pod-links-popup tooltip fade bottom in');
    var html = '';
    html += '<div class="tooltip-arrow"></div>';
    html += '<div class="tooltip-inner">';
    html += '<button class="close" onclick="this.parentNode.parentNode.parentNode.removeChild(document.querySelector(\'.cross-pod-links-popup\'));">[X]</button>';
    html += '<button class="cross-pod-links-pbcopy">Copy to Clipboard</button>';
    html += '<button class="cross-pod-links-pbcopy-markdown">Copy as Markdown</button>';
    html += '<a href="' + D_PERMALINKER.getCrossPodUrl(node) + '">';
    html += 'Cross-pod Permalink: ' + D_PERMALINKER.getCrossPodUrl(node);
    html += '</a>';
    html += '</div>';
    div.innerHTML = html;
    jQuery(div.querySelector('button.cross-pod-links-pbcopy')).on('click', function (e) {
        GM_setClipboard(D_PERMALINKER.getCrossPodUrl(node));
    });
    jQuery(div.querySelector('button.cross-pod-links-pbcopy-markdown')).on('click', function (e) {
        GM_setClipboard('[' + D_PERMALINKER.getPostRoot(node).getAttribute('data-post-title') + '](' + D_PERMALINKER.getCrossPodUrl(node) + ')');
    });
    node.parentNode.appendChild(div);
};

D_PERMALINKER.isPermalink = function (node) {
    var is_permalink = true;
    var excluded_classes = [
        '.toggle_post_comments',
        '.comment_delete',
        '.focus-comment',
        '.like',
        '.reshare',
        '.post_report'
    ];
    if (jQuery(node).is(excluded_classes.join(', '))) {
        is_permalink = false;
    }
    return is_permalink;
};

// This is the main() function, executed on page load.
D_PERMALINKER.main = function (anchor_node) {
    if (!D_PERMALINKER.isPermalink(anchor_node)) { return; }
    D_PERMALINKER.updatePermalink(anchor_node);

    // attach a click listener on this permalink anchor element
    if (!jQuery(anchor_node).closest('.cross-pod-links-popup').length) {
        jQuery(anchor_node).unbind('click'); // not sure what was previously bound?
        jQuery(anchor_node).on('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            // display a small "tooltip" popup over the link
            D_PERMALINKER.createSimplePopUp(anchor_node);
        });
    }
};
