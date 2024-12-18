import {
    IonContent,
    IonHeader,
    IonPage,
    IonRouterLink,
    IonTitle,
    IonToolbar
} from '@ionic/react';
import './PleaseLogin.scss';

const PleaseLogin = (props: { page: string }) => {
    const { page } = props;

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>{page}</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen>
                <IonHeader collapse="condense">
                    <IonToolbar>
                        <IonTitle size="large">{page}</IonTitle>
                    </IonToolbar>
                </IonHeader>

                <div className="container">
                    <strong>Please login to view this page</strong>
                    <p>Sorry, but you've gotta login for full functionality. Please go ahead and <IonRouterLink href="/login">login</IonRouterLink> now...</p>
                </div>
            </IonContent>
        </IonPage>
    );
};

export default PleaseLogin;
