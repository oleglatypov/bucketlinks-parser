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
 * Prevent form submitting
 * 
 */
$(document).on('submit', '#form_profile_profile', function(e)
{

	// -----------------------------------------------------------------
	
	e.preventDefault();

	// -----------------------------------------------------------------

});

// ------------------------------------------------------------------------

/**
 * 
 * Save profile
 * 
 */
$(document).ready(function()
{

	$(document).on('click', '#button-modal-save-profile', function()
	{

		// -----------------------------------------------------------------

		$('#button-modal-save-profile')
		.prop('disabled', true)
		.html('Saving...');

		// -----------------------------------------------------------------

		$.ajax(
		{
			url: bucketlinks.site_url + 'ajax/profile/save_profile',
			type: 'POST',
			data: $('#form_profile_profile').serialize(),
			dataType: 'json'
		})
		.done(function(response)
		{
			if (response.error == false)
			{
				$('#container-profile-profile-status')
				.empty()
				.append('<div class="alert alert-success alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>Your profile has been saved!</div>');

				setTimeout(function()
				{
					location.reload();
				}, 100);
			}
			else
			{
				$('#button-modal-save-profile')
				.prop('disabled', false)
				.html('Save Profile');
			}
		})
		.fail(function(jqXHR, textStatus)
		{
			console.log('Request failed: ' + textStatus);

			$('#container-profile-profile-status')
			.empty()
			.append('<div class="alert alert-warning alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>An error has been occured. Please try again.</div>');
			
			$('#button-modal-save-profile')
			.prop('disabled', false)
			.html('Save Profile');
		});
		
		// -----------------------------------------------------------------

	});

});

// ------------------------------------------------------------------------
