function calculate() {
    const weight = parseFloat(document.getElementById("weight").value);
    const height = parseFloat(document.getElementById("height").value);
    const bmi = weight / (height * height);

    let classification;
    if (bmi < 18.5) {
        classification = "Magreza";
    } else if (bmi >= 18.5 && bmi <= 24.9) {
        classification = "Normal";
    } else if (bmi > 24.9 && bmi <= 30) {
        classification = "Sobrepeso";
    } else {
        classification = "Obesidade";
    }

    document.getElementById("result").textContent =
        "BMI: " + bmi.toFixed(1) + " — " + classification;
}
