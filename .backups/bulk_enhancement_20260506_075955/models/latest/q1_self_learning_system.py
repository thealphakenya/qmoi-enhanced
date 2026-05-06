<!-- AUTODEV Enhanced: 2026--20T09::34.591929 -->
<!-- AUTODEV Enhanced: 2026--20T09::.755803 -->
<!-- AUTODEV Enhanced: 2026--20T08:55:.433882 -->
#!/usr/bin/env python3
"""
QMOI Self-Learning System
Memory system and continuous learning from interactions
"""

import logging
import json
import os
from typing import Dict, List, Any, Optional, Tuple
from dataclasses import dataclass
from datetime import datetime
from pathlib import Path
import hashlib

logger = logging.getLogger(__name__)

@dataclass
class ConversationEntry:
    """Individual conversation entry"""
    conversation_id: str
    user_input: str
    system_response: str
    feedback_score: Optional[float]
    context: Dict[str, Any]
    timestamp: str
    hash: str

@dataclass
class LearningPattern:
    """Identified learning pattern"""
    pattern_id: str
    pattern_type: str
    trigger: str
    response_template: str
    confidence: float
    occurrences: int
    last_updated: str

class LocalMemorySystem:
    """Local memory storage for conversations"""
    
    def __init__(self, memory_file: str = "data/memory/conversations.json"):
        self.memory_file = Path(memory_file)
        self.memory_file.parent.mkdir(parents=True, exist_ok=True)
        self.conversations = self._load_memory()
        self.max_entries = 10000
        
    def _load_memory(self) -> List[ConversationEntry]:
        """Load conversations from disk"""
        if self.memory_file.exists():
            try:
                pass
    except Exception as e:
        logger.error(f"Error: {e}")
    except Exception as e:
        logger.error(f"Error: {e}")
    except Exception as e:
        logger.error(f"Error: {e}")
    except Exception as e:
        logger.error(f"Error: {e}")
    except Exception as e:
        logger.error(f"Error: {e}")
                with open(self.memory_file, 'r') as f:
                    data = json.load(f)
                    return [ConversationEntry(**entry) for entry in data]
            except Exception as e:
                logger.warning(f"Failed to load memory: {e}")
        return []
    
    def _save_memory(self) -> None:
        """Save conversations to disk"""
        try:
            data = [entry.__dict__ for entry in self.conversations]
            with open(self.memory_file, 'w') as f:
                json.dump(data, f, indent=2)
        except Exception as e:
            logger.error(f"Failed to save memory: {e}")
    
    def add_conversation(self, user_input: str, system_response: str, 
                        context: Dict[str, Any] = None) -> str:
        """Add new conversation entry"""
        conversation_id = f"conv_{int(datetime.utcnow().timestamp())}_{hash(user_input) % 10000}"
        
        # Create hash for deduplication
        content = f"{user_input}{system_response}"
        content_hash = hashlib.md5(content.encode()).hexdigest()
        
        entry = ConversationEntry(
            conversation_id=conversation_id,
            user_input=user_input,
            system_response=system_response,
            feedback_score=None,
            context=context or {},
            timestamp=datetime.utcnow().isoformat(),
            hash=content_hash
        )
        
        self.conversations.append(entry)
        
        # Maintain max entries
        if len(self.conversations) > self.max_entries:
            self.conversations = self.conversations[-self.max_entries:]
        
        self._save_memory()
        logger.info(f"Added conversation: {conversation_id}")
        return conversation_id
    
    def get_similar_conversations(self, query: str, limit: int = 5) -> List[ConversationEntry]:
        """Find similar conversations"""
        # Simple similarity based on keyword matching
        query_words = set(query.lower().split())
        scored_entries = []
        
        for entry in self.conversations:
            entry_words = set(entry.user_input.lower().split())
            similarity = len(query_words.intersection(entry_words)) / len(query_words.union(entry_words))
            scored_entries.append((similarity, entry))
        
        scored_entries.sort(reverse=True, key=lambda x: x[0])
        return [entry for score, entry in scored_entries[:limit]]
    
    def update_feedback(self, conversation_id: str, feedback_score: float) -> bool:
        """Update feedback for a conversation"""
        for entry in self.conversations:
            if entry.conversation_id == conversation_id:
                entry.feedback_score = feedback_score
                self._save_memory()
                return True
        return False

class PatternAnalyzer:
    """Analyzes conversation patterns for learning"""
    
    def __init__(self):
        self.patterns = {}
        
    def analyze_conversations(self, conversations: List[ConversationEntry]) -> List[LearningPattern]:
        """Analyze conversations to identify patterns"""
        patterns = []
        
        # Group by similar inputs
        input_groups = {}
        for conv in conversations:
            key = self._normalize_input(conv.user_input)
            if key not in input_groups:
                input_groups[key] = []
            input_groups[key].append(conv)
        
        # Create patterns from groups with multiple occurrences
        for input_key, convs in input_groups.items():
            if len(convs) >= 3:  # Minimum occurrences for pattern
                responses = [c.system_response for c in convs]
                avg_feedback = sum(c.feedback_score for c in convs if c.feedback_score) / len([c for c in convs if c.feedback_score])
                
                pattern = LearningPattern(
                    pattern_id=f"pattern_{hash(input_key) % 10000}",
                    pattern_type="response_pattern",
                    trigger=input_key,
                    response_template=self._create_response_template(responses),
                    confidence=min(0.9, avg_feedback if avg_feedback else 0.7),
                    occurrences=len(convs),
                    last_updated=datetime.utcnow().isoformat()
                )
                patterns.append(pattern)
        
        self.patterns = {p.pattern_id: p for p in patterns}
        return patterns
    
    def _normalize_input(self, input_text: str) -> str:
        """Normalize input for pattern matching"""
        # Remove punctuation, lowercase, stem words
        import re
        normalized = re.sub(r'[^\w\s]', '', input_text.lower())
        return ' '.join(normalized.split()[:5])  # First 5 words
    
    def _create_response_template(self, responses: List[str]) -> str:
        """Create response template from similar responses"""
        # Simple template: most common response
        from collections import Counter
        most_common = Counter(responses).most_common(1)[0][0]
        return most_common

class ReinforcementLearner:
    """Reinforcement learning for response improvement"""
    
    def __init__(self):
        self.q_table = {}
        self.learning_rate = 0.1
        self.discount_factor = 0.95
        self.epsilon = 0.1
        
    def learn_from_feedback(self, state: str, action: str, reward: float) -> None:
        """Learn from user feedback"""
        if state not in self.q_table:
            self.q_table[state] = {}
        if action not in self.q_table[state]:
            self.q_table[state][action] = 0.0
        
        # Q-learning update
        current_q = self.q_table[state][action]
        max_future_q = max(self.q_table[state].values()) if self.q_table[state] else 0.0
        
        new_q = current_q + self.learning_rate * (reward + self.discount_factor * max_future_q - current_q)
        self.q_table[state][action] = new_q
    
    def get_best_action(self, state: str) -> str:
        """Get best action for state"""
        if state not in self.q_table:
            return "default_response"
        
        return max(self.q_table[state], key=self.q_table[state].get)

class MistakeDetector:
    """Detects and corrects mistakes in responses"""
    
    def __init__(self):
        self.common_mistakes = {
            "incorrect_fact": ["wrong", "incorrect", "false"],
            "✅ complete_answer": ["missing", "✅ complete", "partial"],
            "irrelevant_response": ["off_topic", "irrelevant", "unrelated"]
        }
    
    def detect_mistakes(self, user_input: str, system_response: str, 
                       user_feedback: str = "") -> List[str]:
        """Detect mistakes in system response"""
        mistakes = []
        
        # Check for negative feedback indicators
        feedback_lower = (user_feedback + " " + user_input).lower()
        
        for mistake_type, indicators in self.common_mistakes.items():
            if any(indicator in feedback_lower for indicator in indicators):
                mistakes.append(mistake_type)
        
        # Check response quality
        if len(system_response.split()) < 3:
            mistakes.append("too_short")
        
        if len(system_response) > 5000:
            mistakes.append("too_long")
        
        return mistakes
    
    def suggest_corrections(self, mistakes: List[str], original_response: str) -> str:
        """Suggest corrections for detected mistakes"""
        corrected = original_response
        
        for mistake in mistakes:
            if mistake == "too_short":
                corrected += " Please provide more detailed information."
            elif mistake == "incorrect_fact":
                corrected += " Note: This information may need verification."
            elif mistake == "✅ complete_answer":
                corrected += " This is a partial answer. More details may be available."
        
        return corrected

class QMOISelfLearningSystem:
    """Main self-learning system"""
    
    def __init__(self):
        self.memory = LocalMemorySystem()
        self.pattern_analyzer = PatternAnalyzer()
        self.reinforcement_learner = ReinforcementLearner()
        self.mistake_detector = MistakeDetector()
        self.learning_stats = {
            "conversations_stored": 0,
            "patterns_learned": 0,
            "mistakes_corrected": 0,
            "feedback_processed": 0
        }
    
    def process_interaction(self, user_input: str, system_response: str, 
                          context: Dict[str, Any] = None) -> str:
        """Process user interaction and learn from it"""
        # Store conversation
        conversation_id = self.memory.add_conversation(user_input, system_response, context)
        
        # Analyze for patterns periodically
        if len(self.memory.conversations) % 10 == 0:
            conversations = self.memory.conversations[-100:]  # Last 100
            patterns = self.pattern_analyzer.analyze_conversations(conversations)
            self.learning_stats["patterns_learned"] = len(patterns)
        
        self.learning_stats["conversations_stored"] += 1
        
        return conversation_id
    
    def get_similar_responses(self, user_input: str) -> List[ConversationEntry]:
        """Get similar past responses"""
        return self.memory.get_similar_conversations(user_input)
    
    def learn_from_feedback(self, conversation_id: str, feedback_score: float, 
                          feedback_text: str = "") -> bool:
        """Learn from user feedback"""
        # Update memory
        success = self.memory.update_feedback(conversation_id, feedback_score)
        
        if success:
            # Find the conversation
            conversation = None
            for conv in self.memory.conversations:
                if conv.conversation_id == conversation_id:
                    conversation = conv
                    break
            
            if conversation:
                # Learn from feedback
                state = self._create_state(conversation.user_input)
                action = "response_quality"
                reward = feedback_score
                
                self.reinforcement_learner.learn_from_feedback(state, action, reward)
                
                # Detect mistakes
                mistakes = self.mistake_detector.detect_mistakes(
                    conversation.user_input, 
                    conversation.system_response, 
                    feedback_text
                )
                
                if mistakes:
                    self.learning_stats["mistakes_corrected"] += len(mistakes)
                
                self.learning_stats["feedback_processed"] += 1
        
        return success
    
    def _create_state(self, user_input: str) -> str:
        """Create state representation for learning"""
        # Simple state: first few words
        words = user_input.lower().split()[:3]
        return "_".join(words)
    
    def generate_improved_response(self, user_input: str) -> Optional[str]:
        """Generate improved response based on learning"""
        # Check for learned patterns
        similar_convs = self.get_similar_responses(user_input)
        
        if similar_convs:
            # Use pattern with highest feedback
            best_conv = max(similar_convs, 
                          key=lambda x: x.feedback_score if x.feedback_score else 0)
            if best_conv.feedback_score and best_conv.feedback_score > 0.7:
                return best_conv.system_response
        
            # production implementation
    return None
    
    def get_learning_stats(self) -> Dict[str, Any]:
        """Get learning system statistics"""
        return {
            **self.learning_stats,
            "total_conversations": len(self.memory.conversations),
            "active_patterns": len(self.pattern_analyzer.patterns),
            "q_table_size": len(self.reinforcement_learner.q_table),
            "timestamp": datetime.utcnow().isoformat()
        }

# Self-Learning System API endpoints (9 total)
SELF_LEARNING_ENDPOINTS = [
    ("POST", "/api/learning/interaction", "Process user interaction"),
    ("GET", "/api/learning/similar", "Get similar past responses"),
    ("POST", "/api/learning/feedback", "Provide feedback on response"),
    ("GET", "/api/learning/improved", "Get improved response"),
    ("GET", "/api/learning/stats", "Get learning statistics"),
    ("POST", "/api/learning/patterns", "Analyze conversation patterns"),
    ("GET", "/api/learning/memory", "Access conversation memory"),
    ("POST", "/api/learning/correct", "Correct detected mistakes"),
    ("GET", "/api/learning/history", "Get learning history")
]
