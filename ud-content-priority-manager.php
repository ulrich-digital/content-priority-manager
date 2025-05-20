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
foreach (glob(__DIR__ . '/includes/*.php') as $file) {
    require_once $file;
}
