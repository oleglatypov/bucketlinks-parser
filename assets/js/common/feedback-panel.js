/**
 * 
 * Feedback Panel JS
 * 
 */

// ------------------------------------------------------------------------

/**
 * 
 * Activate feedback panel
 * 
 */
$(document).ready(function(event)
{

	// ------------------------------------------------------------------------

	$('#feedback_submit').click(function()
	{
		var post_data = new Object();
		post_data.feedback_message = $('#feedback_textarea').val();
		post_data.user_id = bucketlinks.user_id;
		$.post(bucketlinks.site_url + 'ajax/feedback/send_feedbackJSON', post_data, function(data)
		{
			if (data.error == false)
			{
				$('.feedback_submit').hide();
				$('.feedback_textarea').hide();
				$('.feedback_form').html('<p>Thank you for taking a time to provide us with your valuable feedback.</p>');
				setTimeout(
				function()
				{
					$('.feedback_button').click();
				},
				1000);
			}
			else
			{
				alert('error');
			}
		}, 'json');
	});

	// ------------------------------------------------------------------------

	$('.feedback_button').click(function()
	{
		var slider_box = $('div.feedback_panel');
		slider_box.animate(
		{
			left: parseInt(slider_box.css('left'), 10) == 0 ? -slider_box.css('left', '-271px') : 0
		});
	});

	// ------------------------------------------------------------------------

});

// ------------------------------------------------------------------------
