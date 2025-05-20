<?php
defined('ABSPATH') || exit;

// Medien-Dropdown im Attachment-Popup
add_filter('attachment_fields_to_edit', function($form_fields, $post) {
    if (!get_option('cpm_enable_media')) {
        return $form_fields;
    }

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

// Speichern des Dropdown-Wertes
add_filter('attachment_fields_to_save', function($post, $attachment) {
    if ($post['type'] === 'application/pdf' && empty($attachment['pdf_priority'])) {
        update_post_meta($post['ID'], 'pdf_priority', '3');
    }
    return $post;
}, 20, 2);

// Standardwert beim Hochladen
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
