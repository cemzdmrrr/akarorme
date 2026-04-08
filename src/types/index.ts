/* ===================================================
   Type definitions — single source of truth for the
   entire AKAR ÖRME data model.  When a headless CMS
   is connected, replace the static data files in
   /src/data with API calls that return these types.
   =================================================== */

export interface KnitwearModel {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  tags: Tag[];
  image: string;            // path or CMS URL
  gallery: string[];
  colors: ColorSwatch[];
  specs: TechnicalSpec[];
  featured: boolean;
}

export type Tag =
  | 'men'
  | 'women'
  | 'winter'
  | 'summer'
  | 'fine'
  | 'heavy';

export interface ColorSwatch {
  name: string;
  hex: string;
}

export interface TechnicalSpec {
  label: string;
  value: string;
}

export interface Fabric {
  id: string;
  name: string;
  gauge: string;
  composition: string;
  weight: string;
  description: string;
  image: string;
}

export interface TimelineEvent {
  year: number;
  title: string;
  description: string;
}

export interface Reference {
  initials: string;
  name: string;
  country: string;
}

export interface Stat {
  value: number;
  suffix?: string;
  label: string;
}

export interface NavLink {
  href: string;
  label: string;
  cta?: boolean;
}

export interface InfoCard {
  icon: string;        // SVG path or icon name
  title: string;
  lines: string[];
}
