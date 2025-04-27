import { APP_INITIALIZER, ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { InitService } from './core/services/init.service';
import { lastValueFrom } from 'rxjs';

function initializeApp(initService : InitService) {
  return () => {
    return () => lastValueFrom(initService.init()).finally(() => {
      const splash = document.getElementById('initial-splash');
      if (splash) {
        splash.remove();
      }
    });
}
}
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { errorInterceptor } from './core/interceptors/error.interceptor';
import { loadingInterceptor } from './core/interceptors/loading.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),
    provideHttpClient(
      withInterceptors([authInterceptor, errorInterceptor, loadingInterceptor])
    ),
  ],
  // {

  // }
};
    provideHttpClient(),
  
  {
    provide: APP_INITIALIZER,
    useFactory: initializeApp,
    deps: [InitService],
    multi: true,
  }
