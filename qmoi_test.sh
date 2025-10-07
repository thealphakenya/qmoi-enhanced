#!/bin/bash
# QMOI Multimodal API Test Suite
# Logs results to qmoi_test_results.log

set -e
LOG=qmoi_test_results.log
echo "QMOI API Test Run $(date)" > $LOG

export QMOI_API_KEY="your_qmoi_api_key_here"
export QMOI_API_BASE="http://localhost:3000/v1"

run_test() {
  echo -e "\n===== $1 =====" | tee -a $LOG
  eval "$2" | tee -a $LOG
}

# 1. Basic Text Chat
test1="curl -s $QMOI_API_BASE/chat/completions -H 'Content-Type: application/json' -H 'Authorization: Bearer $QMOI_API_KEY' -d '{\"model\":\"qmoi\",\"messages\":[{\"role\":\"system\",\"content\":\"You are a friendly AI that replies casually to text messages.\"},{\"role\":\"user\",\"content\":\"Hey, what’s up?\"}]}'"
run_test "Basic Text Chat" "$test1"

# 2. Multi-turn Conversation
test2="curl -s $QMOI_API_BASE/chat/completions -H 'Content-Type: application/json' -H 'Authorization: Bearer $QMOI_API_KEY' -d '{\"model\":\"qmoi\",\"messages\":[{\"role\":\"system\",\"content\":\"You are a friendly, context-aware assistant.\"},{\"role\":\"user\",\"content\":\"What’s your favorite color?\"},{\"role\":\"assistant\",\"content\":\"I think blue looks great — calm and clear.\"},{\"role\":\"user\",\"content\":\"Cool, what about matching foods?\"}]}'"
run_test "Multi-turn Conversation" "$test2"

# 3. Multimodal Input (image + text)
test3="curl -s $QMOI_API_BASE/chat/completions -H 'Content-Type: application/json' -H 'Authorization: Bearer $QMOI_API_KEY' -d '{\"model\":\"qmoi\",\"messages\":[{\"role\":\"user\",\"content\":[{\"type\":\"text\",\"text\":\"What do you see in this image?\"},{\"type\":\"image_url\",\"image_url\":\"https://example.com/dog.jpg\"}]}]}'"
run_test "Multimodal Input (image + text)" "$test3"

# 4. Multimodal Reasoning
test4="curl -s $QMOI_API_BASE/chat/completions -H 'Content-Type: application/json' -H 'Authorization: Bearer $QMOI_API_KEY' -d '{\"model\":\"qmoi\",\"messages\":[{\"role\":\"user\",\"content\":[{\"type\":\"text\",\"text\":\"How many people are wearing hats in this picture?\"},{\"type\":\"image_url\",\"image_url\":\"https://example.com/group_photo.jpg\"}]}]}'"
run_test "Multimodal Reasoning" "$test4"

# 5. Structured Output (JSON Mode)
test5="curl -s $QMOI_API_BASE/chat/completions -H 'Content-Type: application/json' -H 'Authorization: Bearer $QMOI_API_KEY' -d '{\"model\":\"qmoi\",\"response_format\":{\"type\":\"json_object\"},\"messages\":[{\"role\":\"user\",\"content\":\"Extract the name, age, and city from: Sarah, 28, from Berlin.\"}]}'"
run_test "Structured Output (JSON Mode)" "$test5"

# 6. Streaming Responses
test6="curl -N $QMOI_API_BASE/chat/completions -H 'Content-Type: application/json' -H 'Authorization: Bearer $QMOI_API_KEY' -d '{\"model\":\"qmoi\",\"stream\":true,\"messages\":[{\"role\":\"user\",\"content\":\"Tell me a short poem about the ocean.\"}]}'"
run_test "Streaming Responses" "$test6"

# 7. Function Calling / Tool Use
test7="curl -s $QMOI_API_BASE/chat/completions -H 'Content-Type: application/json' -H 'Authorization: Bearer $QMOI_API_KEY' -d '{\"model\":\"qmoi\",\"tools\":[{\"type\":\"function\",\"function\":{\"name\":\"get_weather\",\"description\":\"Get current weather info\",\"parameters\":{\"type\":\"object\",\"properties\":{\"location\":{\"type\":\"string\"}},\"required\":[\"location\"]}}}],\"messages\":[{\"role\":\"user\",\"content\":\"What’s the weather like in Tokyo right now?\"}]}'"
run_test "Function Calling / Tool Use" "$test7"

# 8. Embeddings
test8="curl -s $QMOI_API_BASE/embeddings -H 'Content-Type: application/json' -H 'Authorization: Bearer $QMOI_API_KEY' -d '{\"model\":\"qmoi-embed\",\"input\":\"Artificial intelligence is amazing.\"}'"
run_test "Embeddings" "$test8"

echo -e "\nAll tests completed. See $LOG for details."
