<?php
/* =============================================================== *\ 
   Suchergebnisse – Ajax Search Pro
   Sortiert alle Ergebnisse nach dem Custom Field "pdf_priority" bzw. "content_priority"

   - benötigt das Plugin "Content Priority Manager", 
     mit dem PDF-Dateien und Beiträge Prioritäten (1–5) zugewiesen werden können
   - sortiert alle Inhalte gemeinsam nach Priorität: höchste (5) zuerst
   - Post-Typ (z. B. PDF, Beitrag, Seite) spielt bei der Sortierung keine Rolle
\* =============================================================== */

defined('ABSPATH') || exit;

// Nur laden, wenn aktiviert
if (!get_option('cpm_enable_ajax_support')) {
    return;
}

// Ajax Search Pro-Ergebnisse nach Priorität sortieren
add_filter('asp_results', 'cpm_sort_content_by_priority', 10, 2);

function cpm_sort_content_by_priority($results, $args) {
    foreach ($results as &$r) {
        if ($r->post_type === 'attachment') {
            // Für PDFs
            $priority = get_post_meta($r->id, 'pdf_priority', true);
            $r->__cpm_priority = intval($priority);
        } else {
            // Für Beiträge, Seiten, CTPs
            $priority = get_post_meta($r->id, 'content_priority', true);
            $r->__cpm_priority = intval($priority);
        }
    }

    // Sortieren nach Priorität (höchste zuerst)
    usort($results, function($a, $b) {
        return $b->__cpm_priority <=> $a->__cpm_priority;
    });

    return $results;
}
