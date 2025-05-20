import { registerPlugin } from '@wordpress/plugins';
import { PluginDocumentSettingPanel } from '@wordpress/editor';
import { PanelRow, SelectControl } from '@wordpress/components';
import { useSelect, useDispatch } from '@wordpress/data';

(() => {
	const PRIORITY_OPTIONS = [
		{ label: '1 – Sehr niedrig', value: 'sehr_niedrig' },
		{ label: '2 – Niedrig', value: 'niedrig' },
		{ label: '3 – Mittel', value: 'mittel' },
		{ label: '4 – Hoch', value: 'hoch' },
		{ label: '5 – Sehr hoch', value: 'sehr_hoch' },
	];

	// Plugin nur laden, wenn Medienpriorität erlaubt ist
	if (!window.cpmSettings?.enableMedia) {
		//console.log("Content Priority für Medien ist deaktiviert.");
		return;
	}

	const MediaPriorityPanel = () => {
		const postType = useSelect((select) =>
			select('core/editor').getCurrentPostType()
		);
		const postId = useSelect((select) =>
			select('core/editor').getCurrentPostId()
		);
		const meta = useSelect((select) =>
			select('core/editor').getEditedPostAttribute('meta')
		);
		const { editPost } = useDispatch('core/editor');

		if (postType !== 'attachment') return null;

		const value = meta?.pdf_priority || 'mittel';

		return (
			<PluginDocumentSettingPanel
				name="media-priority"
				title="Inhalts-Priorität"
			>
				<PanelRow>
					<SelectControl
						label="Priorität"
						value={value}
						options={PRIORITY_OPTIONS}
						onChange={(newValue) =>
							editPost({ meta: { ...meta, pdf_priority: newValue } })
						}
						__next40pxDefaultSize={true}
						__nextHasNoMarginBottom={true}
					/>
				</PanelRow>
			</PluginDocumentSettingPanel>
		);
	};

	registerPlugin('content-priority-media', {
		render: MediaPriorityPanel,
	});
})();
