import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { getRxStorageWorker } from "rxdb-premium/plugins/storage-worker";
import { type RxDatabase, addRxPlugin, createRxDatabase } from "rxdb";
import { RxDBDevModePlugin } from "rxdb/plugins/dev-mode";
import testSchema from "../../common/testSchema";

import { RxDBMigrationSchemaPlugin } from "rxdb/plugins/migration-schema";
addRxPlugin(RxDBDevModePlugin);
addRxPlugin(RxDBMigrationSchemaPlugin);

const worker = new Worker(new URL("worker.js", import.meta.url).toString());
const storage = getRxStorageWorker({
  workerInput: () => worker,
});

const initDatabase = async () => {
  const db = await createRxDatabase({
    name: "test",
    storage,
  });

    console.log(testSchema);

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

function App() {
  const [count, setCount] = useState(0);

  useEffect(() => {}, []);

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

export default App;
