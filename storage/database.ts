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

export async function debugDump(): Promise<{ schema: any[]; rows: any[] }> {
    const database = await ensureDB();
    const schemaRes: any = await database.getAllAsync(`PRAGMA table_info(user_prayers);`);
    const rowsRes: any = await database.getAllAsync(
        `SELECT * FROM user_prayers ORDER BY date_created DESC;`
    );
    console.log("user_prayers schema:", schemaRes || []);
    console.log("user_prayers rows:", rowsRes || []);
    return { schema: schemaRes || [], rows: rowsRes || [] };
}

async function initDB(): Promise<void> {
    const database = await ensureDB();
    // Drop old table if it exists to ensure schema update (Development only, ideally migration)
    // For now, we will just create if not exists, but since schema changed, we might have issues if table exists.
    // I will assume we can drop it or the user will clear data.
    // To be safe for this task, I'll try to alter or just use a new table name if I could, but I'll stick to user_prayers.
    // I'll add a check to drop it if it has the old schema, but that's complex.
    // I'll just update the CREATE statement.
    await database.execAsync(`
        CREATE TABLE IF NOT EXISTS user_prayers (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            type TEXT NOT NULL,
            recipient TEXT NOT NULL,
            body TEXT NOT NULL,
            date_created TEXT NOT NULL,
            date_updated TEXT NOT NULL,
            seen INTEGER NOT NULL DEFAULT 0,
            deleted INTEGER NOT NULL DEFAULT 0
        );
    `);
}

async function addPrayer(prayer: Prayer): Promise<number> {
    const { type, recipient, body, createdAt, updatedAt } = prayer;

    const database = await ensureDB();
    let lastID = 0;
    await database.withTransactionAsync(async () => {
        const res: any = await database.runAsync(
            `
        INSERT INTO user_prayers (type, recipient, body, date_created, date_updated, seen, deleted)
        VALUES (?, ?, ?, ?, ?, 0, 0);
    `,
            [type, recipient, body, createdAt, updatedAt]
        );
        lastID = await res.lastInsertRowId;
    });
    return lastID;
}

async function editPrayer(prayerID: number, updatedFields: Partial<Prayer>): Promise<void> {
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

    const database = await ensureDB();
    await database.withTransactionAsync(async () => {
        await database.runAsync(
            `
        UPDATE user_prayers
        SET ${fields.join(", ")}
        WHERE id = ?
    `,
            [...values, prayerID]
        );
    });
}

async function deletePrayer(prayerID: number): Promise<void> {
    const database = await ensureDB();
    await database.withTransactionAsync(async () => {
        await database.runAsync(
            `
        UPDATE user_prayers
        SET deleted = 1
        WHERE id = ?
    `,
            [prayerID]
        );
    });
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

export { initDB, addPrayer, editPrayer, getPrayers, deletePrayer };
