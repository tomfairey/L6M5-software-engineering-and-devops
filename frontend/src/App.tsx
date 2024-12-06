import { Redirect, Route } from 'react-router-dom';
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { ellipse, square, triangle, cogOutline, settingsSharp, barcodeSharp, listOutline, listSharp } from 'ionicons/icons';
import Tab1 from './pages/Tab1';
import Tab2 from './pages/Tab2';
import Tab3 from './pages/Tab3';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* import '@ionic/react/css/palettes/dark.always.css'; */
/* import '@ionic/react/css/palettes/dark.class.css'; */
import '@ionic/react/css/palettes/dark.system.css';

/* Theme variables */
import './theme/variables.css';

setupIonicReact();

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <IonTabs>
        <IonRouterOutlet>
          <Route exact path="/history">
            <Tab1 />
          </Route>
          <Route exact path="/scan">
            <Tab2 />
          </Route>
          <Route path="/settings">
            <Tab3 />
          </Route>
          <Route path="/login">
            <>
              <h1>Login page: <i>Not yet routing configured</i></h1>
            </>
          </Route>
          <Route exact path="/">
            <Redirect to="/scan" />
          </Route>
          <Route exact path="/">
            <Redirect to="/scan" />
          </Route>
          <Route render={() => <Redirect to="/" />} />
        </IonRouterOutlet>
        <IonTabBar slot="bottom">
          <IonTabButton tab="history" href="/history">
            <IonIcon aria-hidden="true" icon={triangle} md={listSharp} ios={listOutline} />
            <IonLabel>History</IonLabel>
          </IonTabButton>
          <IonTabButton tab="scan" href="/scan">
            <IonIcon aria-hidden="true" icon={/* ellipse */ barcodeSharp} />
            <IonLabel>Scan</IonLabel>
          </IonTabButton>
          <IonTabButton tab="settings" href="/settings">
            {/* <IonIcon aria-hidden="true" icon={square} /> */}
            <IonIcon aria-hidden="true" icon={square} md={settingsSharp} ios={cogOutline} />
            <IonLabel>Settings</IonLabel>
          </IonTabButton>
        </IonTabBar>
      </IonTabs>
    </IonReactRouter>
  </IonApp>
);

export default App;