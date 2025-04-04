export const BIOLOGICAL_SERVICE_ERRORS ={
    VALIDATION:{
        REFERENCE_NOT_FOUND: {
            path: 'VALIDATION.REFERENCE_NOT_FOUND',
            code: 'BI001',
            message: "Le resultat de test biologique n'est pas supporter par le systeme. Puisque la reference manque."
        },
        INVALID_DATA: {
            path: 'VALIDATION.INVALID_DATA',
            code: 'BI002',
            message: "Le resultat de test biologique est invalide."
        },
        DATA_LEN_NOT_EQ_REFERENCE_LEN: {
            path: 'VALIDATION.DATA_LEN_NOT_EQ_REFERENCE_LEN',
            code: 'BI003',
            message: "Les resultats de test n'ont pas de references respectifs."
        },
        INVALID_DATA_UNIT: {
            path: 'VALIDATION.INVALID_DATA_UNIT',
            code:'BI004',
            message: "L'unite du resultats de test n'est pas supporté." 
        }
    }
} as const