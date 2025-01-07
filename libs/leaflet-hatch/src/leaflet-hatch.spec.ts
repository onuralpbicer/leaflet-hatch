import { hatchStyle } from './index';

describe('leafletHatch', () => {
  it('should work', () => {
    expect(hatchStyle()).toEqual('leaflet-hatch');
  });
});
