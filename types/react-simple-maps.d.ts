declare module 'react-simple-maps' {
  import React from 'react';

  export interface ComposableMapProps {
    children?: React.ReactNode;
    projectionConfig?: any;
    projection?: string;
    width?: number;
    height?: number;
    className?: string;
    style?: React.CSSProperties;
  }

  export interface GeographiesProps {
    children: (props: { geographies: any[] }) => React.ReactNode;
    geography: string;
    parseGeographies?: (features: any) => any[];
    className?: string;
    style?: React.CSSProperties;
  }

  export interface GeographyProps {
    geography: any;
    style?: { default: any; hover: any; pressed: any };
    className?: string;
    key?: string | number;
    fill?: string;
    stroke?: string;
    strokeWidth?: number;
  }

  export interface MarkerProps {
    coordinates: [number, number];
    children?: React.ReactNode;
    style?: React.CSSProperties;
    className?: string;
    key?: string | number;
  }

  export const ComposableMap: React.FC<ComposableMapProps>;
  export const Geographies: React.FC<GeographiesProps>;
  export const Geography: React.FC<GeographyProps>;
  export const Marker: React.FC<MarkerProps>;
} 