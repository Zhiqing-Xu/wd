@echo off
setlocal

:: Set your GitHub Personal Access Token here
set "GITHUB_TOKEN=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"

:: Check if Git is installed
git --version >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo Git is not installed. Please install Git and try again.
    exit /b 1
)

:: Initialize local repository
git init

:: Get the name of the current directory to use as the repository name
for %%I in ("%cd%") do set "REPO_NAME=%%~nxI"

:: Create GitHub repository
curl -H "Authorization: token %GITHUB_TOKEN%" -d "{\"name\":\"%REPO_NAME%\", \"private\": true}" https://api.github.com/user/repos

:: Add remote repository
git remote add origin https://github.com/zhiqing-xu/%REPO_NAME%.git

:: Add all files, commit, and push to GitHub
git add .
git commit -m "Initial commit"
git push -u origin master

endlocal

pause
