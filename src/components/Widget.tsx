import { useEffect } from 'react';

interface Props {
  bgColor: string;
  dismiss: () => void;
}

export default function Widget(props: Props) {
  const { bgColor, dismiss } = props;

  useEffect(() => {
    const listener = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        dismiss();
      }
    };
    window.addEventListener('keypress', listener);
    return () => {
      window.removeEventListener('keypress', listener);
    };
  });

  return <div className="widget" style={{ backgroundColor: bgColor }}></div>;
}
