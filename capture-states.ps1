# capture-states.ps1
# Script to capture screenshots of various views for visual inspection

$edgePath = "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
$baseDir = "c:\Users\lenov\OneDrive\Documents\UKS"

# 1. Capture Login View
$loginScript = @"
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <link rel="stylesheet" href="css/style.css">
  <link rel="icon" type="image/svg+xml" href="assets/logo-pmr.svg">
</head>
<body>
  <div id="wrapper"></div>
  <script src="js/data.js"></script>
  <script src="js/signature.js"></script>
  <script src="js/app.js"></script>
  <script>
    window.addEventListener('load', () => {
      document.getElementById('tabBtnSecretary').click();
    });
  </script>
</body>
</html>
"@

# We can also just take a screenshot of index.html after simulating actions!
Start-Process -FilePath $edgePath -ArgumentList @(
  "--headless",
  "--disable-gpu",
  "--window-size=1280,850",
  "--screenshot=$baseDir\assets\screen-secretary-login.png",
  "file:///$baseDir/index.html#secretary"
) -Wait

Write-Output "Screenshot captured"
