param(
    [string]$Name = "CSCI 2110 Practice (Full)"
)

# Create a Desktop shortcut that starts the app in full mode (client + server)
$desktop = [Environment]::GetFolderPath('Desktop')
$shortcutPath = Join-Path $desktop ($Name + ".lnk")

$ws = New-Object -ComObject WScript.Shell
$sc = $ws.CreateShortcut($shortcutPath)
$sc.TargetPath = "$env:SystemRoot\System32\WindowsPowerShell\v1.0\powershell.exe"
$sc.WorkingDirectory = $PSScriptRoot
$scriptToRun = Join-Path $PSScriptRoot 'Start-DevFull.ps1'
$sc.Arguments = "-NoExit -ExecutionPolicy Bypass -File `"$scriptToRun`""
$sc.Description = "Start CSCI 2110 practice app (full mode: client & server)"
$sc.IconLocation = "$env:SystemRoot\System32\WindowsPowerShell\v1.0\powershell.exe,0"
$sc.Save()

Write-Host "Shortcut created at: $shortcutPath"