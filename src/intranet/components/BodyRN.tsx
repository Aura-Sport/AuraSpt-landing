import React, { Suspense } from 'react';
// @ts-expect-error no types
const BodyHighlighter = React.lazy(() => import('react-native-body-highlighter'));

type BodyRNProps = {
  highlighted: string[];
  height?: number;
  color?: string;
};

export const BodyRN: React.FC<BodyRNProps> = ({ highlighted, height = 320, color = '#10b981' }) => {
  const data = highlighted.map((m) => ({ slug: m, intensity: 1 }));
  return (
    <div style={{ maxWidth: 480 }}>
      <Suspense fallback={<div className="text-zinc-400 text-sm">Cargando visor…</div>}>
        <BodyHighlighter
          type="front"
          data={data}
          height={height}
          color={color}
          animation={true}
        />
      </Suspense>
    </div>
  );
};

export default BodyRN;


