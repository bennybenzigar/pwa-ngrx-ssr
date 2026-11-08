import { Component, inject } from '@angular/core';
import { UserStore } from '../../../store/user.store';
import { ActivatedRoute } from '@angular/router';

@Component({
  imports: [],
  selector: 'app-user-details',
  styleUrl: './user-details.scss',
  templateUrl: './user-details.html',
})
export class UserDetails {
  readonly store =inject(UserStore)
  id:number|null=Number( inject(ActivatedRoute).snapshot.paramMap.get('id'))|| null;
  constructor(){

  }

  ngOnInit(): void {
   if(this.id){
    this.store.loadUserById(this.id)

   }
  }
}
