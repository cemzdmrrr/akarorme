/* ===================================================
   Knit Pattern Explorer data — yarn types, knit
   techniques, gauge levels and resulting fabrics
   =================================================== */

export interface YarnType {
  id: string;
  name: string;
  origin: string;
  properties: string[];
  color: string; // brand-accent variant
}

export interface KnitTechnique {
  id: string;
  name: string;
  description: string;
  characteristics: string[];
}

export interface GaugeLevel {
  id: string;
  name: string;
  range: string;
  weight: string;
  description: string;
}

export interface FabricResult {
  yarnId: string;
  techniqueId: string;
  gaugeId: string;
  name: string;
  weight: string;
  feel: string;
  bestFor: string;
  characteristics: string[];
  stretchH: number; // 0-100
  stretchV: number;
  warmth: number;
  breathability: number;
  durability: number;
}

export const yarnTypes: YarnType[] = [
  {
    id: 'cotton',
    name: 'Cotton',
    origin: 'Natural cellulose fibre',
    properties: ['Breathable', 'Hypoallergenic', 'Absorbent', 'Soft touch'],
    color: '#7a9a7e',
  },
  {
    id: 'wool',
    name: 'Wool',
    origin: 'Natural animal fibre',
    properties: ['Insulating', 'Moisture-wicking', 'Elastic', 'Temperature-regulating'],
    color: '#c5baa8',
  },
  {
    id: 'viscose',
    name: 'Viscose',
    origin: 'Semi-synthetic cellulose',
    properties: ['Silky drape', 'Lightweight', 'Color-vibrant', 'Smooth'],
    color: '#D4BC6A',
  },
  {
    id: 'polyester',
    name: 'Polyester',
    origin: 'Synthetic polymer',
    properties: ['Durable', 'Wrinkle-resistant', 'Quick-dry', 'Shape retention'],
    color: '#8e8e96',
  },
  {
    id: 'blend',
    name: 'Blended',
    origin: 'Multi-fibre composition',
    properties: ['Balanced', 'Enhanced performance', 'Cost-effective', 'Versatile'],
    color: '#c47a6a',
  },
];

export const knitTechniques: KnitTechnique[] = [
  {
    id: 'single-jersey',
    name: 'Single Jersey',
    description: 'The most common knit structure — lightweight, smooth on one side.',
    characteristics: ['Lightweight', 'Smooth face', 'Natural curl', 'Economical'],
  },
  {
    id: 'rib',
    name: 'Rib Knit',
    description: 'Alternating knit-purl columns creating vertical ridges with natural stretch.',
    characteristics: ['Excellent stretch', 'Recovery', 'Symmetrical', 'Trim-ready'],
  },
  {
    id: 'interlock',
    name: 'Interlock',
    description: 'Double-knit structure — smooth on both sides, dimensional stability.',
    characteristics: ['Stable', 'Double-face', 'No curl', 'Premium weight'],
  },
  {
    id: 'jacquard',
    name: 'Jacquard',
    description: 'Multi-colour patterned knit using individual needle selection.',
    characteristics: ['Multicolour', 'Patterned', 'Textured', 'Design flexibility'],
  },
  {
    id: 'cable',
    name: 'Cable Knit',
    description: 'Twisted stitch groups forming rope-like patterns with 3D texture.',
    characteristics: ['3D texture', 'Heavy weight', 'Traditional', 'Luxurious feel'],
  },
];

export const gaugeLevels: GaugeLevel[] = [
  {
    id: 'fine',
    name: 'Fine Gauge',
    range: '18 – 28 GG',
    weight: '120 – 200 g/m²',
    description: 'Tight, smooth fabric ideal for layering and summer garments.',
  },
  {
    id: 'medium',
    name: 'Medium Gauge',
    range: '10 – 16 GG',
    weight: '200 – 350 g/m²',
    description: 'Versatile mid-weight fabric for year-round knitwear.',
  },
  {
    id: 'heavy',
    name: 'Heavy Gauge',
    range: '3 – 8 GG',
    weight: '350 – 600+ g/m²',
    description: 'Chunky, textured fabric for outerwear and winter staples.',
  },
];

/* ─────────── Result combinations ─────────── */
// Not all combos are stored — we use a fallback generator.
// These curated results show the most common combos.
const curatedResults: FabricResult[] = [
  { yarnId: 'cotton', techniqueId: 'single-jersey', gaugeId: 'fine', name: 'Fine Cotton Jersey', weight: '140 g/m²', feel: 'Soft, smooth, light', bestFor: 'T-shirts, Summer basics', characteristics: ['Breathable', 'Light', 'Drapes well'], stretchH: 45, stretchV: 20, warmth: 20, breathability: 90, durability: 60 },
  { yarnId: 'cotton', techniqueId: 'rib', gaugeId: 'medium', name: 'Cotton Rib',  weight: '220 g/m²', feel: 'Textured, stretchy', bestFor: 'Polo collars, Trims, Cuffs', characteristics: ['Elastic', 'Structured', 'Classic'], stretchH: 80, stretchV: 30, warmth: 35, breathability: 75, durability: 70 },
  { yarnId: 'cotton', techniqueId: 'interlock', gaugeId: 'medium', name: 'Cotton Interlock', weight: '260 g/m²', feel: 'Dense, smooth both sides', bestFor: 'Polo shirts, Loungewear', characteristics: ['Stable', 'Premium', 'Double-face'], stretchH: 35, stretchV: 15, warmth: 40, breathability: 65, durability: 80 },
  { yarnId: 'wool', techniqueId: 'cable', gaugeId: 'heavy', name: 'Wool Cable Knit', weight: '480 g/m²', feel: 'Thick, luxurious, textured', bestFor: 'Winter sweaters, Cardigans', characteristics: ['Warm', '3D pattern', 'Traditional'], stretchH: 25, stretchV: 20, warmth: 95, breathability: 40, durability: 85 },
  { yarnId: 'wool', techniqueId: 'single-jersey', gaugeId: 'fine', name: 'Fine Merino Jersey', weight: '160 g/m²', feel: 'Soft, warm, lightweight', bestFor: 'Base layers, Smart knitwear', characteristics: ['Thermoregulating', 'Anti-odour', 'Elegant'], stretchH: 40, stretchV: 20, warmth: 55, breathability: 80, durability: 65 },
  { yarnId: 'viscose', techniqueId: 'single-jersey', gaugeId: 'fine', name: 'Viscose Jersey', weight: '130 g/m²', feel: 'Silky, fluid, cool', bestFor: 'Dresses, Draped tops', characteristics: ['Luxurious drape', 'Vibrant colour', 'Light'], stretchH: 50, stretchV: 25, warmth: 15, breathability: 85, durability: 45 },
  { yarnId: 'viscose', techniqueId: 'jacquard', gaugeId: 'medium', name: 'Jacquard Viscose', weight: '240 g/m²', feel: 'Pattern-rich, smooth', bestFor: 'Statement knitwear, Dresses', characteristics: ['Colourful', 'Detailed pattern', 'Eye-catching'], stretchH: 30, stretchV: 15, warmth: 30, breathability: 65, durability: 55 },
  { yarnId: 'polyester', techniqueId: 'interlock', gaugeId: 'fine', name: 'Poly Interlock', weight: '180 g/m²', feel: 'Crisp, resilient', bestFor: 'Sportswear, Activewear', characteristics: ['Quick-dry', 'Shape-holding', 'Durable'], stretchH: 40, stretchV: 20, warmth: 25, breathability: 60, durability: 92 },
  { yarnId: 'blend', techniqueId: 'rib', gaugeId: 'medium', name: 'Blend Rib Knit', weight: '240 g/m²', feel: 'Balanced, comfortable', bestFor: 'Everyday knitwear, Pullovers', characteristics: ['Versatile', 'Easy care', 'Good recovery'], stretchH: 70, stretchV: 30, warmth: 50, breathability: 60, durability: 75 },
  { yarnId: 'blend', techniqueId: 'jacquard', gaugeId: 'heavy', name: 'Heavy Jacquard', weight: '420 g/m²', feel: 'Substantial, patterned', bestFor: 'Outerwear, Statement pieces', characteristics: ['Bold patterns', 'Warm', 'Premium'], stretchH: 20, stretchV: 10, warmth: 80, breathability: 35, durability: 88 },
];

export function getFabricResult(yarnId: string, techniqueId: string, gaugeId: string): FabricResult {
  // Try curated first
  const curated = curatedResults.find(
    (r) => r.yarnId === yarnId && r.techniqueId === techniqueId && r.gaugeId === gaugeId,
  );
  if (curated) return curated;

  // Generate a reasonable fallback
  const yarn = yarnTypes.find((y) => y.id === yarnId)!;
  const tech = knitTechniques.find((t) => t.id === techniqueId)!;
  const g = gaugeLevels.find((gl) => gl.id === gaugeId)!;

  const baseWeight = gaugeId === 'fine' ? 150 : gaugeId === 'medium' ? 260 : 420;
  const warmBase = gaugeId === 'fine' ? 25 : gaugeId === 'medium' ? 50 : 80;
  const breathBase = gaugeId === 'fine' ? 80 : gaugeId === 'medium' ? 55 : 35;

  return {
    yarnId,
    techniqueId,
    gaugeId,
    name: `${g.name.split(' ')[0]} ${yarn.name} ${tech.name}`,
    weight: `${baseWeight} g/m²`,
    feel: `${yarn.properties[0]}, ${tech.characteristics[0].toLowerCase()}`,
    bestFor: 'Versatile knitwear applications',
    characteristics: [yarn.properties[0], tech.characteristics[0], g.description.split('.')[0]],
    stretchH: techniqueId === 'rib' ? 75 : 35,
    stretchV: 20,
    warmth: warmBase + (yarnId === 'wool' ? 15 : 0),
    breathability: breathBase + (yarnId === 'cotton' ? 10 : 0),
    durability: yarnId === 'polyester' ? 85 : 65,
  };
}
