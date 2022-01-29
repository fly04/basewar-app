import { Component, NgZone, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { defaultIcon } from './markers/default-marker';
import { usedIcon } from './markers/used-marker';
import { userIcon } from './markers/user-marker';
import { latLng, MapOptions, tileLayer } from 'leaflet';
import { Map, marker, Marker, circle, Circle } from 'leaflet';
import { BasesService } from 'src/app/services/api/bases.service';
import { UsersService } from 'src/app/services/api/users.service';
import { WsMessagesService } from 'src/app/services/websocket/ws-messages.service';
import { GeolocationService } from 'src/app/services/geolocation.service';
import { Base } from 'src/app/models/base';
import { Router, ActivatedRoute } from '@angular/router';
import { ReplaySubject, forkJoin, combineLatest } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { User } from 'src/app/models/user';
import { InvestmentToCreate } from 'src/app/models/investment-to-create';
import { BaseToCreate } from 'src/app/models/base-to-create';
import { BaseUpdate } from 'src/app/models/base-update';

@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
})
export class MapPage implements OnInit {
  map: Map;
  mapOptions: MapOptions;
  userMarker: Marker;
  basesMarkers: Marker[] = []; //Contient les markers à afficher sur la carte où se trouvent les bases
  basesCircles: Circle[] = []; //Contient les cercles à afficher sur la carte autour des bases
  markers: any[]; //Contient à terme tous les markers (cercles et markers)

  basesToDisplay: Base[]; //Toutes les bases de la BDD
  activeBases: BaseUpdate[]; //Bases actives provenant du msg WS

  refreshMap = new ReplaySubject();
  createMarkers = new ReplaySubject();

  userIsInBase: boolean;
  lastLat: number;
  lastLng: number;
  lastSeenBase: Base;
  actualUser: User;

  constructor(
    readonly basesService: BasesService,
    readonly usersService: UsersService,
    readonly wsMessagesService: WsMessagesService,
    readonly geolocService: GeolocationService,
    private router: Router,
    private zone: NgZone,
    private alertController: AlertController,
    private auth: AuthService
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
      if (this.userMarker === undefined) return;
      this.markers = [
        this.userMarker,
        ...this.basesMarkers,
        ...this.basesCircles,
      ];

      let isUserInBase = false;
      this.lastSeenBase = null;
      if (this.basesToDisplay != null) {
        this.basesToDisplay.forEach((base) => {
          let distance = this.getDistance(
            this.lastLat,
            this.lastLng,
            base.location.coordinates[0],
            base.location.coordinates[1]
          );
          if (distance <= 200) {
            isUserInBase = true;
            this.lastSeenBase = base;
          }

          //emits true or false
          this.userIsInBase = isUserInBase;
        });
      }
    });
  }

  ngOnInit() {
    // Get the actual logged user
    this.auth.getUser$().subscribe((user) => {
      this.actualUser = user;
    });

    // Get all the bases
    this.getAllBasesData();

    // Get the active bases
    this.getActiveBasesData();

    this.createMarkers.subscribe(() => {
      this.basesMarkers = [];
      this.basesCircles = [];
      this.basesToDisplay.forEach((base) => {
        let isActive = false;
        let userCount;
        this.activeBases.forEach((activeBase) => {
          if (base.id === activeBase.id) {
            isActive = true;
            userCount = activeBase.activeUsers.length;
          }
        });
        //Ajouter des markers pour chaque base
        this.addMarker(isActive, base, userCount);
      });
      //Met à jour la carte
      this.refreshMap.next();
    });
  }

  onMapReady(map: Map) {
    this.map = map;
    setTimeout(() => map.invalidateSize(), 0);

    // Place la caméra à la position initiale du joueur lorsqu'il ouvre l'app
    this.geolocService.getCurrentPosition().then((position) => {
      map.setView(
        latLng(position.coords.latitude, position.coords.longitude),
        16
      );
    });

    // Chaque seconde la position du userMarker est actualisée
    setInterval(() => {
      this.geolocService.getCurrentPosition().then((position) => {
        this.lastLat = position.coords.latitude;
        this.lastLng = position.coords.longitude;

        this.userMarker = marker([this.lastLat, this.lastLng], {
          icon: userIcon,
        });

        this.refreshMap.next();
      });
    }, 1000);
  }

  ionViewDidEnter() {
    //If showBaseService.property == true { show base }
  }

  getAllBasesData() {
    this.basesService.getBases().subscribe((bases) => {
      this.basesToDisplay = bases;
    });
  }

  getActiveBasesData() {
    this.wsMessagesService.updateBases$.subscribe((activeBases) => {
      if (JSON.stringify(this.activeBases) != JSON.stringify(activeBases)) {
        //Un autre joueur a créé un base
        this.getAllBasesData();
      }
      this.activeBases = activeBases;
      this.createMarkers.next();
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

  //Calculate distance between two points in meters
  getDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the earth in km
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) *
        Math.cos(this.deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return d * 1000;
  }

  deg2rad(deg) {
    return deg * (Math.PI / 180);
  }

  clickOnCreate() {
    if (this.userIsInBase) {
      this.createInvestmentAlert();
    } else {
      this.createBaseAlert();
    }
  }

  createInvestmentAlert = async () => {
    const alert = await this.alertController.create({
      header: 'Investir dans la base ' + this.lastSeenBase.name,
      message: 'Souhaitez-vous investir 500 diamants dans cette base ?',
      buttons: [
        { text: 'Annuler' },
        {
          text: 'Investir',
          handler: () => {
            this.handleInvestmentCreation();
          },
        },
      ],
    });
    await alert.present();
  };

  handleInvestmentCreation() {
    let alertMessages: string[] = [];
    let userCanCreateInvestment: boolean = true;

    forkJoin([
      this.basesService.getInvestments(this.lastSeenBase.id),
      this.usersService.getUser(this.actualUser.id),
    ]).subscribe(async (res) => {
      let investments = res[0];
      let user = res[1];

      //Check base ownership
      if (this.lastSeenBase.owner.id == user.id) {
        alertMessages.push('Vous êtes le propriétaire de cette base.');
        userCanCreateInvestment = false;
      }

      //Check if user has enough diamonds
      if (Number(user.money) < 500) {
        alertMessages.push("Vous n'avez pas assez de diamants.");
        userCanCreateInvestment = false;
      }

      //Check if user has already invested in this base
      investments.forEach((investment) => {
        if (investment.investor.id == user.id) {
          alertMessages.push('Vous avez déjà investi dans cette base.');
          userCanCreateInvestment = false;
        }
      });

      // Display error message if user can't invest
      if (!userCanCreateInvestment) {
        let messageToDisplay = alertMessages.join('<br>');
        const alert = await this.alertController.create({
          header: 'Investissement impossible',
          message: messageToDisplay,
          buttons: [{ text: 'Retour' }],
        });
        await alert.present();
        return;
      }

      //Create investment
      let investmentToCreate: InvestmentToCreate = {
        baseId: this.lastSeenBase.id,
        investorId: user.id,
      };
      this.basesService
        .postInvestment(investmentToCreate)
        .subscribe(async () => {
          //Display message
          const alert = await this.alertController.create({
            header: 'Investissement effectué',
            message:
              'Félicitation, vous avez investi dans ' +
              this.lastSeenBase.name +
              '!',
            buttons: [{ text: 'Retour' }],
          });
          await alert.present();
        });
    });
  }

  createBaseAlert() {
    this.basesService.getUserBases(this.actualUser).subscribe(async (bases) => {
      let price = bases.length * 200;
      const alert = await this.alertController.create({
        header: 'Créer une base',
        message:
          'Souhaitez-vous créer une base à cet emplacement pour ' +
          price +
          ' diamants ?',
        buttons: [
          { text: 'Annuler' },
          {
            text: 'Créer',
            handler: () => {
              this.handleBaseCreation(price);
            },
          },
        ],
      });
      await alert.present();
    });
  }

  handleBaseCreation(price: number) {
    forkJoin([
      this.geolocService.getCurrentPosition(),
      this.usersService.getUser(this.actualUser.id),
      this.basesService.getBases(),
    ]).subscribe(async (res) => {
      //   console.log(res);

      let alertMessages: string[] = [];
      let userCanCreateBase: boolean = true;
      let baseTooClose: Base;
      let userPosition = res[0];
      let user = res[1];
      let bases = res[2];

      //Check if user has enough diamonds
      if (Number(user.money) < price) {
        userCanCreateBase = false;
        alertMessages.push("Vous n'avez pas assez de diamants.");
      }

      //Check if there is other bases too close
      let baseIsTooClose = false;
      let userLat = userPosition.coords.latitude;
      let userLng = userPosition.coords.longitude;

      bases.forEach((base) => {
        let baseLat = base.location.coordinates[0];
        let baseLon = base.location.coordinates[1];

        let distance = this.getDistance(userLat, userLng, baseLat, baseLon);
        if (distance <= 400) {
          baseIsTooClose = true;
          baseTooClose = base;
        }
      });

      if (baseIsTooClose) {
        userCanCreateBase = false;
        alertMessages.push(
          'Vous êtes trop proche de la base ' + baseTooClose.name + '.'
        );
      }

      // Display error message if user can't invest
      if (!userCanCreateBase) {
        let messageToDisplay = alertMessages.join('<br>');
        const alert = await this.alertController.create({
          header: 'Création de la base impossible',
          message: messageToDisplay,
          buttons: [{ text: 'Retour' }],
        });
        await alert.present();
        return;
      }

      // Display name input
      const alert = await this.alertController.create({
        header: 'Créer une base',
        inputs: [
          {
            type: 'text',
            name: 'baseName',
            placeholder: 'Veuillez nommer votre base',
          },
        ],
        buttons: [
          { text: 'Annuler' },
          {
            text: 'Créer',
            handler: (data) => {
              this.createBase(data.baseName, userLat, userLng, user.id);
            },
          },
        ],
      });
      await alert.present();
    });
  }

  createBase = async (
    baseName: string,
    userLat: number,
    userLng: number,
    userId: string
  ) => {
    //Create the base
    let baseToCreate: BaseToCreate = {
      name: baseName,
      ownerId: userId,
      location: {
        type: 'Point',
        coordinates: [userLat, userLng],
      },
    };

    this.basesService.postBase(baseToCreate).subscribe(async () => {
      //Display creation success message
      const alert = await this.alertController.create({
        header: 'Base créée',
        message:
          'Félicitation, vous avez crée la base ' + baseToCreate.name + '!',
        buttons: [{ text: 'Retour' }],
      });
      await alert.present();
    });
  };
}
