import { registerPlugin } from "@wordpress/plugins";
import { PluginDocumentSettingPanel } from "@wordpress/editor";
import { SelectControl } from "@wordpress/components";
import { useSelect, useDispatch } from "@wordpress/data";

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
   Registrierung bei passenden Post Types
\* =============================================================== */
wp.data.subscribe(() => {
	const currentType = wp.data.select("core/editor").getCurrentPostType();
	const allowedTypes = window.cpmSettings?.enabledPostTypes || [];

	if (!currentType) return; // Post-Typ noch nicht bekannt
	if (!allowedTypes.includes(currentType)) return; // Nicht erlaubt

	// Nur einmal registrieren (bei Hot-Reloads etc.)
	if (window.__cpm_post_plugin_registered) return;
	window.__cpm_post_plugin_registered = true;

	/* =============================================================== *\
	   Komponente: Sidebar-Einstellung für Inhalts-Priorität
	\* =============================================================== */
	const ContentPrioritySidebar = () => {
		const meta = useSelect((select) =>
			select("core/editor").getEditedPostAttribute("meta"),
		);
		const { editPost } = useDispatch("core/editor");
		const current = meta?.content_priority || "3";

		return (
			<PluginDocumentSettingPanel
				name="content-priority-sidebar"
				title="Inhalts-Priorität"
			>
				<SelectControl
					label="Wähle eine Priorität"
					value={current}
					options={PRIORITY_OPTIONS}
					onChange={(newValue) =>
						editPost({
							meta: { ...meta, content_priority: newValue },
						})
					}
					__next40pxDefaultSize={true}
					__nextHasNoMarginBottom={true}
				/>
			</PluginDocumentSettingPanel>
		);
	};

	// Plugin-Registrierung im Editor
	registerPlugin("content-priority-sidebar", {
		render: ContentPrioritySidebar,
	});
});
