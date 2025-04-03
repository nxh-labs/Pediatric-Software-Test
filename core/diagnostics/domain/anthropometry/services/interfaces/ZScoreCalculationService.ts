/**
 * @fileoverview Interface defining services for calculating z-scores from anthropometric measurements
 * using standardized reference data.
 * @module IZScoreCalculationService
 */

import { Result } from "@shared";
import { AnthropometricVariableObject } from "../../common";
import { GrowthReferenceChart, GrowthStandard, Indicator } from "../../models";

/**
 * @interface IZScoreCalculationService
 * @description Defines the contract for services that handle z-score calculations
 * for anthropometric measurements. Responsible for:
 * - Computing z-scores using appropriate statistical methods
 * - Handling different types of anthropometric indicators
 * - Supporting multiple growth standards (WHO, CDC, etc.)
 */
export interface IZScoreCalculationService {
   /**
    * Calculates the z-score for a given anthropometric measurement using reference data.
    * @param {AnthropometricVariableObject} data - The anthropometric measurements to evaluate
    * @param {Indicator} indicator - The growth indicator being calculated
    * @param {GrowthReferenceChart} chart - The reference chart to use for calculations
    * @param {GrowthStandard} standard - The growth standard being applied
    * @returns {Promise<Result<number>>} The calculated z-score value
    */
   calculateZScore(
      data: AnthropometricVariableObject,
      indicator: Indicator,
      chart: GrowthReferenceChart,
      standard: GrowthStandard,
   ): Promise<Result<number>>;
}
