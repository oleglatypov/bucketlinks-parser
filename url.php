<?php
if ( ! defined('BASEPATH')) exit('Blocked request');

/**
 * 
 * URL Controller
 * 
 */

// ----------------------------------------------------------------------------

class URL extends MY_Controller
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

		// set data
		$data = $this->set_data();

		// check user
		if (empty($this->user_info))
		{
			$this->output->set_status_header('404');

			$result =
			[
				'error' => TRUE,
				'content' => ''
			];

			return $this->output->set_output(json_encode($result));
		}

		// check if AJAX
		if ( ! $this->input->is_ajax_request())
		{
			$this->output->set_status_header('403');

			$result =
			[
				'error' => TRUE,
				'content' => 'Only AJAX calls are accepted',
			];

			return $this->output->set_output(json_encode($result));
		}

		// load model
		$this->load->model('user_model');
		$this->load->model('post_model');
	}
	
	// ------------------------------------------------------------------------

	/**
	 * 
	 * Index (default function)
	 * 
	 */
	public function index()
	{
		// set data
		$data = $this->set_data();

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
	 * Parse URL
	 * 
	 * !!! TODO: Cut banners, banner sizes: http://designerstoolbox.com/designresources/banners/
	 * !!! TODO: Cut image dublicates (compare by image URL)
	 * 
	 */
	public function parse()
	{

		// --------------------------------------------------------------------

		$result =
		[
			'error' => TRUE,
			'content' => ''
		];

		// --------------------------------------------------------------------

		// check URL
		$url = $this->input->post('url');

		if ($parts = parse_url($url))
		{
			// add http if there is no protocol part (http or https)
			if ( ! isset($parts['scheme']))
			{
				$url = 'http://' . $url;
			}
		}

		// remove 'm.' from domain to prevent mobile version of the website
		// $parts = parse_url($url);
		// if (substr($parts['host'], 0, 2) == 'm.')
		// {
		// 	$url = str_replace('https://m.', 'https://', $url);
		// 	$url = str_replace('http://m.', 'http://', $url);
		// }

		// fix mobile Youtube (youtu.be) links
		// if (substr_count($url, 'youtu.be') == 1)
		// {
		// 	// get video ID
		// 	// $url = str_replace('https://www.', '', $url);
		// 	// $url = str_replace('http://www.', '', $url);
		// 	// $url = str_replace('https://', '', $url);
		// 	// $url = str_replace('http://', '', $url);
		// 	// $url = str_replace('youtu.be/', '', $url);
		// 	// $youtube_video_id = $url;

			
			

		// }
		// else
		// {
		// 	// add 'www' if there is no subdomain
		// 	if (substr_count($parts['host'], '.') == 1)
		// 	{
		// 		$url = str_replace('https://', 'https://www.', $url);
		// 		$url = str_replace('http://', 'http://www.', $url);
		// 	}
		// }
		$youtube_image_url = '';
		$youtube_video_id = '';

		if ( (strpos($url, 'youtube.com/') !== FALSE) || (strpos($url, 'youtu.be/') !== FALSE) ) {
			preg_match("/^(?:http(?:s)?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:(?:watch)?\?(?:.*&)?v(?:i)?=|(?:embed|v|vi|user)\/))([^\?&\"'>]+)/", $url, $matches);

			if ( isset($matches) && isset($matches[1]) && is_array($matches) && !empty($matches[1]) ) {
				$youtube_video_id = $matches[1];
				// build regular Youtube URL
				$url = 'https://www.youtube.com/watch?v=' . $youtube_video_id;	
				$youtube_image_url = 'https://i.ytimg.com/vi/'.$youtube_video_id.'/hqdefault.jpg';
			}
		}

		if ( strpos($url, 'm.youtube.com/') !== FALSE ) {
			preg_match("/^(?:http(?:s)?:\/\/)?(?:m\.)?(?:youtu\.be\/|youtube\.com\/(?:(?:watch)?\?(?:.*&)?v(?:i)?=|(?:embed|v|vi|user)\/))([^\?&\"'>]+)/", $url, $matches);

			if ( isset($matches) && isset($matches[1]) && is_array($matches) && !empty($matches[1]) ) {
				$youtube_video_id = $matches[1];
				// build regular Youtube URL
				$url = 'http://m.youtube.com/watch?v=' . $youtube_video_id;	
				$youtube_image_url = 'http://i.ytimg.com/vi/'.$youtube_video_id.'/hqdefault.jpg';
				
			}
		}

		if ($parts = parse_url($url))
		{
			// add http if there is no protocol part (http or https)
			if ( ! isset($parts['scheme']))
			{
				$url = 'http://' . $url;
			}
		}

		if ( ! filter_var($url, FILTER_VALIDATE_URL))
		{
			$result =
			[
				'error' => TRUE,
				'content' => ''
			];

			return $this->output->set_output(json_encode($result));
		}

		// --------------------------------------------------------------------

		// set variables
		$content_title = '';
		$content_description = '';
		$content_images = [];
		$html = '';
		$timeout = 6;
		$user_agent = ($this->input->server('HTTP_USER_AGENT')) ? $this->input->server('HTTP_USER_AGENT') : 'Mozilla/5.0 (X11; CrOS i686 4319.74.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/29.0.1547.57 Safari/537.36';

		// --------------------------------------------------------------------

		// get HTML content
		$ch = curl_init();

		if ($youtube_video_id != '') {
			curl_setopt($ch, CURLOPT_URL, 'https://gdata.youtube.com/feeds/api/videos/'.$youtube_video_id.'?v=2');
		} else {
			curl_setopt($ch, CURLOPT_URL, $url);
		}


		curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);
		curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 0);
		curl_setopt($ch, CURLOPT_ENCODING, 'UTF-8');
		curl_setopt($ch, CURLOPT_FOLLOWLOCATION, TRUE);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
		curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, $timeout);
		curl_setopt($ch, CURLOPT_USERAGENT, $user_agent);
		$html = curl_exec($ch);

		// check if HTTP status 200 ('OK') was returned 
		// and content is at least 256 characters long
		$info = curl_getinfo($ch);

		if ($info['http_code'] <> 200 || empty($html) || mb_strlen($html) < 256)
		{
			$result =
			[
				'error' => TRUE,
				'content' => 'This URL could not be parsed, empty page or there is no response'
			];

			return $this->output->set_output(json_encode($result));
		}
		curl_close($ch); // kill cURL

		// --------------------------------------------------------------------

		// echo '<pre>';
		// var_dump($html);
		// echo '<pre>';

		// parse content
		$dom = new DOMDocument();
		@$dom->loadHTML(mb_convert_encoding($html, 'HTML-ENTITIES', 'UTF-8')); // @ is just to kill any warnings if HTML is not valid

		if ($dom)
		{
			// ----------------------------------------------------------------

			// find page title
			// first step: <title> tag
			// second step: <meta property="og:title"> tag (Open Graph)

			$is_found = FALSE;

			foreach ($dom->getElementsByTagName('title') as $element)
			{
				// echo '<pre>';
				// var_dump($element);
				// echo '</pre>';

				if ( ! $is_found)
				{
					$content_title = trim($element->nodeValue);
					$is_found = TRUE;
				}

			}

			if (empty($content_title) || $content_title == 'YouTube') 
			{
				$is_found = FALSE;
				foreach ($dom->getElementsByTagName('meta') as $element)
				{
					if ( ! $is_found)
					{
						if ($element->getAttribute('property') == 'og:title' && mb_strlen($element->getAttribute('content')) > 0)
						{
							$is_found = TRUE;
							$content_title = trim($element->getAttribute('content'));
						}
					}
				}
			}
			if (empty($content_title))
			{
				$result =
				[
					'error' => TRUE,
					'content' => 'This URL could not be parsed, page has no title'
				];

				return $this->output->set_output(json_encode($result));
			}

			// ----------------------------------------------------------------

			// find page description
			// first step: <meta name="description"> tag
			// second step: <meta property="og:description"> tag (Open Graph)

			$is_found = FALSE;

			foreach ($dom->getElementsByTagName('meta') as $element)
			{
				if ( ! $is_found)
				{
					if ($element->getAttribute('name') == 'description' && mb_strlen($element->getAttribute('content')) > 0)
					{
						$is_found = TRUE;
						$content_description = trim($element->getAttribute('content'));
					}
				}
			}
			if (empty($content_description))
			{
				$is_found = FALSE;
				foreach ($dom->getElementsByTagName('meta') as $element)
				{
					if ( ! $is_found)
					{
						if ($element->getAttribute('property') == 'og:description' && mb_strlen($element->getAttribute('content')) > 0)
						{
							$is_found = TRUE;
							$content_description = trim($element->getAttribute('content'));
						}

						if ($element->getAttribute('name') == 'og:description' && mb_strlen($element->getAttribute('content')) > 0)
						{
							$is_found = TRUE;
							$content_description = trim($element->getAttribute('content'));
						}
					}
				}
			}

			// youtube api
			if (empty($content_description))
			{
				$sPattern = "/<media:description(.*)>(.*?)<\/media:description>/s";
				preg_match($sPattern,$html,$match);
				if( isset($match[2]) && !empty($match[2]) ){
					$content_description = $match[2];
				}
				
			}

			if (mb_strlen($content_description) > 250)
			{
				$content_description = mb_substr($content_description, 0, 247) . '...';
			}

			// ----------------------------------------------------------------

			// find images in HTML body
			// first step: <meta property="og:image"> tag (Open Graph)
			// second step: loop through all <img> tags that have attributes "width" and "height" specified
			// third step: check <link> tag with rel="image_src"

			$i = 0;
			$is_found = FALSE;

			foreach ($dom->getElementsByTagName('meta') as $element)
			{
				if ( ! $is_found)
				{
					if ($element->getAttribute('property') == 'og:image' && mb_strlen($element->getAttribute('content')) > 0)
					{
						$image_url = trim($element->getAttribute('content'));
						if (filter_var($image_url, FILTER_VALIDATE_URL))
						{
							$is_found = TRUE;
							
							if ( $youtube_image_url != '' ) {
								$content_images[$i]['image_url'] = $this->check_if_grababble($youtube_image_url) ? $youtube_image_url : ''; // url
							} else {
								// $content_images[$i]['image_url'] = $this->check_if_grababble($image_url) ? $image_url : ''; // url
								$content_images[$i]['image_url'] = $image_url; // url
							}
							$content_images[$i]['image_width'] = 1; // width
							$content_images[$i]['image_height'] = 1; // height
							/*
							if ($image_size)
							{
								$content_images[$i]['image_width'] = $image_size[0]; // width
								$content_images[$i]['image_height'] = $image_size[1]; // height
							}
							*/

							$i++; // increase counter so next image starts with $i + 1
						}
					}
				}
			}



			foreach ($dom->getElementsByTagName('img') as $element)
			{

				$element_attribute_src = $element->getAttribute('src');

				// convert image to full url
				$domain = parse_url($url);
				if (substr($element_attribute_src, 0, 1) == '/')
				{
					$element_attribute_src = $domain['scheme'] . '://'.$domain['host'] . $element_attribute_src;
				}
				elseif (substr($element_attribute_src, 0, 4) != 'http')
				{
					$element_attribute_src = $domain['scheme'] . '://' . $domain['host'] . '/' . $element_attribute_src;
				}

				if (filter_var($element_attribute_src, FILTER_VALIDATE_URL))
				{
					$image_url = trim($element_attribute_src); // url
					$image_width = trim($element->getAttribute('width')); // width
					$image_height = trim($element->getAttribute('height')); // height

					// minimum requirements for the image to be parsed:
					// width : 220 pixels and more
					// height : 60 pixels and more
					if (intval($image_width) >= 220 && intval($image_height) >= 60)
					{
						if ( $youtube_image_url != '' ) {
							$content_images[$i]['image_url'] = $this->check_if_grababble($youtube_image_url) ? $youtube_image_url : ''; // url
						} else {
							// $content_images[$i]['image_url'] = $this->check_if_grababble($image_url) ? $image_url : ''; // url
							$content_images[$i]['image_url'] = $image_url;
						}
						
						$content_images[$i]['image_width'] = $image_width; // width
						$content_images[$i]['image_height'] = $image_height; // height

						$i++; // image is ok so increase counter
					}
				}
			}

			if ( $youtube_image_url != '' ) {
				$content_images[0]['image_url'] = $this->check_if_grababble($youtube_image_url) ? $youtube_image_url : ''; // url
				$content_images[0]['image_width'] = 1; // width
				$content_images[0]['image_height'] = 1; // height
			}

			// echo '<pre>';
			// var_dump($youtube_image_url);
			// var_dump($content_images);
			// echo '</pre>';
			

			// ----------------------------------------------------------------

			// build result

			$result =
			[
				'error' => FALSE,
				'content' => '',
				'url' => $url,
				'content_title' => $content_title,
				'content_description' => $content_description,
				'content_images' => $content_images
			];

			return $this->output->set_output(json_encode($result));

			// ----------------------------------------------------------------
		}
		else
		{
			$result =
			[
				'error' => TRUE,
				'content' => 'This URL could not be parsed, empty page or there is no response'
			];

			return $this->output->set_output(json_encode($result));
		}

		// --------------------------------------------------------------------

		// output
		return $this->output->set_output(json_encode($result));
		
		// --------------------------------------------------------------------

	}

	// ------------------------------------------------------------------------



	public function check_if_grababble($url){

		$result = true;

		// set variables
		$content_title = '';
		$content_description = '';
		$content_images = [];
		$html = '';
		$timeout = 6;
		$user_agent = ($this->input->server('HTTP_USER_AGENT')) ? $this->input->server('HTTP_USER_AGENT') : 'Mozilla/5.0 (X11; CrOS i686 4319.74.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/29.0.1547.57 Safri/537.36';

		// --------------------------------------------------------------------

		// get HTML content
		$ch = curl_init();
		curl_setopt($ch, CURLOPT_URL, $url);
		curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);
		curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 0);
		curl_setopt($ch, CURLOPT_ENCODING, 'UTF-8');
		curl_setopt($ch, CURLOPT_FOLLOWLOCATION, TRUE);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
		curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, $timeout);
		curl_setopt($ch, CURLOPT_USERAGENT, $user_agent);
		curl_setopt($ch, CURLOPT_AUTOREFERER, FALSE);
		curl_setopt($ch, CURLOPT_REFERER, '');
		// curl_setopt($ch, CURLOPT_REFERER, 'http://beta.bucketlinks.com');

		$html = curl_exec($ch);

		// check if HTTP status 200 ('OK') was returned 
		// and content is at least 256 characters long
		$info = curl_getinfo($ch);

		// echo '<pre>';
		// var_dump($info);
		// echo '<pre>';

		if ( $info['http_code'] <> 200 || empty($html) || mb_strlen($html) < 256 || $info['http_code'] == 403 )
		{
			$result = false;
		}
		curl_close($ch); // kill cURL

		return $result;
	}

}

// ----------------------------------------------------------------------------


/* End of file url.php */