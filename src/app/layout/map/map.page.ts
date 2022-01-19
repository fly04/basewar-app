import { Component, OnInit } from '@angular/core';
import { defaultIcon } from './markers/default-marker';
import { usedIcon } from './markers/used-marker';
import { userIcon } from './markers/user-marker';
import { latLng, MapOptions, tileLayer } from 'leaflet';
import { Map, marker, Marker, circle, Circle } from 'leaflet';
import { BasesService } from 'src/app/services/api/bases.service';
import { WsMessagesService } from 'src/app/services/websocket/ws-messages.service';
import { GeolocationService } from 'src/app/services/geolocation.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
})
export class MapPage {
  mapOptions: MapOptions;
  basesMarkers: Marker[]; //Contient les markers à afficher sur la carte où se trouvent les bases
  basesCircles: Circle[]; //Contient les cercles à afficher sur la carte autour des bases
  markers: any[]; //Contient à terme tous les markers
  basesToDisplay: any;

  constructor(
    readonly basesService: BasesService,
    readonly wsMessagesService: WsMessagesService,
    readonly geolocService: GeolocationService
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

    this.basesMarkers = [];
    this.basesCircles = [];
  }

  onMapReady(map: Map) {
    setTimeout(() => map.invalidateSize(), 0);

    //Place la caméra à la position initiale du joueur lorsqu'il ouvre l'app
    this.geolocService.getCurrentPosition().then((position) => {
      map.setView(
        latLng(position.coords.latitude, position.coords.longitude),
        16
      );
    });

    //Chaque seconde la position du userMarker est actualisée
    setInterval(() => {
      this.geolocService.getCurrentPosition().then((position) => {
        let lat = position.coords.latitude;
        let lng = position.coords.longitude;

        let userMarker = marker([lat, lng], {
          icon: userIcon,
        });

        this.markers = [userMarker, ...this.basesMarkers, ...this.basesCircles];
      });
    }, 1000);
  }

  addMarker(isActive: boolean, base, userCount = 0) {
    let icon = defaultIcon;
    let tooltip = base.name;
    let color = 'blue';
    let fillColor = '#3d85c6';

    if (isActive) {
      icon = usedIcon;
      tooltip += '<br> Nombre de joueurs actifs: ' + userCount;
      color = 'red';
      fillColor = '#f03';
    }

    this.basesMarkers.push(
      marker([base.location.coordinates[0], base.location.coordinates[1]], {
        icon: icon,
      }).bindTooltip(tooltip)
    );

    this.basesCircles.push(
      circle([base.location.coordinates[0], base.location.coordinates[1]], {
        fillColor: fillColor,
        fillOpacity: 0.5,
        radius: 200,
        stroke: false,
      })
    );
  }

  ionViewDidEnter() {
    //Récupère toutes les bases de la bdd via l'API
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

      //Récupère toutes les bases actives via WS
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
          //Ajoute des markers pour chaque base, spécifiant si elle est active ou non
          this.addMarker(isActive, base, userCount);
        });
      });
    });
  }
}
