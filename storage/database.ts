import { openDatabaseAsync, SQLiteDatabase } from "expo-sqlite";

const db: SQLiteDatabase = await openDatabaseAsync("database.db");

const COLUMNS = [
    "id",
    "title",
    "description",
    "tags",
    "date_created",
    "date_updated",
    "seen",
    "deleted",
];

// Transactions queue table (persistent)
function initTransactionsTable(): Promise<void> {
    return db.execAsync(`
		CREATE TABLE IF NOT EXISTS transactions (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			command TEXT NOT NULL,
			attempts INTEGER NOT NULL DEFAULT 0,
			last_error TEXT
		);
	`);
}

async function initDB(): Promise<void> {
    // ensure transactions table exists and start worker
    await initTransactionsTable();

    await db.execAsync(`
		CREATE TABLE IF NOT EXISTS user_prayers (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			title TEXT NOT NULL,
			description TEXT NOT NULL,
			tags TEXT,
			date_created TEXT NOT NULL,
			date_updated TEXT NOT NULL,
			seen INTEGER NOT NULL DEFAULT 0,
			deleted INTEGER NOT NULL DEFAULT 0
		);
	`);

    // kick off queue worker to resume any pending commands
    startQueueWorker();
}

type CommandObj = { sql: string; params?: any[] };

async function enqueueCommand(commandObj: CommandObj): Promise<void> {
    const commandText = JSON.stringify(commandObj);
    await db.runAsync(`INSERT INTO transactions (command, attempts) VALUES (?, 0)`, commandText);
}

async function getPendingTransactions(): Promise<
    { id: number; command: string; attempts: number }[]
> {
    const res: any = await db.getAllAsync(
        `SELECT id, command, attempts FROM transactions ORDER BY id ASC;`
    );
    return res || [];
}

const MAX_RETRIES = 5;
let _queueWorkerRunning = false;

async function processPendingTransactions(): Promise<void> {
    if (_queueWorkerRunning) return;
    _queueWorkerRunning = true;
    try {
        const pending = await getPendingTransactions();
        for (const row of pending) {
            const id = row.id;
            let cmdObj: CommandObj | null = null;
            try {
                cmdObj = JSON.parse(row.command);
            } catch (err) {
                await db.runAsync(
                    `UPDATE transactions SET attempts = attempts + 1, last_error = ? WHERE id = ?`,
                    `invalid-json:${String(err)}`,
                    id
                );
                continue;
            }

            try {
                await db.withTransactionAsync(async () => {
                    const params = cmdObj?.params ?? [];
                    // spread params into runAsync so ? placeholders match
                    if (cmdObj) await db.runAsync(cmdObj.sql, ...params);
                });

                // success -> remove from queue
                await db.runAsync(`DELETE FROM transactions WHERE id = ?`, id);
            } catch (err: any) {
                const attempts = (row.attempts ?? 0) + 1;
                await db.runAsync(
                    `UPDATE transactions SET attempts = ?, last_error = ?, updated_at = ? WHERE id = ?`,
                    attempts,
                    String(err?.message ?? err),
                    new Date().toISOString(),
                    id
                );
                // optionally handle permanent failure after retries; leave row for inspection
                if (attempts >= MAX_RETRIES) {
                    // developer can inspect `last_error` or implement archival/dead-letter logic
                }
            }
        }
    } finally {
        _queueWorkerRunning = false;
    }
}

let _queueIntervalHandle: any = null;
function startQueueWorker(intervalMs = 500) {
    processPendingTransactions().catch(() => {});
    if (_queueIntervalHandle != null) clearInterval(_queueIntervalHandle);
    _queueIntervalHandle = setInterval(() => {
        processPendingTransactions().catch(() => {});
    }, intervalMs);
}

function stopQueueWorker() {
    if (_queueIntervalHandle != null) {
        clearInterval(_queueIntervalHandle);
        _queueIntervalHandle = null;
    }
}

// Replace immediate execution with enqueueing
function addPrayer(prayer: Prayer): Promise<void> {
    const { title, description, tags, createdAt, updatedAt, seen } = prayer;
    const tagsString = JSON.stringify(tags);
    const seenInt = seen ? 1 : 0;

    const sql = `
		INSERT INTO user_prayers (title, description, tags, date_created, date_updated, seen, deleted)
		VALUES (?, ?, ?, ?, ?, ?, 0);
	`;
    const params = [
        title,
        description,
        tagsString,
        createdAt.toISOString(),
        updatedAt.toISOString(),
        seenInt,
    ];

    return enqueueCommand({ sql, params });
}

function editPrayer(prayerID: number, updatedFields: Partial<Prayer>): Promise<void> {
    const fields: string[] = [];
    const values: any[] = [];
    for (const [key, value] of Object.entries(updatedFields)) {
        if (!COLUMNS.includes(key)) continue; // whitelist
        if (key === "tags") {
            fields.push(`${key} = ?`);
            values.push(JSON.stringify(value));
        } else {
            fields.push(`${key} = ?`);
            values.push(value);
        }
    }

    if (fields.length === 0) {
        return Promise.resolve(); // Nothing to update
    }

    const sql = `
		UPDATE user_prayers
		SET ${fields.join(", ")}
		WHERE id = ?
	`;
    const params = [...values, prayerID];

    return enqueueCommand({ sql, params });
}

function deletePrayer(prayerID: number): Promise<void> {
    const sql = `DELETE FROM user_prayers WHERE id = ?`;
    return enqueueCommand({ sql, params: [prayerID] });
}

export {
    initDB,
    addPrayer,
    editPrayer,
    deletePrayer,
    startQueueWorker,
    stopQueueWorker,
};
