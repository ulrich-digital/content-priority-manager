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


defined('ABSPATH') || exit;
// PHP-Funktionen laden

require_once __DIR__ . '/includes/register-meta.php';
require_once __DIR__ . '/includes/media-hooks.php';
require_once __DIR__ . '/includes/settings.php';
require_once __DIR__ . '/includes/asp-integration.php';
require_once __DIR__ . '/includes/enqueue.php';



// Direktlink zur Einstellungsseite im Plugin-Menü
add_filter('plugin_action_links_' . plugin_basename(__FILE__), function ($links) {
    $url = admin_url('options-general.php?page=cpm_settings');
    $settings_link = '<a href="' . esc_url($url) . '">Einstellungen</a>';
    array_unshift($links, $settings_link); // ganz vorne einfügen
    return $links;
});
