/// <reference types="@types/google.maps" />

declare global {
  interface Window {
    google: typeof google;
  }
}

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface AddressDetails {
  formattedAddress: string;
  streetNumber: string;
  route: string;
  locality: string;
  administrativeArea: string;
  postalCode: string;
  country: string;
  premise?: string;
  subpremise?: string;
}

export interface LocationData {
  coordinates: Coordinates;
  address: AddressDetails;
  placeId?: string;
}

export interface MapConfig {
  apiKey: string;
  defaultCenter?: Coordinates;
  defaultZoom?: number;
  mapStyles?: google.maps.MapTypeStyle[];
}
