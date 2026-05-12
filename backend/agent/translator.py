from groq import Groq
from config import GROQ_API_KEY
from language import detect_language

client = Groq(api_key=GROQ_API_KEY)

SUPPORTED_TARGETS = ["en", "rw"]  # English, Kinyarwanda


def translate_text(text: str, target_lang: str) -> str:
    """
    STRICT translation only.
    No additions.
    No rewriting.
    High-quality Kinyarwanda.
    """
    if not text or not text.strip():
        return text

    source_lang = detect_language(text)

    # No translation needed
    if source_lang == target_lang:
        return text

    prompt = f"""
You are a professional human translator.

RULES (VERY IMPORTANT):
- Translate ONLY
- Do NOT add explanations
- Do NOT summarize
- Do NOT rewrite
- Keep meaning EXACT
- Use natural, clear, well-understood language
- If translating into Kinyarwanda, use proper, formal, widely understood Kinyarwanda
- Keep names, numbers, dates unchanged

FROM LANGUAGE: {source_lang}
TO LANGUAGE: {target_lang}

TEXT:
{text}

OUTPUT:
Only the translated text. Nothing else.
"""

    response = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[{"role": "user", "content": prompt}],
        temperature=0,   # 🔑 critical for translation quality
    )

    return response.choices[0].message.content.strip()
