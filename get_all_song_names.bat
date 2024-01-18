@echo off
setlocal EnableDelayedExpansion

set "folderPath=.\assets_music\music"
set "outputFile=audio_list.txt"
set "tempFile=temp.txt"
set "output="

REM Get .mp3 files
for /r "%folderPath%" %%F in (*.mp3) do (
    for /f "delims=" %%A in ("%%~nF") do set "output=!output!, '%%A'"
)

REM Get .wav files
for /r "%folderPath%" %%F in (*.wav) do (
    for /f "delims=" %%A in ("%%~nF") do set "output=!output!, '%%A'"
)

REM Remove leading comma and space, add brackets
set "output=[%output:~2%]"

REM Write output to file using PowerShell with UTF-8 encoding
echo !output! | PowerShell -NoProfile -Command "[Console]::OutputEncoding = [System.Text.Encoding]::UTF8; Out-File -FilePath .\%outputFile% -InputObject (Read-Host -Prompt 'Enter text') -Encoding UTF8"

copy .\audio_list.txt .\assets_music\js\audio_list.txt



endlocal
