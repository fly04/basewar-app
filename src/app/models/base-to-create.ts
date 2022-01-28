export type BaseToCreate = {
  name: string;
  ownerId: string;
  location: {
    type: string;
    coordinates: number[];
  };
};
