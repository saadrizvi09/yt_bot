"""
Text Preprocessing Module.
Handles cleaning, autocorrection, and spam/troll filtering.
"""

import re
import logging
from typing import List, Dict, Any, Tuple
import emoji
from autocorrect import Speller
from app.config import get_settings
from app.models import CommentType

logger = logging.getLogger(__name__)
settings = get_settings()

# Initialize speller for autocorrect (lazy load)
_speller = None


def get_speller() -> Speller:
    """Get or create the speller instance (lazy loading)."""
    global _speller
    if _speller is None:
        _speller = Speller(lang='en')
    return _speller


def clean_text(text: str) -> str:
    """
    Clean and normalize comment text.
    
    Steps:
    1. Convert emojis to text representation
    2. Remove URLs
    3. Remove excessive whitespace
    4. Remove special characters but keep punctuation
    5. Normalize unicode characters
    """
    if not text:
        return ""
    
    # Convert emojis to text (e.g., 😀 -> :grinning_face:)
    text = emoji.demojize(text, delimiters=(" ", " "))
    
    # Remove URLs
    text = re.sub(r'http[s]?://\S+', '', text)
    text = re.sub(r'www\.\S+', '', text)
    
    # Remove timestamps (common in YouTube comments)
    text = re.sub(r'\d{1,2}:\d{2}(:\d{2})?', '', text)
    
    # Remove @ mentions
    text = re.sub(r'@\w+', '', text)
    
    # Remove hashtags but keep the word
    text = re.sub(r'#(\w+)', r'\1', text)
    
    # Normalize repeated characters (e.g., "sooooo" -> "soo")
    text = re.sub(r'(.)\1{3,}', r'\1\1', text)
    
    # Remove excessive punctuation
    text = re.sub(r'[!]{2,}', '!', text)
    text = re.sub(r'[?]{2,}', '?', text)
    text = re.sub(r'[.]{3,}', '...', text)
    
    # Remove non-ASCII characters (except common ones)
    text = re.sub(r'[^\x00-\x7F]+', ' ', text)
    
    # Normalize whitespace
    text = re.sub(r'\s+', ' ', text).strip()
    
    return text


def autocorrect_text(text: str) -> str:
    """
    Apply autocorrection to fix common typos.
    Uses selective correction to avoid over-correcting slang.
    """
    if not text or len(text) < 3:
        return text
    
    try:
        speller = get_speller()
        
        # Split into words and selectively correct
        words = text.split()
        corrected_words = []
        
        # Common internet slang to preserve
        preserve_words = {
            'lol', 'lmao', 'omg', 'btw', 'idk', 'imo', 'imho', 'tbh',
            'ngl', 'fr', 'gg', 'ez', 'pog', 'poggers', 'bruh', 'bro',
            'dude', 'lit', 'goat', 'goated', 'sus', 'cap', 'nocap',
            'vibes', 'vibe', 'fire', 'based', 'cringe', 'yeet', 'fam'
        }
        
        for word in words:
            word_lower = word.lower().strip('.,!?;:')
            
            # Preserve slang, short words, and words with numbers
            if (word_lower in preserve_words or 
                len(word) <= 2 or 
                any(c.isdigit() for c in word)):
                corrected_words.append(word)
            else:
                # Only correct obviously misspelled words
                corrected = speller(word)
                corrected_words.append(corrected)
        
        return ' '.join(corrected_words)
    except Exception as e:
        logger.warning(f"Autocorrect failed: {e}")
        return text


def detect_spam(text: str, author: str = "") -> bool:
    """
    Detect if a comment is spam based on keywords and patterns.
    Uses multi-signal detection to reduce false positives (e.g., "VERY GOOD VIDEO").
    
    Spam Keywords: Instant spam (definitive indicator)
    Other Signals: Require 2+ signals to flag as spam
    """
    text_lower = text.lower()
    
    # SIGNAL 0: Spam keywords (strongest indicator - immediate flag)
    for keyword in settings.SPAM_KEYWORDS:
        if keyword.lower() in text_lower:
            return True  # Keywords alone are definitive spam
    
    # Count additional spam signals
    spam_signals = 0
    
    # SIGNAL 1: Excessive caps (shouting)
    # Changed threshold from 0.7 (70%) to 0.85 (85%) to avoid false positives
    # "VERY GOOD VIDEO" = 86.7% but is legitimate enthusiasm
    if len(text) > 10:
        caps_ratio = sum(1 for c in text if c.isupper()) / len(text)
        if caps_ratio > 0.85:
            spam_signals += 1
    
    # SIGNAL 2: Excessive emoji density
    # Changed threshold from 2.0 to 1.5 emoji per word
    emoji_count = emoji.emoji_count(text)
    if len(text) > 0:
        emoji_per_word = emoji_count / len(text.split())
        if emoji_per_word > 1.5:
            spam_signals += 1
    
    # SIGNAL 3: Repeated characters (indicating spam like "!!!!!!!" or "sooooo")
    if re.search(r'(.)\1{4,}', text):
        spam_signals += 1
    
    # SIGNAL 4: Promo/self-promotion patterns
    promo_patterns = [
        r'sub(scribe)?\s*(to)?\s*(my|me)',
        r'check\s*(out)?\s*(my|me)',
        r'follow\s*(me|my)',
        r'\d+\s*subscribers?',
        r'gift\s*card',
        r'free\s*(money|cash|gift)',
    ]
    
    for pattern in promo_patterns:
        if re.search(pattern, text_lower):
            spam_signals += 1
            break  # Count promo only once
    
    # Require at least 2 signals to flag as spam
    # This prevents false positives like "VERY GOOD VIDEO" (only 1 signal: caps)
    # But catches real spam like "BUY NOW!!! 🔥🔥" (3 signals: caps + emoji + promo)
    return spam_signals >= 2


def detect_troll(text: str) -> bool:
    """
    Detect if a comment is a troll comment (low-effort, provocative).
    """
    text_lower = text.lower().strip()
    
    # Check for troll indicators
    for indicator in settings.TROLL_INDICATORS:
        if text_lower == indicator.lower() or text_lower.startswith(indicator.lower()):
            return True
    
    # "First" comment variations
    if re.match(r'^(first|1st|i\'?m first)!*$', text_lower):
        return True
    
    # Ratio spam
    if re.match(r'^ratio!*$', text_lower) or 'L + ratio' in text_lower:
        return True
    
    # "Nobody:" meme format (often low-effort)
    if re.match(r'^(nobody|no\s*one|literally\s*nobody):', text_lower):
        return True
    
    # Very short provocative comments
    if len(text_lower) <= 5 and text_lower in ['mid', 'bad', 'trash', 'fake', 'cap', 'l', 'w']:
        return True
    
    return False


def classify_comment(text: str, author: str = "") -> CommentType:
    """
    Classify a comment as normal, spam, or troll.
    """
    if detect_spam(text, author):
        return CommentType.SPAM
    
    if detect_troll(text):
        return CommentType.TROLL
    
    return CommentType.NORMAL


def is_valid_comment(text: str) -> bool:
    """
    Check if a comment is valid for analysis.
    """
    if not text:
        return False
    
    # Too short
    if len(text.strip()) < settings.MIN_COMMENT_LENGTH:
        return False
    
    # Only whitespace/punctuation
    if not re.search(r'[a-zA-Z]', text):
        return False
    
    return True


def preprocess_comments(comments: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """
    Full preprocessing pipeline for comments.
    
    Args:
        comments: List of raw comment dictionaries
        
    Returns:
        List of preprocessed comment dictionaries with additional fields
    """
    processed = []
    
    for comment in comments:
        text = comment.get('text', '')
        
        # Skip invalid comments
        if not is_valid_comment(text):
            continue
        
        # Clean the text
        clean = clean_text(text)
        
        # Skip if cleaning made it invalid
        if not is_valid_comment(clean):
            continue
        
        # Autocorrect (light touch)
        corrected = autocorrect_text(clean)
        
        # Truncate if too long
        if len(corrected) > settings.MAX_COMMENT_LENGTH:
            corrected = corrected[:settings.MAX_COMMENT_LENGTH] + "..."
        
        # Classify comment type
        comment_type = classify_comment(corrected, comment.get('author', ''))
        
        # Add preprocessed data
        processed_comment = {
            **comment,
            'text_original': text,
            'text_clean': corrected,
            'comment_type': comment_type,
            'is_filtered': comment_type != CommentType.NORMAL
        }
        
        processed.append(processed_comment)
    
    logger.info(f"Preprocessed {len(processed)} comments from {len(comments)} total")
    
    # Log filter stats
    spam_count = sum(1 for c in processed if c['comment_type'] == CommentType.SPAM)
    troll_count = sum(1 for c in processed if c['comment_type'] == CommentType.TROLL)
    logger.info(f"Filtered: {spam_count} spam, {troll_count} troll comments")
    
    return processed
