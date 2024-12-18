import { IonContent, IonHeader, IonToolbar, IonTitle, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonGrid, IonCol, IonRow, IonAvatar, IonButton } from "@ionic/react"
import { useAuth } from "@context/Authentication"
import LoggedInCard from "./LoggedInCard";
import NotLoggedInCard from "./NotLoggedInCard";

export default function AuthenticationCard() {
    const auth = useAuth();
    return (
        auth?.isLoggedIn ? <LoggedInCard /> : <NotLoggedInCard />
    )
}