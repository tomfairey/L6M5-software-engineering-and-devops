import { useEffect, useState } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButtons, IonButton, IonIcon } from '@ionic/react';
import './Scan.scss';
import { useLocation } from 'react-router';
import { type IDetectedBarcode, outline, Scanner } from '@yudiel/react-qr-scanner';

import { ErrorBoundary } from "react-error-boundary";

import { pause, play } from 'ionicons/icons';
import { createScanlog } from '@modules/api';
import { useToast } from '@context/Toasts';
import PleaseLogin from './PleaseLogin';
import { useAuth } from '@context/Authentication';

const Scan: React.FC = () => {
	const auth = useAuth();
	const toast = useToast();

	const [scanResult, setScanResult] = useState<IDetectedBarcode>(),
		[scanningHold, setScanningHold] = useState<boolean>(false),
		[scanningEnabled, setScanningEnabled] = useState<boolean>(false),
		[scanningError, setScanningError] = useState<boolean>(false);

	const location = useLocation();

	const handleScan = (result: IDetectedBarcode[]) => {
		const code = result/*.filter((r) => r.format === 'qr_code')*/?.[0];

		if (code) {
			// Do something
			toast.present("Scanned: " + code.rawValue.substring(0, 32) + "...");
			setScanResult(code);
			console.log(code);
			createScanlog({
				scan_value: code.rawValue,
				format: code.format,
				valid: false,
				scan_time: new Date(),
				message: "Scanned, validation not currently implemented"
			})

		}
	}

	const enableScanning = (bool: boolean) => {
		setScanningError(false);
		return setScanningEnabled(bool);
	}

	const handleError = (error: any) => {
		setScanningHold(true);
		setScanningError(true);
		console.warn("Error from QR scanner component", error)
	}

	useEffect(() => {
		if (!scanningHold) enableScanning(location?.pathname === '/scan');
	}, [location?.pathname])

	useEffect(() => {
		enableScanning(!scanningHold);
	}, [scanningHold])

	if (!auth?.isLoggedIn)
		return <PleaseLogin page="Scan" />

	return (
		<IonPage>
			<IonHeader>
				<IonToolbar>
					<IonTitle>Scan</IonTitle>
					<IonButtons slot="end">
						<IonButton onClick={() => setScanningHold(!scanningHold)}>
							<IonIcon slot="icon-only" icon={scanningHold ? play : pause}></IonIcon>
						</IonButton>
					</IonButtons>
				</IonToolbar>
			</IonHeader>
			<IonContent fullscreen>
				<IonHeader collapse="condense">
					<IonToolbar>
						<IonTitle size="large">Scan</IonTitle>
					</IonToolbar>
				</IonHeader>
				<section>
					<article>
						<ErrorBoundary fallback={"Huh"}>
							<Scanner
								paused={!scanningEnabled}
								components={{
									audio: false,
									finder: false,
									zoom: true,
									torch: true,
									tracker: outline
								}}
								formats={[
									"qr_code",
									"rm_qr_code",
									"micro_qr_code",
									"matrix_codes"
								]}
								onScan={(result) => handleScan(result)}
								onError={(error) => handleError(error)}
								children={(!scanningEnabled || scanningError) && <button onClick={() => setScanningHold(false)}>Start scanning</button>} />
						</ErrorBoundary>
					</article>
					<article>
						{scanResult?.rawValue}
					</article>
				</section>
			</IonContent>
		</IonPage>
	);
};

export default Scan;
