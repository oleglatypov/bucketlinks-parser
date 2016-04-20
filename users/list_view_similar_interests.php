<?php
reset($people_by_interests_to_follow);
for ($icc = 0; $icc < count($people_by_interests_to_follow); $icc++)
{
	if ($icc < 12)
	{
		$users_item_content = $people_by_interests_to_follow[$icc];
		?>
		<div 
		class="col-sm-3 users-item users-item-<?php echo $users_item_content['user_id']; ?>" 
		id="user-<?php echo $users_item_content['user_id']; ?>" 
		data-user-id="<?php echo $users_item_content['user_id']; ?>">
			<div class="users-item-content">
				<div class="users-item-image">
					<a href="<?php echo site_url('user/' . $users_item_content['user_id']); ?>">
						<img src="<?php echo get_user_picture_from_facebook($users_item_content['user_facebook_id'], 80, 80); ?>" class="img-thumbnail img-responsive" />
					</a>
				</div>

				<div class="users-item-details">
					<h3 class="user-name bold">
						<a href="<?php echo site_url('user/' . $users_item_content['user_id']); ?>" class="bold">
							<?php echo $users_item_content['user_first_name']; ?> <?php echo $users_item_content['user_last_name']; ?>
						</a>
					</h3>
					<span>
						<?php echo ucfirst(get_gender_value($users_item_content['user_gender'])); ?>
					</span>
				</div>

				<div class="user-follow-actions">
					<button 
					class="btn btn-success btn-xs bold font-12 link-actions-user" 
					data-user-id="<?php echo $users_item_content['user_id']; ?>" 
					data-state-followed="<?php echo (in_array($users_item_content['user_id'], $my_following_users)) ? '1' : '0'; ?>" 
					id="button-user-<?php echo $users_item_content['user_id']; ?>-actions"
					>
						<span id="button-user-<?php echo $users_item_content['user_id']; ?>-text">
							<?php
							echo (in_array($users_item_content['user_id'], $my_following_users)) ? 'Unfollow' : 'Follow';
							?>
						</span>
					</button>
				</div>
			</div>
		</div>
		<?php
	}
}
