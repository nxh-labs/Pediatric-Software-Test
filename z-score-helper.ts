// ...imports éventuels...

/**
 * Interface représentant les standards de croissance.
 */
interface GrowthStandard {
	age: number;
	sex: string;
	m: number;
	l: number;
	s: number;
}

/**
 * Arrondit un nombre à l'entier supérieur.
 * @param x Un nombre.
 * @returns Le nombre arrondi vers le haut.
 */
function roundUp(x: number): number {
	return Math.ceil(x);
}

/**
 * Calcule le z-score non ajusté.
 * @param y La mesure observée.
 * @param m La moyenne.
 * @param l Le paramètre L.
 * @param s Le paramètre S.
 * @returns Le z-score.
 */
function computeZscore(y: number, m: number, l: number, s: number): number {
	// Vérifications de type omises
	return (Math.pow(y / m, l) - 1) / (s * l);
}

/**
 * Calcule le z-score ajusté.
 * @param y La mesure observée.
 * @param m La moyenne.
 * @param l Le paramètre L.
 * @param s Le paramètre S.
 * @returns Le z-score ajusté.
 */
function computeZscoreAdjusted(y: number, m: number, l: number, s: number): number {
	const calcSd = (sd: number): number => m * Math.pow(1 + l * s * sd, 1 / l);
	const zscore = computeZscore(y, m, l, s);
	const SD3pos = calcSd(3);
	const SD3neg = calcSd(-3);
	const SD23pos = SD3pos - calcSd(2);
	const SD23neg = calcSd(-2) - SD3neg;
	// Ajustement du zscore
	if (!isNaN(zscore)) {
		if (zscore > 3) {
			return 3 + ((y - SD3pos) / SD23pos);
		}
		if (zscore < -3) {
			return -3 + ((y - SD3neg) / SD23neg);
		}
	}
	return zscore;
}

/**
 * Fusionne les données d'entrée et les standards de croissance, puis applique la fonction de zscore.
 * @param zscoreFun Fonction pour calculer le zscore.
 * @param growthstandards Liste des standards de croissance.
 * @param ageInDays Tableau des âges en jours.
 * @param sex Tableau de sexes.
 * @param measure Tableau des mesures.
 * @returns Tableau des z-scores arrondis à 2 décimales.
 */
function applyZscoreAndGrowthstandards(
	zscoreFun: (y: number, m: number, l: number, s: number) => number,
	growthstandards: GrowthStandard[],
	ageInDays: number[],
	sex: string[],
	measure: number[]
): number[] {
	// Remplacer les âges négatifs par NaN et arrondir
	const correctedAges = ageInDays.map(a => (a < 0 ? NaN : roundUp(a)));
	
	// Fusionner chaque enregistrement avec un standard correspondant
	return correctedAges.map((age, i) => {
		const std = growthstandards.find(g => g.age === age && g.sex === sex[i]);
		const y = measure[i];
		if (std && y > 0) {
			const z = zscoreFun(y, std.m, std.l, std.s);
			return Math.round(z * 100) / 100;
		}
		return NaN;
	});
}

/**
 * Génère un drapeau pour le zscore selon un seuil ou une plage de seuils.
 * @param flagThreshold Nombre ou tableau de deux nombres indiquant le(s) seuil(s).
 * @param scoreName Nom du score.
 * @param zscore Tableau de z-scores.
 * @param validZscore Tableau de booléens indiquant les z-scores valides.
 * @returns Objet contenant le zscore et le drapeau.
 */
function flagZscore(
	flagThreshold: number | [number, number],
	scoreName: string,
	zscore: number[],
	validZscore: boolean[]
): { [key: string]: number[] } {
	// Mise à jour des z-scores invalides
	const zscoreUpdated = zscore.map((z, i) => (validZscore[i] ? z : NaN));
	// Calcul du drapeau
	const fzscore = zscoreUpdated.map(z => {
		if (isNaN(z)) return 0;
		if (typeof flagThreshold === "number") {
			return Math.abs(z) > flagThreshold ? 1 : 0;
		} else {
			return (z < flagThreshold[0] || z > flagThreshold[1]) ? 1 : 0;
		}
	});
	const result: { [key: string]: number[] } = {};
	result[`z${scoreName}`] = zscoreUpdated;
	result[`f${scoreName}`] = fzscore;
	return result;
}

/**
 * Ajuste la mesure lenhei en fonction de l'âge et de l'unité.
 * @param ageInDays Tableau des âges en jours.
 * @param measure Tableau des unités de mesure ('h' pour hauteur, 'l' pour longueur).
 * @param lenhei Tableau des mesures lenhei.
 * @returns Tableau des mesures lenhei ajustées.
 */
function adjustLenhei(ageInDays: number[], measure: string[], lenhei: number[]): number[] {
	const adjusted = lenhei.map((l, i) => {
		const age = roundUp(ageInDays[i]);
		// Si enfant <= 730 jours et mesure "h", on ajoute 0.7
		if (!isNaN(age) && age < 731 && measure[i] === "h") return l + 0.7;
		// Si enfant > 730 jours et mesure "l", on soustrait 0.7
		if (!isNaN(age) && age >= 731 && measure[i] === "l") return l - 0.7;
		return l;
	});
	return adjusted;
}

/**
 * Vérifie la validité du sexe.
 * @param sex Tableau de sexes.
 * @returns Le même tableau si la vérification est réussie.
 */
function assertValidSex(sex: string[]): string[] {
	// Implémentation minimale
	return sex;
}

/**
 * Vérifie et retourne les âges en jours valides.
 * @param ageInDays Tableau des âges en jours.
 * @returns Tableau validé d'âges en jours.
 */
function assertValidAgeInDays(ageInDays: number[]): number[] {
	// Implémentation minimale (peut être étendue)
	return ageInDays;
}

/**
 * Vérifie les standards de croissance.
 * @param gs Liste des standards.
 * @returns La même liste si la vérification est réussie.
 */
function assertGrowthstandards(gs: GrowthStandard[]): GrowthStandard[] {
	// Implémentation minimale
	return gs;
}


/**
 * Calcule le zscore ajusté et applique les standards de croissance pour une série d'enfants.
 * @param name Nom de l'indicateur.
 * @param measure Tableau des mesures.
 * @param ageInDays Tableau des âges en jours.
 * @param ageInMonths Tableau des âges en mois.
 * @param sex Tableau des sexes.
 * @param growthstandards Liste des standards de croissance.
 * @param flagThreshold Seuil ou plage de seuils pour le drapeau.
 * @param allowedAgeRange Plage d'âges autorisée (défaut : [0, 1856]).
 * @param zscoreIsValid Tableau de booléens indiquant les z-scores valides.
 * @param zscoreFun Fonction pour calculer le zscore (défaut : computeZscoreAdjusted).
 * @returns Objet contenant le zscore et le drapeau.
 */
function anthroZscoreAdjusted(
	name: string,
	measure: number[],
	ageInDays: number[],
	ageInMonths: number[],
	sex: string[],
	growthstandards: GrowthStandard[],
	flagThreshold: number | [number, number],
	allowedAgeRange: [number, number] = [0, 1856],
	zscoreIsValid: boolean[] = new Array(measure.length).fill(true),
	zscoreFun: (y: number, m: number, l: number, s: number) => number = computeZscoreAdjusted
): { [key: string]: number[] } {
	// Vérifications minimales
	if (!name || measure.length === 0) throw new Error("Paramètres invalides");
	sex = assertValidSex(sex);
	ageInDays = assertValidAgeInDays(ageInDays);
	growthstandards = assertGrowthstandards(growthstandards);

	// Les mesures <= 0 deviennent NaN
	measure = measure.map(m => (m <= 0 ? NaN : m));

	// Calcul du zscore grâce à la fusion avec les standards
	const zscoreArray = applyZscoreAndGrowthstandards(zscoreFun, growthstandards, ageInDays, sex, measure);
	// Calcul d'une validité basée sur l'âge en mois (< 60)
	const validAge = ageInMonths.map(a => a < 60);
	const validZscore = ageInDays.map((age, i) =>
		!isNaN(age) &&
		age >= allowedAgeRange[0] &&
		age <= allowedAgeRange[1] &&
		zscoreIsValid[i] &&
		validAge[i]
	);
	return flagZscore(flagThreshold, name, zscoreArray, validZscore);
}

// ...export éventuel des fonctions...
export {
	GrowthStandard,
	roundUp,
	computeZscore,
	computeZscoreAdjusted,
	applyZscoreAndGrowthstandards,
	flagZscore,
	adjustLenhei,
	anthroZscoreAdjusted,
	assertValidAgeInDays,
	assertValidSex,
	assertGrowthstandards,
	
};
