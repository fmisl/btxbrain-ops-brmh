# This is Backbone Logic

## Step1. Setup Environment settings

1. Create python virtualenv

```
> python -m venv venv

  # Win10
> source venv/Scripts/activate

  # Linux or OSX
> source venv/bin/activate
```

2. Check if python version == 3.6.x (in Win10) or 3.9 (in MAC M1)

```
(venv)
> python --version
Python 3.6.8
```

3. Check if pip version >= 21.2.2

```
(venv)
> pip --version
pip 18.1

(venv)
> python -m pip install --upgrade pip

(venv)
> pip --version
pip 21.2.2
```

4. Install dependencies lists on the requirements.txt
   - Win10: requirements-win.txt
   - OSX: requirements-mac.txt
   - Linux: requirements-linux.txt

```
(venv)
> pip install -r requirements.txt
```

5. Migrate sqlite3 database

```
(venv)
> python manage.py makemigrations

(venv)
> python manage.py migrate
```

6. Create superuser (Optional)

```
(venv)
> python manage.py createsuperuser
```
