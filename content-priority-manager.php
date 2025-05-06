<?php
/**
 * Plugin Name: Content Priority Manager
 * Description: Ermöglicht die Verwaltung von Prioritäten für Medien, Beiträge und mehr.
 * Version: 1.0
 * Author: ulrich.digital gmbh
 * Author URI: https://ulrich.digital/
 * License: GPL v2 or later
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain: content-priority-manager
 */

/* =============================================================== *\ 
   Lädt die JavaScript-Dateien für Gutenberg-Editor (wenn vorhanden)
   - media.js: für Medienanhänge
   - post.js: für Beiträge, Seiten, CTPs
\* =============================================================== */
function cpm_enqueue_editor_assets() {
    $base = plugin_dir_url(__FILE__) . 'build/';
    $dir  = plugin_dir_path(__FILE__) . 'build/';

    // media.js
    if (file_exists($dir . 'media.js')) {
        wp_enqueue_script(
            'cpm-media-priority',
            $base . 'media.js',
            [ 'wp-plugins', 'wp-edit-post', 'wp-element', 'wp-components', 'wp-data', 'wp-editor' ],
            filemtime($dir . 'media.js'),
            true
        );
    }

    // post.js (optional, für später)
    if (file_exists($dir . 'post.js')) {
        wp_enqueue_script(
            'cpm-post-priority',
            $base . 'post.js',
            [ 'wp-plugins', 'wp-edit-post', 'wp-element', 'wp-components', 'wp-data', 'wp-editor' ],
            filemtime($dir . 'post.js'),
            true
        );
    }
}
add_action('enqueue_block_editor_assets', 'cpm_enqueue_editor_assets');


/* =============================================================== *\ 
   Registriert das Custom Field "pdf_priority" für Anhänge
   - sichtbar über die REST API
   - erlaubt die Verwendung im Gutenberg-Editor und externen Tools
\* =============================================================== */
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


/* =============================================================== *\ 
   Fügt ein Dropdown zur Prioritätsauswahl im Medien-Popup hinzu
   - erscheint in den Anhang-Details von PDF-Dateien
\* =============================================================== */
add_filter('attachment_fields_to_edit', function($form_fields, $post) {
    if ($post->post_mime_type !== 'application/pdf') {
        return $form_fields;
    }

    $value = get_post_meta($post->ID, 'pdf_priority', true) ?: 'mittel';

    $form_fields['pdf_priority'] = [
        'label' => 'Priorität',
        'input' => 'html',
        'html'  => '<select name="attachments[' . $post->ID . '][pdf_priority]">
                <option value="5"' . selected($value, '5', false) . '>5 – Sehr hoch</option>
                <option value="4"' . selected($value, '4', false) . '>4 – Hoch</option>
                <option value="3"' . selected($value, '3', false) . '>3 – Mittel</option>
                <option value="2"' . selected($value, '2', false) . '>2 – Niedrig</option>
                <option value="1"' . selected($value, '1', false) . '>1 – Sehr niedrig</option>
            </select>',
        'helps' => 'Setze eine Priorität von 1 (niedrig) bis 5 (hoch)',
    ];

    return $form_fields;
}, 10, 2);


/* =============================================================== *\ 
   Speichert die ausgewählte Priorität beim Speichern eines Anhangs
   - trägt "3" als Standardwert ein, wenn kein Wert gesetzt wurde
\* =============================================================== */
add_filter('attachment_fields_to_save', function($post, $attachment) {
    // Wenn keine Priorität explizit gesetzt wurde, Standardwert eintragen
    if ($post['type'] === 'application/pdf' && empty($attachment['pdf_priority'])) {
        update_post_meta($post['ID'], 'pdf_priority', '3');
    }
    return $post;
}, 20, 2);


/* =============================================================== *\ 
   Setzt pdf_priority auf "3" beim Hochladen neuer PDF-Dateien
   - funktioniert auch bei REST- und Ajax-Uploads
\* =============================================================== */
add_action('wp_handle_upload', function($upload) {
    add_filter('wp_generate_attachment_metadata', function($metadata, $attachment_id) {
        $mime = get_post_mime_type($attachment_id);
        if ($mime === 'application/pdf') {
            $existing = get_post_meta($attachment_id, 'pdf_priority', true);
            if (!$existing) {
                update_post_meta($attachment_id, 'pdf_priority', '3');
            }
        }
        return $metadata;
    }, 10, 2);
    return $upload;
});







/* =============================================================== *\ 
   Registriert das Feld "content_priority" für Posts, Seiten und CTPs
\* =============================================================== */
function cpm_register_post_priority_meta() {
    register_meta('post', 'content_priority', [
        'show_in_rest' => true,
        'single' => true,
        'type' => 'string', // oder 'integer', wenn du direkt Zahlen nutzt
        'auth_callback' => function() {
            return current_user_can('edit_posts');
        }
    ]);
}
add_action('init', 'cpm_register_post_priority_meta');
