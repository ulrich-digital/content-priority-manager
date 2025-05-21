<?php
defined('ABSPATH') || exit;

add_action('rest_api_init', function () {
	register_rest_route('debug/v1', '/media/(?P<id>\d+)', [
		'methods'  => 'POST',
		'callback' => function ($request) {
			error_log('DEBUG media update: ' . print_r($request->get_json_params(), true));
			return rest_ensure_response(['received' => $request->get_json_params()]);
		},
		'permission_callback' => '__return_true',
	]);
});


// content_priority nur für aktivierte CPTs
function cpm_register_post_priority_meta() {
    $enabled_post_types = get_option('cpm_enabled_post_types', []);

    foreach ($enabled_post_types as $type) {
        register_post_meta($type, 'content_priority', [
            'show_in_rest'  => true,
            'single'        => true,
            'type'          => 'string',
            'auth_callback' => fn() => current_user_can('edit_posts'),
        ]);
    }
}
add_action('init', 'cpm_register_post_priority_meta', 20); // Priorität 20


// pdf_priority nur wenn Option aktiviert
function cpm_register_pdf_priority_meta() {
    if (!get_option('cpm_enable_media')) {
        return;
    }

    register_post_meta('attachment', 'pdf_priority', [
        'show_in_rest'  => true,
        'single'        => true,
        'type'          => 'string',
	'auth_callback' => '__return_true',
	'sanitize_callback' => 'sanitize_text_field',

    ]);
}
add_action('init', 'cpm_register_pdf_priority_meta');
