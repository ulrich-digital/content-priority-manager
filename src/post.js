import { registerPlugin } from '@wordpress/plugins';
import { PluginDocumentSettingPanel } from '@wordpress/editor';
import { PanelBody, SelectControl } from '@wordpress/components';
import { useSelect, useDispatch } from '@wordpress/data';

const PRIORITY_OPTIONS = [
  { label: '5 – Sehr hoch', value: '5' },
  { label: '4 – Hoch', value: '4' },
  { label: '3 – Mittel', value: '3' },
  { label: '2 – Niedrig', value: '2' },
  { label: '1 – Sehr niedrig', value: '1' },
];

const ContentPrioritySidebar = () => {
  const meta = useSelect((select) => select('core/editor').getEditedPostAttribute('meta'));
  const { editPost } = useDispatch('core/editor');

  const current = meta?.content_priority || '3';

  return (
    <PluginDocumentSettingPanel name="content-priority-sidebar" title="Inhalts-Priorität">
      <PanelBody title="Priorität" initialOpen={true}>
        <SelectControl
          label="Wähle eine Priorität"
          value={current}
          options={PRIORITY_OPTIONS}
          onChange={(newValue) =>
            editPost({ meta: { ...meta, content_priority: newValue } })
          }
 		__next40pxDefaultSize={true}
  		__nextHasNoMarginBottom={true}


        />
      </PanelBody>
    </PluginDocumentSettingPanel>
  );
};

registerPlugin('content-priority-sidebar', {
  render: ContentPrioritySidebar,
});
