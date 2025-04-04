export const CLINICAL_ERRORS = {
    VALIDATION: {
        MISSING_DATA: {
            path: "VALIDATION.MISSING_DATA",
            code: "CL001",
            message: "Les données cliniques requises sont manquantes"
        },
        INVALID_DATA: {
            path: "VALIDATION.INVALID_DATA",
            code: "CL002",
            message: "Les données cliniques fournies sont invalides"
        }
    },
    ANALYSIS: {
        SIGN_NOT_FOUND: {
            path: "ANALYSIS.SIGN_NOT_FOUND",
            code: "CL003",
            message: "Le signe clinique n'a pas été trouvé"
        },
        INVALID_CONDITION: {
            path: "ANALYSIS.INVALID_CONDITION",
            code: "CL004",
            message: "La condition d'évaluation est invalide"
        },
        INTERPRETATION_FAILED: {
            path: "ANALYSIS.INTERPRETATION_FAILED",
            code: "CL005",
            message: "L'interprétation du signe clinique a échoué"
        }
    },
    REPOSITORY: {
        REFERENCE_NOT_FOUND: {
            path: "REPOSITORY.REFERENCE_NOT_FOUND",
            code: "CL006",
            message: "La référence clinique n'a pas été trouvée"
        }
    }
} as const;
