/**
 * 
 * Interests JS
 * 
 */

// ------------------------------------------------------------------------

/**
 * 
 * Save interests
 * 
 */
$(document).ready(function()
{

	// -----------------------------------------------------------------

	$(document).on('click', '#button-save-interests', function()
	{

		// -----------------------------------------------------------------

		var checked_values = [];

		$('#container-interests-list input[type=checkbox]').each(function ()
		{
			if (this.checked)
			{
				checked_values.push($(this).val());
			}
		});

		if (checked_values.length < 3)
		{
			alert('Select at least 3 interests');
			return false;
		}

		// -----------------------------------------------------------------

		$('#button-save-interests')
		.prop('disabled', true)
		.html('Saving...');

		// -----------------------------------------------------------------

		$.ajax(
		{
			url: bucketlinks.site_url + 'ajax/profile/save_interests',
			type: 'POST',
			data: $('#form_profile_interests').serialize(),
			dataType: 'json'
		})
		.done(function(response)
		{
			if (response.error == false)
			{
				setTimeout(function()
				{
					window.location.href = bucketlinks.site_url + 'profile/invite';
				}, 10);
			}
			else
			{
				alert('There was an error saving your interests. Please try again.');

				$('#button-save-interests')
				.prop('disabled', false)
				.html('Save My Interests');
			}
		})
		.fail(function(jqXHR, textStatus)
		{
			console.log('Request failed: ' + textStatus);

			alert('There was an error saving your interests. Please try again.');

			$('#button-save-interests')
			.prop('disabled', false)
			.html('Save My Interests');
		});

		// -----------------------------------------------------------------

	});

	// -----------------------------------------------------------------

});

// ------------------------------------------------------------------------
