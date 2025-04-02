import { GrowthReferenceChart, GrowthStandard, ZScoreComputingStrategyType } from "../../models"

/**
 * Représente les données nécessaires pour le calcul du Z-score.
 * 
 * @property {Object} measurements - Contient les valeurs de référence pour le calcul.
 * @property {number} measurements.x - Peut représenter l'âge en jours (`AGE_IN_DAY`), l'âge en mois (`AGE_IN_MONTH`) ou la taille normalisée (`LENHEI`).
 * @property {number} measurements.y - Valeur anthropométrique observée (ex : poids, taille, périmètre crânien, IMC...).
 * @property {GrowthReferenceChart} growthReferenceChart - La courbe de référence de croissance utilisée pour l'interprétation des mesures.
 */
export type ZScoreComputingData = {
    measurements: { x: number, y: number };
    growthReferenceChart: GrowthReferenceChart;
};


/**
 * Interface définissant une stratégie de calcul du Z-score.
 */
export interface ZScoreComputingStrategy {
    standard: GrowthStandard
    type: ZScoreComputingStrategyType
    /**
     * Calcule le Z-score à partir des données fournies.
     * 
     * @param {ZScoreComputingData} data - Les mesures et la courbe de référence à utiliser pour le calcul.
     * @returns {number} - Le Z-score calculé.
     */
    computeZScore(data: ZScoreComputingData): number;
}

