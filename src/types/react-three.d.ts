/* eslint-disable @typescript-eslint/no-explicit-any */
import { ReactNode, FC } from 'react';

declare module '@react-three/fiber' {
  export interface CanvasProps {
    children?: ReactNode;
    camera?: any;
    shadows?: boolean;
    dpr?: number | [number, number];
    gl?: any;
    style?: React.CSSProperties;
    className?: string;
    [key: string]: any;
  }

  export const Canvas: FC<CanvasProps>;

  export function useFrame(callback: (state: any, delta: number) => void, priority?: number): void;
  export function useThree(): any;

  export type ThreeEvent<T = Event> = T & {
    object: any;
    eventObject: any;
    point: any;
    distance: number;
    [key: string]: any;
  };
}

declare module '@react-three/drei' {
  export const OrbitControls: FC<any>;
  export const Environment: FC<any>;
  export const ContactShadows: FC<any>;
  export const PresentationControls: FC<any>;
  export const Float: FC<any>;
  export const Text: FC<any>;
  export const Center: FC<any>;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      mesh: any;
      group: any;
      primitive: any;
      ambientLight: any;
      directionalLight: any;
      pointLight: any;
      spotLight: any;
      hemisphereLight: any;
      meshStandardMaterial: any;
      meshBasicMaterial: any;
      meshPhongMaterial: any;
      meshPhysicalMaterial: any;
      meshLambertMaterial: any;
      boxGeometry: any;
      sphereGeometry: any;
      planeGeometry: any;
      cylinderGeometry: any;
      torusGeometry: any;
      latheGeometry: any;
      bufferGeometry: any;
      lineBasicMaterial: any;
      lineSegments: any;
      line: any;
      points: any;
      gridHelper: any;
      axesHelper: any;
      fog: any;
      color: any;
    }
  }
}
