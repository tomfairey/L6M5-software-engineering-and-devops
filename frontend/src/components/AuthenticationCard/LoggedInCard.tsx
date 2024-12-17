import { IonContent, IonHeader, IonToolbar, IonTitle, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonGrid, IonCol, IonRow, IonAvatar, IonButton } from "@ionic/react"
import { useAuth } from "@context/Authentication"

export default function LoggedInCard() {
    const auth = useAuth();

    return (
        <IonCard>
            <IonCardHeader>
                <IonGrid style={{ width: "100%" }}>
                    <IonRow className="ion-justify-content-start ion-align-items-center">
                        <IonCol size="auto">
                            <IonAvatar>
                                <img src="https://ionicframework.com/docs/img/demos/avatar.svg" alt="Silhouette of a person's head" />
                            </IonAvatar>
                        </IonCol>
                        <IonCol>
                            <IonCardTitle>{auth.user?.first_name} {auth.user?.last_name}</IonCardTitle>
                            <IonCardSubtitle>Configure your settings below...</IonCardSubtitle>
                        </IonCol>
                        <IonCol size="auto">
                            <IonButton onClick={() => auth.logOut()}>Logout</IonButton>
                        </IonCol>
                    </IonRow>
                </IonGrid>
            </IonCardHeader>
        </IonCard>
    );
}