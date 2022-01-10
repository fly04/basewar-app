import { User } from '../models/user';

export type Base = {
  name: string;
  link: string;
  investments: string;
  location: {
    type: string;
    coordinates: number[];
  };
  owner: User;
  id: string;
};
