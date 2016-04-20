/**
 * 
 * Common / Notifications JS
 * 
 */

// ------------------------------------------------------------------------

/**
 *
 * Notifications updater
 * 
 */
function BL_RefreshNotifications()
{
	$.ajax(
	{
		url: bucketlinks.site_url + 'ajax/profile/get_notifications_counter',
		type: 'GET',
		data: {  },
		dataType: 'json'
	})
	.done(function(response)
	{
		if (response.error == false)
		{
			if (response.num > 0)
			{
				$('#notifications-container').removeClass('btn-primary').addClass('btn-danger2');
				$('#notifications-num').empty().append(response.num);
			}
			else
			{
				$('#notifications-container').removeClass('btn-danger2').addClass('btn-primary');
				$('#notifications-num').empty().append(response.num);
			}
		}
	})
	.fail(function(jqXHR, textStatus)
	{
		console.log('Request failed for Notifications updater: ' + textStatus);
	});
}

// ------------------------------------------------------------------------

$(document).ready(function()
{
	BL_RefreshNotifications();
	setInterval(BL_RefreshNotifications, 2000);
});

// ------------------------------------------------------------------------

/**
 * 
 * Notifications
 * 
 */
$(document).ready(function()
{

	// ------------------------------------------------------------------------

	$('#modal-notifications').on('shown.bs.modal', function (e)
	{

		// --------------------------------------------------------------------

		$('#modal-notifications div.modal-body-loading-indicator').show();

		// --------------------------------------------------------------------

		var request = $.ajax(
		{
			url: bucketlinks.site_url + 'ajax/profile/get_notifications',
			type: 'GET',
			data: {  },
			dataType: 'json'
		})
		.done(function(response)
		{
			if (response.error == false)
			{
				$('#modal-notifications div.modal-body-content').empty().append(response.content);
				$('#modal-notifications div.modal-body-loading-indicator').hide();
			}
		})
		.fail(function(jqXHR, textStatus)
		{
			console.log('Request failed: ' + textStatus);

			$('#modal-notifications div.modal-body-content').empty().append('<p class="text-warning"><small>An error has been occured. Please try again.</small></p>');
			$('#modal-notifications div.modal-body-loading-indicator').hide();
		});

		// --------------------------------------------------------------------
	
	});

	// ------------------------------------------------------------------------

	$('#modal-notifications').on('hidden.bs.modal', function (e)
	{
		$('#modal-notifications div.modal-body-content').empty();
	});

	// ------------------------------------------------------------------------

});
