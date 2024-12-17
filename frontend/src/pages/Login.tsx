import { useState } from 'react';
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
  IonButton,
  IonList,
  IonItem,
  IonInput,
  IonInputPasswordToggle
} from '@ionic/react';
import './Settings.scss';

import { useAuth } from '../context/Authentication';

const Settings: React.FC = () => {
  const auth = useAuth();

  const [username, setUsername] = useState<string>('admin@localhost.local'),
    [password, setPassword] = useState<string>('Password1!');

  const onInput = (ev: Event, setState: (arg0: string) => void) => {
    const value = (ev.target as HTMLIonInputElement).value as string;

    setState(value);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Login</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen={true}>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Login</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonList>
          <IonItem>
            <IonInput type="email" label="Email" labelPlacement="floating" placeholder="Email" value={username} onIonInput={(e) => onInput(e, setUsername)} />
          </IonItem>
          <IonItem>
            <IonInput type="password" label="Password" labelPlacement="floating" placeholder="Password" value={password} onIonInput={(e) => onInput(e, setPassword)}>
              <IonInputPasswordToggle slot="end" />
            </IonInput>
          </IonItem>
        </IonList>
        <IonButton onClick={() => auth.logIn(username, password)}>Log "in"...</IonButton>
      </IonContent>
    </IonPage>
  );
};

export default Settings;
