/**
 * 
 * Profile / Read Later JS
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

				$.ajax(
				{
					url: bucketlinks.site_url + 'ajax/post/get_read_later_posts',
					type: 'POST',
					data: {  },
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
