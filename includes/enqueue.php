<?php
/*
 * Lädt JS und CSS für Editor und Frontend.
 *
 * Wird verwendet, wenn keine automatische Einbindung über block.json erfolgt.
 */

defined('ABSPATH') || exit;

function cpm_enqueue_editor_assets() {
    $base = plugin_dir_url(__DIR__) . 'build/';
    $dir  = plugin_dir_path(__DIR__) . 'build/';

    if (file_exists($dir . 'editor.js')) {
        wp_enqueue_script(
            'cpm-editor-js',
            $base . 'editor.js',
            ['wp-plugins', 'wp-edit-post', 'wp-element', 'wp-components', 'wp-data', 'wp-editor'],
            filemtime($dir . 'editor.js'),
            true
        );
        wp_localize_script('cpm-editor-js', 'cpmSettings', [
            'enabledPostTypes' => get_option('cpm_enabled_post_types', []),
            'enableMedia'      => get_option('cpm_enable_media', 1),
        ]);
    }
}
add_action('enqueue_block_editor_assets', 'cpm_enqueue_editor_assets');


add_action('admin_enqueue_scripts', function ($hook) {
    if ($hook === 'settings_page_cpm_settings') {
        $base = plugin_dir_url(__DIR__) . 'build/';
        $dir  = plugin_dir_path(__DIR__) . 'build/';

        if (file_exists($dir . 'admin.css')) {
            wp_enqueue_style(
                'cpm-admin-style',
                $base . 'admin.css',
                [],
                filemtime($dir . 'admin.css')
            );
        }
    }
});
