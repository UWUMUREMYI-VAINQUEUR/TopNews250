from langdetect import detect, DetectorFactory, LangDetectException

# Make detection deterministic
DetectorFactory.seed = 0


def detect_language(text: str) -> str:
    """
    Detect language safely.
    Returns ISO code: en, fr, rw, sw, etc.
    Defaults to 'en' if unsure.
    """

    if not text or len(text.strip()) < 40:
        return "en"  # too short → assume English

    try:
        lang = detect(text)

        # Normalize common cases
        if lang in ["en", "fr", "rw", "sw", "ar"]:
            return lang

        return "en"

    except LangDetectException:
        return "en"
