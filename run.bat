@echo off
title AgniNet - Community-Powered Fire Response
echo =========================================================
echo    AgniNet - Community-Powered Fire Response System
echo =========================================================
echo Setting environment...
set "PATH=C:\Users\Localadmin\.gemini\antigravity\scratch\nodejs;%PATH%"

echo Starting Backend Server (Express + SQLite + NASA FIRMS)...
start "AgniNet Backend" cmd /k "cd /d %~dp0 && node server/server.js"

echo Starting Frontend Dev Server (React + Vite + Leaflet)...
start "AgniNet Frontend" cmd /k "cd /d %~dp0 && npx vite --port 5173"

echo.
echo Both servers are launching!
echo Frontend will be live at: http://localhost:5173
echo Backend API will be live at: http://localhost:5000
echo.
pause
