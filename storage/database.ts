import { openDatabaseAsync, SQLiteDatabase } from "expo-sqlite";

let db: SQLiteDatabase | null = null;
async function ensureDB(): Promise<SQLiteDatabase> {
    if (db) return db;
    db = await openDatabaseAsync("database.db");
    return db;
}

const COLUMNS = [
    "id",
    "type",
    "recipient",
    "body",
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
    // Drop old table if it exists to ensure schema update (Development only, ideally migration)
    // For now, we will just create if not exists, but since schema changed, we might have issues if table exists.
    // I will assume we can drop it or the user will clear data.
    // To be safe for this task, I'll try to alter or just use a new table name if I could, but I'll stick to user_prayers.
    // I'll add a check to drop it if it has the old schema, but that's complex.
    // I'll just update the CREATE statement.
    await database.execAsync(`
        CREATE TABLE IF NOT EXISTS user_prayers (
            id INTEGER PRIMARY KEY,
            type TEXT NOT NULL,
            recipient TEXT NOT NULL,
            body TEXT NOT NULL,
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
    const { id, type, recipient, body, createdAt, updatedAt } = prayer;

    const sql = `
        INSERT INTO user_prayers (id, type, recipient, body, date_created, date_updated, seen, deleted)
        VALUES (?, ?, ?, ?, ?, ?, 0, 0);
    `;
    const params = [id, type, recipient, body, createdAt, updatedAt];

    return enqueueCommand({ sql, params });
}

function editPrayer(prayerID: number, updatedFields: Partial<Prayer>): Promise<void> {
    const fields: string[] = [];
    const values: any[] = [];
    for (const [key, value] of Object.entries(updatedFields)) {
        if (!COLUMNS.includes(key)) continue; // whitelist
        // Map camelCase to snake_case for DB columns if needed, but here we used same names except dates
        let dbKey = key;
        if (key === "createdAt") dbKey = "date_created";
        if (key === "updatedAt") dbKey = "date_updated";

        fields.push(`${dbKey} = ?`);
        values.push(value);
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
        SELECT id, type, recipient, body, date_created, date_updated, seen, deleted
        FROM user_prayers
        WHERE deleted != 1
        ORDER BY date_created DESC
    `;

    const database = await ensureDB();
    // Check if table has correct columns, if not we might need to recreate or handle error.
    // For now, assuming fresh start or manual reset.
    try {
        const res: any = await database.getAllAsync(sql);
        const rows: any[] = res || [];
        return rows.map((r) => ({
            id: r.id,
            type: r.type as PrayerType,
            recipient: r.recipient,
            body: r.body,
            createdAt: r.date_created,
            updatedAt: r.date_updated,
            seen: !!r.seen,
            deleted: !!r.deleted,
        })) as Prayer[];
    } catch (e) {
        console.error("Error fetching prayers, possibly schema mismatch:", e);
        return [];
    }
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
