/**
 * 
 * Share New Link
 * 
 */

// ------------------------------------------------------------------------

/**
 * 
 * Process New Link
 * 
 */
$(document).ready(function()
{

	$(document).on('click', '#button-modal-process-new-link', function()
	{

		// -----------------------------------------------------------------

		$('#button-modal-process-new-link').prop('disabled', true).html('Processing...');

		// -----------------------------------------------------------------

		var url_to_parse_input = $('#new-link-url-input');
		var url_to_parse_value = url_to_parse_input.val();

		url_to_parse_value = url_to_parse_value.replace(/ +(?= )/g,'');
		url_to_parse_value = url_to_parse_value.replace(' ', '');

		url_to_parse_input.val(url_to_parse_value);

		// -----------------------------------------------------------------

		if (BL_validateURL(url_to_parse_value))
		{
			$('#container-process-new-link-status').empty();



			$.ajax(
			{
				url: bucketlinks.site_url + 'ajax/url/parse',
				type: 'POST',
				data: { 'url': url_to_parse_value },
				dataType: 'json'
			})
			.done(function(response)
			{
				if (response.error == false)
				{

					// console.log("BEGIN/ parser response: ");
					// console.log( response );
					// console.log("END/ parser response: ");

					// hide 'process' button
					$('#container-process-new-link-button').hide();

					// check if there is an image
					if (response.content_images.length > 0 && response.content_images[0]["image_url"] != '')
					{
						$('#container-new-link-image').css({'background-image' : 'url(' + response.content_images[0]['image_url'] + ')'});
						$('#container-new-link-image').show();
						$('#new-link-image-url').val(response.content_images[0]['image_url']);
					}
					else
					{

						$('#container-new-link-image').css({'background-image' : 'url(/assets/images/common/no-image.jpg)'});
						$('#container-new-link-image').show();

						// $('#container-new-link-image-area').removeClass('col-sm-4');
						// $('#container-new-link-title-description-area').removeClass('col-sm-8').addClass('col-sm-12');
					}

					// set title and description
					$('#new-link-title').val(response.content_title);
					$('#new-link-description').val(response.content_description);

					// show details
					$('#container-process-new-link-details').show();

					// show options
					$('#container-process-new-link-options').show();

					// show 'save' button
					$('#container-save-new-link-button').show();

					// run Chosen
					$('.chosen-select').chosen(
					{
						/*width: "inherit"*/
					});
					$('.chosen-select-deselect').chosen(
					{
						/*width: "inherit",*/
						allow_single_deselect: true
					});
				}
				else
				{

					console.log("error")
					$('#button-modal-process-new-link').prop('disabled', false).empty().html('Get Content');
					$('#container-process-new-link-status').empty().append('<div class="alert alert-warning alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>An error has been occured: ' + response.content + '</div>')
				}
			})
			.fail(function(jqXHR, textStatus)
			{
				$('#button-modal-process-new-link').prop('disabled', false).empty().html('Get Content');
				$('#container-process-new-link-status').empty().append('<div class="alert alert-warning alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>An error has been occured. Please try again.</div>')
			});
		}
		else
		{
			$('#button-modal-process-new-link').prop('disabled', false).empty().html('Get Content');
			$('#container-process-new-link-status').empty().append('<div class="alert alert-warning alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>This URL is not valid</div>');
		}

		// -----------------------------------------------------------------

	});

});

// ------------------------------------------------------------------------

/**
 * 
 * Share New Link
 * 
 */
$(document).ready(function()
{

	$(document).on('click', '#button-modal-share-new-link', function()
	{

		// -----------------------------------------------------------------

		$('#button-modal-save-new-link').hide();
		$('#button-modal-share-new-link').prop('disabled', true).empty().html('Sharing...');

		// -----------------------------------------------------------------

		if ($('#is_ajax_loading').val() == 0)
		{
			$('#is_ajax_loading').val('1');

			post_data =
			{
				'post_url': $('#new-link-url-input').val(),
				'post_image_url': $('#new-link-image-url').val(),
				'post_title': $('#new-link-title').val(),
				'post_content': $('#new-link-description').val(),
				'post_interests': $('.new_link_interests').val(),
				'post_privacy_status': 'public'
			}

			$.ajax(
			{
				url: bucketlinks.site_url + 'ajax/post/add',
				type: 'POST',
				data: post_data,
				dataType: 'html'
			})
			.done(function(response)
			{
				if (response.error)
				{
					$('#container-process-new-link-status')
					.empty()
					.append('<div class="alert alert-danger alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>An error has been occured. Please try again.</div>');
					$('#button-modal-share-new-link').prop('disabled', false).empty().html('Share Link');

					$('#is_ajax_loading').val('0');
				}
				else
				{
					$('#container-save-new-link-button').empty();
					$('#container-process-new-link-status')
					.empty()
					.append('<div class="alert alert-success alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>New post has been shared!</div>');

					setTimeout(function()
					{
						$('#modal-share-new-link').modal('hide');
					}, 1000);

					window.location.replace(bucketlinks.site_url);

					$('#is_ajax_loading').val('0');
				}
			})
			.fail(function(jqXHR, textStatus)
			{
				console.log('Request failed: ' + textStatus);

				$('#container-process-new-link-status')
				.empty()
				.append('<div class="alert alert-danger alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>An error has been occured. Please try again.</div>');
				$('#button-modal-share-new-link').prop('disabled', false).empty().html('Share Link');

				$('#is_ajax_loading').val('0');
			});
		}

		// -----------------------------------------------------------------

	});

});

// ------------------------------------------------------------------------

/**
 * 
 * Save New Link
 * 
 */
$(document).ready(function()
{

	$(document).on('click', '#button-modal-save-new-link', function()
	{

		// -----------------------------------------------------------------

		$('#button-modal-share-new-link').hide();
		$('#button-modal-save-new-link').prop('disabled', true).empty().html('Saving...');

		// -----------------------------------------------------------------

		if ($('#is_ajax_loading').val() == 0)
		{
			$('#is_ajax_loading').val('1');

			post_data =
			{
				'post_url': $('#new-link-url-input').val(),
				'post_image_url': $('#new-link-image-url').val(),
				'post_title': $('#new-link-title').val(),
				'post_content': $('#new-link-description').val(),
				'post_interests': $('.new_link_interests').val(),
				'post_privacy_status': 'private'
			}

			$.ajax(
			{
				url: bucketlinks.site_url + 'ajax/post/add',
				type: 'POST',
				data: post_data,
				dataType: 'html'
			})
			.done(function(response)
			{
				if (response.error)
				{
					$('#container-process-new-link-status')
					.empty()
					.append('<div class="alert alert-danger alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>An error has been occured. Please try again.</div>');
					$('#button-modal-save-new-link').prop('disabled', false).empty().html('Save Link');

					$('#is_ajax_loading').val('0');
				}
				else
				{
					$('#container-save-new-link-button').empty();
					$('#container-process-new-link-status')
					.empty()
					.append('<div class="alert alert-success alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>New post has been saved!</div>');

					setTimeout(function()
					{
						$('#modal-share-new-link').modal('hide');
					}, 1000);

					window.location.replace(bucketlinks.site_url + 'profile/private_box');

					$('#is_ajax_loading').val('0');
				}
			})
			.fail(function(jqXHR, textStatus)
			{
				console.log('Request failed: ' + textStatus);

				$('#container-process-new-link-status')
				.empty()
				.append('<div class="alert alert-danger alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>An error has been occured. Please try again.</div>');
				$('#button-modal-save-new-link').prop('disabled', false).empty().html('Save Link');

				$('#is_ajax_loading').val('0');
			});
		}

		// -----------------------------------------------------------------

	});

});

// ------------------------------------------------------------------------

/**
 * 
 * Form validation
 * 
 */

/**
 *
 * jquery.charcounter.js version 1.2
 * requires jQuery version 1.2 or higher
 * Copyright (c) 2007 Tom Deater (http://www.tomdeater.com)
 * Licensed under the MIT License:
 * http://www.opensource.org/licenses/mit-license.php
 * 
 */
 
(function($) {
    /**
	 * attaches a character counter to each textarea element in the jQuery object
	 * usage: $("#myTextArea").charCounter(max, settings);
	 */
	
	$.fn.charCounter = function (max, settings) {
		max = max || 100;
		settings = $.extend({
			container: "<span></span>",
			classname: "charcounter",
			format: "(%1 characters remaining)",
			pulse: true,
			delay: 0
		}, settings);
		var p, timeout;
		
		function count(el, container) {
			el = $(el);
			if (el.val().length > max) {
			    el.val(el.val().substring(0, max));
			    if (settings.pulse && !p) {
			    	pulse(container, true);
			    };
			};
			if (settings.delay > 0) {
				if (timeout) {
					window.clearTimeout(timeout);
				}
				timeout = window.setTimeout(function () {
					container.html(settings.format.replace(/%1/, (max - el.val().length)));
				}, settings.delay);
			} else {
				container.html(settings.format.replace(/%1/, (max - el.val().length)));
			}
		};
		
		function pulse(el, again) {
			if (p) {
				window.clearTimeout(p);
				p = null;
			};
			el.animate({ opacity: 0.1 }, 100, function () {
				$(this).animate({ opacity: 1.0 }, 100);
			});
			if (again) {
				p = window.setTimeout(function () { pulse(el) }, 200);
			};
		};
		
		return this.each(function () {
			var container;
			if (!settings.container.match(/^<.+>$/)) {
				// use existing element to hold counter message
				container = $(settings.container);
			} else {
				// append element to hold counter message (clean up old element first)
				$(this).next("." + settings.classname).remove();
				container = $(settings.container)
								.insertAfter(this)
								.addClass(settings.classname);
			}
			$(this)
				.unbind(".charCounter")
				.bind("keydown.charCounter", function () { count(this, container); })
				.bind("keypress.charCounter", function () { count(this, container); })
				.bind("keyup.charCounter", function () { count(this, container); })
				.bind("focus.charCounter", function () { count(this, container); })
				.bind("mouseover.charCounter", function () { count(this, container); })
				.bind("mouseout.charCounter", function () { count(this, container); })
				.bind("paste.charCounter", function () { 
					var me = this;
					setTimeout(function () { count(me, container); }, 10);
				});
			if (this.addEventListener) {
				this.addEventListener('input', function () { count(this, container); }, false);
			};
			count(this, container);
		});
	};

})(jQuery);

$(function() {
    $(".counted").charCounter(250,{container: "#counter"});
});

// ------------------------------------------------------------------------

/**
 * 
 * Form styling
 * 
 */
$(document).ready(function()
{

	// -----------------------------------------------------------------

	// $('.multiselect').multiselect();

	// -----------------------------------------------------------------

});

// ------------------------------------------------------------------------
