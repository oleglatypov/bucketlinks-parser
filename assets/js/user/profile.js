/**
 * 
 * User / Profile JS
 * 
 */

// ------------------------------------------------------------------------

/**
 * 
 * Run Masonry for posts
 * 
 */
$(document).ready(function()
{
	// ------------------------------------------------------------------------

	masonry();

	// ------------------------------------------------------------------------
});

// ------------------------------------------------------------------------

/**
 * 
 * Follow user
 * 
 */
function BL_FollowUser2(user_id)
{
	// ------------------------------------------------------------------------

	$button = $('#user-follow-actions');

	$button.prop('disabled', true);

	// ------------------------------------------------------------------------

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
			current_followers_num = parseInt($('#user-followers-counter-value').html());
			current_followers_num = current_followers_num + 1;
			$('#user-followers-counter-value').html(parseInt(current_followers_num));

			$button.prop('disabled', false);

			$button.attr('data-state-followed', '1');
			$button.addClass('btn-success');

			$button_text = $('#button-user-follow-actions-text');
			$button_text.empty().append('Unfollow');
		}
		else
		{
			$button.prop('disabled', false);

			console.log('Failed to follow user. User ID: ' + user_id);
		}
	})
	.fail(function(jqXHR, textStatus)
	{
		$button.prop('disabled', false);

		console.log('Failed to follow user. User ID: ' + user_id);
	});

	// ------------------------------------------------------------------------
}

// ------------------------------------------------------------------------

/**
 * 
 * Unfollow user
 * 
 */
function BL_UnfollowUser2(user_id)
{
	// ------------------------------------------------------------------------

	$button = $('#user-follow-actions');

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
			current_followers_num = parseInt($('#user-followers-counter-value').html());
			current_followers_num = current_followers_num - 1;
			$('#user-followers-counter-value').html(parseInt(current_followers_num));

			$button.prop('disabled', false);

			$button.attr('data-state-followed', '0');
			$button.addClass('btn-success');

			$button_text = $('#button-user-follow-actions-text');
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
		return false;
	});

	// ------------------------------------------------------------------------
}

// ------------------------------------------------------------------------

/**
 * 
 * Request
 * 
 */
function BL_RequestUser(user_id)
{
	// ------------------------------------------------------------------------

	$button = $('#user-request-actions');

	$button.prop('disabled', true);

	// ------------------------------------------------------------------------

	$.ajax(
	{
		url: bucketlinks.site_url + 'ajax/user/request',
		type: 'POST',
		data: { user_id: user_id },
		dataType: 'json'
	})
	.done(function(response)
	{
		if (response.error == false)
		{
			$button = $('#user-request-actions');
			$button.removeClass('btn-success').addClass('btn-info');
			$button.attr('data-is-requested', '1');
			$button.attr('disabled', true);
			$button.css({'cursor':'default'});

			$button_text = $('#button-user-request-actions-text');
			$button_text.empty().append('Request has been sent');
		}
		else
		{
			$button.prop('disabled', false);

			console.log('Failed to request user. User ID: ' + user_id);
		}
	})
	.fail(function(jqXHR, textStatus)
	{
		$button.prop('disabled', false);
		
		console.log('Failed to request user. User ID: ' + user_id);
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

	$('#user-follow-actions').on('click', function (e)
	{

		// --------------------------------------------------------------------

		user_id = $(this).attr('data-user-id');
		state_followed = $(this).attr('data-state-followed');

		if (parseInt(state_followed) == 1)
		{
			// Unfollow user
			BL_UnfollowUser2(user_id);
		}
		else
		{
			// Follow user
			BL_FollowUser2(user_id);
		}

		// --------------------------------------------------------------------

	});

	// ------------------------------------------------------------------------

});

// ------------------------------------------------------------------------

/**
 * 
 * Request user action handler
 * 
 */
$(document).ready(function()
{

	// ------------------------------------------------------------------------

	$('#user-request-actions').on('click', function (e)
	{

		// --------------------------------------------------------------------

		user_id = $(this).attr('data-user-id');
		is_requested = $(this).attr('data-is-requested');

		if (parseInt(is_requested) == 0)
		{
			BL_RequestUser(user_id);
		}

		// --------------------------------------------------------------------

	});

	// ------------------------------------------------------------------------

});

// ------------------------------------------------------------------------

/**
 * 
 * Run autoload for posts
 * 
 */
$(document).ready(function()
{
	// ------------------------------------------------------------------------

	$(window).scroll(function ()
	{

		var limit_to_bottom = 1200;

		if ($(window).scrollTop() + $(window).height() > $(document).height() - limit_to_bottom)
		{
			if ( ! bucketlinks.is_loading)
			{
				bucketlinks.is_loading = true;

				var current_user_id = $('#current_user_id').val();

				$.ajax(
				{
					url: bucketlinks.site_url + 'ajax/post/get_user_posts',
					type: 'POST',
					data: { user_id: current_user_id },
					dataType: 'json'
				})
				.done(function(response)
				{
					if (response.error == false)
					{
						$('.js-masonry').append(response.content);

						$('.js-masonry').masonry(
						{
							itemSelector: '.post-item',
							columnWidth: '.post-item',
							transitionDuration: 0
						});

						$('.js-masonry').masonry('reloadItems');
						$('.js-masonry').masonry('bindResize');
						$('.js-masonry').masonry('layout');

						BL_enableMentions();
						// BL_enableGoToLinkOnPost();
						// BL_enableOpenPostYoutubeVideo();
						// BL_enableDeletePost();
						// BL_enableReadLaterPost();
						// BL_enableDeleteReadLaterPost();
						// BL_enableMakePublicPost();
						// BL_enableLikePost();
						// BL_enableAddCommentToThePost();
						// BL_enableDeleteComment();
						// BL_enablePostLikes();
					}

					bucketlinks.is_loading = false;
				})
				.fail(function(jqXHR, textStatus)
				{
					console.log('Request failed: ' + textStatus);

					bucketlinks.is_loading = false;
				});
			}
		}

	});

	// ------------------------------------------------------------------------
});

// ------------------------------------------------------------------------
