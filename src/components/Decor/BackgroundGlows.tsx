import React from 'react';

type BackgroundGlowsProps = {
  variant?: 'minimal' | 'bold';
};

export const BackgroundGlows: React.FC<BackgroundGlowsProps> = ({ variant = 'minimal' }) => {
  const isBold = variant === 'bold';
  const op = isBold ? '30' : '20'; // tailwind opacity /xx
  const blur = isBold ? '[130px]' : '[100px]';
  const sizeMain = isBold ? '[820px]' : '[680px]';
  const sizeSide = isBold ? '[720px]' : '[600px]';
  const sizeBottom = isBold ? '[900px]' : '[700px]';
  return (
    <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
      <div className={`absolute -top-40 -left-40 w-${sizeMain} h-${sizeMain} rounded-full bg-gradient-to-br from-emerald-500/${op} to-blue-500/${op} blur-${blur}`} />
      <div className={`absolute -top-24 right-[-160px] w-${sizeSide} h-${sizeSide} rounded-full bg-gradient-to-bl from-blue-500/${op} to-emerald-500/${op} blur-${blur}`} />
      <div className={`absolute bottom-[-220px] left-[-120px] w-${sizeBottom} h-${sizeBottom} rounded-full bg-gradient-to-tr from-sky-500/${op} to-teal-500/${op} blur-${isBold ? '[140px]' : '[110px]'}`} />
      <div className={`absolute bottom-[-200px] right-[-120px] w-${isBold ? '[760px]' : '[700px]'} h-${isBold ? '[760px]' : '[700px]'} rounded-full bg-gradient-to-tl from-indigo-500/${op} to-emerald-500/${op} blur-${blur}`} />
      {isBold && <div className="absolute inset-0 bg-gradient-radial from-transparent via-white/10 to-transparent" />}
    </div>
  );
};

export default BackgroundGlows;


