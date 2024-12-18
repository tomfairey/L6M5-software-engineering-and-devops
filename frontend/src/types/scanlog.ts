export interface ScanLog {
	id: number;
	scan_value: string;
	valid: boolean;
	scan_time: Date;
	message?: string;
	format?: string;
	user_uuid?: string;
}
