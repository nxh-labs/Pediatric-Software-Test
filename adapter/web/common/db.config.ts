export const createStoreIndexes = (db: IDBDatabase) => {
   // Nutrition Care Stores
   if (db.objectStoreNames.contains("appetite_test_references")) {
      const store = db.createObjectStore("appetite_test_references", { keyPath: "id" });
      store.createIndex("id", "id", { unique: true });
      store.createIndex("code", "code", { unique: true });
   }

   if (db.objectStoreNames.contains("complications")) {
      const store = db.createObjectStore("complications", { keyPath: "id" });
      store.createIndex("id", "id", { unique: true });
   }

   if (db.objectStoreNames.contains("medicines")) {
      const store = db.createObjectStore("medicines", { keyPath: "id" });
      store.createIndex("id", "id", { unique: true });
      store.createIndex("code", "code", { unique: false });
   }

   if (db.objectStoreNames.contains("milks")) {
      const store = db.createObjectStore("milks", { keyPath: "id" });
      store.createIndex("id", "id", { unique: true });
      store.createIndex("code", "code", { unique: true });
   }

   if (db.objectStoreNames.contains("orientation_references")) {
      const store = db.createObjectStore("orientation_references", { keyPath: "id" });
      store.createIndex("id", "id", { unique: true });
      store.createIndex("code", "code", { unique: true });
   }

   if (db.objectStoreNames.contains("patient_current_states")) {
      const store = db.createObjectStore("patient_current_states", { keyPath: "id" });
      store.createIndex("id", "id", { unique: true });
   }
   if (db.objectStoreNames.contains("daily_care_journals")) {
      const store = db.createObjectStore("daily_care_journals", { keyPath: "id" });
      store.createIndex("id", "id", { unique: true });
   }
   if (db.objectStoreNames.contains("patient_care_sessions")) {
      const store = db.createObjectStore("patient_care_sessions", { keyPath: "id" });
      store.createIndex("id", "id", { unique: true });
      store.createIndex("patientId", "patientId", { unique: false });
   }

   // Diagnostic Stores
   if (db.objectStoreNames.contains("nutritional_diagnostics")) {
      const store = db.createObjectStore("nutritional_diagnostics", { keyPath: "id" });
      store.createIndex("id", "id", { unique: true });
      store.createIndex("patientId", "patientId", { unique: false });
   }
   if (db.objectStoreNames.contains("diagnostic_rules")) {
      const store = db.createObjectStore("diagnostic_rules", { keyPath: "id" });
      store.createIndex("id", "id", { unique: true });
      store.createIndex("code", "code", { unique: false });
   }

   if (db.objectStoreNames.contains("anthropometric_measures")) {
      const store = db.createObjectStore("anthropometric_measures", { keyPath: "id" });
      store.createIndex("id", "id", { unique: true });
      store.createIndex("code", "code", { unique: false });
   }
   if (db.objectStoreNames.contains("growth_reference_charts")) {
      const store = db.createObjectStore("growth_reference_charts", { keyPath: "id" });
      store.createIndex("id", "id", { unique: true });
      store.createIndex("code", "code", { unique: false });
   }
   if (db.objectStoreNames.contains("growth_reference_tables")) {
      const store = db.createObjectStore("growth_reference_tables", { keyPath: "id" });
      store.createIndex("id", "id", { unique: true });
      store.createIndex("code", "code", { unique: false });
   }
   if (db.objectStoreNames.contains("indicators")) {
      const store = db.createObjectStore("indicators", { keyPath: "id" });
      store.createIndex("id", "id", { unique: true });
      store.createIndex("code", "code", { unique: false });
   }

   if (db.objectStoreNames.contains("clinical_sign_references")) {
      const store = db.createObjectStore("clinical_sign_references", { keyPath: "id" });
      store.createIndex("id", "id", { unique: true });
      store.createIndex("code", "code", { unique: true });
   }
   if (db.objectStoreNames.contains("nutritional_risk_factors")) {
      const store = db.createObjectStore("nutritional_risk_factors", { keyPath: "id" });
      store.createIndex("id", "id", { unique: true });
      store.createIndex("clinicalSignCode", "clinicalSignCode", { unique: true });
   }
   if (db.objectStoreNames.contains("biochemical_references")) {
      const store = db.createObjectStore("biochemical_references", { keyPath: "id" });
      store.createIndex("id", "id", { unique: true });
      store.createIndex("code", "code", { unique: true });
   }

   // Medical Records Store
   if (db.objectStoreNames.contains("medical_records")) {
      const store = db.createObjectStore("medical_records", { keyPath: "id" });
      store.createIndex("id", "id", { unique: true });
      store.createIndex("patientId", "patientId", { unique: true });
   }

   // Patient Store
   if (db.objectStoreNames.contains("patients")) {
      const store = db.createObjectStore("patients", { keyPath: "id" });
      store.createIndex("id", "id", { unique: true });
   }

   // Units
   if (db.objectStoreNames.contains("medical_records")) {
      const store = db.createObjectStore("medical_records", { keyPath: "id" });
      store.createIndex("id", "id", { unique: true });
      store.createIndex("code", "code", { unique: true });
      store.createIndex("type", "type", { unique: true });
   }
};
