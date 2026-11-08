import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { CreateUserFormDTO, User, UserState } from '../models/user.model';
import { computed, inject } from '@angular/core';
import { UserApiService } from '../service/user-api.service';
import { tapResponse } from '@ngrx/operators';
import { RxMethod, rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap } from 'rxjs';
import { error } from 'console';
import { Router } from '@angular/router';
const initialState: UserState = {
  users: [],
  loading: false,
  searchTerm: '',
  error: null,
  selectedUser: null,
};

export const UserStore = signalStore(
  { providedIn: 'root' },

  withState(initialState),

  withComputed(({ users, searchTerm }) => ({
    totalUsers: computed(() => users().length),

    filteredUsers: computed(() => {
      console.log('ss', searchTerm);
      const search = searchTerm().toLowerCase().trim();

      if (!search) {
        return users();
      }

      return users().filter(
        (user) =>
          user.name.toLowerCase().includes(search) || user.email.toLowerCase().includes(search),
      );
    }),
  })),

  withMethods((store, userApi = inject(UserApiService),
    router = inject(Router)) => ({
       setUsers(users: User[]) {
    patchState(store, {
      users,
      loading: false,
      error: null
    });
  },

      loadUsers: rxMethod<void>(
        pipe(
          tap(() => {
            patchState(store, {
              loading: true,
              error: null,
            });
          }),

          switchMap(() =>
            userApi.getUsers().pipe(
              tapResponse({
                next: (users) => {
                  patchState(store, {
                    users,
                    loading: false,
                  });
                },
                error: (error: unknown) => {
                  patchState(store, {
                    loading: false,
                    error: error instanceof Error ? error.message : 'Unable toload users',
                  });
                },
              }),
            ),
          ),
        ),
      ),

      loadUserById: rxMethod<number>(
        pipe(
          tap(() =>
            patchState(store, {
              loading: true,
              error: null,
            }),
          ),

          switchMap((id) =>
            userApi.getUser(id).pipe(
              tapResponse({
                next: (user) => {
                  console.log('User details:', user);
                  patchState(store, {
                    loading: false,
                    selectedUser: user,
                  });
                },
                error: (error) => {
                  patchState(store, {
                    loading: false,
                    error: error instanceof Error ? error.message : 'Unable toload users',
                  });
                },
              }),
            ),
          ),
        ),
      ),

      createUser: rxMethod<CreateUserFormDTO>(
        pipe(
          tap(() => {
            patchState(store, {
              loading: true,
              error: null,
            });
          }),

          switchMap((userData: CreateUserFormDTO) =>
            userApi.createUser(userData).pipe(
              tapResponse({
                next: (user) => {
                  patchState(store, (state) => ({
                    loading: false,
                    users: [...state.users, user],
                  }));
                  router.navigateByUrl('/users')
                },

                error: (error: unknown) => {
                  patchState(store, {
                    loading: false,
                    error: error instanceof Error ? error.message : 'Unable to create user',
                  });
                },
              }),
            ),
          ),
        ),
      ),

      deleteUser: rxMethod<number>(
        pipe(
           tap(()=>patchState(store,{
            loading:true,
            error:null
           })),
           switchMap(id =>
          userApi.deleteUser(id).pipe(
            tapResponse({
              next: () => patchState(store, state => ({
                users: state.users.filter(
                  user => user.id !== id
                ),

                selectedUser:
                  state.selectedUser?.id === id
                    ? null
                    : state.selectedUser,

                deleting: false
              })),

              error: () => patchState(store, {
                loading: false,
                error: 'Unable to delete user'
              })
            })
          )
        )
      
        )
       
      ),

      setSearch(searchTerm: string) {
        console.log(searchTerm, 'ss');
        patchState(store, { searchTerm: searchTerm });
      },
      clearSearch() {
        patchState(store, { searchTerm: '' });
      },
    })),
);
