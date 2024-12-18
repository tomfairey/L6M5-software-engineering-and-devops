import { useEffect, useState } from "react";
import { IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonButton, IonList, IonItem, IonGrid, IonRow, IonText, IonCol, IonModal, IonHeader, IonToolbar, IonButtons, IonTitle, IonContent, IonInput, IonInputPasswordToggle, IonCheckbox, IonIcon, IonPopover, IonProgressBar, useIonAlert } from "@ionic/react";

import { deleteUser, editUser, getUsers, validateEmail, validatePasswordStrength } from "@modules/api"
import { User } from "@/types/user";
import { shieldHalfOutline } from "ionicons/icons";

export default function UserManagementCard(props: { presentingElement: HTMLElement | null }) {
    const { presentingElement } = props;

    const [users, setUsers] = useState<User[]>([]);

    const [presentAlert] = useIonAlert();

    const updateUsers = async () => {
        setUsers(await getUsers());
    }

    useEffect(() => {
        updateUsers();
    }, []);

    const [isOpen, setIsOpen] = useState(false),
        [isLoading, setIsLoading] = useState(false);

    const
        [originalUser, setOriginalUser] = useState<User | null>(null),
        [uuid, setUuid] = useState<string>(''),
        [firstName, setFirstName] = useState<string>(''),
        [lastName, setLastName] = useState<string>(''),
        [username, setUsername] = useState<string>(''),
        [password, setPassword] = useState<string>(''),
        [confirmPassword, setConfirmPassword] = useState<string>(''),
        [isAdmin, setIsAdmin] = useState<boolean>(false);

    const deleteAlert = (user: User) => {
        presentAlert({
            header: 'Delete User',
            subHeader: 'Are you sure you want to delete this user?',
            message: `This action is final and cannot be undone, please confirm you would like to delete user "${user?.first_name || ""} ${user?.last_name || ""}" (${user.email})`,
            buttons: [{
                text: 'Cancel',
                role: 'cancel',
                handler: () => { }
            }, {
                text: 'Delete',
                role: 'destructive',
                handler: () => {
                    deleteUser(user?.uuid).then(() => {
                        updateUsers();
                    }).catch((e) => {
                        presentAlert({
                            header: 'Unsuccessful deletion',
                            subHeader: 'The operation may have failed, please refresh and try again later',
                            message: `Error: ${e?.message || "Unknown error"}`,
                        });
                    }).finally(() => {
                        getUsers();
                    });
                }
            }],
        });
    };

    const editModal = (user: User) => {
        setOriginalUser(user);
        setUuid(user.uuid);
        setUsername('');
        setFirstName('');
        setLastName('');
        setPassword('');
        setConfirmPassword('');
        setIsAdmin(user?.is_admin || false);
        setIsOpen(true);
    }

    const onInput = (ev: Event, setState: (arg0: string) => void) => {
        const value = (ev.target as HTMLIonInputElement).value as string;

        setState(value);
    };

    const onCheckboxInput = (ev: Event, setState: (arg0: boolean) => void) => {
        const value = (ev.target as HTMLIonCheckboxElement).checked as boolean;

        setState(value);
    };

    const validate = () => {
        if (username && !validateEmail(username)) {
            return false;
        }

        if (password && password !== confirmPassword) {
            return false;
        }

        if (password && !validatePasswordStrength(password)) {
            return false;
        }

        if (isAdmin != originalUser?.is_admin) {
            return true;
        }

        return !!(username || password || firstName || lastName || isAdmin != originalUser?.is_admin);
    }

    const submit = () => {
        if (!validate()) throw new Error("Invalid form");

        setIsLoading(true);

        editUser({
            uuid: uuid,
            email: username && username != originalUser?.email ? username : undefined,
            password: password || undefined,
            first_name: firstName && firstName != originalUser?.first_name ? firstName : undefined,
            last_name: lastName && lastName != originalUser?.last_name ? lastName : undefined,
            is_admin: isAdmin != originalUser?.is_admin ? isAdmin : undefined
        }).then(() => {
            setIsOpen(false);
            updateUsers();
        }).catch((e) => {
        }).finally(() => {
            setIsLoading(false);
        });
    }

    return (
        <IonCard>
            <IonCardHeader>
                <IonCardTitle>User management</IonCardTitle>
                <IonCardSubtitle>Configure users below...</IonCardSubtitle>
                <IonButton onClick={() => updateUsers()}>Get all</IonButton>
            </IonCardHeader>
            <IonCardContent>
                <IonList>
                    {users.map((user, index) => (
                        <IonItem key={index} className="">
                            <IonGrid>
                                <IonRow>
                                    <IonText>
                                        <h2>
                                            {user.first_name} {user.last_name}
                                            {user.is_admin &&
                                                <>
                                                    <IonIcon id={`admin-icon-${index}`} icon={shieldHalfOutline} />
                                                    <IonPopover trigger={`admin-icon-${index}`} triggerAction="hover" translucent={true}>
                                                        <IonContent class="ion-padding">
                                                            This user is an administrator
                                                        </IonContent>
                                                    </IonPopover>
                                                </>}
                                        </h2>
                                    </IonText>
                                </IonRow>
                                <IonRow>
                                    <IonText>
                                        <p>{user.email}</p>
                                    </IonText>
                                </IonRow>
                                <IonRow className="ion-justify-content-end">
                                    <IonButton onClick={() => editModal(user)}>Edit</IonButton>
                                    <IonButton color="danger" onClick={() => deleteAlert(user)}>Delete</IonButton>
                                </IonRow>
                            </IonGrid>
                        </IonItem>
                    ))}
                    <IonModal isOpen={isOpen} onWillDismiss={() => setIsOpen(false)} presentingElement={presentingElement!}>
                        <IonHeader>
                            <IonToolbar>
                                <IonButtons slot="start">
                                    <IonButton onClick={() => setIsOpen(false)}>Cancel</IonButton>
                                </IonButtons>
                                <IonTitle className="ion-justify-content-center">Edit user</IonTitle>
                                <IonButtons slot="end">
                                    <IonButton strong={true} disabled={!validate()} onClick={() => submit()}>
                                        Update
                                    </IonButton>
                                </IonButtons>
                                {isLoading && <IonProgressBar type="indeterminate"></IonProgressBar>}
                            </IonToolbar>
                        </IonHeader>
                        <IonContent className="ion-padding">
                            <IonItem>
                                <IonInput type="text" label="First name" labelPlacement="floating" placeholder="Inigo" value={firstName || originalUser?.first_name} onIonInput={(e) => onInput(e, setFirstName)} />
                                <IonInput type="text" label="Last name" labelPlacement="floating" placeholder="Montoya" value={lastName || originalUser?.last_name} onIonInput={(e) => onInput(e, setLastName)} />
                            </IonItem>
                            <IonItem>
                                <IonInput type="email" label="Email" labelPlacement="floating" placeholder="inigo.mon@to.ya" value={username || originalUser?.email} onIonInput={(e) => onInput(e, setUsername)} />
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
                                <IonCheckbox checked={isAdmin != originalUser?.is_admin ? isAdmin : originalUser?.is_admin} onIonChange={(e) => onCheckboxInput(e, setIsAdmin)}>Admin user</IonCheckbox>
                            </IonItem>
                        </IonContent>
                    </IonModal>
                </IonList>
            </IonCardContent>
        </IonCard>
    )
}