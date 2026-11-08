import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { map, Observable } from "rxjs";
import { CreateProductDTO, ProductDTO, UdateProductDTO } from "../models/product.modal";

@Injectable({
    providedIn:'root'
})

export class ProductService{
  private readonly http = inject(HttpClient);

  private apiUrl='https://dummyjson.com/products';

  getProducts():Observable<ProductDTO[]>{
    return this.http.get(`${this.apiUrl}?limit=0`).pipe(map((res:any)=> res.products))
  }

  getPRoductById(id:number):Observable<ProductDTO>{
   return this.http.get<ProductDTO>(
      `${this.apiUrl}/${id}`
    );

  }
    createProduct(data: CreateProductDTO): Observable<ProductDTO> {
    return this.http.post<ProductDTO>(
      `${this.apiUrl}/add`,
      data
    );
  }

  updateProduct(
    id: number,
    data: UdateProductDTO
  ): Observable<ProductDTO> {
    return this.http.patch<ProductDTO>(
      `${this.apiUrl}/${id}`,
      data
    );
  }

  deleteProduct(id: number): Observable<ProductDTO> {
    return this.http.delete<ProductDTO>(
      `${this.apiUrl}/${id}`
    );
  }


}