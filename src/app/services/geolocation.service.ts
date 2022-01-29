import { Injectable } from '@angular/core';
import { Geolocation } from '@capacitor/geolocation';

@Injectable({
  providedIn: 'root',
})
export class GeolocationService {
  coordinate: any;
  watchCoordinate: any;
  watchId: any;
  constructor() {}

  public getCurrentPosition = async () => {
    let coordinates;
    try {
      coordinates = await Geolocation.getCurrentPosition({
        timeout: 10000,
        enableHighAccuracy: true,
      });
    } catch (error) {
      console.log('Error occurred', error);
    }
    return coordinates;
  };
}
