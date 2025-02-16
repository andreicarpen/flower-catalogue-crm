
export interface Flower {
  id: string;
  name: string;
  image: string;
  distributorId: string;
  categoryId: string;
  quantity: number;
  createdAt: string;
}

export interface Distributor {
  id: string;
  name: string;
}

export interface Category {
  id: string;
  name: string;
}
