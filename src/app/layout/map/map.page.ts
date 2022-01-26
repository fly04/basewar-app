import { Component, NgZone, OnInit } from '@angular/core';
import { defaultIcon } from './markers/default-marker';
import { usedIcon } from './markers/used-marker';
import { userIcon } from './markers/user-marker';
import { latLng, MapOptions, tileLayer } from 'leaflet';
import { Map, marker, Marker, circle, Circle } from 'leaflet';
import { BasesService } from 'src/app/services/api/bases.service';
import { WsMessagesService } from 'src/app/services/websocket/ws-messages.service';
import { GeolocationService } from 'src/app/services/geolocation.service';
import { Base } from 'src/app/models/base';
import { Router, ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';
import { ReplaySubject } from 'rxjs';

@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
})
export class MapPage {
  map: Map;
  mapOptions: MapOptions;
  userMarker: Marker;
  basesMarkers: Marker[] = []; //Contient les markers à afficher sur la carte où se trouvent les bases
  basesCircles: Circle[] = []; //Contient les cercles à afficher sur la carte autour des bases
  markers: any[]; //Contient à terme tous les markers (cercles et markers)
  basesToDisplay: Base[];
  refreshMap = new ReplaySubject();

  constructor(
    readonly basesService: BasesService,
    readonly wsMessagesService: WsMessagesService,
    readonly geolocService: GeolocationService,
    private router: Router,
    private route: ActivatedRoute,
    private zone: NgZone
  ) {
    //Set les options de la carte
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
      center: latLng(0, 0),
    };

    this.refreshMap.subscribe(() => {
      this.markers = [
        this.userMarker,
        ...this.basesMarkers,
        ...this.basesCircles,
      ];
    });
  }

  onMapReady(map: Map) {
    this.map = map;
    setTimeout(() => map.invalidateSize(), 0);

    //Place la caméra à la position initiale du joueur lorsqu'il ouvre l'app
    this.geolocService.getCurrentPosition().then((position) => {
      map.setView(
        latLng(position.coords.latitude, position.coords.longitude),
        16
      );
    });

    // Chaque seconde la position du userMarker est actualisée
    setInterval(() => {
      this.geolocService.getCurrentPosition().then((position) => {
        let lat = position.coords.latitude;
        let lng = position.coords.longitude;

        this.userMarker = marker([lat, lng], {
          icon: userIcon,
        });
        this.refreshMap.next();
      });
    }, 1000);
  }

  ionViewDidEnter() {
    //Récupèrer toutes les bases de la bdd via l'API
    this.basesService.getBases().subscribe((bases) => {
      this.basesToDisplay = bases;

      //Si un id est spécifié, centrer la carte dessus
      if (this.route.snapshot.paramMap.get('id') !== null) {
        let baseToShow = this.basesToDisplay.find(
          (base) => base.id == this.route.snapshot.paramMap.get('id')
        );
        if (baseToShow != null) {
          this.map.setView(
            latLng(
              baseToShow.location.coordinates[0],
              baseToShow.location.coordinates[1]
            ),
            16
          );
        }
      }

      //Récupèrer toutes les bases actives via WS
      this.wsMessagesService.updateBases$.subscribe((activeBases) => {
        this.basesMarkers = [];
        this.basesCircles = [];
        this.basesToDisplay.forEach((base) => {
          let isActive = false;
          let userCount;
          activeBases.forEach((activeBase) => {
            if (base.id === activeBase.id) {
              isActive = true;
              userCount = activeBase.activeUsers.length;
            }
          });

          //Ajouter des markers pour chaque base
          this.addMarker(isActive, base, userCount);
        });
        this.refreshMap.next();
      });
    });
  }

  centerMap() {
    this.geolocService.getCurrentPosition().then((position) => {
      this.map.setView(
        latLng(position.coords.latitude, position.coords.longitude),
        16
      );
    });
  }

  addMarker(isActive: boolean, base: Base, userCount: number = 0) {
    let icon = defaultIcon;
    let tooltip = base.name;
    let fillColor = '#3d85c6';

    if (isActive) {
      icon = usedIcon;
      tooltip += '<br> Nombre de joueurs actifs: ' + userCount;
      fillColor = '#f03';
    }

    let markerToPush = marker(
      [base.location.coordinates[0], base.location.coordinates[1]],
      {
        icon: icon,
      }
    ).bindTooltip(tooltip);
    markerToPush.addEventListener('click', () => {
      this.zone.run(() => {
        this.router.navigate(['/base/' + base.id]);
      });
    });

    this.basesMarkers.push(markerToPush);

    this.basesCircles.push(
      circle([base.location.coordinates[0], base.location.coordinates[1]], {
        fillColor: fillColor,
        fillOpacity: 0.5,
        radius: 200,
        stroke: false,
      })
    );
  }
}
