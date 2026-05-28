// User's imput
const weightKg = 70;
const heightM = 1.75;

// Calculate BMI
const bmi = weightKg / (heightM * heightM);

console.log("BMI: " + bmi.toFixed(1));

// Classify the result
if (bmi < 18.5) {
    console.log("Classification: Magreza");
} else if (bmi >= 18.5 && bmi <= 24.9) {
    console.log("Classification: Normal");
} else if (bmi > 24.9 && bmi <= 30) {
    console.log("Classification: Sobrepeso");
} else {
    console.log("Classification: Obesidade");
}