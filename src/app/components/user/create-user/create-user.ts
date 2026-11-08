import { Component, inject, signal } from '@angular/core';
import { UserStore } from '../../../store/user.store';
import { CreateUserFormDTO } from '../../../models/user.model';
import { email, form, FormField, minLength, pattern, required } from '@angular/forms/signals';

@Component({
  imports: [FormField],
  selector: 'app-create-user',
  styleUrl: './create-user.scss',
  templateUrl: './create-user.html',
})
export class CreateUser {
  readonly store = inject(UserStore);

  // step1 d=form model
  readonly UserFormModel = signal<CreateUserFormDTO>({
    name: '',
    email: '',
    phone: '',
    username: '',
    website: '',
  });

  readonly userForm = form(this.UserFormModel,(schemaPath)=>{

    required(schemaPath.name,{
      message:"Name is required"
    });

    minLength(schemaPath.name, 3,{
      message:" Name must contain atleast 3 character"
    });

    required(schemaPath.email,{
      message:'email is required'
    })

    email(schemaPath.email, {
      message:"please enter a valid email"
    })

    pattern(schemaPath.phone, /^[+]?[0-9\s()-]{7,20}$/,{
      message:"please enter a valid phone number"
    })

    minLength(schemaPath.phone,10,{
message:"minimum length should be 10"
    })

    required(schemaPath.username,{
      message:'user name is required'
    })

    required(schemaPath.website,{
      message:'website is required'
    })


  })

  onSubmit(event:Event):void{
    console.log(this.userForm().value())
    event.preventDefault();

    if(!this.userForm().valid()){

      return
    }
    else{

      const userData= this.UserFormModel();

      console.log("Form data", userData);
      this.store.createUser(userData);
      

    }
  }


}
