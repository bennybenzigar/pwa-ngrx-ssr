import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { ProductDTO, ProductStateDTO } from '../models/product.modal';
import { setAllEntities, withEntities } from '@ngrx/signals/entities';
import { computed, inject } from '@angular/core';
import { ProductService } from '../service/product-api.service';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap } from 'rxjs';
import { tapResponse } from '@ngrx/operators';
import { error } from 'console';

const initialState: ProductStateDTO = {
    deleting: false,
    error: null,
    loading: false,
    products: [],
    saving: false,
    searchTerm: '',
    selectedCategory: '',
    selectedProduct: null,
    currentPage: 1,
    pageSize: 10,
};

export const ProductStore = signalStore(
    { providedIn: 'root' },

    withState(initialState),
    withEntities<ProductDTO>(),

    withComputed(({ entities, searchTerm, selectedCategory, currentPage, pageSize }) => ({
        totalProducts: computed(() => entities().length),

        totalStock: computed(() => entities().reduce((total, product) => total + product.stock, 0)),

        inverntoryValue: computed(() =>
            entities().reduce((total, product) => total + product.price * product.stock, 0),
        ),

        categories: computed(() => {
            [...new Set(entities().map((product) => product.category))];
        }),

        filteredProducts: computed(() => {
            const search = searchTerm().toLowerCase().trim();
            const category = selectedCategory();

            return entities().filter((product) => {
                const matchesSearch =
                    !search ||
                    product.title.toLowerCase().includes(search) ||
                    product.description.toLowerCase().includes(search);
                const matchesCategory = category === 'all' || product.category === category;

                return matchesSearch && matchesCategory;
            });
        }),

        filteredCount: computed(() =>
            entities().filter(product => {

                const search = searchTerm()
                    .toLowerCase()
                    .trim();

                const matchesSearch =
                    !search ||
                    product.title.toLowerCase().includes(search) ||
                    product.description.toLowerCase().includes(search);

                const matchesCategory =
                    selectedCategory() === 'all' ||
                    product.category === selectedCategory();

                return matchesSearch && matchesCategory;

            }).length
        ),

        totalPages: computed(() =>
            Math.ceil(
                entities().filter(product => {

                    const search = searchTerm()
                        .toLowerCase()
                        .trim();

                    return (
                        (!search ||
                            product.title.toLowerCase().includes(search) ||
                            product.description.toLowerCase().includes(search)) &&
                        (selectedCategory() === 'all' ||
                            product.category === selectedCategory())
                    );

                }).length / pageSize()
            )
        ),

        paginatedProducts: computed(() => {

            const search = searchTerm()
                .toLowerCase()
                .trim();

            const category = selectedCategory();

            const filtered = entities().filter(product => {

                const matchesSearch =
                    !search ||
                    product.title.toLowerCase().includes(search) ||
                    product.description.toLowerCase().includes(search);

                const matchesCategory =
                    category === 'all' ||
                    product.category === category;

                return matchesSearch && matchesCategory;

            });

            const start =
                (currentPage() - 1) * pageSize();

            return filtered.slice(
                start,
                start + pageSize()
            );

        })

    })),


    withMethods((
        store,
        api = inject(ProductService)
    ) => ({

        loadProducts: rxMethod<void>(

            pipe(

                tap(() => patchState(store, {
                    loading: true,
                    error: null
                })),

                switchMap(() =>
                    api.getProducts().pipe(
                        tapResponse({
                            next: response => patchState(store, setAllEntities(response), {
                                loading: false
                            }),
                            error: () => {
                                patchState(store, {
                                    loading: false,
                                    error: 'Failed to load products'
                                });
                            }
                        })
                    )
                ))


        ),

        



    }))
);
