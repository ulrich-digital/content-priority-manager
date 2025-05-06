<?php 
function cpm_register_pdf_priority_meta() {
    register_meta('post', 'pdf_priority', [
        'show_in_rest' => true,
        'single' => true,
        'type' => 'string',
        'auth_callback' => function() {
            return current_user_can('edit_posts');
        }
    ]);
}
add_action('init', 'cpm_register_pdf_priority_meta');
?>