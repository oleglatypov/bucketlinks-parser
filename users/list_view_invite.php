<?php
foreach ($users_to_invite as $users_item_key => $users_item_content)
{
	if ($users_item_content['id'] <> $user_info['user_id'])
	{
		?>
		<div 
		class="col-sm-3 users-item users-item-<?php echo $users_item_content['id']; ?>" 
		id="user-<?php echo $users_item_content['id']; ?>" 
		data-user-id="<?php echo $users_item_content['id']; ?>">
			<div class="users-item-content">
				<div class="users-item-image">
					<a href="#">
						<img src="<?php echo $users_item_content['picture']['data']['url']; ?>" class="img-thumbnail img-responsive" />
					</a>
				</div>

				<div class="users-item-details">
					<h3 class="user-name bold">
						<a href="#" class="bold">
							<?php echo $users_item_content['name']; ?>
						</a>
					</h3>
					<span>
						Not on Bucketlinks
					</span>
				</div>

				<div class="user-follow-actions">
					<button 
					class="btn btn-success btn-xs bold font-12" 
					data-user-id="<?php echo $users_item_content['id']; ?>" 
					data-state-followed="0" 
					id="button-user-<?php echo $users_item_content['id']; ?>-actions"
					>
						<span id="button-user-<?php echo $users_item_content['id']; ?>-text">
							Invite
						</span>
					</button>
				</div>
			</div>
		</div>
		<?php
	}
}
?>