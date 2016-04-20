/**
 * 
 * Common / Users JS
 * 
 */

// ------------------------------------------------------------------------

/**
 * 
 * Follow user
 * 
 */
function BL_FollowUser(user_id)
{

	// ------------------------------------------------------------------------

	$button = $('#button-user-' + user_id + '-actions');

	$button.prop('disabled', true);

	$.ajax(
	{
		url: bucketlinks.site_url + 'ajax/user/follow',
		type: 'POST',
		data: { user_id: user_id },
		dataType: 'json'
	})
	.done(function(response)
	{
		if (response.error == false)
		{
			$button.prop('disabled', false);

			$button.attr('data-state-followed', '1');
			$button.removeClass('btn-primary').addClass('btn-info');
			$button_text = $('#button-user-' + user_id + '-text');
			$button_text.empty().append('Unfollow');
			if ('is_requested' in response)
			{
				if (response.is_requested == 1)
				{
					$button_text.empty().append('Requested');
					$button.prop('disabled', true);
				}
			}
		}
		else
		{
			$button.prop('disabled', false);

			console.log('Failed to follow user. User ID: ' + user_id);
			return false;
		}
	})
	.fail(function(jqXHR, textStatus)
	{
		$button.prop('disabled', false);

		console.log('Failed to follow user. User ID: ' + user_id);
		return false;
	});

	// ------------------------------------------------------------------------

}

// ------------------------------------------------------------------------

/**
 * 
 * Unfollow user
 * 
 */
function BL_UnfollowUser(user_id)
{

	// ------------------------------------------------------------------------

	$button = $('#button-user-' + user_id + '-actions');

	$button.prop('disabled', true);

	// ------------------------------------------------------------------------

	$.ajax(
	{
		url: bucketlinks.site_url + 'ajax/user/unfollow',
		type: 'POST',
		data: { user_id: user_id },
		dataType: 'json'
	})
	.done(function(response)
	{
		if (response.error == false)
		{
			$button.prop('disabled', false);

			$button.attr('data-state-followed', '0');
			$button.removeClass('btn-info').addClass('btn-success');
			$button_text = $('#button-user-' + user_id + '-text');
			$button_text.empty().append('Follow');
		}
		else
		{
			$button.prop('disabled', false);

			console.log('Failed to unfollow user. User ID: ' + user_id);
			return false;
		}
	})
	.fail(function(jqXHR, textStatus)
	{
		$button.prop('disabled', false);
		
		console.log('Failed to unfollow user. User ID: ' + user_id);
	});

	// ------------------------------------------------------------------------

}

// ------------------------------------------------------------------------

/**
 * 
 * Follow / Unfollow user action handler
 * 
 */
$(document).ready(function()
{

	// ------------------------------------------------------------------------

	$('.link-actions-user').on('click', function (e)
	{

		// --------------------------------------------------------------------

		user_id = $(this).attr('data-user-id');
		state_followed = $(this).attr('data-state-followed');

		if (parseInt(state_followed) == 1)
		{
			// Unfollow user
			BL_UnfollowUser(user_id);
		}
		else
		{
			// Follow user
			BL_FollowUser(user_id);
		}

		// --------------------------------------------------------------------

	});

	// ------------------------------------------------------------------------

});

// ------------------------------------------------------------------------
