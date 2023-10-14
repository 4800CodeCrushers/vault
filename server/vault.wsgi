import sys
import logging

sys.path.insert(0, '/var/www/html/vault/server')
sys.path.insert(0, '/usr/lib/python3/dist-packages')
sys.path.insert(0, '/home/ubuntu/.local/lib/python3.10/site-packages')


# Set up logging
logging.basicConfig(stream=sys.stderr, level=logging.DEBUG)

from app import app as application