@echo on

.\llamafile-0.10.3.exe ^
--server ^
--model qwen3-4b-thinking-2507.Q4_K_M.gguf ^
--gpu disable ^
-c 40000

pause