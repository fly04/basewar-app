import { Component, OnInit } from '@angular/core';
import { defaultIcon } from './markers/default-marker';
import { usedIcon } from './markers/used-marker';
import { latLng, MapOptions, tileLayer } from 'leaflet';
import { Map, marker, Marker } from 'leaflet';
import { BasesService } from 'src/app/api/bases.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
})
export class MapPage {
  mapOptions: MapOptions;
  mapMarkers: Marker[];
  basesToDisplay: any;
  activeBases: any[];

  constructor(private basesService: BasesService) {
    this.mapOptions = {
      layers: [
        tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 18,
        }),
      ],
      zoom: 13,
      center: latLng(46.778186, 6.641524),
    };
  }

  onMapReady(map: Map) {
    setTimeout(() => map.invalidateSize(), 0);
  }

  ionViewDidEnter() {
    this.basesService.getBases().subscribe((bases) => {
      this.basesToDisplay = bases.map((base) => {
        return {
          id: base.id,
          name: base.name,
          investments: base.investments,
          location: base.location,
          owner: base.owner,
        };
      });

      this.basesService.getActiveBases().subscribe((activeBases) => {
        let markers = [];

        this.basesToDisplay.forEach((btd) => {
          let isActive = false;
          activeBases.forEach((ab) => {
            if (btd.id == ab.id) {
              isActive = true;
            }
          });

          if (isActive) {
            markers.push(
              marker(
                [btd.location.coordinates[0], btd.location.coordinates[1]],
                {
                  icon: usedIcon,
                }
              ).bindTooltip(btd.name)
            );
          } else {
            markers.push(
              marker(
                [btd.location.coordinates[0], btd.location.coordinates[1]],
                {
                  icon: defaultIcon,
                }
              ).bindTooltip(btd.name)
            );
          }
        });
        this.mapMarkers = markers;
      });
    });
  }
}
//marker([base.location.coordinates[0], base.location.coordinates[1]], { icon: defaultIcon })
