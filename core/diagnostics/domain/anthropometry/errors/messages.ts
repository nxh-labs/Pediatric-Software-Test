export const GROWTH_INDICATOR_ERRORS = {
    INTERPRETATION: {
      NOT_FOUND: {
        path: "INTERPRETATION.NOT_FOUND",
        code: 'GI001',
        message: "L'interprétation n'est pas trouvée pour ce z-score"
      },
      INVALID_RANGE: {
        path: "INTERPRETATION.INVALID_RANGE",
        code: 'GI002',
        message: "La plage d'interprétation n'est pas valide"
      }
    },
    CHART: {
      NOT_AVAILABLE: {
        path: "CHART.NOT_AVAILABLE",
        code: 'GI003',
        message: "Le graphique de référence n'est pas disponible"
      },
      INVALID_DATA: {
        path: "CHART.INVALID_DATA",
        code: 'GI004',
        message: "Les données du graphique sont invalides"
      }
    },
    CALCULATION: {
      STRATEGY_NOT_FOUND: {
        path: "CALCULATION.STRATEGY_NOT_FOUND",
        code: 'GI005',
        message: "La stratégie de calcul n'est pas disponible"
      },
      INVALID_RESULT: {
        path: "CALCULATION.INVALID_RESULT",
        code: 'GI006',
        message: "Le calcul a produit un résultat invalide"
      }
    }
  } as const;