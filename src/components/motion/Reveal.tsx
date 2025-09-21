import React, { useEffect, useRef, useState } from 'react';

type RevealProps = {
  children: React.ReactNode;
  delayMs?: number;
};

export const Reveal: React.FC<RevealProps> = ({ children, delayMs = 0 }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(() => setVisible(true), delayMs);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [delayMs]);

  return (
    <div
      ref={ref}
      className={
        visible
          ? 'transition-all duration-300 ease-out translate-y-0 opacity-100'
          : 'transition-all duration-300 ease-out translate-y-6 opacity-0'
      }
    >
      {children}
    </div>
  );
};

export default Reveal;


