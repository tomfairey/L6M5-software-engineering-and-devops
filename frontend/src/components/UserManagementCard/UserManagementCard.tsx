import { useEffect, useState } from "react";
import { IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonButton, IonList, IonItem, IonGrid, IonRow, IonText, IonCol } from "@ionic/react";

import { getUsers } from "@modules/api"
import { User } from "@/types/user";

import ExistingUserManagementCard from "./ExistingUserManagementCard";
import NewUserManagementCard from "./NewUserManagementCard";

export default function UserManagementCard() {
    return (
        <>
            <ExistingUserManagementCard />
            <NewUserManagementCard />
        </>
    )
}