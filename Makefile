DEFAULT_GOAL:  pythonanalysis

.PHONY: pythonanalysis
pythonanalysis:
	pip install --upgrade -r requirements.txt
	python3  code/python/a0000_main.py
	python3 -m http.server
	python3 -mwebbrowser http://127.0.0.1:8000
