import { useEventBus } from "domain-eventrix/react";
import Button from "./Button";
import { createStoreIndexes, DB_CONFIG, IndexedDBConnection, PediatricAppProvider } from "../adapter";
import { useEffect, useState } from "react";
import { IEventBus } from "@shared";
import InitApp from "./InitApp";

function App() {
   const [dbOpened, setDbOpened] = useState(false);

   const eventBus = useEventBus();
   const dbConnection = new IndexedDBConnection(DB_CONFIG.name, DB_CONFIG.version, (db: IDBDatabase) => createStoreIndexes(db));

   useEffect(() => {
      async function initialize() {
         try {
            await dbConnection.open();
            setDbOpened(true);
         } catch (error) {
            console.error("Initialization error:", error);
         }
      }

      initialize();

      return () => {
         dbConnection.close();
         setDbOpened(false);
      };
   }, []);

   if (!dbOpened) return <div>Initializing database...</div>;

   return (
      <PediatricAppProvider dbConnection={dbConnection} eventBus={eventBus as unknown as IEventBus}>
         <div>
            <InitApp />
         </div>
      </PediatricAppProvider>
   );
}

export default App;
