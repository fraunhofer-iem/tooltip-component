import cytoscape from 'cytoscape';
import popper from 'cytoscape-popper';
import deepEqual from 'deep-equal';
import { useEffect, useRef } from 'react';

interface Props {
  cy?: (cy: cytoscape.Core) => void | undefined;
  elements: cytoscape.ElementDefinition[];
  layout?: cytoscape.LayoutOptions | undefined;
  stylesheet?: cytoscape.Stylesheet[] | undefined;
}

const equals = (prev: Props | null | undefined, curr: Props) => {
  if (!prev) {
    return false;
  }
  return deepEqual(prev, curr, { strict: true });
};

export default function CytoscapeComponent(props: Props) {
  const container = useRef(null);
  const prevProps = useRef<Props | null>();
  const cy = useRef<cytoscape.Core | null>();
  const { elements, layout, stylesheet } = props;

  useEffect(() => {
    if (!equals(prevProps.current, props)) {
      cy.current = cytoscape({
        container: container.current,
        layout: layout,
        elements: elements,
        style: stylesheet,
      });
      cy.current.fit();
      if (!Object.getPrototypeOf(cy.current).popper) {
        cytoscape.use(popper);
      }

      prevProps.current = props;
    }
    if (props.cy) {
      props.cy(cy.current as cytoscape.Core);
    }
    return () => {
      if (!equals(prevProps.current, props)) {
        cy.current?.destroy();
      }
    };
  });

  return <div ref={container} className="canvas"></div>;
}
