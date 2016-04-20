<?php
foreach ($likers as $likers_item_key => $likers_item_content)
{
	?>
	<div 
	class="col-sm-3 users-item users-item-<?php echo $likers_item_content['user_id']; ?>" 
	id="user-<?php echo $likers_item_content['user_id']; ?>" 
	data-user-id="<?php echo $likers_item_content['user_id']; ?>">
		<div class="users-item-content">
			<div class="users-item-image">
				<a href="<?php echo site_url('user/' . $likers_item_content['user_id']); ?>">
					<img src="<?php echo get_user_picture_from_facebook($likers_item_content['user_facebook_id'], 80, 80); ?>" class="img-thumbnail img-responsive" />
				</a>
			</div>

			<div class="users-item-details">
				<h3 class="user-name bold">
					<a href="<?php echo site_url('user/' . $likers_item_content['user_id']); ?>" class="bold" target="_blank">
						<?php echo $likers_item_content['user_first_name']; ?> <?php echo $likers_item_content['user_last_name']; ?>
					</a>
				</h3>
			</div>
		</div>
	</div>
	<?php
}
?>