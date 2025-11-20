print("hello world,Tim!")
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware as CM
from pydantic import BaseModel

app = FastAPI()
app.add_middleware(
    CM,
    allow_origins=["*"],  # 生产环境要改具体域名，开发环境用 * (允许所有人连接)
    allow_credentials=True,
    allow_methods=["*"],  # 允许 GET, POST 等所有动作
    allow_headers=["*"],  # 允许所有 HTTP 头
)
class UserRequest(BaseModel):
    message: str
#定义接口 (API Endpoint)
# @app.post 也是一个装饰器。
# 如果有人向 http://IP:端口/chat 发送 POST 请求，就激活下面这个函数。
@app.post("/chat")
async def chat_endpoint(request: UserRequest):
#request: 自动把前端发来的 JSON 解析成 python 对象

    print(f"收到前端发来的指令: {request.message}")
    
    # 简单的回声逻辑
    ai_response = f"收到！你刚才说了：{request.message}。但还没接服务。"

    # 返回字典，FastAPI 会自动把它打包成 JSON 发回给前端
    return {"reply": ai_response}




# 测试用的根目录
@app.get("/")
def read_root():
    return {"Status": "Server is running", "Owner": "Tim"}
if __name__ == "__main__":
    import uvicorn
    # 这里直接指定 host 和 port
    # reload=True 在代码里启动时通常只在调试模式下生效，且在某些系统下可能需要特殊配置
    # 但为了简单，先这样写
    print("正在启动服务器，端口: 3901...")
    print("请不要关闭此窗口，否则服务器会停止。")
    
    # run 方法是阻塞的，它会一直卡在这里运行，直到你按 Ctrl+C
    uvicorn.run(app, host="127.0.0.1", port=3901)
