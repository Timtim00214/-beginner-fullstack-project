@echo off
color 0A
:: ==========================================
::      Tim's AI Project - Auto Sync v2.0
:: ==========================================

:: 1. 核心修正：定位到当前脚本所在的目录
:: 无论你在哪里运行此脚本，都会自动跳转到项目文件夹
cd /d "%~dp0"

echo [Info] Current Directory: %cd%
echo.

:: 2. 检查 Git 是否安装
git --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [Error] Git ignores you. Please install Git first.
    pause
    exit
)

:: 3. 添加所有变动
echo [Step 1/4] Adding files...
git add .

:: 4. 询问更新日志
:ask_commit
set "commit_msg="
set /p commit_msg="[Input] Enter commit message: "
if "%commit_msg%"=="" goto ask_commit

:: 5. 提交存档
echo.
echo [Step 2/4] Committing...
git commit -m "%commit_msg%"

:: 6. 推送到 GitHub (origin)
echo.
echo [Step 3/4] Pushing to GitHub (origin)...
git push origin main
if %errorlevel% neq 0 (
    color 0C
    echo [Warning] GitHub push failed! Check your network or proxy.
) else (
    echo [Success] GitHub synced.
)

:: 7. 推送到 Gitee (gitee)
echo.
echo [Step 4/4] Pushing to Gitee (remote: gitee)...
git push gitee main
if %errorlevel% neq 0 (
    color 0C
    echo [Warning] Gitee push failed! Check your password or network.
) else (
    echo [Success] Gitee synced.
)

echo.
echo ==========================================
echo             All Tasks Finished
echo ==========================================
pause