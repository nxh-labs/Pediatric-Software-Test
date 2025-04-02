import { DAY_IN_MONTHS, DAY_IN_YEARS, GrowthReferenceChart, GrowthStandard, IChartData, MAX_AGE_IN_PEDIATRIC, MAX_AGE_TO_USE_AGE_IN_DAY, ZScoreComputingStrategyType } from "../models";
import { IAnthroComputingHelper } from "./interfaces/AnthroComputingHelper";
import { ZScoreComputingData, ZScoreComputingStrategy } from "./interfaces/ZScoreComputingStrategy";

export class AgeBasedStrategy implements ZScoreComputingStrategy {
    standard: GrowthStandard = GrowthStandard.OMS
    type: ZScoreComputingStrategyType = ZScoreComputingStrategyType.AGEBASED
    constructor(private anthroComputingHelper: IAnthroComputingHelper) { }
    computeZScore(data: ZScoreComputingData): number {
        const { measurements, growthReferenceChart } = data
        const { x, y } = measurements
        const age_in_day = x
        // Verification de age 
        if (age_in_day <= MAX_AGE_TO_USE_AGE_IN_DAY) {
            const standard = this.findGrowthStandardWhenAgeIsInDay(age_in_day, growthReferenceChart)
            if (!standard) return NaN
            return Math.round(this.anthroComputingHelper.computeZScoreAdjusted(y, standard.l, standard.median, standard.s))
        }
        if (age_in_day >= MAX_AGE_IN_PEDIATRIC * DAY_IN_YEARS) {
            const age_in_month = age_in_day / DAY_IN_MONTHS
            const standard = this.findGrowthStandardWhenAgeIsInMonth(age_in_month, growthReferenceChart)
            if (!standard) return NaN
            return Math.round(this.anthroComputingHelper.computeZScoreAdjusted(y, standard.l, standard.median, standard.s))
        }
        return NaN;

    }

    private findGrowthStandardWhenAgeIsInDay(age_in_day: number, growthReferenceChart: GrowthReferenceChart): IChartData | undefined {
        const standard = growthReferenceChart.getChartData().find(chartData => chartData.value === age_in_day)
        return standard
    }
    private findGrowthStandardWhenAgeIsInMonth(age_in_month: number, growthReferenceChart: GrowthReferenceChart): IChartData | undefined {
        const chartData = growthReferenceChart.getChartData()
        // Make interpolation : 
        const lowAge = Math.trunc(age_in_month)
        const uppAge = Math.trunc(age_in_month + 1)
        // FIXED: Verifier bien si c'est la bonne façon d'interpoler et de calculer la diff ici 
        const diffAge = age_in_month - lowAge
        const standardLow = chartData.find(data => data.value === lowAge)
        const standardUpp = chartData.find(data => data.value === uppAge)
        if (standardUpp && standardLow) {
            return {
                median: diffAge > 0 ? standardLow.median + diffAge * (standardUpp.median - standardLow.median) : standardLow.median,
                l: diffAge > 0 ? standardLow.l + diffAge * (standardUpp.l - standardLow.l) : standardLow.l,
                s: diffAge > 0 ? standardLow.s + diffAge * (standardUpp.s - standardLow.s) : standardLow.s,
                curvePoints: standardLow.curvePoints,
                value: age_in_month
            }
        }
        return undefined

    }

}