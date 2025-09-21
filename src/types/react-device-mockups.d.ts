declare module 'react-device-mockups' {
  import * as React from 'react';
  export type DeviceProps = {
    color?: string;
    landscape?: boolean;
    width?: number;
    style?: React.CSSProperties;
    children?: React.ReactNode;
  };
  export const IPhoneX: React.ComponentType<DeviceProps>;
  const DefaultDevice: React.ComponentType<any>;
  export default DefaultDevice;
}


