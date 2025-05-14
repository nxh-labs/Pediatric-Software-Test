import { DataCategory, ServiceConfig } from './types';

export class DataStructureManager {
  private readonly dataStructure: { [key: string]: DataCategory } = {
    anthropometry: {
      name: 'Anthropometric Measures',
      paths: ['processed_data/anthroMeasures/anthropometricMeasures.json']
    },
    charts: {
      name: 'Growth Charts',
      paths: [
        'processed_data/charts/arm_circumference_boys_0_5.json',
        'processed_data/charts/arm_circumference_girls_0_5.json',
        // ... autres chemins de graphiques
      ]
    },
    indicators: {
      name: 'Growth Indicators',
      paths: ['processed_data/indicators/all_indicators.json']
    },
    references: {
      name: 'Clinical References',
      paths: [
        'processed_data/appetiteTestRef/appetiteTestRef.json',
        'processed_data/clinicalRef/clinicalRef.json',
        'processed_data/biochemicalRef/verified.json',
        'processed_data/biochemicalRef/notVerified.json'
      ]
    },
    diagnostic: {
      name: 'Diagnostic Rules',
      paths: ['processed_data/diagnosticRules/diagnosticRules.json']
    },
    orientation: {
      name: 'Orientation References',
      paths: ['processed_data/orientationRef/orientationRef.json']
    },
    medicine: {
      name: 'Medicines',
      paths: ['processed_data/medicine/medicines.json']
    },
    units: {
      name: 'Units',
      paths: ['processed_data/units/units.json']
    }
  };

  constructor(private services: Map<string, any>) {
    this.initializeServices();
  }

  private initializeServices() {
    // Associer les services aux catégories
    if (this.services.has('AnthropometryService')) {
      this.dataStructure.anthropometry.service = this.services.get('AnthropometryService');
    }
    // ... autres services
  }

  async processAndSaveData(files: Map<string, ArrayBuffer>): Promise<void> {
    for (const [category, config] of Object.entries(this.dataStructure)) {
      if (!config.service) continue;

      for (const path of config.paths) {
        const fileData = files.get(path);
        if (!fileData) {
          console.warn(`File not found: ${path}`);
          continue;
        }

        try {
          const jsonData = JSON.parse(new TextDecoder().decode(fileData));
          await config.service.saveData(jsonData);
          console.log(`Successfully processed and saved: ${path}`);
        } catch (error) {
          console.error(`Error processing ${path}:`, error);
        }
      }
    }
  }

  getDataStructure() {
    return this.dataStructure;
  }
}