import {Pool, PoolConfig, type PoolClient} from 'pg';

const connectionString: PoolConfig = {
	connectionString: process.env.DATABASE_URL,
};

const configObject: PoolConfig = {
	user: process.env.DATABASE_USER,
	password: process.env.DATABASE_PASSWORD,
	host: process.env.DATABASE_HOST,
	port: parseInt(process.env?.DATABASE_PORT || '5432'),
	database: process.env.DATABASE_NAME,
};

const config: PoolConfig = {
	...(connectionString?.connectionString ? connectionString : {}),
	...(Object.keys(configObject).length > 0 ? configObject : {}),
};

const pool = new Pool(config);

pool.on('error', (err, client) => {
	console.error('Unexpected error on idle client', err);
	process.exit(-1);
});

export function connect(): Promise<PoolClient> {
	return pool.connect();
}

export function end(): Promise<void> {
	return pool.end();
}

export default pool;
