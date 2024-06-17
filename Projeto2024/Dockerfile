FROM python:3

WORKDIR /app

COPY ./WhiteBoardImport.py .
COPY ./data .

RUN pip install --no-cache-dir requests

CMD ["python3", "WhiteBoardImport.py","data","setup"]