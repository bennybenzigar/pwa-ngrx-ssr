import { afterEveryRender, Component, computed, inject, PendingTasks } from '@angular/core';
import { UserStore } from '../../../store/user.store';
import { RouterLink } from '@angular/router';
import { UserApiService } from '../../../service/user-api.service';
import { firstValueFrom } from 'rxjs';
import { ChartConfigDTO } from '../../shared/chart.dto';
import { UserChartDTO } from '../../../models/user.model';
import {
  StackedClusteredColumnChartComponent
} from '../../shared/stacked-clustered-column-chart.component';

@Component({
  imports: [RouterLink, StackedClusteredColumnChartComponent],
  selector: 'app-users',
  styleUrl: './users.scss',
  templateUrl: './users.html',
})
export class Users {

  readonly store= inject(UserStore)
 private readonly pendingTasks = inject(PendingTasks);
   private readonly userApi = inject(UserApiService);

   
private userChartConfig = computed<ChartConfigDTO<UserChartDTO>>(() => {

  const users = this.store.users();

  return {
    height: 400,
    categoryField: 'name',
    showLegend: false,
    showLabels: true,

    data: users
      .filter((user): user is typeof user & { id: number } =>
        user.id !== undefined
      )
      .map(user => ({
        name: user.name,
        id: user.id,
      })),

    series: [
      {
        name: 'User ID',
        field: 'id',
        stacked: false,
      },
    ],
  };
});

   constructor(){
      afterEveryRender(() => {
      console.log('Angular finished rendering');
    });

   }
 ngOnInit(): void {

    console.log('SSR: Users component initialized');

    this.pendingTasks.run(async () => {

      console.log('SSR: Starting users API request');

      try {
        const users = await firstValueFrom(
          this.userApi.getUsers()
        );

        console.log('SSR: Users received:', users.length);

        this.store.setUsers(users);

      } catch (error) {
        console.error('SSR API ERROR:', error);
      }

    });
  }
}


