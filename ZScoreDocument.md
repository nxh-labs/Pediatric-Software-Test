# Explication Théorique du Calcul d'un Z-Score pour Weight-for-Length

Ce document présente une explication détaillée des fonctions impliquées dans le calcul des z-scores pour la croissance en pédiatrie, ainsi qu'une illustration théorique du calcul d'un z-score pour un cas de poids-pour-longueur (weight-for-length).

---

## 1. Aperçu des Fonctions Clés

### **roundUp**
- **But :** Arrondir un nombre à l'entier supérieur.
- **Fonctionnement :** Utilise `Math.ceil` pour obtenir le plus petit entier supérieur ou égal à un nombre donné.
- **Utilité :** Assure que l'âge ou d'autres mesures se retrouvent sous forme d'entiers précis afin de faciliter la recherche des standards de croissance.

### **computeZscore**
- **But :** Calculer le z-score non ajusté via la formule LMS.
- **Formule :**  
  \[
  Z = \frac{\left(\frac{y}{m}\right)^L - 1}{s \times L}
  \]
  - \( y \) : Mesure observée (par exemple, le poids).
  - \( m \) : Médiane (valeur de référence pour le standard).
  - \( L \) : Paramètre Box-Cox pour la normalisation.
  - \( s \) : Coefficient de variation.
- **Utilité :** Permet d'estimer combien une mesure s'écarte de la norme en se basant sur une distribution normalisée.

### **computeZscoreAdjusted**
- **But :** Ajuster le z-score non ajusté pour mieux gérer les valeurs extrêmes.
- **Fonctionnement :**
  - Calcule d'abord le z-score non ajusté via `computeZscore`.
  - Détermine ensuite la mesure correspondant à +3 et -3 écarts-types (SD3pos et SD3neg) via une fonction locale `calcSd`.
  - Si le z-score dépasse +3 ou descend en dessous de -3, il est ajusté en fonction de l'écart mesuré.
- **Utilité :** Garantit que des valeurs aberrantes extrêmes n'influencent pas excessivement l'interprétation globale.

### **Interpolation des Standards de Croissance**
Pour calculer le z-score dans le cas du poids-pour-longueur, il faut :
1. **Déterminer les bornes d'interpolation :**
   - `lowLenhei` : La taille arrondie à 0.1 cm (vers le bas).
   - `uppLenhei` : La taille arrondie à 0.1 cm (vers le haut).
   - `diffLenhei` : La fraction indiquant où se situe la taille par rapport à ces bornes.
2. **Sélectionner les standards correspondant :**
   - On cherche dans la table des standards un enregistrement pour le sexe et la taille basse (`lowLenhei`) et un autre pour la taille haute (`uppLenhei`).
3. **Interpolation des paramètres (m, l, s) :**
   - Pour chaque paramètre (M, L, S), l'interpolation est effectuée comme suit :
     \[
     \text{paramètre interpolé} = \text{paramètre}_{low} + diffLenhei \times (\text{paramètre}_{upp} - \text{paramètre}_{low})
     \]

---

## 2. Illustration du Calcul d'un Z-Score pour Weight-for-Length (Cas Unique)

Imaginons le cas d'un enfant avec les données suivantes :

- **Poids (weight) :** 9.5 kg  
- **Longueur (lenhei) :** 70.3 cm  
- **Sexe :** "M"  
- **Âge :** (Supposons que l'âge et l'unité indiquent ici qu'on utilise les standards pour la longueur)

### **Étape 1 : Interpolation de la Taille**

1. **Calcul de `lowLenhei` et `uppLenhei` :**
   - `lowLenhei` : On tronque 70.3 à 70.3 (ici, le nombre est déjà à une décimale).
   - `uppLenhei` : On calcule le nombre immédiatement supérieur en 0.1 cm, soit 70.4.
2. **Calcul de `diffLenhei` :**
   - \( diffLenhei = \frac{70.3 - 70.3}{0.1} = 0 \)
   - Ici, l'enfant correspond exactement à la borne basse, donc pas d'interpolation nécessaire.

### **Étape 2 : Recherche des Standards de Croissance**

Pour un garçon ("M") et une taille de 70.3 cm, on cherche deux standards :
- **Standard bas (`standardLow`) pour 70.3 cm.**
- **Standard haut (`standardUpp`) pour 70.4 cm.**

Supposons que les valeurs extraites soient :

| Paramètre | standardLow (à 70.3 cm) | standardUpp (à 70.4 cm) |
|-----------|-------------------------|-------------------------|
| **m**   | 9.0                     | 9.1                     |
| **l**   | 0.5                     | 0.5                     |
| **s**   | 0.12                    | 0.12                    |

Puisque `diffLenhei = 0`, l'interpolation nous donne :
- \( m = 9.0 + 0 \times (9.1 - 9.0) = 9.0 \)
- \( l = 0.5 \)  
- \( s = 0.12 \)

### **Étape 3 : Calcul du Z-Score**

En utilisant la fonction `computeZscoreAdjusted` (qui appelle d'abord `computeZscore`), nous appliquons la formule :

\[
Z = \frac{\left(\frac{weight}{m}\right)^l - 1}{s \times l}
\]

Avec nos valeurs :
- \( weight = 9.5 \) kg
- \( m = 9.0 \)
- \( l = 0.5 \)
- \( s = 0.12 \)

1. Calcul du rapport :
   \[
   \frac{weight}{m} = \frac{9.5}{9.0} \approx 1.0556
   \]
2. Calcul de \( \left(\frac{weight}{m}\right)^l \) :
   \[
   1.0556^{0.5} \approx \sqrt{1.0556} \approx 1.0275
   \]
3. Calcul du numérateur :
   \[
   1.0275 - 1 = 0.0275
   \]
4. Calcul du dénominateur :
   \[
   s \times l = 0.12 \times 0.5 = 0.06
   \]
5. Z-score non ajusté :
   \[
   Z \approx \frac{0.0275}{0.06} \approx 0.4583
   \]

**Ajustement éventuel :**  
La fonction `computeZscoreAdjusted` vérifie si le z-score est dans la plage acceptable (généralement entre -3 et +3).  
- Dans notre cas, \( 0.4583 \) est dans la plage normale, donc aucun ajustement n'est nécessaire.

Le z-score final est donc environ **0.46** (arrondi à deux décimales).

---

## Conclusion

Ce processus théorique nous montre comment, pour une seule mesure de poids-pour-longueur :
- On commence par **interpoler** la taille pour obtenir les paramètres de référence appropriés.
- On **recherche** dans les standards de croissance les valeurs correspondant à la taille et au sexe de l'enfant.
- On applique la **formule LMS** pour calculer le z-score, et on ajuste ce score si la mesure se trouve en dehors des limites classiques.

Ce z-score permet ensuite aux cliniciens de situer la mesure de l'enfant par rapport aux normes établies, facilitant la détection d'anomalies de croissance. Pour votre application de pédiatrie, ce processus garantit une évaluation fiable de la croissance et aide à prendre les bonnes décisions cliniques.

