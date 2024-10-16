import { exposeWorkerRxStorage } from "rxdb-premium/plugins/storage-worker";
import { getRxStorageOPFS } from "rxdb-premium/plugins/storage-opfs";
import { type RxDatabase, addRxPlugin, createRxDatabase } from "rxdb";
import testSchema from "../../common/testSchema.ts";

import { RxDBMigrationSchemaPlugin } from "rxdb/plugins/migration-schema";
addRxPlugin(RxDBMigrationSchemaPlugin);

const storage = getRxStorageOPFS({ usesRxDatabaseInWorker: true });

exposeWorkerRxStorage({
  storage: getRxStorageOPFS({ usesRxDatabaseInWorker: true }),
});

const initDatabase = async () => {
  const db = await createRxDatabase({
    name: "test",
    storage,
  });

  await db.addCollections({
    test: testSchema,
  });

    const docs = await db.test.find().exec();
    console.log(docs);

  return db;
};

initDatabase().then((db) => {
  console.log("Database initialized");
});
