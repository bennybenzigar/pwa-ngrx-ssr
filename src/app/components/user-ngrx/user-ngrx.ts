import { Component, inject, signal, Signal } from '@angular/core';
import { UserNGRXService } from '../../service/userngrx.service';
import { rxResource } from '@angular/core/rxjs-interop';
@Component({
  imports: [],
  selector: 'app-user-ngrx',
  styleUrl: './user-ngrx.scss',
  templateUrl: './user-ngrx.html',
})
export class UserNgrx {

  private userApiService= inject(UserNGRXService);


  userid=  signal<number | undefined>(undefined);
  status= signal<string>('pending')
  userResource=rxResource({
    params:()=>this.userid,

    stream:()=>this.userApiService.getUsers(),
    defaultValue:[]
  })


  singleUserResource=rxResource({
    params:()=> this.userid(),
    stream:({params})=> this.userApiService.getUser(params)
  })

  switchUser(id:number){
    this.userid.set(id);
  }

  changeStatus() {
  const statuses = ['pending', 'rejected', 'loading'];

  this.status.set(statuses[Math.floor(Math.random() * statuses.length)]);
}



}
