
// ===== 基础功能函数 =====
function validateInput(text) {
    if (!text || text.trim() === '') {
        alert('请输入消息内容');
        return false;
    }
    if (text.length > 500) {
        alert('消息长度不能超过500字符');
        return false;
    }
    return true;
}

function displayMessage(message, isUser = true) {
    const messageDiv = document.createElement('div');
    messageDiv.className = isUser ? 'user-message' : 'response-message';
    messageDiv.textContent = message;
    outputBox.appendChild(messageDiv);
    outputBox.scrollTop = outputBox.scrollHeight; // 自动滚动到底部
}

function clearInput() {
    inputBox.value = '';
}

// ===== 场景1：发送给后端API =====

// 方法1：使用Fetch API（现代推荐方法）
async function sendToBackendFetch(message) {
    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: message })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data.response;
    } catch (error) {
        console.error('发送消息失败:', error);
        return '抱歉，发送消息时出现错误';
    }
}

// 方法2：使用XMLHttpRequest（传统方法）
function sendToBackendXHR(message) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', '/api/chat', true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        
        xhr.onload = function() {
            if (xhr.status === 200) {
                try {
                    const data = JSON.parse(xhr.responseText);
                    resolve(data.response);
                } catch (error) {
                    reject('解析响应失败');
                }
            } else {
                reject(`请求失败，状态码: ${xhr.status}`);
            }
        };
        
        xhr.onerror = function() {
            reject('网络错误');
        };
        
        xhr.send(JSON.stringify({ message: message }));
    });
}

// 方法3：使用Axios（第三方库，需要引入axios）
// 注意：需要先引入axios库，例如：<script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
async function sendToBackendAxios(message) {
    try {
        const response = await axios.post('/api/chat', { message: message });
        return response.data.response;
    } catch (error) {
        console.error('发送消息失败:', error);
        return '抱歉，发送消息时出现错误';
    }
}

// ===== 场景2：本地处理 =====

// 方法1：简单回显（本地模拟）
function processLocallyEcho(message) {
    // 模拟处理延迟
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(`你说了: ${message}`);
        }, 500);
    });
}

// 方法2：本地AI模拟回复
function processLocallyAI(message) {
    return new Promise((resolve) => {
        setTimeout(() => {
            const responses = [
                '这是一个有趣的看法！',
                '你能详细说明一下吗？',
                '我明白了，还有其他想法吗？',
                '这个观点很有启发性！',
                '谢谢分享你的想法！'
            ];
            const randomResponse = responses[Math.floor(Math.random() * responses.length)];
            resolve(randomResponse);
        }, 800);
    });
}

// 方法3：本地关键词匹配回复
function processLocallyKeyword(message) {
    return new Promise((resolve) => {
        setTimeout(() => {
            const lowerMessage = message.toLowerCase();
            if (lowerMessage.includes('你好') || lowerMessage.includes('hello')) {
                resolve('你好！很高兴和你聊天！');
            } else if (lowerMessage.includes('帮助') || lowerMessage.includes('help')) {
                resolve('我可以和你聊天，请随意输入任何内容！');
            } else if (lowerMessage.includes('时间')) {
                resolve(`当前时间: ${new Date().toLocaleString()}`);
            } else {
                resolve(`我收到了你的消息: "${message}"`);
            }
        }, 600);
    });
}

// ===== 主处理函数 =====

// 方法A：使用Fetch API发送到后端
async function handleSendFetch() {
    const message = inputBox.value.trim();
    if (!validateInput(message)) return;
    
    displayMessage(message, true);
    clearInput();
    
    const response = await sendToBackendFetch(message);
    displayMessage(response, false);
}

// 方法B：使用XMLHttpRequest发送到后端
async function handleSendXHR() {
    const message = inputBox.value.trim();
    if (!validateInput(message)) return;
    
    displayMessage(message, true);
    clearInput();
    
    try {
        const response = await sendToBackendXHR(message);
        displayMessage(response, false);
    } catch (error) {
        displayMessage(`错误: ${error}`, false);
    }
}

// 方法C：本地处理 - 回显模式
async function handleSendLocalEcho() {
    const message = inputBox.value.trim();
    if (!validateInput(message)) return;
    
    displayMessage(message, true);
    clearInput();
    
    const response = await processLocallyEcho(message);
    displayMessage(response, false);
}

// 方法D：本地处理 - AI模拟模式
async function handleSendLocalAI() {
    const message = inputBox.value.trim();
    if (!validateInput(message)) return;
    
    displayMessage(message, true);
    clearInput();
    
    const response = await processLocallyAI(message);
    displayMessage(response, false);
}

// 方法E：本地处理 - 关键词匹配模式
async function handleSendLocalKeyword() {
    const message = inputBox.value.trim();
    if (!validateInput(message)) return;
    
    displayMessage(message, true);
    clearInput();
    
    const response = await processLocallyKeyword(message);
    displayMessage(response, false);
}

// ===== 事件监听器设置 =====

// 设置默认使用的方法（可以根据需要切换）
function setupEventListeners() {
    // 方法1：点击发送按钮
    sendButton.addEventListener('click', handleSendLocalKeyword); // 默认使用关键词匹配
    
    // 方法2：按Enter键发送（在输入框中）
    inputBox.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            handleSendLocalKeyword(); // 使用相同的方法
        }
    });
    
    // 方法3：表单提交事件（如果input和button在form元素内）
    // document.querySelector('form').addEventListener('submit', function(event) {
    //     event.preventDefault(); // 阻止表单默认提交
    //     handleSendLocalKeyword();
    // });
}

// ===== 初始化 =====
document.addEventListener('DOMContentLoaded', function() {
    setupEventListeners();
    console.log('聊天功能已初始化');
    
    // 显示欢迎消息
    setTimeout(() => {
        displayMessage('你好！我是AI助手，请开始聊天吧！', false);
    }, 1000);
});

// ===== 额外功能：方法切换器（用于测试不同方法） =====
function switchMethod(methodName) {
    // 移除现有的事件监听器
    sendButton.replaceWith(sendButton.cloneNode(true));
    const newSendButton = document.getElementById('send');
    
    // 根据方法名设置新的事件监听器
    switch(methodName) {
        case 'fetch':
            newSendButton.addEventListener('click', handleSendFetch);
            inputBox.onkeypress = function(event) {
                if (event.key === 'Enter') handleSendFetch();
            };
            break;
        case 'xhr':
            newSendButton.addEventListener('click', handleSendXHR);
            inputBox.onkeypress = function(event) {
                if (event.key === 'Enter') handleSendXHR();
            };
            break;
        case 'echo':
            newSendButton.addEventListener('click', handleSendLocalEcho);
            inputBox.onkeypress = function(event) {
                if (event.key === 'Enter') handleSendLocalEcho();
            };
            break;
        case 'ai':
            newSendButton.addEventListener('click', handleSendLocalAI);
            inputBox.onkeypress = function(event) {
                if (event.key === 'Enter') handleSendLocalAI();
            };
            break;
        case 'keyword':
        default:
            newSendButton.addEventListener('click', handleSendLocalKeyword);
            inputBox.onkeypress = function(event) {
                if (event.key === 'Enter') handleSendLocalKeyword();
            };
            break;
    }
    
    console.log(`已切换到方法: ${methodName}`);
}

// 为了方便测试，将切换函数暴露到全局作用域
window.switchMethod = switchMethod;
