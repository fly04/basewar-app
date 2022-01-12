import { Component, OnInit } from '@angular/core';
import { defaultIcon } from './markers/default-marker';
import { usedIcon } from './markers/used-marker';
import { latLng, MapOptions, tileLayer } from 'leaflet';
import { Map, marker, Marker } from 'leaflet';
import { BasesService } from 'src/app/api/bases.service';
import { WsMessagesService } from 'src/app/api/ws-messages.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
})
export class MapPage {
  mapOptions: MapOptions;
  mapMarkers: Marker[];
  basesToDisplay: any;
  refreshBases;

  constructor(
    readonly basesService: BasesService,
    readonly wsMessagesService: WsMessagesService
  ) {
    this.mapOptions = {
      layers: [
        tileLayer(
          'https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png',
          {
            maxZoom: 18,
          }
        ),
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

      this.wsMessagesService.updateBases$.subscribe((activeBases) => {
        let markers = [];
        this.basesToDisplay.forEach((base) => {
          let isActive = false;
          let userCount;
          activeBases.forEach((activeBase) => {
            if (base.id === activeBase.id) {
              isActive = true;
              userCount = activeBase.activeUsers.length;
            }
          });

          if (isActive) {
            markers.push(
              marker(
                [base.location.coordinates[0], base.location.coordinates[1]],
                {
                  icon: usedIcon,
                }
              ).bindTooltip(
                base.name + '<br> Nombre de joueurs actifs: ' + userCount
              )
            );
          } else {
            markers.push(
              marker(
                [base.location.coordinates[0], base.location.coordinates[1]],
                {
                  icon: defaultIcon,
                }
              ).bindTooltip(base.name)
            );
          }
        });

        this.mapMarkers = markers;
      });

      //   setInterval(() => {
      //     console.log(this.wsMessagesService.activeBases);
      //   }, 1000);

      //   let refreshBases = setInterval(() => {
      //     let markers = [];
      //     this.basesToDisplay.forEach((base) => {
      //       let isActive = false;
      //       this.wsMessagesService.activeBases?.forEach((activeBase) => {
      //         if (base.id === activeBase.id) {
      //           isActive = true;
      //         }
      //       });

      //       if (isActive) {
      //         markers.push(
      //           marker(
      //             [base.location.coordinates[0], base.location.coordinates[1]],
      //             {
      //               icon: usedIcon,
      //             }
      //           ).bindTooltip(base.name)
      //         );
      //       } else {
      //         markers.push(
      //           marker(
      //             [base.location.coordinates[0], base.location.coordinates[1]],
      //             {
      //               icon: defaultIcon,
      //             }
      //           ).bindTooltip(base.name)
      //         );
      //       }
      //     });

      //     this.mapMarkers = markers;
      //     console.log('aa');
      //   }, 1000);
    });
  }
}
