FROM python:3.11-slim
LABEL "language"="python"
LABEL "framework"="fastapi"

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PORT=8000

WORKDIR /app

# 复制 backend 目录的依赖文件
COPY backend/requirements.txt .

# 安装 Python 依赖
RUN pip install --no-cache-dir -r requirements.txt

# 复制整个 backend 目录到 /app
COPY backend/ .

# 创建 uploads 目录
RUN mkdir -p uploads

EXPOSE 8000

# 使用 uvicorn 启动应用
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]