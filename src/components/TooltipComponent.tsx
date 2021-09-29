import popper from '@popperjs/core';
import { TippyProps } from '@tippyjs/react';
import * as React from 'react';
import TippyComponent from './TippyComponent';

interface Props {
  /**
   * Provide Tippy target IDs as array, if known at mount time
   */
  targets?: string[];
  /**
   * Set Tippy target IDs (i.e. if not known at mount time) using callback method
   */
  setTargets?: (setTargets: (targets: string[]) => void) => void;
  /**
   * Get state control methods of TippyComponent assigned to target using a callback method
   */
  controls?: (getTippy: (target: string) => TippyControl) => void;
}

export const useTippy = () => {
  const tooltipRegistry = React.useRef<(target: string) => TippyControl>();
  const setTooltipRegistry = React.useCallback(
    (tippy: (target: string) => TippyControl) => {
      tooltipRegistry.current = tippy;
    },
    []
  );
  const tippy = (
    target: string,
    props: {
      content?: React.ReactNode;
      popperRef?: popper.VirtualElement;
      dispose?: () => void;
      tippyProps?: Omit<
        TippyProps,
        | 'content'
        | 'visible'
        | 'getReferenceClientRect'
        | 'interactive'
        | 'reference'
        | 'onDestroy'
      >;
    }
  ) => {
    if (tooltipRegistry.current) {
      const controls = tooltipRegistry.current(target);
      if (props.hasOwnProperty('content')) {
        controls.setContent(props.content);
      }
      if (props.hasOwnProperty('popperRef')) {
        controls.setReference(props.popperRef);
      }
      if (props.hasOwnProperty('dispose')) {
        controls.setDispose(() => props.dispose);
      }
      if (props.hasOwnProperty('tippyProps')) {
        controls.additionalProps(props.tippyProps ?? {});
      }
    }
  };

  return { tooltipRegistry, setTooltipRegistry, tippy };
};

export type TippyControl = {
  setContent: (content: React.ReactNode | undefined) => void;
  setReference: (popperRef: popper.VirtualElement | undefined) => void;
  setDispose: (dispose: () => void) => void;
  additionalProps: (
    props: Omit<
      TippyProps,
      | 'content'
      | 'visible'
      | 'getReferenceClientRect'
      | 'interactive'
      | 'reference'
      | 'onDestroy'
    >
  ) => void;
};

export default (props: Props) => {
  // each target is assigned a TippyComponent
  const [targets, setTargets] = React.useState<string[]>(
    props.targets ? props.targets : []
  );
  const tippies = React.useRef<{ [key: string]: TippyControl }>({});

  // store state changing methods of generated TippyComponents
  const registerTippy = React.useCallback(
    (node: string, control: TippyControl) => {
      tippies.current[node] = control;
    },
    []
  );

  // return state changing methods of generated TippyComponents
  const controlTippy = React.useCallback((node: string) => {
    return tippies.current[node];
  }, []);

  // provide parent component with callback to set target IDs
  if (props.setTargets) {
    props.setTargets(setTargets);
  }

  // provide parent component with callback to get state methods of generated TippyComponents
  if (props.controls) {
    props.controls(controlTippy);
  }

  return (
    <>
      {targets.map((node) => (
        <TippyComponent node={node} key={node} register={registerTippy} />
      ))}
    </>
  );
};
