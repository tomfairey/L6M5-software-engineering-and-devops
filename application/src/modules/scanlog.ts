import {Scanlog, ScanlogKey} from '@/types/scanlog';
import database from '@modules/database';
import {PoolClient} from 'pg';

const allowedScanlogKeys = [
	ScanlogKey.ID,
	ScanlogKey.SCAN_VALUE,
	ScanlogKey.VALID,
	ScanlogKey.SCAN_TIME,
	ScanlogKey.MESSAGE,
	ScanlogKey.FORMAT,
];

export const filterScanlogTypes = (
	scanlog: Scanlog,
	extra: ScanlogKey[] = [],
): {[key: string]: any} => {
	Object.keys(scanlog)
		.filter(
			key =>
				![...allowedScanlogKeys, ...extra].includes(key as ScanlogKey),
		)
		.forEach((key: string) => {
			delete (scanlog as any)[key];
		});

	return scanlog;
};

export const performAddScanlog = async (
	scan_value: string,
	valid: boolean,
	scan_time: Date,
	message: string,
	format: string,
	user_uuid: string,
): Promise<Scanlog> => {
	try {
		return createScanlog({
			scan_value,
			valid,
			scan_time,
			message,
			format,
			user_uuid,
		});
	} catch (e) {
		console.error(e);
	}

	throw new Error('Unexpected error');
};

const createScanlog = async (
	{
		scan_value,
		valid,
		scan_time,
		message,
		format,
		user_uuid,
	}: {
		scan_value: string;
		valid: boolean;
		scan_time: Date;
		message: string;
		format: string;
		user_uuid: string;
	},
	client?: PoolClient,
): Promise<Scanlog> => {
	let managedClient = false;

	if (!client) {
		client = await database.connect();
		managedClient = true;
	}

	const {rows} = await client.query(
		`INSERT INTO
            scanlog
            (
                ${ScanlogKey.SCAN_VALUE},
                ${ScanlogKey.VALID},
                ${ScanlogKey.SCAN_TIME},
                ${ScanlogKey.MESSAGE},
                ${ScanlogKey.FORMAT},
                ${ScanlogKey.USER_UUID}
            )
        VALUES
            (
                $1,
                $2,
                $3,
                $4,
                $5,
                $6
            )
        RETURNING *;`,
		[scan_value, valid, scan_time, message, format, user_uuid],
	);

	if (managedClient) {
		client.release();
	}

	if (rows.length === 1) {
		return {
			[ScanlogKey.ID]: rows[0][ScanlogKey.ID],
			[ScanlogKey.SCAN_VALUE]: rows[0][ScanlogKey.SCAN_VALUE],
			[ScanlogKey.VALID]: rows[0][ScanlogKey.VALID],
			[ScanlogKey.SCAN_TIME]: rows[0][ScanlogKey.SCAN_TIME],
			[ScanlogKey.MESSAGE]: rows[0][ScanlogKey.MESSAGE],
			[ScanlogKey.FORMAT]: rows[0][ScanlogKey.FORMAT],
			[ScanlogKey.USER_UUID]: rows[0][ScanlogKey.USER_UUID],
		};
	}

	throw new Error('Scanlog not created');
};

export const getAllScanlogs = async (
	uuid?: string,
	limit: number = 10,
	offset: number = 0,
	client?: PoolClient,
): Promise<Scanlog[]> => {
	let managedClient = false;

	if (!client) {
		client = await database.connect();
		managedClient = true;
	}

	const {rows} = await client.query(
		`SELECT
            ${ScanlogKey.ID},
            ${ScanlogKey.SCAN_VALUE},
            ${ScanlogKey.VALID},
            ${ScanlogKey.SCAN_TIME},
            ${ScanlogKey.MESSAGE},
            ${ScanlogKey.FORMAT},
            ${ScanlogKey.USER_UUID}
        FROM
            scanlog
        ${uuid ? `WHERE ${ScanlogKey.USER_UUID} = $3` : ''}
        ORDER BY ${ScanlogKey.SCAN_TIME} DESC
        LIMIT $1
        OFFSET GREATEST($2, 0);`,
		[limit, offset, ...(uuid ? [uuid] : [])],
	);

	if (managedClient) {
		client.release();
	}

	return rows.map(row => ({
		[ScanlogKey.ID]: row[ScanlogKey.ID],
		[ScanlogKey.SCAN_VALUE]: row[ScanlogKey.SCAN_VALUE],
		[ScanlogKey.VALID]: row[ScanlogKey.VALID],
		[ScanlogKey.SCAN_TIME]: row[ScanlogKey.SCAN_TIME],
		[ScanlogKey.MESSAGE]: row[ScanlogKey.MESSAGE],
		[ScanlogKey.FORMAT]: row[ScanlogKey.FORMAT],
		[ScanlogKey.USER_UUID]: row[ScanlogKey.USER_UUID],
	}));
};
