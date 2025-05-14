import { Result } from "@shared";

interface ServiceContext {
  anthropometryService: any;
  diagnosticService: any;
  growthChartService: any;
  growthTableService: any;
  indicatorService: any;
  clinicalService: any;
  biochemicalService: any;
  nutritionCareService: any;
  orientationService: any;
  unitService: any;
}

interface DataCategory {
  name: string;
  paths: string[];
  service?: any;
  processor?: (data: any) => Promise<void>;
}

export class PediatricDataManager {
  private readonly dataStructure: { [key: string]: DataCategory } = {
    anthropometry: {
      name: 'Anthropometric Measures',
      paths: ['processed_data/anthroMeasures/anthropometricMeasures.json']
    },
    growthCharts: {
      name: 'Growth Charts',
      paths: [
        'processed_data/charts/arm_circumference_boys_0_5.json',
        'processed_data/charts/arm_circumference_girls_0_5.json',
        'processed_data/charts/bmi_for_age_boys_0_5.json',
        'processed_data/charts/bmi_for_age_boys_5_19.json',
        'processed_data/charts/bmi_for_age_girls_0_5.json',
        'processed_data/charts/bmi_for_age_girls_5_19.json',
        'processed_data/charts/head_circumference_boys_0_5.json',
        'processed_data/charts/head_circumference_girls_0_5.json',
        'processed_data/charts/height_for_age_boys_5_19.json',
        'processed_data/charts/height_for_age_girls_5_19.json',
        'processed_data/charts/length_for_age_boys_0_5.json',
        'processed_data/charts/length_for_age_girls_0_5.json',
        'processed_data/charts/subscapular_skinfold_boys_0_5.json',
        'processed_data/charts/subscapular_skinfold_girls_0_5.json',
        'processed_data/charts/triceps_skinfold_boys_0_5.json',
        'processed_data/charts/triceps_skinfold_girls_0_5.json',
        'processed_data/charts/weight_for_age_boys_0_5.json',
        'processed_data/charts/weight_for_age_boys_5_10.json',
        'processed_data/charts/weight_for_age_girls_0_5.json',
        'processed_data/charts/weight_for_age_girls_5_10.json',
        'processed_data/charts/weight_for_height_boys_65_120.json',
        'processed_data/charts/weight_for_height_girls_65_120.json',
        'processed_data/charts/weight_for_length_boys_45_110.json',
        'processed_data/charts/weight_for_length_girls_45_110.json'
      ]
    },
    growthTables: {
      name: 'Growth Tables',
      paths: [
        'processed_data/tables/weight_for_height_nchs_unisex.json',
        'processed_data/tables/weight_for_length_who_2006_unisex.json'
      ]
    },
    indicators: {
      name: 'Growth Indicators',
      paths: ['processed_data/indicators/all_indicators.json'] // Only using the combined indicators file
    },
    clinicalReferences: {
      name: 'Clinical References',
      paths: ['processed_data/clinicalRef/clinicalRef.json']
    },
    biochemicalReferences: {
      name: 'Biochemical References',
      paths: [
        'processed_data/biochemicalRef/verified.json',
        'processed_data/biochemicalRef/notVerified.json'
      ]
    },
    diagnosticRules: {
      name: 'Diagnostic Rules',
      paths: ['processed_data/diagnosticRules/diagnosticRules.json']
    },
    nutritionCare: {
      name: 'Nutrition Care',
      paths: [
        'processed_data/appetiteTestRef/appetiteTestRef.json',
        'processed_data/milks/milks.json'
      ]
    },
    orientation: {
      name: 'Orientation References',
      paths: ['processed_data/orientationRef/orientationRef.json']
    },
    units: {
      name: 'Units',
      paths: ['processed_data/units/units.json']
    }
  };

  constructor(private serviceContext: ServiceContext) {
    this.initializeServices();
  }

  private initializeServices() {
    // Map services to their respective data categories
    this.dataStructure.anthropometry.service = this.serviceContext.anthropometryService;
    this.dataStructure.growthCharts.service = this.serviceContext.growthChartService;
    this.dataStructure.growthTables.service = this.serviceContext.growthTableService;
    this.dataStructure.indicators.service = this.serviceContext.indicatorService;
    this.dataStructure.clinicalReferences.service = this.serviceContext.clinicalService;
    this.dataStructure.biochemicalReferences.service = this.serviceContext.biochemicalService;
    this.dataStructure.diagnosticRules.service = this.serviceContext.diagnosticService;
    this.dataStructure.nutritionCare.service = this.serviceContext.nutritionCareService;
    this.dataStructure.orientation.service = this.serviceContext.orientationService;
    this.dataStructure.units.service = this.serviceContext.unitService;

    // Set up specific processors for each category
    this.setupProcessors();
  }

  private setupProcessors() {
    this.dataStructure.growthCharts.processor = async (data: any) => {
      return await this.serviceContext.growthChartService.saveData(data);
    };

    this.dataStructure.indicators.processor = async (data: any) => {
      return await this.serviceContext.indicatorService.saveData(data);
    };

    // Add other specific processors...
  }

  async processAndSaveData(files: Map<string, ArrayBuffer>): Promise<Result<void>> {
    try {
      for (const [category, config] of Object.entries(this.dataStructure)) {
        if (!config.service) {
          console.warn(`No service configured for category: ${category}`);
          continue;
        }

        for (const path of config.paths) {
          const fileData = files.get(path);
          if (!fileData) {
            console.warn(`File not found: ${path}`);
            continue;
          }

          try {
            const jsonData = JSON.parse(new TextDecoder().decode(fileData));
            
            if (config.processor) {
              await config.processor(jsonData);
            } else {
              await config.service.saveData(jsonData);
            }
            
            console.log(`Successfully processed and saved: ${path}`);
          } catch (error) {
            console.error(`Error processing ${path}:`, error);
          }
        }
      }
      return Result.ok();
    } catch (error) {
      return Result.fail(`Failed to process and save data: ${error}`);
    }
  }

  getDataStructure() {
    return this.dataStructure;
  }
}