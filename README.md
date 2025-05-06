# Content Priority Manager

Ein WordPress-Plugin zur Vergabe und Verwaltung von Inhalts-Prioritäten für PDF-Dateien, Beiträge, Seiten und Custom Post Types (CPTs). Ideal zur inhaltlichen Gewichtung und Sortierung – z. B. in Kombination mit Ajax Search Pro.



## Funktionen

- Prioritätsfeld (1–5) für:
  - PDF-Dateien (über Anhang-Details in der Mediathek)
  - Beiträge, Seiten und CPTs (über Gutenberg-Sidebar)
- Automatische Vergabe der Standard-Priorität „3“ beim PDF-Upload
- Speicherung als Custom Field (`pdf_priority`, `content_priority`)
- Kompatibel mit Ajax Search Pro zur Priorisierung von Suchergebnissen


## Einsatzbeispiel mit Ajax Search Pro

- PDFs mit höherer Priorität erscheinen weiter oben in der Suche
- Kein aktiver Filter durch Nutzer:innen notwendig
- Sortierung erfolgt automatisch per `asp_results`-Filter in `functions.php`

**Wichtig:** Der Suchmodus in Ajax Search Pro muss auf `Regular engine` stehen (nicht „Index Table Engine“).


## Filter in functions.php für Ajax Search Pro
Damit Ajax Search Pro die PDF-Ergebnisse nach Priorität sortiert, muss folgender PHP-Filter verwendet werden (sofern nicht im Plugin enthalten):
```
add_filter('asp_results', 'cpm_sort_pdfs_by_priority', 10, 2);
function cpm_sort_pdfs_by_priority($results, $args) {
    foreach ($results as &$r) {
        if ($r->post_type === 'attachment') {
            $priority = get_post_meta($r->id, 'pdf_priority', true);
            $r->__cpm_priority = intval($priority);
        } else {
            $r->__cpm_priority = -1;
        }
    }

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

