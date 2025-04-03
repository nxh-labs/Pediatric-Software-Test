/**
 * @fileoverview Interface defining services for selecting appropriate growth reference charts
 * based on anthropometric data and indicators.
 * @module IChartSelectionService
 */

import { Result } from "@shared";
import { AnthropometricVariableObject } from "../../common";
import { GrowthReferenceChart, GrowthStandard, Indicator } from "../../models";

/**
 * @interface IChartSelectionService
 * @description Defines the contract for services that handle the selection of appropriate
 * growth reference charts. Responsible for:
 * - Matching anthropometric data with correct reference charts
 * - Considering indicator types and growth standards
 * - Providing standardized chart selection logic
 */
export interface IChartSelectionService {
   /**
    * Selects the appropriate growth reference chart for a given anthropometric measurement and indicator.
    * @param {AnthropometricVariableObject} data - The anthropometric data to be evaluated
    * @param {Indicator} indicator - The growth indicator to be used for chart selection
    * @param {GrowthStandard} standard - The growth standard reference to be used
    * @returns {Promise<Result<GrowthReferenceChart>>} A promise that resolves to a Result containing the selected growth reference chart
    */
   selectChartForIndicator(data: AnthropometricVariableObject, indicator: Indicator, standard: GrowthStandard): Promise<Result<GrowthReferenceChart>>;
}
