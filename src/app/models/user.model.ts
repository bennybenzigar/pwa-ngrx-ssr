export interface User{
    id?:number;
    email:string;
    username:string;
    name:string;
    phone:string;
    website:string;
}

export interface UserState{
    users:User[];
    loading:boolean;
    error:string|null;
    searchTerm:string;
    selectedUser?:User|null
}

export type CreateUserFormDTO=User

export type UpdateUser= Partial<User>

export interface UserChartDTO {
  name: string;
  id: number;
}