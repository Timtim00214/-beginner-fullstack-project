// ===== DOM元素获取 =====(Document Object Model)
const inputBox = document.getElementById('inputBox');
const sendButton = document.getElementById('send');
const outputBox = document.getElementById('outputBox');
const outText = document.getElementById("outText")
//按钮“点击”监听器

// 定义一个异步函数 (async)
async function sendMessage() {
    const userText = inputBox.value;
//空输入校验
    if (userText.trim() === "") {
        alert("请先输入内容");
        return;
    }
    if (!inputBox) return;

    // 1. 告诉用户正在发送 (UI反馈)
    outText.innerText = "AI 正在思考中...";
    try {
        // 2. 发起网络请求 (向后端 main.py 发送数据)
        //后端接口地址 http://127.0.0.1:3901/chat
        const response = await fetch('http://127.0.0.1:3901/chat', {
            method: 'POST', // 发送数据通常用 POST
            headers: {
                'Content-Type': 'application/json' // 告诉后端我发的是 JSON
            },
            // 把 JS 对象转换成 JSON 字符串发过去
            body: JSON.stringify({ message: userText }) 
        });

        // 3. 等待后端返回结果
        const data = await response.json();
        
        // 4. 显示后端返回的消息 (假设后端返回格式是 { reply: "..." })
        outText.innerText = "modelid" +"回复: " + data.reply;

    } catch (error) {
        // 如果断网了或者后端报错
        console.error('Error:', error);
        outText.innerText = "连接服务器失败，请检查网络和服务器设置。";
    }
}

// 绑定点击事件
sendButton.addEventListener('click', sendMessage);
// 监听输入框的键盘按下事件
inputBox.addEventListener('keypress', function(event) {
    // Enter 键的 keyCode 是 13，或者直接判断 key === 'Enter'
    if (event.key === 'Enter') {
        sendMessage(); // 直接调用上面的发送函数
    }
});