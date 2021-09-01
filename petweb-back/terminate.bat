@ECHO OFF
SET killport=8002
for /f "tokens=5" %%p in ('netstat -aon ^| find /i "listening" ^| find "%killport%"') do taskkill /F /PID %%p