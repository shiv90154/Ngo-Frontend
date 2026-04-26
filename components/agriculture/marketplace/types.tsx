// components/marketplace/types.ts

export type Product = {
  id?: string;
  _id?: string;
  name: string;
  category?: string;
  price?: number | string;
  quantity?: number | string;
  unit?: string;
  imageUrl?: string;
  location?: string;
  sellerName?: string;
  isOrganic?: boolean;
};

export type CartItem = {
  _id?: string;
  product?: Product | null;
  productId: string;
  quantity: number;
  price: number;
  name: string;
};

export type Address = {
  _id: string;
  fullName: string;
  phone: string;
  addressLine: string;
  city: string;
  state: string;
  pincode: string;
  landmark?: string;
  isDefault?: boolean;
};

export type ManualAddress = {
  fullName: string;
  phone: string;
  addressLine: string;
  city: string;
  state: string;
  pincode: string;
  landmark: string;
  isDefault: boolean;
};