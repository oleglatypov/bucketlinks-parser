/**
 * 
 * Pre Common JS
 * 
 */

// ------------------------------------------------------------------------

/**
 * 
 * Check if URL is valid
 * 
 */
function BL_validateURL(url)
{
	/*var pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
	'((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
	'((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
	'(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
	'(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
	'(\\#[.-a-z\\d_]*)?$','i'); // fragment locator

	return pattern.test(url);*/

	return true;
}

// ------------------------------------------------------------------------

/**
 * 
 * Remove #_=_ from window location value (Facebook API bug)
 * 
 */
if (window.location.hash == '#_=_')
{
	history.replaceState ? history.replaceState(null, null, window.location.href.split('#')[0]) : window.location.hash = '';
}

// ------------------------------------------------------------------------
