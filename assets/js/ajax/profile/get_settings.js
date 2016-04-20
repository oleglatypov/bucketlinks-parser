/**
 * 
 * Ajax / Profile / Get Settings JS
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
 * Prevent form submitting
 * 
 */
$(document).on('submit', '#form_settings', function(e)
{

	// -----------------------------------------------------------------
	
	e.preventDefault();

	// -----------------------------------------------------------------

});

// ------------------------------------------------------------------------

/**
 * 
 * Save settings
 * 
 */
$(document).ready(function()
{

	$(document).on('click', '#button-modal-save-settings', function()
	{

		// -----------------------------------------------------------------

		$('#button-modal-save-settings')
		.prop('disabled', true)
		.html('Saving...');

		// -----------------------------------------------------------------

		$.ajax(
		{
			url: bucketlinks.site_url + 'ajax/profile/save_settings',
			type: 'POST',
			data: $('#form_settings').serialize(),
			dataType: 'json'
		})
		.done(function(response)
		{
			if (response.error == false)
			{
				$('#container-settings-status')
				.empty()
				.append('<div class="alert alert-success alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>Your settings have been saved!</div>');

				setTimeout(function()
				{
					$('#modal-my-settings').modal('hide');
				}, 1000);
			}
			else
			{
				$('#button-modal-save-settings')
				.prop('disabled', false)
				.html('Save My Settings');
			}
		})
		.fail(function(jqXHR, textStatus)
		{
			console.log('Request failed: ' + textStatus);

			$('#container-settings-status')
			.empty()
			.append('<div class="alert alert-warning alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>An error has been occured. Please try again.</div>');
			
			$('#button-modal-save-settings')
			.prop('disabled', false)
			.html('Save My Settings');
		});
		
		// -----------------------------------------------------------------

	});

});

// ------------------------------------------------------------------------
