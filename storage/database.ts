import { openDatabaseAsync, SQLiteDatabase } from "expo-sqlite";

let db: SQLiteDatabase | null = null;
async function ensureDB(): Promise<SQLiteDatabase> {
    if (db) return db;
    db = await openDatabaseAsync("database.db");
    return db;
}

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
async function initTransactionsTable(): Promise<void> {
    const database = await ensureDB();
    return database.execAsync(`
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

    const database = await ensureDB();
    await database.execAsync(`
        CREATE TABLE IF NOT EXISTS user_prayers (
            id INTEGER PRIMARY KEY,
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
    const database = await ensureDB();
    await database.runAsync(
        `INSERT INTO transactions (command, attempts) VALUES (?, 0)`,
        commandText
    );
}

async function getPendingTransactions(): Promise<
    { id: number; command: string; attempts: number }[]
> {
    const database = await ensureDB();
    const res: any = await database.getAllAsync(
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
                const database = await ensureDB();
                await database.runAsync(
                    `UPDATE transactions SET attempts = attempts + 1, last_error = ? WHERE id = ?`,
                    `invalid-json:${String(err)}`,
                    id
                );
                continue;
            }

            try {
                const database = await ensureDB();
                await database.withTransactionAsync(async () => {
                    const params = cmdObj?.params ?? [];
                    if (cmdObj) await database.runAsync(cmdObj.sql, ...params);
                });

                // success -> remove from queue
                const database2 = await ensureDB();
                await database2.runAsync(`DELETE FROM transactions WHERE id = ?`, id);
            } catch (err: any) {
                const attempts = (row.attempts ?? 0) + 1;
                const database = await ensureDB();
                await database.runAsync(
                    `UPDATE transactions SET attempts = ?, last_error = ?, updated_at = ? WHERE id = ?`,
                    attempts,
                    String(err?.message ?? err),
                    new Date().toISOString(),
                    id
                );
                if (attempts >= MAX_RETRIES) {
                    // optional dead-letter handling
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

function addPrayer(prayer: Prayer): Promise<void> {
    const { id, title, description, tags, createdAt, updatedAt } = prayer;
    const tagsString = JSON.stringify(tags);

    const sql = `
        INSERT INTO user_prayers (id, title, description, tags, date_created, date_updated, seen, deleted)
        VALUES (?, ?, ?, ?, ?, ?, 0, 0);
    `;
    const params = [id, title, description, tagsString, createdAt, updatedAt];

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

async function getPrayers(): Promise<Prayer[]> {
    const sql = `
        SELECT id, title, description, tags, date_created, date_updated, seen, deleted
        FROM user_prayers
        WHERE deleted != 1
        ORDER BY date_created DESC
    `;

    const database = await ensureDB();
    const res: any = await database.getAllAsync(sql);
    const rows: any[] = res || [];
    return rows.map((r) => ({
        ...r,
        tags: r.tags ? JSON.parse(r.tags) : [],
        date_created: r.date_created ? new Date(r.date_created) : undefined,
        date_updated: r.date_updated ? new Date(r.date_updated) : undefined,
        seen: !!r.seen,
        deleted: !!r.deleted,
    })) as Prayer[];
}

export {
    initDB,
    addPrayer,
    editPrayer,
    getPrayers,
    deletePrayer,
    startQueueWorker,
    stopQueueWorker,
};
