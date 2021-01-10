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
