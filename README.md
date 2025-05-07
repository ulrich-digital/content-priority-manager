# Content Priority Manager

Ein WordPress-Plugin zur Vergabe und Verwaltung von Inhalts-Prioritäten für PDF-Dateien, Beiträge, Seiten und Custom Post Types (CPTs). Ideal zur inhaltlichen Gewichtung und Sortierung – z. B. in Kombination mit Ajax Search Pro.



## Funktionen

- Prioritätsfeld (1–5) für:
  - PDF-Dateien (über Anhang-Details in der Mediathek)
  - Beiträge, Seiten und CPTs (über Gutenberg-Sidebar)
- Automatische Vergabe der Standard-Priorität „3“ beim PDF-Upload
- Speicherung als Custom Field:
  - pdf_priority für Anhänge
  - content_priority für alle anderen Inhalte
- Kompatibel mit Ajax Search Pro zur Priorisierung von Suchergebnissen


## Einsatzbeispiel mit Ajax Search Pro
- Inhalte mit höherer Priorität (egal ob PDF, Beitrag oder Seite) erscheinen weiter oben in der Suche
- Kein aktiver Filter durch Nutzer:innen notwendig
- Sortierung erfolgt automatisch per `asp_results`-Filter in `functions.php`, basierend auf pdf_priority und content_priority

**Wichtig:** Der Suchmodus in Ajax Search Pro muss auf `Regular engine` stehen (nicht „Index Table Engine“).


## Filter in functions.php für Ajax Search Pro
Damit Ajax Search Pro alle Inhalte (z. B. PDFs, Beiträge, Seiten) nach ihrer jeweils vergebenen Priorität sortiert, kann folgender PHP-Filter verwendet werden:
```
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
```


## Technische Details

| Feld               | Post Type         | Typ     |
|--------------------|-------------------|---------|
| `pdf_priority`     | `attachment` (PDF) | Zahl (1–5) |
| `content_priority` | `post`, `page`, CPTs | Zahl (1–5) |



## Installation

1. Plugin in den Ordner wp-content/plugins/ kopieren
2. Aktivieren über das WordPress-Backend
3. PDF-Dateien oder Beiträge bearbeiten, um Prioritäten zu setzen

