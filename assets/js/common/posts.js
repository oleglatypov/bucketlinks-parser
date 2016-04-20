/**
 * 
 * Common / Posts JS
 * 
 */

// ------------------------------------------------------------------------

/**
 * 
 * Enable mentions
 * 
 */
function BL_enableMentions()
{
	$('textarea.mention').mentionsInput(
	{
		onDataRequest:function (mode, query, callback)
		{
			$.getJSON('/ajax/profile/get_users_to_mention', function(responseData)
			{
				responseData = _.filter(responseData, function(item)
				{
					return item.name.toLowerCase().indexOf(query.toLowerCase()) > -1
				});
				callback.call(this, responseData);
			});
		}
	});
}


$(document).ready(function()
{
	BL_enableMentions();
});

// ------------------------------------------------------------------------

/**
 * 
 * Go to link on post
 * 
 */
function BL_enableGoToLinkOnPost()
{
	$('body').on('click', '.action-gotolink-post', function (e)
	{

		// --------------------------------------------------------------------

		post_id = $(this).attr('data-post-id');

		// --------------------------------------------------------------------

		current_views_num = parseInt($('#views-num-' + post_id).html());
		new_views_num = current_views_num + 1;
		$('#views-num-' + post_id).html(parseInt(new_views_num));
		$('#btn-gotolink-' + post_id).removeClass('btn-default').addClass('btn-info');

		// --------------------------------------------------------------------

	});
}

// $(document).ready(function()
// {
	BL_enableGoToLinkOnPost();
// });

// ------------------------------------------------------------------------

/**
 * 
 * Increase post views counter (AJAX)
 * 
 */
function BL_AJAX_IncreasePostViewsCounter(post_id)
{
	// ------------------------------------------------------------------------

	$.ajax(
	{
		url: bucketlinks.site_url + 'ajax/post/increase_views_counter',
		type: 'POST',
		data: { post_id: post_id },
		dataType: 'json'
	})
	.done(function(response)
	{
		if (response.error == false)
		{
			console.log('Increased post views counter. Post ID: ' + post_id);
		}
		else
		{
			console.log('Failed to increase views counter for post. Post ID: ' + post_id);
		}
	})
	.fail(function(jqXHR, textStatus)
	{
		console.log('Failed to increase views counter for post. Post ID: ' + post_id);
	});

	// ------------------------------------------------------------------------
}

// ------------------------------------------------------------------------

/**
 * 
 * Open post Youtube video
 * 
 */
function BL_enableOpenPostYoutubeVideo()
{
	// ------------------------------------------------------------------------

	$('body').on('click', '.action-play-youtube-video', function (e)
	{

		// --------------------------------------------------------------------

		e.preventDefault();

		// --------------------------------------------------------------------

		var youtube_video_id = $(this).attr('data-youtube-video-id');
		var post_id = $(this).attr('data-post-id');

		// --------------------------------------------------------------------

		video_width =  ( $(window).width() < 640 )  ? '100%' : '863';
		

		if ( $(window).height() < 300 ) {
			video_height = '100%'
		} else if( $(window).height() >= 300 && $(window).height() < 420 ){
			video_height = '400';
		} else {
			video_height = '490';
		}



		var youtube_video_html = '<iframe width="'+video_width+'" height="'+video_height+'" src="http://www.youtube.com/embed/' + youtube_video_id + '?autoplay=1" frameborder="0" allowfullscreen></iframe>';

		$('#modal-post-video div.modal-body-content').empty().append(youtube_video_html);

		$('#modal-post-video').modal('toggle');

		// --------------------------------------------------------------------

		BL_AJAX_IncreasePostViewsCounter(post_id);

		// --------------------------------------------------------------------

	});

	// ------------------------------------------------------------------------

	$('#modal-post-video').on('hidden.bs.modal', function (e)
	{
		$('#modal-post-video div.modal-body-content').empty();
	});

	// ------------------------------------------------------------------------
}

// $(document).ready(function()
// {
	BL_enableOpenPostYoutubeVideo();
// });

// ------------------------------------------------------------------------

/**
 * 
 * Delete post
 * 
 */
function BL_DeletePost(post_id)
{
	// ------------------------------------------------------------------------

	$.ajax(
	{
		url: bucketlinks.site_url + 'ajax/post/delete',
		type: 'POST',
		data: { post_id: post_id },
		dataType: 'json'
	})
	.done(function(response)
	{
		if (response.error == false)
		{
			$('.post-item-' + post_id).fadeOut(300);

			setTimeout(function()
			{
				var $container = $('.js-masonry').masonry(
				{
					itemSelector: '.post-item',
					transitionDuration: 0
				});
				
				$('.post-item-' + post_id).remove();
				$container.masonry();
			}, 310);
		}
		else
		{
			console.log('Failed to delete post. Post ID: ' + post_id);
		}
	})
	.fail(function(jqXHR, textStatus)
	{
		console.log('Failed to delete post. Post ID: ' + post_id);
	});

	// ------------------------------------------------------------------------
}

function BL_enableDeletePost()
{
	$('body').on('click', '.action-delete-post', function (e)
	{

		$("#modal-delete-post").modal('show');
		$(".delete-post-id").attr("data-delete-post-id", $(this).attr('data-post-id'));



		
		//, '<p>Are you sure? <button class="btn btn-danger">Delete</button></p>'
		// --------------------------------------------------------------------
		
		// if (confirm('Do you really want to delete this link?'))
		// {
		// 	post_id = $(this).attr('data-post-id');
		// 	BL_DeletePost(post_id);
		// }

		// --------------------------------------------------------------------

	});

	$('body').on('click', '.confirm-delete-post', function (e)
	{

		post_id = $(".delete-post-id").attr("data-delete-post-id");
		BL_DeletePost(post_id);
		$("#modal-delete-post").modal('hide');
		// --------------------------------------------------------------------

	});


}

// $(document).ready(function()
// {
	BL_enableDeletePost();
// });

// ------------------------------------------------------------------------

/**
 * 
 * Read later post
 * 
 */
function BL_ReadLaterPost(post_id)
{
	// ------------------------------------------------------------------------

	$.ajax(
	{
		url: bucketlinks.site_url + 'ajax/post/read_later',
		type: 'POST',
		data: { post_id: post_id },
		dataType: 'json'
	})
	.done(function(response)
	{
		if (response.error == false)
		{
			$('.post-item-' + post_id).fadeTo('200', 0.35, function(){});
			$('.post-item-' + post_id + ' .post-item-actions').empty().append('<i class="fa fa-check"></i> Added to Read Later');
		}
		else
		{
			console.log('Failed to read later post. Post ID: ' + post_id);
		}
	})
	.fail(function(jqXHR, textStatus)
	{
		console.log('Failed to read later post. Post ID: ' + post_id);
	});

	// ------------------------------------------------------------------------
}

function BL_enableReadLaterPost()
{
	// ------------------------------------------------------------------------

	$('body').on('click', '.action-readlater-post', function (e)
	{

		// --------------------------------------------------------------------
		
		post_id = $(this).attr('data-post-id');
		BL_ReadLaterPost(post_id);

		// --------------------------------------------------------------------

	});

	// ------------------------------------------------------------------------
}

// $(document).ready(function()
// {
	BL_enableReadLaterPost();
// });

// ------------------------------------------------------------------------

/**
 * 
 * Delete read later post
 * 
 */
function BL_DeleteReadLaterPost(post_id)
{
	// ------------------------------------------------------------------------

	$.ajax(
	{
		url: bucketlinks.site_url + 'ajax/post/read_later_delete',
		type: 'POST',
		data: { post_id: post_id },
		dataType: 'json'
	})
	.done(function(response)
	{
		if (response.error == false)
		{
			$('.post-item-' + post_id).fadeOut(300);

			setTimeout(function()
			{
				var $container = $('.js-masonry').masonry(
				{
					itemSelector: '.post-item',
					transitionDuration: 0
				});
				
				$('.post-item-' + post_id).remove();
				$container.masonry();
			}, 310);
		}
		else
		{
			console.log('Failed to delete read later post. Post ID: ' + post_id);
		}
	})
	.fail(function(jqXHR, textStatus)
	{
		console.log('Failed to delete read later post. Post ID: ' + post_id);
	});

	// ------------------------------------------------------------------------
}

function BL_enableDeleteReadLaterPost()
{
	// ------------------------------------------------------------------------

	$('body').on('click', '.action-delete-readlater-post', function (e)
	{

		// --------------------------------------------------------------------
		
		post_id = $(this).attr('data-post-id');
		BL_DeleteReadLaterPost(post_id);

		// --------------------------------------------------------------------

	});

	// ------------------------------------------------------------------------
}

// $(document).ready(function()
// {
	BL_enableDeleteReadLaterPost();
// });

// ------------------------------------------------------------------------

/**
 * 
 * Make post public from private box
 * 
 */
function BL_MakePublicPost(post_id)
{

	// ------------------------------------------------------------------------

	$.ajax(
	{
		url: bucketlinks.site_url + 'ajax/post/make_public',
		type: 'POST',
		data: { post_id: post_id },
		dataType: 'json'
	})
	.done(function(response)
	{
		if (response.error == false)
		{
			$('.post-item-' + post_id).fadeOut(300);

			setTimeout(function()
			{
				var $container = $('.js-masonry').masonry(
				{
					itemSelector: '.post-item',
					transitionDuration: 0
				});
				
				$('.post-item-' + post_id).remove();
				$container.masonry();
			}, 310);
		}
		else
		{
			console.log('Failed to make post public. Post ID: ' + post_id);
		}
	})
	.fail(function(jqXHR, textStatus)
	{
		console.log('Failed to make post public. Post ID: ' + post_id);
	});

	// ------------------------------------------------------------------------

}

function BL_enableMakePublicPost()
{

	// ------------------------------------------------------------------------

	$('body').on('click', '.action-make-public-post', function (e)
	{

		// --------------------------------------------------------------------
		
		post_id = $(this).attr('data-post-id');
		BL_MakePublicPost(post_id);

		// --------------------------------------------------------------------

	});

	// ------------------------------------------------------------------------

}

// $(document).ready(function()
// {
	BL_enableMakePublicPost();
// });

// ------------------------------------------------------------------------

/**
 * 
 * Like post
 * 
 */
function BL_enableLikePost()
{
	$("body").on('click', '.action-like-post', function (event)
	{

		// --------------------------------------------------------------------

		post_id = $(this).attr('data-post-id');

		// --------------------------------------------------------------------

		$.ajax(
		{
			url: bucketlinks.site_url + 'ajax/post/like',
			type: 'POST',
			data: { post_id: post_id },
			dataType: 'json'
		})
		.done(function(response)
		{
			// console.log(response);

			if (response.error == false)
			{
				if (response.content == 'liked')
				{
					$('#btn-like-' + post_id).removeClass('btn-default').addClass('btn-danger');
					current_likes_num = parseInt($('#likes-num-' + post_id).html());
					new_likes_num = current_likes_num + 1;
					$('#likes-num-' + post_id).html(parseInt(new_likes_num));
				}
				else
				if (response.content == 'unliked')
				{
					$('#btn-like-' + post_id).removeClass('btn-danger').addClass('btn-default');
					current_likes_num = parseInt($('#likes-num-' + post_id).html());
					new_likes_num = current_likes_num - 1;
					new_likes_num = parseInt(new_likes_num);
					if (new_likes_num < 0)
					{
						new_likes_num = 0;
					}
					$('#likes-num-' + post_id).html(new_likes_num);
				}
			}
			else
			{
				console.log('Failed to like/unlike post. Post ID: ' + post_id);
			}
		})
		.fail(function(jqXHR, textStatus)
		{
			console.log('Failed to like/unlike post. Post ID: ' + post_id);
		});

		// --------------------------------------------------------------------

	});
}

// $(document).ready(function()
// {
	BL_enableLikePost();
// });

// ------------------------------------------------------------------------

/**
 * 
 * Add comment to the post
 * 
 */
function BL_enableAddCommentToThePost()
{
	$('body').on('click', '.action-comment-post', function (e)
	{

		// --------------------------------------------------------------------

		var post_id = $(this).attr('data-post-id');
		var comment_content = $('#textarea-comment-' + post_id).val();

		if ( comment_content.replace(/\s/g, "") == '') {
			$("#textarea-comment-"+post_id).focus();
			return false;
		}

		// --------------------------------------------------------------------

		$('#btn-comment-' + post_id).prop('disabled', true).empty().html('Posting...');

		// --------------------------------------------------------------------

		bucketlinks.form_content = comment_content;
		$('#textarea-comment-' + post_id).mentionsInput('getMentions', function(data)
		{
			bucketlinks.mentions = JSON.parse(JSON.stringify(data));
		});

		for (var mention_key in bucketlinks.mentions)
		{
			var mention_obj = bucketlinks.mentions[mention_key];
			for (var prop in mention_obj)
			{
				if (mention_obj.hasOwnProperty(prop))
				{
					if (prop == 'value')
					{
						if (bucketlinks.form_content.indexOf(mention_obj[prop]) > -1)
						{
							bucketlinks.form_content = bucketlinks.form_content.replace(mention_obj[prop], '<a href="/user/' + mention_obj['id'] + '">' + mention_obj[prop] + '</a>');
						}
					}
				}
			}
		}

		comment_content = bucketlinks.form_content;
		bucketlinks.form_content = '';

		$.ajax(
		{
			url: bucketlinks.site_url + 'ajax/comment/add',
			type: 'POST',
			data:
			{
				post_id: post_id,
				comment_content: comment_content
			},
			dataType: 'json'
		})
		.done(function(response)
		{
			if (response.error)
			{
				console.log('Failed to comment post. Post ID: ' + post_id);
			}
			else
			{
				$('#btn-comment-' + post_id).prop('disabled', false).empty().html('Submit');

				$('#textarea-comment-' + post_id).mentionsInput('reset');
				$('#textarea-comment-' + post_id).val('');
				$('#post-comments-list-' + post_id).append(response.comment_html);
				
				masonry();
			}
		})
		.fail(function(jqXHR, textStatus)
		{
			$('#btn-comment-' + post_id).prop('disabled', false).empty().html('Submit');

			console.log('Failed to comment post. Post ID: ' + post_id);
		});

		// --------------------------------------------------------------------

	});
}

// $(document).ready(function()
// {
	BL_enableAddCommentToThePost();
// });

// ------------------------------------------------------------------------

/**
 * 
 * Delete comment
 * 
 */
function BL_DeleteComment(comment_id)
{
	// ------------------------------------------------------------------------

	$.ajax(
	{
		url: bucketlinks.site_url + 'ajax/comment/delete',
		type: 'POST',
		data: { comment_id: comment_id },
		dataType: 'json'
	})
	.done(function(response)
	{
		if (response.error)
		{
			console.log('Failed to delete comment. Comment ID: ' + comment_id);
		}
		else
		{
			$('#post-comment-' + comment_id).hide();
			
			setTimeout(function()
			{
				masonry();
			}, 5);
		}
	})
	.fail(function(jqXHR, textStatus)
	{
		console.log('Failed to delete comment. Comment ID: ' + comment_id);
	});

	// ------------------------------------------------------------------------
}

function BL_enableDeleteComment()
{
	$("body").on('click','.action-delete-comment', function (e)
	{

		// --------------------------------------------------------------------
		
		comment_id = $(this).attr('data-comment-id');
		BL_DeleteComment(comment_id);

		// --------------------------------------------------------------------

	});
}

$(document).ready(function()
{
	BL_enableDeleteComment();
});

// ------------------------------------------------------------------------

/**
 * 
 * Post likes
 * 
 */
function BL_enablePostLikes()
{
	$('#modal-post-likes').on('shown.bs.modal', function (e)
	{
		
		// --------------------------------------------------------------------

		$('#modal-post-likes div.modal-body-loading-indicator').show();

		// --------------------------------------------------------------------

		var request = $.ajax(
		{
			url: bucketlinks.site_url + 'ajax/post/get_likes',
			type: 'POST',
			data: { 'post_id' : bucketlinks.post_id },
			dataType: 'json'
		})
		.done(function(response)
		{
			if (response.error == false)
			{
				$('#modal-post-likes div.modal-body-content').empty().append(response.content);
				$('#modal-post-likes div.modal-body-loading-indicator').hide();
			}
			else
			{
				$('#modal-post-likes div.modal-body-content').empty().append('<p class="text-warning"><small>An error has been occured. Please try again.</small></p>');
				$('#modal-post-likes div.modal-body-loading-indicator').hide();
			}
		})
		.fail(function(jqXHR, textStatus)
		{
			console.log('Request failed: ' + textStatus);

			$('#modal-post-likes div.modal-body-content').empty().append('<p class="text-warning"><small>An error has been occured. Please try again.</small></p>');
			$('#modal-post-likes div.modal-body-loading-indicator').hide();
		});

		// --------------------------------------------------------------------

	});

	// ------------------------------------------------------------------------

	$('#modal-post-likes').on('hidden.bs.modal', function (e)
	{
		$('#modal-post-likes div.modal-body-content').empty();
	});

	// ------------------------------------------------------------------------

	$('.action-show-likes-post').on('click', function (e)
	{

		// --------------------------------------------------------------------

		var post_id = $(this).attr('data-post-id');
		bucketlinks.post_id = post_id;

		$('#modal-post-likes').modal('show');

		// --------------------------------------------------------------------

	});
}

$(document).ready(function()
{
	BL_enablePostLikes();
});

// ------------------------------------------------------------------------
