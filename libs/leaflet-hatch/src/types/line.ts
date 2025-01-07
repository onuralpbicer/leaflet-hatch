export function createLineHatch(
  fillColor: string,
  backgroundColor: string | undefined,
  width: number,
  maxSize: number
) {
  const paths: SVGPathElement[] = [];

  paths.push(createForeground(fillColor, width, maxSize));

  if (backgroundColor) {
    const backgrounds = createBackground(backgroundColor, width, maxSize);
    for (const background of backgrounds) {
      paths.push(background);
    }
  }
  return paths;
}

function createBackground(
  backgroundColor: string,
  width: number,
  maxSize: number
) {
  const backgroundSize = (maxSize - width) / 2;
  const background1 = document.createElementNS(
    'http://www.w3.org/2000/svg',
    'path'
  );
  background1.setAttribute('stroke', backgroundColor);
  background1.setAttribute('stroke-width', backgroundSize.toString());
  background1.setAttribute('pointer-events', 'none');
  background1.setAttribute('d', `M0 ${backgroundSize / 2}h${maxSize}`);

  const background2 = document.createElementNS(
    'http://www.w3.org/2000/svg',
    'path'
  );
  background2.setAttribute('stroke', backgroundColor);
  background2.setAttribute('stroke-width', backgroundSize.toString());
  background2.setAttribute('pointer-events', 'none');
  background2.setAttribute(
    'd',
    `M0 ${maxSize - backgroundSize / 2}h${maxSize}`
  );

  return [background1, background2];
}

function createForeground(fillColor: string, width: number, maxSize: number) {
  const foreground = document.createElementNS(
    'http://www.w3.org/2000/svg',
    'path'
  );
  foreground.setAttribute('stroke', fillColor);
  foreground.setAttribute('stroke-width', width.toString());
  foreground.setAttribute('pointer-events', 'none');
  foreground.setAttribute('d', `M0 ${maxSize / 2}h${maxSize}`);

  return foreground;
}
