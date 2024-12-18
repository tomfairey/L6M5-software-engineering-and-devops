import { useEffect, useState } from "react";
import { IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonButton, IonList, IonItem, IonGrid, IonRow, IonText, IonCol, IonInput, IonInputPasswordToggle, IonCheckbox } from "@ionic/react";
import { registerUser, validateEmail, validatePasswordStrength } from "@modules/api";

export default function UserManagementCard() {
    const [firstName, setFirstName] = useState<string>(''),
        [lastName, setLastName] = useState<string>(''),
        [username, setUsername] = useState<string>(''),
        [password, setPassword] = useState<string>(''),
        [confirmPassword, setConfirmPassword] = useState<string>(''),
        [isAdmin, setIsAdmin] = useState<boolean>(false);

    const onInput = (ev: Event, setState: (arg0: string) => void) => {
        const value = (ev.target as HTMLIonInputElement).value as string;

        setState(value);
    };

    const onCheckboxInput = (ev: Event, setState: (arg0: boolean) => void) => {
        const value = (ev.target as HTMLIonCheckboxElement).checked as boolean;

        setState(value);
    };

    const validate = () => {
        if (!username) {
            return false;
        }

        if (!validateEmail(username)) {
            return false;
        }

        if (password !== confirmPassword) {
            return false;
        }

        if (!validatePasswordStrength(password)) {
            return false;
        }

        return true;
    }

    const submit = () => {
        if (!validate()) throw new Error("Invalid form");

        registerUser({ email: username, password: password, first_name: firstName, last_name: lastName });
    }

    return (
        <IonCard>
            <IonCardHeader>
                <IonCardTitle>New user</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
                <IonList>
                    <IonItem>
                        <IonInput type="text" label="First name" labelPlacement="floating" placeholder="Inigo" value={firstName} onIonInput={(e) => onInput(e, setFirstName)} />
                        <IonInput type="text" label="Last name" labelPlacement="floating" placeholder="Montoya" value={lastName} onIonInput={(e) => onInput(e, setLastName)} />
                    </IonItem>
                    <IonItem>
                        <IonInput type="email" label="Email" labelPlacement="floating" placeholder="inigo.mon@to.ya" value={username} onIonInput={(e) => onInput(e, setUsername)} />
                    </IonItem>
                    <IonItem>
                        <IonInput type="password" label="Password" labelPlacement="floating" placeholder="Password" value={password} onIonInput={(e) => onInput(e, setPassword)}>
                            <IonInputPasswordToggle slot="end" />
                        </IonInput>
                    </IonItem>
                    <IonItem>
                        <IonInput type="password" label="Confirm password" labelPlacement="floating" placeholder="Confirm password" value={confirmPassword} onIonInput={(e) => onInput(e, setConfirmPassword)}>
                            <IonInputPasswordToggle slot="end" />
                        </IonInput>
                    </IonItem>
                    <IonItem>
                        <IonCheckbox value={isAdmin} onIonChange={(e) => onCheckboxInput(e, setIsAdmin)}>Admin user</IonCheckbox>
                    </IonItem>
                    <IonButton expand="block" onClick={() => submit()} disabled={!validate()}>Create</IonButton>
                </IonList>
            </IonCardContent>
        </IonCard>
    )
}