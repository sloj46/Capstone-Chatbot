from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
import httpx
import os

app = FastAPI(title="Dify Proxy Service")

# 允许前端跨域
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 生产环境应替换为具体域名
    allow_methods=["*"],
    allow_headers=["*"],
)

DIFY_URL = "http://localhost:8080/v1/chat-messages"
# DIFY_KEY = os.getenv("DIFY_API_KEY")  # 从环境变量读取密钥
DIFY_KEY = "app-cUA4C7Z8o22xMSmpjeRyYysX" # 从环境变量读取密钥

# @app.post("/api/chat")
# async def chat_proxy(request: Request):
#     """流式转发请求到Dify"""
#     payload = await request.json()
    
#     async def forward_stream():
#         async with httpx.AsyncClient() as client:
#             async with client.stream(
#                 "POST",
#                 DIFY_URL,
#                 headers={"Authorization": f"Bearer {DIFY_KEY}"},
#                 json=payload
#             ) as response:
#                 async for chunk in response.aiter_text():
#                     yield chunk
    
#     return StreamingResponse(forward_stream())

@app.post("/api/chat")
async def chat_proxy(request: Request):
    """流式转发请求到Dify"""
    payload = await request.json()
    
    # 设置更长的超时时间（例如60秒）
    timeout = httpx.Timeout(480.0, read=480.0)
    
    async def forward_stream():
        async with httpx.AsyncClient(timeout=timeout) as client:  # 添加超时设置
            try:
                async with client.stream(
                    "POST",
                    DIFY_URL,
                    headers={
                        "Authorization": f"Bearer {DIFY_KEY}",
                        "Content-Type": "application/json",
                        "Accept": "text/event-stream"
                    },
                    json=payload
                ) as response:
                    async for chunk in response.aiter_bytes():
                        yield chunk
            except httpx.ReadTimeout:
                # 超时后返回一个错误消息事件
                yield 'data: {"event": "error", "answer": "请求超时，请稍后再试"}\n\n'.encode('utf-8')
    
    return StreamingResponse(
        forward_stream(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no"
        }
    )


# 先在终端运行该中间件, 再启动前端程序    python -m uvicorn dify_proxy:app --reload --port 8000

