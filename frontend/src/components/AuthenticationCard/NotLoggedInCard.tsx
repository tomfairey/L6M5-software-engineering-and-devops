import { IonContent, IonHeader, IonToolbar, IonTitle, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonGrid, IonCol, IonRow, IonAvatar, IonButton } from "@ionic/react"

export default function NotLoggedInCard() {
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
                            <IonCardTitle>Not logged in</IonCardTitle>
                            <IonCardSubtitle>Login to access all features...</IonCardSubtitle>
                        </IonCol>
                        <IonCol size="auto">
                            <IonButton routerLink="/login">Login</IonButton>
                        </IonCol>
                    </IonRow>
                </IonGrid>
            </IonCardHeader>
        </IonCard>
    );
}