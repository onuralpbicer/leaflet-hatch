import { PathOptions } from 'leaflet';
import { uid } from 'uid';
import { createLineHatch } from './types/line';

export enum HatchTypes {
  Line,
}

interface CommonHatchOptions {
  width?: number;
  backgroundColor?: string;
  maxSize?: number;
}

interface LineHatchOptions {
  type: HatchTypes.Line;
  angle?: number;
}

type Options = CommonHatchOptions &
  LineHatchOptions &
  Partial<Pick<PathOptions, 'weight' | 'fillOpacity' | 'color' | 'fillColor'>>;

export function removeHatchStyles() {
  if (defs && defs.parentElement) document.body.removeChild(defs.parentElement);
}

export function hatchStyle(options: Options = {} as Options): PathOptions {
  const {
    fillColor = 'red',
    weight = 1,
    fillOpacity = 0.6,
    width = 4,
    angle = 0,
    color,
    type,
    backgroundColor,
    maxSize = 8,
  } = options;

  const defs = createSVG();

  const pattern = createPattern(
    {
      type,
      angle,
    },
    maxSize
  );

  const lineHatchPaths = createLineHatch(
    fillColor,
    backgroundColor,
    width,
    maxSize
  );

  for (const path of lineHatchPaths) {
    pattern.appendChild(path);
  }
  defs.appendChild(pattern);

  return {
    fillColor: `url(#${pattern.id})`,
    fillOpacity,
    weight,
    color,
  };
}

function createPattern(
  directionOptions: Omit<LineHatchOptions, 'color'>,
  maxSize: number
) {
  const pattern = document.createElementNS(
    'http://www.w3.org/2000/svg',
    'pattern'
  );

  pattern.id = uid(5);
  pattern.setAttribute('x', '0');
  pattern.setAttribute('y', '0');
  pattern.setAttribute('width', maxSize.toString());
  pattern.setAttribute('height', maxSize.toString());
  pattern.setAttribute('patternUnits', 'userSpaceOnUse');
  pattern.setAttribute('patternContentUnits', 'userSpaceOnUse');
  pattern.setAttribute('patternTransform', `rotate(${directionOptions.angle})`);
  return pattern;
}

let defs: SVGDefsElement;

function createSVG() {
  if (defs) {
    return defs;
  }

  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

  svg.setAttribute('width', '0');
  svg.setAttribute('height', '0');

  defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
  svg.appendChild(defs);

  document.body.appendChild(svg);
  return defs;
}
