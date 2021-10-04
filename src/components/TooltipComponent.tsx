import popper from '@popperjs/core';
import * as React from 'react';
import TippyComponent, { TippyComponentProps } from './TippyComponent';

/**
 * Tippyfied components obtain a new prop ´setTippy` which allows to set
 * an interactive Tippy tooltip for an arbitrary target.
 */
export interface TooltipControl {
  setTippy: (
    target: string,
    props: {
      content?: React.ReactNode;
      popperRef?: popper.VirtualElement;
      dispose?: () => void;
      tippyProps?: TippyComponentProps;
    }
  ) => void;
}
/**
 * Add necessary hooks to the component passed as parameter
 * in order to allow control of Tippy tooltips within the wrapped component.
 * Also add TooltipComponent to the virtual DOM.
 */
export function tippyfy(component: (props: any) => React.ReactNode) {
  return (props: { [key: string]: any }) => {
    const tooltipRegistry = React.useRef<(target: string) => TippyControl>();

    const setTooltipRegistry = React.useCallback(
      (tippy: (target: string) => TippyControl) => {
        tooltipRegistry.current = tippy;
      },
      []
    );

    const setTippy = (
      target: string,
      props: {
        content?: React.ReactNode;
        popperRef?: popper.VirtualElement;
        dispose?: () => void;
        tippyProps?: TippyComponentProps;
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
    return (
      <>
        <TooltipComponent controls={setTooltipRegistry} />
        {component({
          setTippy: setTippy,
          ...props,
        })}
      </>
    );
  };
}

export type TippyControl = {
  setContent: (content: React.ReactNode) => void;
  setReference: (popperRef: popper.VirtualElement | undefined) => void;
  setDispose: (dispose: () => void) => void;
  additionalProps: (props: TippyComponentProps) => void;
};

interface Props {
  controls: (getTippy: (target: string) => TippyControl) => void;
}

function TooltipComponent(props: Props) {
  // each target is assigned a TippyComponent
  const [targets, setTargets] = React.useState<string[]>([]);
  const tippies = React.useRef<{ [key: string]: TippyControl }>({});

  // store state changing methods of generated TippyComponents
  const registerTippy = React.useCallback(
    (node: string, control: TippyControl) => {
      tippies.current[node] = control;
    },
    []
  );

  // return state changing methods of generated TippyComponents
  const controlTippy = React.useCallback(
    (target: string) => {
      if (!targets.includes(target)) {
        setTargets([target, ...targets]);
      }
      return tippies.current[target];
    },
    [targets]
  );

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
}
