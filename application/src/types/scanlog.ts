export enum ScanlogKey {
	ID = 'id',
	SCAN_VALUE = 'scan_value',
	VALID = 'valid',
	SCAN_TIME = 'scan_time',
	MESSAGE = 'message',
	FORMAT = 'format',
	USER_UUID = 'user_uuid',
}

export interface Scanlog {
	[ScanlogKey.ID]: number;
	[ScanlogKey.SCAN_VALUE]: string;
	[ScanlogKey.VALID]: boolean;
	[ScanlogKey.SCAN_TIME]: Date;
	[ScanlogKey.MESSAGE]?: string;
	[ScanlogKey.FORMAT]?: string;
	[ScanlogKey.USER_UUID]?: string;
}
