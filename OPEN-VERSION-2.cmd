@echo off
setlocal
cd /d "%~dp0"
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0scripts\start-website.ps1" -Route "/version2"
if errorlevel 1 pause
