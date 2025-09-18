document.getElementById("weatherForm").addEventListener("submit", async function(e) {
  e.preventDefault();

  const formData = new FormData(this);
  let data = {};
  formData.forEach((value, key) => data[key] = value);

  const resultDiv = document.getElementById("result");

  try {
    const response = await fetch("/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    const result = await response.json();

    // Clear old animations
    document.querySelectorAll(".raindrop").forEach(el => el.remove());
    document.querySelectorAll(".cloud").forEach(el => el.style.opacity = "0.6");
    document.querySelector(".sun").style.opacity = "0.6";

    if (result.prediction) {
      let icon = "🌤️";
      if (result.prediction === "rain") {
        icon = "🌧️";
        // Generate raindrops
        for (let i = 0; i < 50; i++) {
          let drop = document.createElement("div");
          drop.classList.add("raindrop");
          drop.style.left = Math.random() * window.innerWidth + "px";
          drop.style.animationDuration = (Math.random() * 1 + 0.7) + "s";
          document.body.appendChild(drop);
        }
        document.querySelectorAll(".cloud").forEach(el => el.style.opacity = "0.9");
        document.querySelector(".sun").style.opacity = "0.2";
      } else if (result.prediction === "cloudy") {
        icon = "☁️";
        document.querySelectorAll(".cloud").forEach(el => el.style.opacity = "0.9");
        document.querySelector(".sun").style.opacity = "0.4";
      } else {
        document.querySelector(".sun").style.opacity = "1";
      }

      resultDiv.innerHTML = `${icon} <b>${result.prediction.toUpperCase()}</b>`;
      resultDiv.style.color = "#fff";
    } else {
      resultDiv.innerHTML = `⚠️ Error: ${result.error}`;
      resultDiv.style.color = "red";
    }
  } catch (err) {
    resultDiv.innerHTML = "❌ Something went wrong!";
    resultDiv.style.color = "red";
  }
});
