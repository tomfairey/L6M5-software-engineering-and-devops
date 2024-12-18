import { useEffect, useRef, useState } from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonRefresher,
  IonRefresherContent,
  RefresherEventDetail
} from '@ionic/react';
import './Settings.scss';

import { useAuth } from '@context/Authentication';
import AuthenticationCard from '@components/AuthenticationCard';
import { useToast } from '@context/Toasts';
import UserManagementCard from '@components/UserManagementCard';

const Settings: React.FC = () => {
  const auth = useAuth();
  const toast = useToast();

  const pageRef = useRef(null);
  const [presentingElement, setPresentingElement] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setPresentingElement(pageRef.current);
  }, []);

  const handleRefresh = (event: CustomEvent<RefresherEventDetail>) => {
    try {
      auth.refreshSelf();
    } catch (e: Error | any) {
      console.log(e?.message);
      toast.present(e?.message);
    } finally {
      event.detail.complete();
    }
  };

  return (
    <IonPage ref={pageRef}>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Settings</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen={true}>
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent></IonRefresherContent>
        </IonRefresher>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Settings</IonTitle>
          </IonToolbar>
        </IonHeader>

        <AuthenticationCard />

        {auth.isLoggedIn && auth.user?.is_admin && <UserManagementCard presentingElement={presentingElement} />}

      </IonContent>
    </IonPage>
  );
};

export default Settings;
