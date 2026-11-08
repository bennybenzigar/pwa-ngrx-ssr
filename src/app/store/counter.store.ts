import { computed } from "@angular/core"
import { patchState, signalStore, withComputed, withMethods, withState } from "@ngrx/signals"

interface counterSignal {
    count:number
}

const initialState:counterSignal= {count:0}
export const counterStore= signalStore(
    { providedIn: 'root' },
// 1. Define state
    withState(initialState),
    // 1. Define state
    withComputed(({count})=>({
        doubleCount:computed(()=> count()*2),
        isPositive:computed(()=> count()>0)
    })),


    // 3. Define methods

    withMethods((store)=>({

        increment(){
            patchState(store,{
                count:store.count()+1
            })

        },
        decrement(){
            patchState(store,{
                count:store.count()-1

            })

        },
        reset(){
            patchState(store, {
              count:  0
            })

        }


    }))

   
)

// rx methord allows us to create reactive mehotds inside signal stire using rxjs opetators
