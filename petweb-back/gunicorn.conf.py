# gunicorn --bind 0.0.0.0:8000 backend.wsgi:application
# gunicorn -c gunicorn.conf.py backend.wsgi
# nohup gunicorn -c gunicorn.conf.py backend.wsgi &
bind = "0.0.0.0:8100"                   # Don't use port 80 becaue nginx occupied it already.
errorlog = '/Users/dwnusa/workspace/SNU/log/gunicorn-error.log'  # Make sure you have the log folder create
accesslog = '/Users/dwnusa/workspace/SNU/log/gunicorn-access.log'
loglevel = 'debug'
workers = 2     # the number of recommended workers is '2 * number of CPUs + 1'