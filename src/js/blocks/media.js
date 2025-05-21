import {
	render,
	useEffect,
	useState,
	unmountComponentAtNode,
} from "@wordpress/element";
import { SelectControl } from "@wordpress/components";
import apiFetch from "@wordpress/api-fetch";

/* =============================================================== *\ 
   Konstante: Dropdown-Optionen
\* =============================================================== */
const PRIORITY_OPTIONS = [
	{ label: "5 – Sehr hoch", value: "5" },
	{ label: "4 – Hoch", value: "4" },
	{ label: "3 – Mittel", value: "3" },
	{ label: "2 – Niedrig", value: "2" },
	{ label: "1 – Sehr niedrig", value: "1" },
];

/* =============================================================== *\ 
   Komponente: Panel zur Auswahl der Priorität
\* =============================================================== */
const MediaPriorityPanel = () => {
	const postId = new URLSearchParams(window.location.search).get("item");
	const [value, setValue] = useState("3");
	const [skipRender, setSkipRender] = useState(false);
	const [isReady, setIsReady] = useState(false); // ← damit das Feld erst auftaucht, wenn geklärt
	useEffect(() => {
		setIsReady(false); // nur den Ladezustand zurücksetzen
	}, [postId]);

	useEffect(() => {
		apiFetch({ path: `/wp/v2/media/${postId}` }).then((res) => {
			const allowed = window.cpmSettings?.allowedMimeTypes || [
				"application/pdf",
			];
			const mime = res.mime_type || "";
			const baseType = mime.split("/")[0];

			const isAllowed =
				allowed.includes(mime) || allowed.includes(baseType);

			if (!isAllowed) {
				setSkipRender(true); // unterdrücke Anzeige
			} else {
				setSkipRender(false); // ← explizit wieder aktivieren
				setValue(res.meta?.pdf_priority || "3");
			}
			setIsReady(true);

			setIsReady(true); // ⬅️ wichtig: Status aktualisieren
		});
	}, [postId]);

	if (!isReady || skipRender) return null;

	const handleChange = (newValue) => {
		setValue(newValue);
		apiFetch({
			path: `/wp/v2/media/${postId}`,
			method: "POST",
			data: { meta: { pdf_priority: newValue } },
		});
	};

	return (
		<div
			style={{
				padding: "1em",
				background: "#fff",
				border: "1px solid #ccc",
				marginTop: "1em",
			}}
		>
			<h3 style={{ marginTop: 0 }}>Inhalts-Priorität</h3>
			<SelectControl
				value={value}
				options={PRIORITY_OPTIONS}
				onChange={handleChange}
				__next40pxDefaultSize
				__nextHasNoMarginBottom
			/>
		</div>
	);
};

/* =============================================================== *\ 
   Logik: Einfügen des Panels bei Medienwechsel
\* =============================================================== */
let lastRenderedId = null;

function tryRenderPanel(retries = 0) {
	const postId = new URLSearchParams(window.location.search).get("item");
	if (!postId) return;

	const container = document.querySelector(".attachment-info");
	const alreadyMounted = container?.querySelector(
		".media-priority-container",
	);

	// Falls Panel für aktuelle ID bereits existiert → abbrechen
	if (postId === lastRenderedId && alreadyMounted) return;

	// Falls .attachment-info noch nicht existiert → später nochmal versuchen
	if (!container) {
		if (retries < 20) {
			setTimeout(() => tryRenderPanel(retries + 1), 200); // max. 4s warten
		}
		return;
	}

	// Vorheriges Panel entfernen (falls vorhanden)
	if (alreadyMounted) {
		unmountComponentAtNode(alreadyMounted);
		alreadyMounted.remove();
	}

	// Neues Panel einfügen
	const mountPoint = document.createElement("div");
	mountPoint.className = "media-priority-container";
	container.appendChild(mountPoint);
	render(<MediaPriorityPanel />, mountPoint);
	lastRenderedId = postId;
}

/* =============================================================== *\ 
   Initialisierung: Beobachte DOM-Änderungen
\* =============================================================== */
document.addEventListener("DOMContentLoaded", () => {
	const contentRoot =
		document.querySelector(".media-frame-content") || document.body;

	const observer = new MutationObserver(() => {
		setTimeout(tryRenderPanel, 50); // Debounce, um Timing-Probleme zu vermeiden
	});

	observer.observe(contentRoot, { childList: true, subtree: true });

	tryRenderPanel(); // Direkt initial ausführen
});
