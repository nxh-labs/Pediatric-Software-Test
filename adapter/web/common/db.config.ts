export const DB_CONFIG = {
   name: 'nutrition_app_db',
   version: 1,
   stores: {
      appetite_test_references: { keyPath: 'id', indexes: ['code'] },
      complications: { keyPath: 'id' },
      medicines: { keyPath: 'id', indexes: [{ name: 'code', unique: false }] },
      milks: { keyPath: 'id', indexes: ['code'] },
      orientation_references: { keyPath: 'id', indexes: ['code'] },
      patient_current_states: { keyPath: 'id' },
      daily_care_journals: { keyPath: 'id' },
      patient_care_sessions: { keyPath: 'id', indexes: [{ name: 'patientId', unique: false }] },
      nutritional_diagnostics: { keyPath: 'id', indexes: [{ name: 'patientId', unique: false }] },
      diagnostic_rules: { keyPath: 'id', indexes: ['code'] },
      anthropometric_measures: { keyPath: 'id', indexes: ['code'] },
      growth_reference_charts: { keyPath: 'id', indexes: ['code'] },
      growth_reference_tables: { keyPath: 'id', indexes: ['code'] },
      indicators: { keyPath: 'id', indexes: ['code'] },
      clinical_sign_references: { keyPath: 'id', indexes: ['code'] },
      nutritional_risk_factors: { keyPath: 'id', indexes: [{ name: 'clinicalSignCode', unique: true }] },
      biochemical_references: { keyPath: 'id', indexes: ['code'] },
      medical_records: { keyPath: 'id', indexes: [{ name: 'patientId', unique: true }] },
      patients: { keyPath: 'id' },
   }
};

export const createStoreIndexes = (db: IDBDatabase) => {
   Object.entries(DB_CONFIG.stores).forEach(([storeName, config]) => {
      if (db.objectStoreNames.contains(storeName)) {
         const store = db.createObjectStore(storeName, { keyPath: config.keyPath });
         if ('indexes' in config && config.indexes) {
            config.indexes.forEach(index => {
               const indexConfig = typeof index === 'string'
                  ? { name: index, unique: true }
                  : index;
               store.createIndex(indexConfig.name, indexConfig.name, { unique: indexConfig.unique });
            });
         }
      }
   });
};
