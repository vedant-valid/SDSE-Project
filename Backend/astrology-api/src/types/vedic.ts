export type DoshaType = "manglik" | "kalsarp" | "sadesati" | "pitradosh" | "nadi";

export interface VedicParams {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  city?: string;
  lat?: number;
  lng?: number;
}

export interface VedicPlanet {
  name: string;
  absolute_degree: number;
  sign: string;
  sign_id: number;
  degree_in_sign: number;
  house: number;
  is_retrograde: boolean;
  nakshatra: string;
  nakshatra_id: number;
  pada: number;
  nakshatra_lord: string;
}

export interface DoshaResult {
  is_present: boolean;
  details: Record<string, unknown>;
  remedies: string[];
}
