<?php
/*
 * Optionen-Seite – Content Priority Manager
 */

defined('ABSPATH') || exit;

/* =============================================================== *\
   Optionen & Menü
\* =============================================================== */

add_action('admin_menu', function () {
    add_options_page(
        'Content Priority Manager',
        'Content Priority Manager',
        'manage_options',
        'cpm_settings',
        'cpm_render_settings_page'
    );
});

add_action('admin_init', function () {
    register_setting('cpm_settings', 'cpm_enable_media');
    register_setting('cpm_settings', 'cpm_enabled_post_types', [
        'type'    => 'array',
        'default' => [],
    ]);
    register_setting('cpm_settings', 'cpm_enable_ajax_support');
});

/* =============================================================== *\ 
   Ajax Search Pro prüfen
\* =============================================================== */
add_action('admin_init', function () {
    // Nur wenn Funktion noch nicht geladen ist
    if (!function_exists('is_plugin_active')) {
        require_once ABSPATH . 'wp-admin/includes/plugin.php';
    }

    $is_asp_active = is_plugin_active('ajax-search-pro/ajax-search-pro.php');

    // Optional: Standard setzen
    if ($is_asp_active && get_option('cpm_enable_ajax_support') === false) {
        update_option('cpm_enable_ajax_support', 1);
    }

    // Wert speichern für spätere Verwendung
    update_option('cpm_asp_plugin_available', $is_asp_active ? 1 : 0);
});


/* =============================================================== *\
   Einstellungs-Seite rendern
\* =============================================================== */
function cpm_render_settings_page() {
    // Alle verfügbaren CPTs (ohne attachment)
    $post_types = array_filter(
        get_post_types(['public' => true, 'show_ui' => true], 'objects'),
        fn($type) => $type->name !== 'attachment'
    );

    // Standard: alle aktivieren, falls noch nicht gesetzt
    $stored_post_types = get_option('cpm_enabled_post_types', []);
    if (empty($stored_post_types)) {
        // Noch nicht gesetzt: alle Post Types außer attachment aktivieren
        $enabled_post_types = array_keys($post_types);
    } else {
        $enabled_post_types = $stored_post_types;
    }


    // PDFs: standardmäßig aktiv
    $enable_media = get_option('cpm_enable_media', 1);

    // Ajax: standardmäßig deaktiviert
$is_asp_active = get_option('cpm_asp_plugin_available', 0); // fallback = 0

$stored_ajax = get_option('cpm_enable_ajax_support');
$enable_ajax = $stored_ajax !== false ? $stored_ajax : ($is_asp_active ? 1 : 0);

?>
    <div class="wrap">
        <h1>Content Priority Manager – Einstellungen</h1>
        <form method="post" action="options.php">
            <?php settings_fields('cpm_settings'); ?>
            <table class="form-table">
                <tbody>
                    <tr>
                        <th scope="row">Priorität für PDFs aktivieren</th>
                        <td>
                            <label class="switch">
                                <input type="checkbox" name="cpm_enable_media" value="1" <?php checked(1, $enable_media); ?> />
                                <span class="slider"></span>
                            </label>
                            <span class="switch-label">PDFs</span>
                        </td>
                    </tr>

                    <tr>
                        <th scope="row">Priorität für folgende Inhaltstypen aktivieren:</th>
                        <td>
                            <div class="cpm-toggle-list">
                                <?php foreach ($post_types as $type): ?>
                                    <div class="cpm-toggle-item">
                                        <label class="switch">
                                            <input type="checkbox" name="cpm_enabled_post_types[]" value="<?= esc_attr($type->name); ?>" <?= in_array($type->name, $enabled_post_types) ? 'checked' : ''; ?> />
                                            <span class="slider"></span>
                                        </label>
                                        <span class="switch-label"><?= esc_html($type->labels->name); ?></span>
                                    </div>
                                <?php endforeach; ?>
                            </div>
                        </td>
                    </tr>

                    <tr class="<?= !$is_asp_active ? 'cpm-disabled' : ''; ?>">
                        <th scope="row">Ajax Search Pro Unterstützung aktivieren</th>
                        <td>
                            <label class="switch">
                                <input type="checkbox" name="cpm_enable_ajax_support" value="1"
                                    <?php checked(1, $enable_ajax); ?>
                                    <?php disabled(!$is_asp_active); ?> />
                                <span class="slider"></span>
                            </label>
                            <span class="switch-label">Ajax Search Pro</span>
                            <?php if (!$is_asp_active): ?>
                                <p class="description" style="margin-top: 4px; color: #666;">
                                    Ajax Search Pro ist nicht installiert oder nicht aktiv.
                                </p>
                            <?php endif; ?>
                        </td>
                    </tr>

                </tbody>
            </table>

            <?php submit_button('Speichern'); ?>
        </form>
    </div>
<?php
}
?>