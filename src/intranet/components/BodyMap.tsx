import React from 'react';

type BodyMapProps = {
  highlighted: string[];
  color?: string;
  view?: 'front' | 'back';
  height?: number;
};

const MUSCLE_IDS = [
  'shoulders',
  'chest',
  'biceps',
  'triceps',
  'abs',
  'quads',
  'hamstrings',
  'glutes',
  'calves',
  'back',
];

export const BodyMap: React.FC<BodyMapProps> = ({ highlighted, color = '#10b981', view = 'front', height = 320 }) => {
  const fillIf = (id: string) => (highlighted.includes(id) ? color : 'rgba(255,255,255,0.06)');
  const strokeIf = (id: string) => (highlighted.includes(id) ? color : 'rgba(255,255,255,0.15)');

  // Simple silhouette (no pretende ser anatómicamente exacta; sirve para resaltar grupos de alto nivel)
  return (
    <svg viewBox="0 0 200 400" height={height} className="w-full select-none">
      {/* Fondo */}
      <rect x="0" y="0" width="200" height="400" fill="transparent" />

      {/* Cabeza */}
      <circle cx="100" cy="40" r="18" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.1)" />

      {/* Tronco */}
      <path d="M70,70 C70,60 130,60 130,70 L130,150 C130,170 70,170 70,150 Z" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.1)" />

      {/* Hombros */}
      <g id="shoulders">
        <circle cx="70" cy="85" r="12" fill={fillIf('shoulders')} stroke={strokeIf('shoulders')} />
        <circle cx="130" cy="85" r="12" fill={fillIf('shoulders')} stroke={strokeIf('shoulders')} />
      </g>

      {/* Pecho */}
      {view === 'front' && (
        <g id="chest">
          <path d="M80,90 L120,90 L120,120 C110,125 90,125 80,120 Z" fill={fillIf('chest')} stroke={strokeIf('chest')} />
        </g>
      )}

      {/* Abdomen */}
      {view === 'front' && (
        <g id="abs">
          <rect x="85" y="122" width="30" height="36" rx="6" fill={fillIf('abs')} stroke={strokeIf('abs')} />
        </g>
      )}

      {/* Espalda */}
      {view === 'back' && (
        <g id="back">
          <path d="M80,90 C100,80 100,80 120,90 L120,140 C110,150 90,150 80,140 Z" fill={fillIf('back')} stroke={strokeIf('back')} />
        </g>
      )}

      {/* Brazos (bíceps/tríceps simplificados) */}
      <g id="arms">
        {/* Izquierdo */}
        <rect x="50" y="98" width="12" height="38" rx="6" fill={fillIf('biceps')} stroke={strokeIf('biceps')} />
        <rect x="50" y="138" width="12" height="36" rx="6" fill={fillIf('triceps')} stroke={strokeIf('triceps')} />
        {/* Derecho */}
        <rect x="138" y="98" width="12" height="38" rx="6" fill={fillIf('biceps')} stroke={strokeIf('biceps')} />
        <rect x="138" y="138" width="12" height="36" rx="6" fill={fillIf('triceps')} stroke={strokeIf('triceps')} />
      </g>

      {/* Caderas/Glúteos */}
      <g id="glutes">
        <rect x="82" y="160" width="36" height="20" rx="8" fill={fillIf('glutes')} stroke={strokeIf('glutes')} />
      </g>

      {/* Piernas */}
      <g id="legs">
        {/* Muslos (cuádriceps / isquios) */}
        {view === 'front' ? (
          <>
            <rect x="78" y="182" width="20" height="60" rx="10" fill={fillIf('quads')} stroke={strokeIf('quads')} />
            <rect x="102" y="182" width="20" height="60" rx="10" fill={fillIf('quads')} stroke={strokeIf('quads')} />
          </>
        ) : (
          <>
            <rect x="78" y="182" width="20" height="60" rx="10" fill={fillIf('hamstrings')} stroke={strokeIf('hamstrings')} />
            <rect x="102" y="182" width="20" height="60" rx="10" fill={fillIf('hamstrings')} stroke={strokeIf('hamstrings')} />
          </>
        )}
        {/* Pantorrillas */}
        <rect x="80" y="244" width="18" height="46" rx="9" fill={fillIf('calves')} stroke={strokeIf('calves')} />
        <rect x="102" y="244" width="18" height="46" rx="9" fill={fillIf('calves')} stroke={strokeIf('calves')} />
      </g>

      {/* Pies */}
      <rect x="78" y="292" width="24" height="8" rx="4" fill="rgba(255,255,255,0.04)" />
      <rect x="100" y="292" width="24" height="8" rx="4" fill="rgba(255,255,255,0.04)" />
    </svg>
  );
};

export default BodyMap;


