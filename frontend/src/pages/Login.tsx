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

const Settings: React.FC = () => {
  const auth = useAuth();
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Login</IonTitle>
        </IonToolbar>
      </IonHeader>
      <h1>Login page: <i>Not yet configured</i></h1>
      <IonGrid>
        <IonRow>
          <IonCol><h3>Is logged in:</h3></IonCol>
          <IonCol><p>{JSON.stringify(auth?.isLoggedIn)}</p></IonCol>
        </IonRow>
        <IonRow>
          <IonCol><h3>User:</h3></IonCol>
          <IonCol><p>{JSON.stringify(auth?.user)}</p></IonCol>
        </IonRow>
      </IonGrid>
      <IonButton onClick={() => auth.logIn()}>Log "in"...</IonButton>
    </IonPage>
  );
};

export default Settings;
