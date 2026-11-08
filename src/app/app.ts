import { Component, computed, effect, signal } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';

@Component({
  imports: [RouterOutlet, RouterLink],
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App {


// Creates writable reactive state.
//   count =signal<number>(0);

//   constructor(){
//     effect(()=>{
//       console.log("value is " +this.count())
//     })
//   }

//   increment(){
//   this.count.update((count:number)=> count+1)
//   }

// decrement(){
//   this.count.update((count:number)=> count-1)
//   }

//   reset(){
//     this.count.update((count:number)=>0)
//   }

// //   computed()
// // Creates derived state.
//   // Whenever price or quantity changes, total recalculates automatically.
//   totalValue= computed(()=> this.count()*5)

}
