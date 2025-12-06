import { openDatabaseAsync, SQLiteDatabase } from "expo-sqlite";
import { DEFAULT_SETTINGS, DEFAULT_APP_DATA } from "../constants";

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

    await database.execAsync(`
        CREATE TABLE IF NOT EXISTS app_data (
            user_id INTEGER PRIMARY KEY,
            settings TEXT,
            app_data TEXT
        )
    `);

    interface CountResult {
        count: number;
    }

    // Ensure there is at least one row in app_data
    await database.withTransactionAsync(async () => {
        const existing = await database.getAllAsync<CountResult>(
            `SELECT COUNT(*) as count FROM app_data WHERE user_id = 1`
        );
        if (existing[0].count === 0) {
            await database.runAsync(
                `INSERT INTO app_data (user_id, settings, app_data) VALUES (1, ?, ?)`,
                [JSON.stringify(DEFAULT_SETTINGS), JSON.stringify(DEFAULT_APP_DATA)]
            );
        }
    });
}

async function getSettings(): Promise<Settings> {
    const database = await ensureDB();
    let res: any = null;
    await database.withTransactionAsync(async () => {
        res = await database.getFirstAsync(`
            SELECT settings FROM app_data WHERE user_id = 1
        `);
    });

    const settings = res && res.settings ? (JSON.parse(res.settings) as Settings) : null;

    return settings || DEFAULT_SETTINGS;
}

async function getAppData(): Promise<AppData> {
    const database = await ensureDB();
    let res: any = null;
    await database.withTransactionAsync(async () => {
        res = await database.getFirstAsync(`
            SELECT app_data FROM app_data WHERE user_id = 1
        `);
    });

    const appData = res && res.app_data ? (JSON.parse(res.app_data) as AppData) : null;

    return appData || DEFAULT_APP_DATA;
}

async function setAppData(updatedFields: Partial<AppData>): Promise<void> {
    let newAppData = await getAppData();
    newAppData = { ...newAppData, ...updatedFields };

    const database = await ensureDB();
    await database.withTransactionAsync(async () => {
        database.runAsync(
            `
            UPDATE app_data
            SET app_data = ?
            WHERE user_id = 1
        `,
            [JSON.stringify(newAppData)]
        );
    });
}

async function setSettings(updatedFields: Partial<Settings>): Promise<void> {
    let newSettings = await getAppData();
    newSettings = { ...newSettings, ...updatedFields };

    const database = await ensureDB();
    await database.withTransactionAsync(async () => {
        database.runAsync(
            `
            UPDATE app_data
            SET app_data = ?
            WHERE user_id = 1
        `,
            [JSON.stringify(newSettings)]
        );
    });
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

export {
    initDB,
    addPrayer,
    editPrayer,
    getPrayers,
    deletePrayer,
    getSettings,
    getAppData,
    setAppData,
    setSettings,
};
