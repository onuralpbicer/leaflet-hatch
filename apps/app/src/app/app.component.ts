import { Component, effect, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LeafletModule } from '@bluehalo/ngx-leaflet';
import { GeoJSON, geoJson, latLng, Map, tileLayer } from 'leaflet';
import { HttpClient } from '@angular/common/http';
import { rxResource } from '@angular/core/rxjs-interop';
import { hatchStyle, HatchTypes } from '@leaflet-hatch/leaflet-hatch';

@Component({
  imports: [RouterModule, LeafletModule],
  selector: 'app-root',
  template: `
    <div
      id="map"
      leaflet
      [leafletOptions]="options"
      (leafletMapReady)="handleMapLoaded($event)"
    ></div>
    <svg>
      <defs>
        <pattern fill></pattern>
      </defs>
    </svg>
  `,
  styles: `
    #map {
      height: 100%;
      width: 100%;
    }
  `,
})
export class AppComponent {
  options = {
    layers: [
      tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: '...',
      }),
    ],
    zoom: 6,
    center: latLng(-32.5550775, 147.6694639),
  };
  map!: Map;
  private http = inject(HttpClient);
  states = rxResource({
    loader: () => this.http.get<GeoJSON.FeatureCollection>('single-state.json'),
  });

  constructor() {
    effect(() => {
      const states = this.states.value();
      if (!states) return;

      geoJson(states, {
        style: hatchStyle({
          type: HatchTypes.Line,
          color: 'blue',
          fillColor: 'red',
        }),
      }).addTo(this.map);
    });
  }

  handleMapLoaded(map: Map) {
    this.map = map;
    setTimeout(() => map.invalidateSize(), 100);
  }
}
