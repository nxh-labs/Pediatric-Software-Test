export const CORE_SERVICE_ERRORS = {
    NUTRITIONAL_ASSESSMENT: {
        NEEDED_VARIABLE_GENERATION_FAILED: {
            path: 'NUTRITIONAL_ASSESSMENT.NEEDED_VARIABLE_GENERATION_FAILED',
            code: 'CS001',
            message: "La generation de variables dont a besoin le NutritionalAssessment pour faire le diagnostic a échoué"
        },
        DIAGNOSTIC_RULE_REPO_ERROR: {
            path: 'NUTRITIONAL_ASSESSMENT.DIAGNOSTIC_RULE_REPO_ERROR',
            code: 'CS002',
            message: "L'erreur lors de la recuperation des regles de diagnostic global"
        }
    }
}