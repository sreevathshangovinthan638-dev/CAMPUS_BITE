@echo off
title CampusBite Launcher - PSGCAS Food Court
echo ==============================================
echo       Launching CampusBite (PSGCAS Food Court)
echo ==============================================
echo.

set PYCMD=python
where python >nul 2>nul
if %errorlevel% neq 0 (
    where py >nul 2>nul
    if %errorlevel% equ 0 (
        set PYCMD=py
    ) else if exist "%LOCALAPPDATA%\Programs\Python\Python312\python.exe" (
        set "PYCMD=%LOCALAPPDATA%\Programs\Python\Python312\python.exe"
    )
)

echo [1/2] Starting Backend (Django on http://127.0.0.1:8000 using %PYCMD%)...
start "CampusBite Backend (Django)" cmd /k "cd /d "%~dp0CampusBite_PSGCAS\backend" && %PYCMD% manage.py migrate && %PYCMD% manage.py seed_campusbite && %PYCMD% manage.py runserver 127.0.0.1:8000"

echo [2/2] Starting Frontend (Vite on http://localhost:5173)...
start "CampusBite Frontend (Vite)" cmd /k "cd /d "%~dp0CampusBite_PSGCAS\frontend" && npm run dev"

echo.
echo Both services are now starting up!
echo - Backend API:  http://127.0.0.1:8000/api/health/
echo - Frontend Web: http://localhost:5173/
echo.
timeout /t 3 >nul
start http://localhost:5173/
