import { formatError, Result } from "@shared";
import React, { useEffect, useRef, useState } from "react";
import { DataFileManager } from "./scripts";
import { PediatricSoftwareDataManager, usePediatricApp, InitializationProgress } from "../adapter";
import "./InitApp.css";

function InitApp() {
   const [downloadStatus, setDownloadStatus] = useState<string>("");
   const [currentStage, setCurrentStage] = useState<string>("");
   const [progress, setProgress] = useState<number>(0);
   const [isComplete, setIsComplete] = useState<boolean>(false);
   const [error, setError] = useState<string | null>(null);
   const [initStages, setInitStages] = useState<string[]>([]);
   const localState: { isInitialize: boolean } = localStorage.getItem("state")
      ? JSON.parse(localStorage.getItem("state") as string)
      : { isInitialize: false };
   const isInitialize = useRef(localState.isInitialize);

   const { diagnosticServices, nutritionCareServices, unitService } = usePediatricApp();

   const pediatricDataManager = new PediatricSoftwareDataManager({
      anthropometricService: diagnosticServices.anthropometricMeasure,
      appetiteTestRefService: nutritionCareServices.appetiteTest,
      biochemicalRefService: diagnosticServices.biochemicalReference,
      clinicalRefService: diagnosticServices.clinicalSign,
      complicationService: nutritionCareServices.complication,
      diagnosticRuleService: diagnosticServices.diagnosticRule,
      growthChartService: diagnosticServices.growthChart,
      growthTableService: diagnosticServices.growthTable,
      indicatorService: diagnosticServices.indicator,
      medicineService: nutritionCareServices.medicine,
      milkService: nutritionCareServices.milk,
      nutritionalRiskService: diagnosticServices.nutritionalRisk,
      orientationService: nutritionCareServices.orientation,
      unitService: unitService,
   });

   pediatricDataManager.addObserver({
      onProgress(progress: InitializationProgress) {
         setCurrentStage(progress.stage);
         setProgress((progress.completed / progress.total) * 100);
         setDownloadStatus(progress.message);
         if (!initStages.includes(progress.stage)) {
            setInitStages((prev) => [...prev, progress.stage]);
         }
      },
      onComplete() {
         setIsComplete(true);
         setDownloadStatus("Initialisation terminée avec succès!");
      },
      onError(error) {
         setError(`${error.stage}: ${error.error}`);
         console.log(error);
         setDownloadStatus("Une erreur est survenue");
      },
   });

   useEffect(() => {
      init();
   }, []);

   async function init() {
      try {
         if (isInitialize.current) {
            setProgress(100);
            return;

         }
         setDownloadStatus("Démarrage du téléchargement...");
         const result = await loadPediatricData();

         if (result.isFailure) {
            setError(formatError(result, init.name));
            console.error("Failed to load pediatric data:", result.err);
         } else {
            const files = result.val;
            const decoder = new TextDecoder("utf-8");
            const filesData = new Map(Array.from(files).map((value) => [value[0], decoder.decode(value[1])]));

            const data = pediatricDataManager.prepareData(filesData);

            await pediatricDataManager.initialize(data);
            isInitialize.current = true;
            localStorage.setItem("state", JSON.stringify({ isInitialize: true }));
         }
      } catch (error) {
         setError(`${error}`);
         console.error("Initialization error:", error);
      }
   }

   async function loadPediatricData(): Promise<Result<Map<string, ArrayBuffer>>> {
      try {
         const dataManager = new DataFileManager();
         return await dataManager.loadPediatricData();
      } catch (error) {
         return Result.fail(`${error}`);
      }
   }

   return (
      <>
         <div className="init-container">
            <h2 className="init-title">Initialisation de l'Application</h2>

            <div className="progress-container"></div>
            <div className="progress-bar">
               <div className="progress-fill" style={{ width: `${progress}%` }} />
            </div>
            <div className="progress-text">{Math.round(progress)}%</div>
         </div>
         <div className="status-container">
            <p className="current-stage">{currentStage}</p>
            <p className="status-message">{downloadStatus}</p>
         </div>

         {error && (
            <div className="error-container">
               <p className="error-message">{error}</p>
            </div>
         )}

         <div className="stages-container">
            {initStages.map((stage, index) => (
               <div key={index} className={`stage-item ${currentStage === stage ? "active" : ""}`}>
                  <span className="stage-bullet">✓</span>
                  <span className="stage-text">{stage} </span>
               </div>
            ))}
         </div>

         {isComplete && (
            <div className="complete-message">
               <span className="complete-icon">✓</span>
               <p>Installation terminée avec succès!</p>
            </div>
         )}
      </>
   );
}

export default InitApp;
