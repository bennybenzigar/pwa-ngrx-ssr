export interface ProductDTO{
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  stock: number;
  thumbnail: string;
  rating: number;
}

export interface  ProductStateDTO {
  products: ProductDTO[];
  selectedProduct: ProductDTO | null;
  loading: boolean;
  saving: boolean;
  deleting: boolean;
  error: string | null;
  searchTerm: string;
  selectedCategory: string;
  currentPage: number;
  pageSize: number;
}

export interface CreateProductDTO{
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  stock: number;
  thumbnail: string;
  rating: number;
}

export type UdateProductDTO= Partial<CreateProductDTO>