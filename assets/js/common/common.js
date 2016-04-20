/**
 * 
 * Common JS
 * 
 */

// ------------------------------------------------------------------------

/**
 * 
 * Form styling
 * 
 */
$(document).ready(function()
{

	// -----------------------------------------------------------------

	$('input.icheck').iCheck(
	{
		checkboxClass: 'icheckbox_flat-blue',
		radioClass: 'iradio_flat-blue',
		increaseArea: '10%'
	});

	// -----------------------------------------------------------------

});

// ------------------------------------------------------------------------

/**
 * 
 * Masonry
 * 
 */
function masonry()
{
	$('.js-masonry').masonry(
	{
		itemSelector: '.post-item',
		columnWidth: '.post-item',
		transitionDuration: 0
	});

	$('.js-masonry').masonry('reloadItems');
	$('.js-masonry').masonry('bindResize');
}

// ------------------------------------------------------------------------

/**
 * 
 * Masonry for Users
 * 
 */
function masonry_users()
{
	$('.js-masonry').masonry(
	{
		itemSelector: '.users-item',
		columnWidth: '.users-item',
		transitionDuration: 0
	});
	
	$('.js-masonry').masonry('reloadItems');
	$('.js-masonry').masonry('bindResize');
}

// ------------------------------------------------------------------------

/**
 * 
 * Activate search
 * 
 */
$(document).ready(function(event)
{

	// ------------------------------------------------------------------------

	$('.search-panel .dropdown-menu').find('a').click(function(event)
	{
		event.preventDefault();
		var param = $(this).attr('href').replace('#', '');
		var concept = $(this).text();
		$('.search-panel span#search_concept').text(concept);
		$('.input-group #search_where').val(param);
	});

	// ------------------------------------------------------------------------

});

// ------------------------------------------------------------------------

/**
 * 
 * Share New Link
 * 
 */
$(document).ready(function()
{
	// ------------------------------------------------------------------------

	$('#modal-share-new-link').on('shown.bs.modal', function (e)
	{

		// --------------------------------------------------------------------

		$('#modal-share-new-link div.modal-body-loading-indicator').show();

		// --------------------------------------------------------------------

		$.ajax(
		{
			url: bucketlinks.site_url + 'ajax/share/share_new_link',
			type: 'GET',
			data: {  },
			dataType: 'json'
		})
		.done(function(response)
		{
			if (response.error == false)
			{
				$('#modal-share-new-link div.modal-body-content').empty().append(response.content);
				$('#modal-share-new-link div.modal-body-loading-indicator').hide();
			}
		})
		.fail(function(jqXHR, textStatus)
		{
			console.log('Request failed: ' + textStatus);

			$('#modal-share-new-link div.modal-body-content').empty().append('<p class="text-warning"><small>An error has been occured. Please try again.</small></p>');
			$('#modal-share-new-link div.modal-body-loading-indicator').hide();
		});

		// --------------------------------------------------------------------

		$('.chosen-select', this).chosen(
		{
			/*width: "inherit"*/
		});
		$('.chosen-select-deselect', this).chosen(
		{
			/*width: "inherit",*/
			allow_single_deselect: true
		});

		// --------------------------------------------------------------------

	});

	// ------------------------------------------------------------------------

	$('#modal-share-new-link').on('hidden.bs.modal', function (e)
	{
		$('#modal-share-new-link div.modal-body-content').empty();
	});

	// ------------------------------------------------------------------------
});

// ------------------------------------------------------------------------

/**
 * 
 * Manage My Settings
 * 
 */
$(document).ready(function()
{

	// ------------------------------------------------------------------------

	$('#modal-my-settings').on('shown.bs.modal', function (e)
	{

		// --------------------------------------------------------------------

		$('#modal-my-settings div.modal-body-loading-indicator').show();

		// --------------------------------------------------------------------

		$.ajax(
		{
			url: bucketlinks.site_url + 'ajax/profile/get_settings',
			type: 'GET',
			data: {  },
			dataType: 'json'
		})
		.done(function(response)
		{
			if (response.error == false)
			{
				$('#modal-my-settings div.modal-body-content').empty().append(response.content);
				$('#modal-my-settings div.modal-body-loading-indicator').hide();
			}
			else
			{
				$('#modal-my-settings div.modal-body-content').empty().append('<p class="text-warning"><small>An error has been occured. Please try again.</small></p>');
				$('#modal-my-settings div.modal-body-loading-indicator').hide();
			}
		})
		.fail(function(jqXHR, textStatus)
		{
			console.log('Request failed: ' + textStatus);

			$('#modal-my-settings div.modal-body-content').empty().append('<p class="text-warning"><small>An error has been occured. Please try again.</small></p>');
			$('#modal-my-settings div.modal-body-loading-indicator').hide();
		});

		// --------------------------------------------------------------------

	});

	// ------------------------------------------------------------------------

	$('#modal-my-settings').on('hidden.bs.modal', function (event)
	{
		$('#modal-my-settings div.modal-body-content').empty();
	});

	// ------------------------------------------------------------------------

});

// ------------------------------------------------------------------------

/**
 * 
 * Manage My Interests
 * 
 */
$(document).ready(function()
{

	// ------------------------------------------------------------------------

	$('#modal-my-interests').on('shown.bs.modal', function (e)
	{

		// --------------------------------------------------------------------

		$('#modal-my-interests div.modal-body-loading-indicator').show();

		// --------------------------------------------------------------------

		var request = $.ajax(
		{
			url: bucketlinks.site_url + 'ajax/profile/get_interests',
			type: 'GET',
			data: {  },
			dataType: 'json'
		})
		.done(function(response)
		{
			if (response.error == false)
			{
				$('#modal-my-interests div.modal-body-content').empty().append(response.content);
				$('#modal-my-interests div.modal-body-loading-indicator').hide();
			}
			else
			{
				$('#modal-my-interests div.modal-body-content').empty().append('<p class="text-warning"><small>An error has been occured. Please try again.</small></p>');
				$('#modal-my-interests div.modal-body-loading-indicator').hide();
			}
		})
		.fail(function(jqXHR, textStatus)
		{
			console.log('Request failed: ' + textStatus);

			$('#modal-my-interests div.modal-body-content').empty().append('<p class="text-warning"><small>An error has been occured. Please try again.</small></p>');
			$('#modal-my-interests div.modal-body-loading-indicator').hide();
		});

		// --------------------------------------------------------------------
	
	});

	// ------------------------------------------------------------------------

	$('#modal-my-interests').on('hidden.bs.modal', function (e)
	{
		$('#modal-my-interests div.modal-body-content').empty();
	});

	// ------------------------------------------------------------------------

});

// ------------------------------------------------------------------------

/**
 *
 * Go to Home Feed link handler
 * 
 */
$(document).ready(function()
{

	$('#button-action-go-to-homefeed').on('click', function(e)
	{
		e.preventDefault();

		window.location.href = bucketlinks.site_url + '/home';
	})

});

// ------------------------------------------------------------------------
