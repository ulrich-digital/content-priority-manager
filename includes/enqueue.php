<?php
/*
 * Lädt JS und CSS für Editor und Frontend.
 *
 * Wird verwendet, wenn keine automatische Einbindung über block.json erfolgt.
 */

defined('ABSPATH') || exit;

/**
 * Lade post.js im Blockeditor
 */

add_action('enqueue_block_editor_assets', function () {
    $dir  = plugin_dir_path(__DIR__) . 'build/';
    $base = plugin_dir_url(__DIR__) . 'build/';

    wp_enqueue_script(
        'cpm-editor',
        $base . 'editor-script.js',
        ['wp-api-fetch', 'wp-plugins', 'wp-edit-post', 'wp-element', 'wp-components', 'wp-data'],
        filemtime($dir . 'editor-script.js'),
        true
    );

    wp_localize_script('cpm-editor', 'cpmSettings', [
        'enabledPostTypes' => get_option('cpm_enabled_post_types', []),
        //'enableMedia'      => get_option('cpm_enable_media', 1),
    ]);
});




add_action('admin_enqueue_scripts', function ($hook) {
    // Nur in Mediathek & Medien-Einzelansicht
    if (!in_array($hook, ['upload.php', 'media.php'])) {
        return;
    }

    $dir  = plugin_dir_path(__DIR__) . 'build/';
    $base = plugin_dir_url(__DIR__) . 'build/';

    if (file_exists($dir . 'editor-script.js')) {
        wp_enqueue_script(
            'cpm-editor-js-media',
            $base . 'editor-script.js',
            ['wp-api-fetch', 'wp-plugins', 'wp-element', 'wp-components', 'wp-data'],
            filemtime($dir . 'editor-script.js'),
            true
        );

        wp_localize_script('cpm-editor-js-media', 'cpmSettings', [
            //'enableMedia' => get_option('cpm_enable_media', 1),
            'allowedMimeTypes' => get_option('cpm_allowed_media_types', ['application/pdf']),

        ]);
    }
});


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