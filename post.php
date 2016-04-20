<?php
if ( ! defined('BASEPATH')) exit('Blocked request');

/**
 * 
 * Post Controller
 * 
 */

// ----------------------------------------------------------------------------

class Post extends MY_Controller
{

	// ------------------------------------------------------------------------
	
	/**
	 * 
	 * Constructor
	 * 
	 */
	function __construct()
	{
		parent::__construct();

		header('Content-Type: application/json; charset=utf-8');

		// check user
		if (empty($this->user_info))
		{
			$this->output->set_status_header('404');

			die('error');
		}

		// check if AJAX
		if ( ! $this->input->is_ajax_request())
		{
			$this->output->set_status_header('404');

			die('error');
		}

		// load models
		$this->load->model('post_model');
		$this->load->model('post_read_later_model');
		$this->load->model('post_like_model');
		$this->load->model('tag_model');
		$this->load->model('user_model');
	}
	
	// ------------------------------------------------------------------------

	/**
	 * 
	 * Index (default function)
	 * 
	 */
	public function index()
	{
		$result =
		[
			'error' => TRUE,
			'content' => ''
		];

		return $this->output->set_output(json_encode($result));
	}

	// ------------------------------------------------------------------------

	/**
	 * 
	 * Add new post
	 * 
	 */
	public function add()
	{
		// set data
		$data = $this->set_data();

		$result =
		[
			'error' => TRUE,
			'content' => ''
		];

		// set post data
		$post_has_image = 0;
		if (strlen($this->input->post('post_image_url')) > 0)
		{
			$post_has_image = 1;
		}

		$post_description = $this->input->post('post_content') ? mb_substr($this->input->post('post_content'), 0, 250) : '';

		preg_match_all("/(#\w+)/u", $post_description, $post_tags);
		if ($post_tags) {
			$hashtagsArray = array_count_values($post_tags[0]);
			$hashtags = array_keys($hashtagsArray);
		}
		$post_tags_prepared = [];
		if (is_array($hashtags) && count($hashtags))
		{
			foreach ($hashtags as $key => $value)
			{
				$value = str_replace('#', '', $value);
				$post_tags_prepared[] = trim($value);
			}
		}

		if (count($post_tags_prepared) > 0)
		{
			foreach ($post_tags_prepared as $key => $value)
			{
				$post_description = str_replace('#' . $value, '', $post_description);
			}
		}
		$post_description = preg_replace('/\s\s+/', ' ', $post_description);

		reset($post_tags_prepared);

		$post_interests = $this->input->post('post_interests') ? $this->input->post('post_interests') : [];
		$post_data =
		[
			'post_id' => '',
			'post_title' => $this->input->post('post_title') ? mb_substr($this->input->post('post_title'), 0, 200) : '',
			'post_description' => $post_description,
			'post_url' => $this->input->post('post_url'),
			'post_has_image' => $post_has_image,
			'post_image_url' => $this->input->post('post_image_url'),
			'post_owner_id' => $data['user_info']['user_id'],
			'post_updated_timestamp' => 'NOW()',
			'post_privacy_status' => $this->input->post('post_privacy_status'),
		];
		

		// add post and fetch its ID
		$post_id = $this->post_model->add_post($post_data);

		if ($post_id)
		{
			// generate posh hash ID
			$post_hash_id = generate_post_hash_id($post_id);

			// update post hash ID
			$this->post_model->update_post_hash_id($post_id, $post_hash_id);

			// save post interests
			$this->post_model->update_post_interests($post_id, $post_interests);

			// save post tags
			$add_tags_to_collection = $this->tag_model->add_tags_to_collection($post_tags_prepared, $data['user_info']['user_id']);
			$post_tags_id_values = $this->tag_model->get_tags_id_values($post_tags_prepared);
			$save_post_tags = $this->tag_model->save_post_tags($post_id, $post_tags_id_values);

			$result =
			[
				'error' => FALSE,
				'content' => ''
			];
		}

		return $this->output->set_output(json_encode($result));
	}
	
	// ------------------------------------------------------------------------

	/**
	 * 
	 * Delete post
	 * 
	 */
	public function delete()
	{
		// set data
		$data = $this->set_data();

		$result =
		[
			'error' => TRUE,
			'content' => ''
		];

		$post_id = ($this->input->post('post_id')) ? $this->input->post('post_id') : 0;
		if ( ! $post_id)
		{
			return $this->output->set_output(json_encode($result));
		}

		if ($this->post_model->delete_post($post_id, $data['user_info']['user_id']))
		{
			$result =
			[
				'error' => FALSE,
				'content' => 'ok'
			];
		}

		return $this->output->set_output(json_encode($result));
	}

	// ------------------------------------------------------------------------

	/**
	 * 
	 * Read later post
	 * 
	 */
	public function read_later()
	{
		// set data
		$data = $this->set_data();

		$result =
		[
			'error' => TRUE,
			'content' => ''
		];

		$post_id = ($this->input->post('post_id')) ? $this->input->post('post_id') : 0;
		if ( ! $post_id)
		{
			return $this->output->set_output(json_encode($result));
		}

		$post_exists = TRUE;
		
		if ($post_exists)
		{
			$user_id = $data['user_info']['user_id'];

			if ($this->post_read_later_model->add_read_later($post_id, $user_id))
			{
				$result =
				[
					'error' => FALSE,
					'content' => 'ok'
				];
			}
		}

		return $this->output->set_output(json_encode($result));
	}

	// ------------------------------------------------------------------------
	
	/**
	 * 
	 * Delete read later post
	 * 
	 */
	public function read_later_delete()
	{
		// set data
		$data = $this->set_data();

		$result =
		[
			'error' => TRUE,
			'content' => ''
		];

		$post_id = ($this->input->post('post_id')) ? $this->input->post('post_id') : 0;
		if ( ! $post_id)
		{
			return $this->output->set_output(json_encode($result));
		}

		$post_exists = TRUE;
		
		if ($post_exists)
		{
			$user_id = $data['user_info']['user_id'];

			if ($this->post_read_later_model->delete_read_later($post_id, $user_id))
			{
				$result =
				[
					'error' => FALSE,
					'content' => 'ok'
				];
			}
		}

		return $this->output->set_output(json_encode($result));
	}

	// ------------------------------------------------------------------------

	/**
	 * 
	 * Make private post public
	 * 
	 */
	public function make_public()
	{
		// set data
		$data = $this->set_data();

		$result =
		[
			'error' => TRUE,
			'content' => ''
		];

		$post_id = ($this->input->post('post_id')) ? $this->input->post('post_id') : 0;
		if ( ! $post_id)
		{
			return $this->output->set_output(json_encode($result));
		}

		$post_exists = TRUE;
		
		if ($post_exists)
		{
			$user_id = $data['user_info']['user_id'];

			if ($this->post_model->make_public($post_id, $user_id))
			{
				$result =
				[
					'error' => FALSE,
					'content' => 'ok'
				];
			}
		}

		return $this->output->set_output(json_encode($result));
	}

	// ------------------------------------------------------------------------

	/**
	 * 
	 * Like / unlike post
	 * 
	 */
	public function like()
	{
		// set data
		$data = $this->set_data();

		$result =
		[
			'error' => TRUE,
			'content' => 'unliked'
		];

		$post_id = ($this->input->post('post_id')) ? $this->input->post('post_id') : 0;
		if ( ! $post_id || $post_id == 0)
		{
			return $this->output->set_output(json_encode($result));
		}

		$post_exists = TRUE;

		if ($post_exists)
		{
			$user_id = $data['user_info']['user_id'];
			$like_state = $this->post_like_model->get_state($post_id, $user_id);
			$post_content = $this->post_model->get_post_info_by_id($post_id);

			if (count($like_state) > 0)
			{
				$result_delete_like = $this->post_like_model->delete_like($post_id, $user_id);
				if ($result_delete_like)
				{
					$this->post_model->decrease_post_likes_counter($post_id);

					$result =
					[
						'error' => FALSE,
						'content' => 'unliked'
					];

					return $this->output->set_output(json_encode($result));
				}
			}
			else
			{
				$result_add_like = $this->post_like_model->add_like($post_id, $user_id);

				if ($result_add_like)
				{
					$this->post_model->increase_post_likes_counter($post_id);

					$result =
					[
						'error' => FALSE,
						'content' => 'liked'
					];

					// get notification settings
					$user_notification_settings = $this->user_model->get_user_notification_settings($post_content['post_owner_id']);

					// email notification
					if ($user_notification_settings['post_liked_receive_emails'] == 1)
					{
						notification_user_new_post_like_send_email($post_content['post_owner_id'], $user_id, $post_id);
					}

					// save notification
					if ($user_notification_settings['post_liked_receive_notifications'] == 1)
					{
						notification_user_new_post_like_save($post_content['post_owner_id'], $user_id, $post_id);
					}

					return $this->output->set_output(json_encode($result));
				}
			}
		}

		return $this->output->set_output(json_encode($result));
	}

	// ------------------------------------------------------------------------

	/**
	 * 
	 * Get HTML for Youtube video
	 * 
	 */
	public function get_video_youtube_html()
	{
		// set data
		$data = $this->set_data();

		$result =
		[
			'error' => TRUE,
			'content' => '',
			'video_html' => '',
		];

		$youtube_video_id = ($this->input->post('youtube_video_id')) ? $this->input->post('youtube_video_id') : 0;
		if ($youtube_video_id == 0)
		{
			return $this->output->set_output(json_encode($result));
		}
		else
		{
			$result =
			[
				'error' => FALSE,
				'content' => 'ok',
				'video_html' => get_post_youtube_video_html($youtube_video_id),
			];
		}

		return $this->output->set_output(json_encode($result));
	}

	// ------------------------------------------------------------------------

	/**
	 * 
	 * Get post likes
	 * 
	 */
	public function get_likes()
	{
		// set data
		$data = $this->set_data();

		$result =
		[
			'error' => TRUE,
			'content' => '',
		];

		$post_id = ($this->input->post('post_id')) ? $this->input->post('post_id') : 0;
		if ( ! $post_id || $post_id == 0)
		{
			return $this->output->set_output(json_encode($result));
		}

		// set view name to load
		$data['view_name'] = 'posts/get_likes';

		// get likers
		$data['likers'] = $this->post_like_model->get_post_likes($post_id);

		// generate likers HTML
		$data['users_html_likers'] = $this->load->view('_template/users/list_view_likers', $data, TRUE);

		// load view for result
		$content = $this->view_library->build_ajax($data);

		if ($content)
		{
			$result =
			[
				'error' => FALSE,
				'content' => $content,
			];
		}

		// output
		return $this->output->set_output(json_encode($result));
	}

	// ------------------------------------------------------------------------

	/**
	 * 
	 * Get home feed posts (AJAX)
	 * 
	 */
	public function get_home_posts()
	{
		// set data
		$data = $this->set_data();

		$result =
		[
			'error' => TRUE,
			'content' => '',
		];

		// get last loaded post ID
		$posts_last_loaded_id = $this->session->userdata('home_feed_posts_last_id');
		$_new_session_home_feed_posts_ids = $this->session->userdata('home_feed_posts_ids');

		$is_by_interest = ($this->input->post('is_by_interest')) ? $this->input->post('is_by_interest') : 0;
		$is_by_interest = intval($is_by_interest);

		if ($posts_last_loaded_id > 0)
		{
			if ($is_by_interest)
			{
				$data['posts'] = $this->post_model->get_home_posts($data['user_info']['user_id'], TRUE, TRUE, $posts_last_loaded_id, $_new_session_home_feed_posts_ids);
			}
			else
			{
				$data['posts'] = $this->post_model->get_home_posts($data['user_info']['user_id'], TRUE, FALSE, $posts_last_loaded_id, $_new_session_home_feed_posts_ids);
			}

			// get posts IDs
			$posts_ids = array_keys($data['posts']);

			// set last loaded post ID
			if (count($posts_ids))
			{
				$this->session->set_userdata('home_feed_posts_last_id', end($posts_ids));

				$_new_session_home_feed_posts_ids = array_merge($_new_session_home_feed_posts_ids, $posts_ids);
				$this->session->set_userdata('home_feed_posts_ids', $_new_session_home_feed_posts_ids);
				reset($posts_ids);
			}

			// detect my likes
			$posts_with_my_likes = $this->post_like_model->detect_posts_liked_by_user($posts_ids, $data['user_info']['user_id']);
			$__posts_with_my_likes = [];
			foreach ($posts_with_my_likes as $posts_with_my_likes_item)
			{
				$__posts_with_my_likes[] = $posts_with_my_likes_item['post_id'];
			}
			$data['posts_with_my_likes'] = $__posts_with_my_likes;

			// get posts comments
			$data['posts_comments'] = $this->post_model->get_posts_comments($posts_ids);

			// set section for posts
			$data['posts_section'] = 'home';

			// generate posts HTML
			$data['posts_html'] = $this->load->view('_template/posts/list_view', $data, TRUE);

			$result =
			[
				'error' => FALSE,
				'content' => $data['posts_html'],
			];
		}

		// output
		return $this->output->set_output(json_encode($result));
	}

	// ------------------------------------------------------------------------

	/**
	 * 
	 * Get profile posts (AJAX)
	 * 
	 */
	public function get_profile_posts()
	{
		// set data
		$data = $this->set_data();

		$result =
		[
			'error' => TRUE,
			'content' => '',
		];

		// get last loaded post ID
		$posts_last_loaded_id = $this->session->userdata('profile_feed_posts_last_id');
		$_new_session_profile_feed_posts_ids = $this->session->userdata('profile_feed_posts_ids');

		if ($posts_last_loaded_id > 0)
		{
			// get posts
			$data['posts'] = $this->post_model->get_my_profile_posts($data['user_info']['user_id'], TRUE, FALSE, $posts_last_loaded_id, $_new_session_profile_feed_posts_ids);
			
			// get posts IDs
			$posts_ids = array_keys($data['posts']);

			// set last loaded post ID
			if (count($posts_ids))
			{
				$this->session->set_userdata('profile_feed_posts_last_id', end($posts_ids));

				$_new_session_profile_feed_posts_ids = array_merge($_new_session_profile_feed_posts_ids, $posts_ids);
				$this->session->set_userdata('profile_feed_posts_ids', $_new_session_profile_feed_posts_ids);
				reset($posts_ids);
			}
		}

		// detect my likes
		$posts_with_my_likes = $this->post_like_model->detect_posts_liked_by_user($posts_ids, $data['user_info']['user_id']);
		$__posts_with_my_likes = [];
		foreach ($posts_with_my_likes as $posts_with_my_likes_item)
		{
			$__posts_with_my_likes[] = $posts_with_my_likes_item['post_id'];
		}
		$data['posts_with_my_likes'] = $__posts_with_my_likes;

		// get posts comments
		$data['posts_comments'] = $this->post_model->get_posts_comments($posts_ids);

		// set section for posts
		$data['posts_section'] = 'profile';

		// generate posts HTML
		$data['posts_html'] = $this->load->view('_template/posts/list_view', $data, TRUE);

		$result =
		[
			'error' => FALSE,
			'content' => $data['posts_html'],
		];

		// output
		return $this->output->set_output(json_encode($result));
	}

	// ------------------------------------------------------------------------

	/**
	 * 
	 * Get profile likes posts (AJAX)
	 * 
	 */
	public function get_likes_posts()
	{
		// set data
		$data = $this->set_data();

		$result =
		[
			'error' => TRUE,
			'content' => '',
		];

		// get last loaded post ID
		$posts_last_loaded_id = $this->session->userdata('profile_likes_posts_last_id');
		$_new_session_profile_likes_posts_ids = $this->session->userdata('profile_likes_posts_ids');

		if ($posts_last_loaded_id > 0)
		{
			// get posts
			$data['posts'] = $this->post_model->get_user_liked_posts($data['user_info']['user_id'], TRUE, $posts_last_loaded_id, $_new_session_profile_likes_posts_ids);
			
			// get posts IDs
			$posts_ids = array_keys($data['posts']);

			// set last loaded post ID
			if (count($posts_ids))
			{
				$this->session->set_userdata('profile_likes_posts_last_id', end($posts_ids));

				$_new_session_profile_likes_posts_ids = array_merge($_new_session_profile_likes_posts_ids, $posts_ids);
				$this->session->set_userdata('profile_likes_posts_ids', $_new_session_profile_likes_posts_ids);
				reset($posts_ids);
			}
		}

		// detect my likes
		$posts_with_my_likes = $this->post_like_model->detect_posts_liked_by_user($posts_ids, $data['user_info']['user_id']);
		$__posts_with_my_likes = [];
		foreach ($posts_with_my_likes as $posts_with_my_likes_item)
		{
			$__posts_with_my_likes[] = $posts_with_my_likes_item['post_id'];
		}
		$data['posts_with_my_likes'] = $__posts_with_my_likes;

		// get posts comments
		$data['posts_comments'] = $this->post_model->get_posts_comments($posts_ids);

		// set section for posts
		$data['posts_section'] = 'likes';

		// generate posts HTML
		$data['posts_html'] = $this->load->view('_template/posts/list_view', $data, TRUE);

		$result =
		[
			'error' => FALSE,
			'content' => $data['posts_html'],
		];

		// output
		return $this->output->set_output(json_encode($result));
	}

	// ------------------------------------------------------------------------

	/**
	 * 
	 * Get profile private box posts (AJAX)
	 * 
	 */
	public function get_private_box_posts()
	{
		// set data
		$data = $this->set_data();

		$result =
		[
			'error' => TRUE,
			'content' => '',
		];

		// get last loaded post ID
		$posts_last_loaded_id = $this->session->userdata('profile_private_box_posts_last_id');
		$_new_session_profile_private_box_posts_ids = $this->session->userdata('profile_private_box_posts_ids');

		if ($posts_last_loaded_id > 0)
		{
			// get posts
			$data['posts'] = $this->post_model->get_user_private_posts($data['user_info']['user_id'], TRUE, $posts_last_loaded_id, $_new_session_profile_private_box_posts_ids);

			// get posts IDs
			$posts_ids = array_keys($data['posts']);

			// set last loaded post ID
			if (count($posts_ids))
			{
				$this->session->set_userdata('profile_private_box_posts_last_id', end($posts_ids));

				$_new_session_profile_private_box_posts_ids = array_merge($_new_session_profile_private_box_posts_ids, $posts_ids);
				$this->session->set_userdata('profile_private_box_posts_ids', $_new_session_profile_private_box_posts_ids);
				reset($posts_ids);
			}
		}

		// detect my likes
		$posts_with_my_likes = $this->post_like_model->detect_posts_liked_by_user($posts_ids, $data['user_info']['user_id']);
		$__posts_with_my_likes = [];
		foreach ($posts_with_my_likes as $posts_with_my_likes_item)
		{
			$__posts_with_my_likes[] = $posts_with_my_likes_item['post_id'];
		}
		$data['posts_with_my_likes'] = $__posts_with_my_likes;

		// get posts comments
		$data['posts_comments'] = $this->post_model->get_posts_comments($posts_ids);

		// set section for posts
		$data['posts_section'] = 'private_box';

		// generate posts HTML
		$data['posts_html'] = $this->load->view('_template/posts/list_view', $data, TRUE);

		$result =
		[
			'error' => FALSE,
			'content' => $data['posts_html'],
		];

		// output
		return $this->output->set_output(json_encode($result));
	}

	// ------------------------------------------------------------------------

	/**
	 * 
	 * Get profile read later posts (AJAX)
	 * 
	 */
	public function get_read_later_posts()
	{
		// set data
		$data = $this->set_data();

		$result =
		[
			'error' => TRUE,
			'content' => '',
		];

		// get last loaded post ID
		$posts_last_loaded_id = $this->session->userdata('profile_read_later_posts_last_id');
		$_new_session_profile_read_later_posts_ids = $this->session->userdata('profile_read_later_posts_ids');

		if ($posts_last_loaded_id > 0)
		{
			// get posts
			$data['posts'] = $this->post_model->get_user_read_later_posts($data['user_info']['user_id'], TRUE, $posts_last_loaded_id, $_new_session_profile_read_later_posts_ids);

			// get posts IDs
			$posts_ids = array_keys($data['posts']);

			// set last loaded post ID
			if (count($posts_ids))
			{
				$this->session->set_userdata('profile_read_later_posts_last_id', end($posts_ids));

				$_new_session_profile_read_later_posts_ids = array_merge($_new_session_profile_read_later_posts_ids, $posts_ids);
				$this->session->set_userdata('profile_read_later_posts_ids', $_new_session_profile_read_later_posts_ids);
				reset($posts_ids);
			}
		}

		// detect my likes
		$posts_with_my_likes = $this->post_like_model->detect_posts_liked_by_user($posts_ids, $data['user_info']['user_id']);
		$__posts_with_my_likes = [];
		foreach ($posts_with_my_likes as $posts_with_my_likes_item)
		{
			$__posts_with_my_likes[] = $posts_with_my_likes_item['post_id'];
		}
		$data['posts_with_my_likes'] = $__posts_with_my_likes;

		// get posts comments
		$data['posts_comments'] = $this->post_model->get_posts_comments($posts_ids);

		// set section for posts
		$data['posts_section'] = 'read_later';

		// generate posts HTML
		$data['posts_html'] = $this->load->view('_template/posts/list_view', $data, TRUE);

		$result =
		[
			'error' => FALSE,
			'content' => $data['posts_html'],
		];

		// output
		return $this->output->set_output(json_encode($result));
	}

	// ------------------------------------------------------------------------

	/**
	 * 
	 * Get user posts (AJAX)
	 * 
	 */
	public function get_user_posts()
	{
		// set data
		$data = $this->set_data();

		// get user ID
		$user_id = (int) $this->input->post('user_id');

		$result =
		[
			'error' => TRUE,
			'content' => '',
		];

		// get last loaded post ID
		$posts_last_loaded_id = $this->session->userdata('user_feed_posts_last_id');
		$_new_session_user_feed_posts_ids = $this->session->userdata('user_feed_posts_ids');

		if ($posts_last_loaded_id > 0)
		{
			// get posts
			$data['posts'] = $this->post_model->get_user_profile_posts_by_user_id($user_id, TRUE, $posts_last_loaded_id, $_new_session_user_feed_posts_ids);
			
			// get posts IDs
			$posts_ids = array_keys($data['posts']);

			// set last loaded post ID
			if (count($posts_ids))
			{
				$this->session->set_userdata('user_feed_posts_last_id', end($posts_ids));

				$_new_session_user_feed_posts_ids = array_merge($_new_session_user_feed_posts_ids, $posts_ids);
				$this->session->set_userdata('user_feed_posts_ids', $_new_session_user_feed_posts_ids);
				reset($posts_ids);
			}
		}

		// detect my likes
		$posts_with_my_likes = $this->post_like_model->detect_posts_liked_by_user($posts_ids, $data['user_info']['user_id']);
		$__posts_with_my_likes = [];
		foreach ($posts_with_my_likes as $posts_with_my_likes_item)
		{
			$__posts_with_my_likes[] = $posts_with_my_likes_item['post_id'];
		}
		$data['posts_with_my_likes'] = $__posts_with_my_likes;

		// get posts comments
		$data['posts_comments'] = $this->post_model->get_posts_comments($posts_ids);

		// set section for posts
		$data['posts_section'] = 'user';

		// generate posts HTML
		$data['posts_html'] = $this->load->view('_template/posts/list_view', $data, TRUE);

		$result =
		[
			'error' => FALSE,
			'content' => $data['posts_html'],
		];

		// output
		return $this->output->set_output(json_encode($result));
	}

	// ------------------------------------------------------------------------

	/**
	 * 
	 * Increase post views counter
	 * 
	 */
	public function increase_views_counter()
	{
		// set data
		$data = $this->set_data();

		$result =
		[
			'error' => TRUE,
			'content' => ''
		];

		$post_id = ($this->input->post('post_id')) ? $this->input->post('post_id') : 0;
		if ( ! $post_id)
		{
			return $this->output->set_output(json_encode($result));
		}

		if ($this->post_model->increase_post_views_counter_by_id($post_id))
		{
			$result =
			[
				'error' => FALSE,
				'content' => 'ok'
			];
		}

		return $this->output->set_output(json_encode($result));
	}

	// ------------------------------------------------------------------------

}

// ----------------------------------------------------------------------------


/* End of file post.php */