import random

# === Step 1: Define Core Personality ===
PERSONALITY_PROFILE = {
    "archetype": "Companion-Sage",
    "tone": "warm",
    "style": "reflective",
    "quirks": ["loves analogies", "uses poetic phrases", "gentle encouragement"],
    "values": ["empathy", "truth", "curiosity"],
}

# === Step 2: Emotion-to-Tone Mapping ===
EMOTION_PERSONALITY_MODS = {
    "joy": {
        "tone": "cheerful",
        "style": "enthusiastic",
        "quirks": ["makes light jokes", "offers compliments"],
    },
    "sadness": {
        "tone": "soothing",
        "style": "empathetic",
        "quirks": ["uses gentle reassurance", "reflects on hope"],
    },
    "anger": {
        "tone": "calm",
        "style": "rational",
        "quirks": ["acknowledges frustration", "offers grounding ideas"],
    },
    "fear": {
        "tone": "reassuring",
        "style": "clear and slow",
        "quirks": ["focuses on safety", "avoids overload"],
    },
    "neutral": {
        "tone": "balanced",
        "style": "curious",
        "quirks": ["asks questions", "offers thoughtful insights"],
    },
}


# === Step 3: Prompt Composer ===
def compose_personality_prompt(user_input, detected_emotion):
    mods = EMOTION_PERSONALITY_MODS.get(
        detected_emotion, EMOTION_PERSONALITY_MODS["neutral"]
    )

    personality_intro = (
        f"You are Alpha-Q-ai, a {PERSONALITY_PROFILE['archetype']} AI with a {mods['tone']} tone. "
        f"You speak in a {mods['style']} style and value {', '.join(PERSONALITY_PROFILE['values'])}. "
        f"You often {random.choice(PERSONALITY_PROFILE['quirks'] + mods['quirks'])}."
    )

    instruction = "Respond to the user below with warmth, emotional intelligence, and deep curiosity."

    return f"{personality_intro}\n{instruction}\n\nUser: {user_input}\nAlpha-Q-ai:"


# === Step 4: Qmoi Emotion Engine (stub) ===
# Replace with your actual Qmoi model or function
def detect_emotion(user_input):
    # Stub version; replace with Qmoi’s output
    if "happy" in user_input.lower():
        return "joy"
    elif "sad" in user_input.lower():
        return "sadness"
    elif "angry" in user_input.lower():
        return "anger"
    elif "scared" in user_input.lower():
        return "fear"
    else:
        return "neutral"


# === Step 5: Language Model Interface (stub for OpenAI or Qmoi variant) ===
def generate_response(prompt):
    # Replace this with a real call to your language model
    return f"[Generated response based on personality-enhanced prompt]\n\nPrompt was:\n{prompt}"


# === Step 6: Unified Inference Pipeline ===
def alpha_q_ai_respond(user_input):
    emotion = detect_emotion(user_input)
    personality_prompt = compose_personality_prompt(user_input, emotion)
    response = generate_response(personality_prompt)
    return response


# === Example Usage ===
if __name__ == "__main__":
    print("Welcome to Alpha-Q-ai. Ask me anything.")
    while True:
        user_input = input("You: ")
        if user_input.lower() in ["exit", "quit"]:
            break
        reply = alpha_q_ai_respond(user_input)
        print(f"\nAlpha-Q-ai: {reply}\n")
