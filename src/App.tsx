import React, { useCallback, useRef } from 'react';
import './App.css';
import CytoscapeComponent from './components/CytoscapeComponent';
import tippyfy, { TooltipControl } from 'tooltip-component';
import Widget from './components/Widget';

export default tippyfy(function App(props: TooltipControl) {
  const cy = useRef<cytoscape.Core | null>();
  const observeCytoscape = useCallback((c: cytoscape.Core) => {
    if (cy.current == c) {
      return;
    }
    c.on('tapselect', 'node', (event) => {
      const node: cytoscape.NodeSingular = event.target;

      const update = () => {
        props.setTippy(node.id(), { popperRef: node.popperRef() });
      };

      props.setTippy(node.id(), {
        content: (
          <Widget
            bgColor={node.data('widgetColor')}
            dismiss={() => {
              props.setTippy(node.id(), { content: null });
            }}
          />
        ),
        popperRef: node.popperRef(),
        dispose: () => {
          node.removeListener('position', undefined, update);
          node.cy().removeListener('pan', update);
        },
      });

      node.on('position', update);
      node.cy().on('pan', update);
    });
    cy.current = c;
  }, []);
  return (
    <div className="App">
      <CytoscapeComponent
        elements={[
          { data: { id: 'A', label: 'A', widgetColor: 'fuchsia' } },
          { data: { id: 'B', label: 'B', widgetColor: 'red' } },
          { data: { id: 'C', label: 'C', widgetColor: 'lime' } },
          { data: { id: 'D', label: 'D', widgetColor: 'cyan' } },
          { data: { id: 'E', label: 'E', widgetColor: 'yellow' } },
          { data: { id: 'F', label: 'F', widgetColor: 'blue' } },
          { data: { id: 'G', label: 'G', widgetColor: 'orange' } },
          { data: { id: 'H', label: 'H', widgetColor: 'black' } },
          { data: { source: 'A', target: 'B', id: 'AB' } },
          { data: { source: 'B', target: 'C', id: 'BC' } },
          { data: { source: 'C', target: 'D', id: 'CD' } },
          { data: { source: 'D', target: 'E', id: 'DE' } },
          { data: { source: 'E', target: 'F', id: 'EF' } },
          { data: { source: 'F', target: 'G', id: 'FG' } },
          { data: { source: 'G', target: 'H', id: 'GH' } },
          { data: { source: 'H', target: 'A', id: 'HA' } },
        ]}
        layout={{
          name: 'circle',
          nodeDimensionsIncludeLabels: true,
          avoidOverlap: true,
          fit: true,
        }}
        stylesheet={[
          {
            selector: 'node',
            style: {
              label: 'data(label)',
            },
          },
        ]}
        cy={observeCytoscape}
      />
    </div>
  );
});
