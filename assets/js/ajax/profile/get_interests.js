/**
 * 
 * Ajax / Profile / Get Profile JS
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
 * Save interests
 * 
 */
$(document).ready(function()
{

	// -----------------------------------------------------------------
	
	$(document).on('click', '#button-modal-save-interests', function()
	{

		// -----------------------------------------------------------------

		$('#button-modal-save-interests')
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
					location.reload();
				}, 10);
			}
			else
			{
				alert('There was an error saving your interests. Please try again.');

				$('#button-modal-save-interests')
				.prop('disabled', false)
				.html('Save Interests');
			}
		})
		.fail(function(jqXHR, textStatus)
		{
			console.log('Request failed: ' + textStatus);

			alert('There was an error saving your interests. Please try again.');

			$('#button-modal-save-interests')
			.prop('disabled', false)
			.html('Save Interests');
		});

		// -----------------------------------------------------------------

	});

	// -----------------------------------------------------------------

});

// -----------------------------------------------------------------
