import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonAvatar,
  IonGrid,
  IonRow,
  IonCol,
  IonButton
} from '@ionic/react';
import './Settings.scss';

import { useAuth } from '../context/Authentication';
import AuthenticationCard from '../components/AuthenticationCard';

const Settings: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Settings</IonTitle>
        </IonToolbar>
      </IonHeader>
      {!useAuth()?.isLoggedIn ?
        <AuthenticationCard />
        :
        <>
          Innit mate
        </>
      }
    </IonPage>
  );
};

export default Settings;
