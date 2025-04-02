import {
    GrowthStandard,
    computeZscoreAdjusted,
    flagZscore,
    assertValidSex,
    assertValidAgeInDays,
    assertGrowthstandards
} from './z-score-helper';

/**
 * Calcule l'indicateur z-score poids-pour-taille
 * @param weight - Tableau des poids
 * @param lenhei - Tableau des tailles
 * @param lenheiUnit - Tableau des unités de mesure ('h' pour hauteur, 'l' pour longueur)
 * @param ageInDays - Tableau des âges en jours
 * @param ageInMonths - Tableau des âges en mois
 * @param sex - Tableau des sexes ('M' pour masculin, 'F' pour féminin)
 * @param oedema - Tableau indiquant la présence d'œdème ('y' ou 'n')
 * @param flagThreshold - Seuil pour le drapeau (défaut: 5)
 * @param growthstandardsWfl - Standards de croissance pour poids-pour-longueur
 * @param growthstandardsWfh - Standards de croissance pour poids-pour-hauteur
 * @returns Objet contenant les z-scores et leurs drapeaux
 */
function anthroZscoreWeightForLenhei(
    weight: number[],
    lenhei: number[],
    lenheiUnit: string[],
    ageInDays: number[],
    ageInMonths: number[],
    sex: string[],
    oedema: string[],
    flagThreshold: number = 5,
    growthstandardsWfl: GrowthStandard[],
    growthstandardsWfh: GrowthStandard[]
): { [key: string]: number[] } {
    // Vérifications des paramètres
    if (!Array.isArray(weight) || !weight.every(w => typeof w === 'number')) {
        throw new Error('Le poids doit être un tableau de nombres');
    }
    if (!oedema.every(o => ['y', 'n'].includes(o))) {
        throw new Error("L'œdème doit être 'y' ou 'n'");
    }

    const n = lenhei.length;

    // Nettoyage des poids et tailles
    weight = weight.map(w => (w < 0.9 || w > 58.0) ? NaN : w);
    lenhei = lenhei.map(l => (l < 38.0 || l > 150.0) ? NaN : l);

    // Interpolation des tailles
    const lowLenhei = lenhei.map(l => Math.trunc(l * 10) / 10);
    const uppLenhei = lenhei.map(l => Math.trunc(l * 10 + 1) / 10);
    const diffLenhei = lenhei.map((l, i) => (l - lowLenhei[i]) / 0.1);

    // Harmonisation des standards de croissance
    const growthstandards = [...growthstandardsWfl, ...growthstandardsWfh];

    // Détermination du type de mesure à utiliser (longueur ou hauteur)
    const joinOn = ageInDays.map((age, i) => {
        if (!isNaN(age)) {
            return age < 731 ? 'l' : 'h';
        }
        if (lenheiUnit[i]) {
            return lenheiUnit[i].toLowerCase();
        }
        if (!isNaN(lenhei[i])) {
            return lenhei[i] < 87 ? 'l' : 'h';
        }
        return '';
    });

    // Calcul des z-scores
    const zscores = new Array(n).fill(NaN);
    for (let i = 0; i < n; i++) {
        if (!isNaN(weight[i]) && !isNaN(lenhei[i]) && joinOn[i]) {
            const standardLow = growthstandards.find(g => 
                g.sex === sex[i] && 
                g.age === lowLenhei[i]
            );
            const standardUpp = growthstandards.find(g => 
                g.sex === sex[i] && 
                g.age === uppLenhei[i]
            );

            if (standardLow && standardUpp) {
                const m = diffLenhei[i] > 0 
                    ? standardLow.m + diffLenhei[i] * (standardUpp.m - standardLow.m)
                    : standardLow.m;
                const l = diffLenhei[i] > 0
                    ? standardLow.l + diffLenhei[i] * (standardUpp.l - standardLow.l)
                    : standardLow.l;
                const s = diffLenhei[i] > 0
                    ? standardLow.s + diffLenhei[i] * (standardUpp.s - standardLow.s)
                    : standardLow.s;

                zscores[i] = Math.round(computeZscoreAdjusted(weight[i], m, l, s) * 100) / 100;
            }
        }
    }

    // Validation des z-scores
    const validZscore = zscores.map((z, i) => {
        if (isNaN(lenhei[i])) return false;
        if (oedema[i] === 'y') return false;
        if (!isNaN(ageInDays[i]) && ageInDays[i] > 1856) return false;
        if (ageInMonths[i] >= 60) return false;
        
        if (joinOn[i] === 'l') {
            return lenhei[i] >= 45 && lenhei[i] <= 110;
        }
        if (joinOn[i] === 'h') {
            return lenhei[i] >= 65 && lenhei[i] <= 120;
        }
        return false;
    });

    return flagZscore(flagThreshold, 'wfl', zscores, validZscore);
}

export { anthroZscoreWeightForLenhei };
