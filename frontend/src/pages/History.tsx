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
	IonInfiniteScroll,
	IonInfiniteScrollContent,
	IonProgressBar,
	IonRefresher,
	IonRefresherContent,
	IonToggle
} from '@ionic/react';
import './History.scss';
import { getAllScanlogs } from '@modules/api';
import { useAuth } from '@context/Authentication';
import { useEffect, useState } from 'react';
import { IonInfiniteScrollCustomEvent, IonRefresherCustomEvent, RefresherEventDetail } from '@ionic/core';
import { ScanLog } from '@/types/scanlog';
import PleaseLogin from './PleaseLogin';

const History: React.FC = () => {
	const auth = useAuth();
	const [scanlogs, setScanlogs] = useState<ScanLog[]>([]),
		[endWorking, setEndWorking] = useState<boolean>(false),
		[startWorking, setStartWorking] = useState<boolean>(false),
		[itemLimit, setItemLimit] = useState<number>(15),
		[filterByUser, setFilterByUser] = useState<boolean>(false);

	const handleAddingScanlogs = (newScanlogs: ScanLog[]) => {
		// Get all IDs, only once
		const keys = [...new Set([...scanlogs, ...newScanlogs].map((scanlog) => scanlog.id))];

		// Filter out duplicates
		const scanlogsMap = new Map<number, ScanLog>();
		keys.forEach((key) => {
			const scanlog = scanlogs.find((scanlog) => scanlog.id === key) || newScanlogs.find((scanlog) => scanlog.id === key);
			if (scanlog) scanlogsMap.set(key, scanlog);
		});

		return setScanlogs([...scanlogsMap.values()].sort((a, b) => b.id - a.id));
	}

	const fetchScanlogsFromIndex = async (index: number) => {
		if (!auth?.isLoggedIn) return;

		const newScanlogs = await getAllScanlogs(filterByUser, itemLimit, index);

		handleAddingScanlogs(newScanlogs)
	};

	const infiniteScrollStartHandler = (e: IonInfiniteScrollCustomEvent<void>) => {
		if (startWorking) return;

		setStartWorking(true);

		fetchScanlogsFromIndex(0).then(() => {
		}).catch(() => { }).finally(() => {
			e.target.complete();
			setStartWorking(false);
		});
	};

	const infiniteScrollEndHandler = (e: IonInfiniteScrollCustomEvent<void>) => {
		if (endWorking) return;

		setEndWorking(true);

		fetchScanlogsFromIndex(scanlogs.length).then(() => {
		}).catch(() => { }).finally(() => {
			e.target.complete();
			setEndWorking(false);
		});
	};

	const handleRefresh = (e: IonRefresherCustomEvent<RefresherEventDetail>) => {
		fetchScanlogsFromIndex(0).then(() => {
		}).catch(() => { }).finally(() => {
			e.detail.complete();
		});
	}

	const onCheckboxInput = (ev: Event, setState: (arg0: boolean) => void) => {
		const value = (ev.target as HTMLIonCheckboxElement).checked as boolean;

		setState(value);
	};

	useEffect(() => {
		fetchScanlogsFromIndex(0);
	}, [itemLimit]);

	useEffect(() => {
		if (scanlogs)
			setScanlogs([]);
		fetchScanlogsFromIndex(0);
	}, [filterByUser]);

	if (!auth?.isLoggedIn)
		return <PleaseLogin page="History" />

	return (
		<IonPage>
			<IonHeader>
				<IonToolbar>
					<IonTitle>History</IonTitle>
					{(startWorking || endWorking) && <IonProgressBar type="indeterminate"></IonProgressBar>}
				</IonToolbar>
			</IonHeader>
			<IonContent fullscreen>
				<IonInfiniteScroll style={{ position: "absolute" }} onIonInfinite={(e) => infiniteScrollStartHandler(e)}>
					<IonInfiniteScrollContent></IonInfiniteScrollContent>
				</IonInfiniteScroll>

				<IonRefresher slot="fixed" onIonRefresh={(e) => handleRefresh(e)}>
					<IonRefresherContent></IonRefresherContent>
				</IonRefresher>

				<IonHeader collapse="condense">
					<IonToolbar>
						<IonTitle size="large">History</IonTitle>
					</IonToolbar>
				</IonHeader>

				{
					auth.user.is_admin &&
					<IonToggle className="ion-padding" labelPlacement="start" checked={filterByUser} onIonChange={(e) => onCheckboxInput(e, setFilterByUser)}>Show all users</IonToggle>}

				{scanlogs.map((scanlog, i) => (
					<IonCard key={i} >
						<IonCardHeader>
							<IonCardTitle>{scanlog?.scan_time?.toLocaleString()}</IonCardTitle>
							<IonCardSubtitle>{scanlog?.format}</IonCardSubtitle>
						</IonCardHeader>
						<IonCardContent>
							<p>ID: {scanlog.id}</p>
							<p>Scan Value: {scanlog.scan_value}</p>
							<p>Valid: {scanlog?.valid ? "Yes" : "No"}</p>
							<p>Message: {scanlog?.message}</p>
							<p>User: {scanlog?.user_uuid === undefined || scanlog?.user_uuid == auth.user?.uuid ? "Me" : scanlog?.user_uuid == null ? "Deleted user" : scanlog?.user_uuid}</p>
						</IonCardContent>
					</IonCard>
				))}

				<IonInfiniteScroll onIonInfinite={(e) => infiniteScrollEndHandler(e)}>
					<IonInfiniteScrollContent></IonInfiniteScrollContent>
				</IonInfiniteScroll>

			</IonContent>
		</IonPage >
	);
};

export default History;
