import * as popper from "@popperjs/core";
import Tippy, { TippyProps } from "@tippyjs/react";
import * as React from "react";
import { useState } from "react";
import { TippyControl } from "./TooltipComponent";
interface Props {
  node: string;
  register: (node: string, control: TippyControl) => void;
}

export default function TippyComponent(props: Props) {
  const [content, setContent] = useState<React.ReactNode>();
  const [popperRef, setPopperRef] = useState<popper.VirtualElement>();
  const [dispose, setDispose] = useState<() => void>(() => () => {});
  const [tippyProps, setTippyProps] = useState<
    Omit<
      TippyProps,
      | "content"
      | "visible"
      | "getReferenceClientRect"
      | "interactive"
      | "reference"
      | "onDestroy"
    >
  >({});

  props.register(props.node, {
    setContent: setContent,
    setReference: setPopperRef,
    setDispose: setDispose,
    additionalProps: setTippyProps,
  });

  if (content && popperRef) {
    return (
      <Tippy
        visible={true}
        content={content}
        getReferenceClientRect={popperRef.getBoundingClientRect}
        interactive={true}
        onDestroy={dispose}
        {...tippyProps}
      >
        <div />
      </Tippy>
    );
  } else {
    return <></>;
  }
}
