import { LatLng } from "react-native-maps";

export type MapMarker = {
  id: number;
  coordinate: { latitude: number; longitude: number };
  title: string;
  description: string;
};

export type Course = {
  id: number;
  mode: Mode;
  title: string;
  description: string;
  checkpoints: MapMarker[];
  // first checkpoint coordinate
  coordinate: LatLng;
};

export enum Mode {
  Race,
  Sprint,
  Point,
}
