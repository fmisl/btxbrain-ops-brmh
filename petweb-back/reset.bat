@ECHO OFF
SET killport=8002
for /f "tokens=5" %%p in ('netstat -aon ^| find /i "listening" ^| find "%killport%"') do taskkill /F /PID %%p
cd C:\Users\dwnusa\AppData\Local\Jenkins\.jenkins\workspace\petweb\petweb-back
pip install --upgrade pip 
pip install -r requirements.txt
python manage.py makemigrations
python manage.py migrate
python manage.py runserver 0.0.0.0:8002
