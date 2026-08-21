@echo off
echo ==============================================
echo Installing Skill-Forge Dependencies
echo ==============================================

echo.
echo [1/3] Installing Python Backend (ai-service)...
cd ai-service
python -m venv venv
call venv\Scripts\activate.bat
pip install -r requirements.txt
cd ..

echo.
echo [2/3] Installing Node API Gateway (api-gateway)...
cd api-gateway
call npm install
cd ..

echo.
echo [3/3] Installing Frontend Client (client)...
cd client
call npm install
cd ..

echo.
echo ==============================================
echo Setup Complete! All dependencies are installed.
echo ==============================================
pause
