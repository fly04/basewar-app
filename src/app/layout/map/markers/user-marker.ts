import { Icon, IconOptions, icon } from 'leaflet';
export const userIcon: Icon<IconOptions> = icon({
  // This define the displayed icon size, in pixel
  iconSize: [25, 25],
  // This defines the pixel that should be placed right above the location
  // If not provided, the image center will be used, and that could be awkward
  iconAnchor: [12.5, 24],
  // The path to the image to display. In this case, it's a Leaflet asset
  iconUrl: '../../../../assets/markers/user.png',
  // The path to the image's shadow to display. Also a leaflet asset
  //   shadowUrl: 'leaflet/marker-shadow.png',
});
