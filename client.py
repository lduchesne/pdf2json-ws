#!/usr/bin/env python
import os
import sys
import json
import requests
from pprint import pprint

if len(sys.argv) < 2:
    print("Usage: {0} /path/to/file.pdf".format(sys.argv[0]));
    sys.exit(1)

url      = 'http://localhost:8080/pdf'
filename = sys.argv[1]

files = [('pdf', (os.path.basename(filename), open(filename, 'rb'), 'application/pdf'))]
pprint(json.loads(requests.post(url, files=files).text))
