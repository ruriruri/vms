import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app.module';

// platformBrowserDynamic().bootstrapModule(AppModule,{providers: [{provide: LOCALE_ID, useValue: 'vi-VN'}]});
platformBrowserDynamic().bootstrapModule(AppModule);
// platformBrowserDynamic([{provide: LOCALE_ID, useValue: 'fr-FR'}]).bootstrapModule(AppModule, {providers: [{provide: LOCALE_ID, useValue: 'fr-FR'}]});
