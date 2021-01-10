export type User = {
  id: number;
  email: string;
  username: string;
  role: string;
  age?: number;
  gender?: string;
  image?: string;
  members: unknown[];
  relations: unknown[];
  status: string;
  createdAt: Date;
  updatedAt: Date;
};

export type Server = {
  id: number;
  name: string;
  members: unknown[];
  channels: unknown[];
  roles: unknow[];
  type: string;
  createdAt: Date;
  updatedAt: Date;
};
