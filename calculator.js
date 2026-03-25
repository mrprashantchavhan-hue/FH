// Premix Output Calculator
function calculatePremix() {
  const atta = parseFloat(document.getElementById("atta").value);
  const standard = parseFloat(document.getElementById("standard").value);
  const hopper = parseFloat(document.getElementById("hopper").value);
  const ratio = document.getElementById("ratio").value.split(":");

  if (!atta || !standard || !hopper || ratio.length !== 2) {
    // Clear results if inputs are invalid
    document.getElementById("required").innerText = "-";
    document.getElementById("output").innerText = "-";
    document.getElementById("time").innerText = "-";
    document.getElementById("auto-deviation").innerText = "-";
    document.getElementById("auto-iron").innerText = "-";
    document.getElementById("auto-status").innerText = "Enter values to calculate";
    document.getElementById("auto-status").className = "status-indicator";
    return;
  }

  const premixPart = parseFloat(ratio[0]);
  const dilutorPart = parseFloat(ratio[1]);

  // Premix required (kg/hr)
  // Atta (kg/hr) → MT/hr → premix kg/hr
  const premixKgHr = (atta / 1000) * (standard / 1000);

  // Diluted premix output (kg/hr)
  const dilutionFactor = (premixPart + dilutorPart) / premixPart;
  const dilutedKgHr = premixKgHr * dilutionFactor;

  // Output in g/min
  const outputGmMin = (dilutedKgHr * 1000) / 60;

  // Hopper emptying time (based on diluted premix)
  const totalHours = hopper / dilutedKgHr;
  const hh = Math.floor(totalHours);
  const mm = Math.round((totalHours - hh) * 60);

  document.getElementById("required").innerText = premixKgHr.toFixed(3);
  document.getElementById("output").innerText = outputGmMin.toFixed(0);
  document.getElementById("time").innerText = hh + " hr " + (mm < 10 ? "0"+mm : mm) + " min";
  
  // Auto-calculate Iron Level based on Premix Output
  const calOutput = parseFloat(outputGmMin.toFixed(0));
  // document.getElementById("calOutput").value = calOutput; // Element doesn't exist, disabling for now.
  
  // Get actual output if entered
  const actualOutputValue = document.getElementById("actualOutput").value;
  let actualOutput = calOutput; // default to perfect output
  
  if (actualOutputValue && !isNaN(parseFloat(actualOutputValue))) {
    actualOutput = parseFloat(actualOutputValue);
  }
  
  // Calculate deviation and iron level
  const deviation = ((actualOutput - calOutput) / calOutput) * 100;
  const ironLevel = (actualOutput / calOutput) * 18;
  
  document.getElementById("auto-deviation").innerText = deviation.toFixed(2);
  document.getElementById("auto-iron").innerText = ironLevel.toFixed(2);
  
  // Determine calibration status based on user-provided rules:
  // 15.84 to 20.16 (+/- 12%) - No action
  // 15.12 to 15.84 or 20.16 to 20.88 (+/- 16%) - Minor calibration
  // <15.12 or >20.88 - Major calibration
  
  let statusText = "";
  let statusClass = "";
  
  if (ironLevel >= 15.84 && ironLevel <= 20.16) {
    statusText = "No Calibration Required";
    statusClass = "green";
  } else if ((ironLevel >= 15.12 && ironLevel < 15.84) || (ironLevel > 20.16 && ironLevel <= 20.88)) {
    statusText = "Minor Calibration Required";
    statusClass = "yellow";
  } else {
    statusText = "Major Calibration Required";
    statusClass = "red";
  }
  
  const statusDiv = document.getElementById("auto-status");
  statusDiv.innerText = statusText;
  statusDiv.className = "status-indicator " + statusClass;
}

// Add real-time event listeners for automatic calculation
document.addEventListener('DOMContentLoaded', function() {
  const inputs = ['atta', 'ratio', 'standard', 'hopper', 'actualOutput'];
  inputs.forEach(id => {
    const element = document.getElementById(id);
    if (element) {
      element.addEventListener('input', calculatePremix);
      element.addEventListener('change', calculatePremix);
    }
  });
});

