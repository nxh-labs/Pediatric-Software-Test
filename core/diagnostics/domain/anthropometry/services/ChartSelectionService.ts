import { ConditionResult, evaluateCondition, handleError, Result } from "@shared";
import { AnthropometricVariableObject } from "../common";
import { Indicator, GrowthStandard, GrowthReferenceChart, AvailableChart } from "../models";
import { IChartSelectionService } from "./interfaces/ChartSelectionService";
import { GrowthReferenceChartRepository } from "../ports";
import { handleGrowthIndicatorError } from "../errors/handle";
import { GROWTH_INDICATOR_ERRORS } from "../errors";

export class ChartSelectionService implements IChartSelectionService {
    constructor(private growthReferenceRepo: GrowthReferenceChartRepository) { }
    private validateChartCondition(
        chart: AvailableChart,
        data: AnthropometricVariableObject,
        standard: GrowthStandard
    ): boolean {
        const { condition } = chart.unpack();
        const variables = condition.unpack().variables;

        if (!variables.every(variable => Object.keys(data).includes(variable))) {
            return false;
        }

        return evaluateCondition(condition.unpack().value, { ...data, standard }) === ConditionResult.True;
    }

    async selectChartForIndicator(data: AnthropometricVariableObject, indicator: Indicator, standard: GrowthStandard): Promise<Result<GrowthReferenceChart>> {
        try {
            const availableCharts = indicator.getProps().availableRefCharts;
            const selectedChart = availableCharts.find(chart =>
                this.validateChartCondition(chart, data, standard)
            );

            if (!selectedChart) {
                return handleGrowthIndicatorError(GROWTH_INDICATOR_ERRORS.CHART.NOT_AVAILABLE.path, `Indicator: ${indicator.getCode()}, Chart: ${standard}`);
            }
            const growthReferenceChart = await this.growthReferenceRepo.getByCode(selectedChart.unpack().chartCode);
            return Result.ok(growthReferenceChart)

        } catch (e: unknown) {
            return handleError(e)
        }
    }

}