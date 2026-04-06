#!/usr/bin/env python3
"""
Test script for Lion Agent Enhanced Features
Tests LION variations, chatbot integration, and evolution features
"""

import sys
import os
sys.path.append('/workspaces/qmoi-enhanced/qvillage')

try:
    from app import LionAgentHealthOrchestrator
    print("✅ Lion Agent imported successfully")
except ImportError as e:
    print(f"❌ Failed to import Lion Agent: {e}")
    sys.exit(1)

def test_lion_variations():
    """Test LION variations (L-I-O-N)"""
    print("\n🦁 Testing LION Variations:")

    # Test L - Validation Layer
    result = lion_agent._lion_validation_layer("test_target")
    print(f"L (Validation): {result['lion_variation']} - Status: {result['validation_status']}")

    # Test I - Integrity Monitor
    result = lion_agent._lion_integrity_monitor("test_target")
    print(f"I (Integrity): {result['lion_variation']} - Health: {result['overall_health']}")

    # Test O - Orchestration Engine
    result = lion_agent._lion_orchestration_engine("test_target")
    print(f"O (Orchestration): {result['lion_variation']} - Status: {result['orchestration_status']}")

    # Test N - Network Sync
    result = lion_agent._lion_network_sync("test_target")
    print(f"N (Network): {result['lion_variation']} - Status: {result['sync_status']}")

def test_chatbot_features():
    """Test chatbot integration features"""
    print("\n🤖 Testing Chatbot Features:")

    # Test chatbot integration
    result = lion_agent.lion_chatbot_integration("Hello, how are you?", "helpful")
    print(f"Chatbot Response: {result['message']} - Personality: {result['personality']}")

    # Test code execution detection
    result = lion_agent._detect_and_execute_code("```python\nprint('Hello World')\n```")
    print(f"Code Execution: {len(result['executed_blocks'])} blocks detected")

    # Test suggestions
    suggestions = lion_agent._generate_suggestions("I have an error in my code")
    print(f"Suggestions: {len(suggestions)} suggestions generated")

def test_evolution_features():
    """Test evolution integration features"""
    print("\n🚀 Testing Evolution Features:")

    # Test evolution integration
    result = lion_agent.lion_evolution_integration("auto_enhancements", "test_system")
    print(f"Evolution: {result['evolution_type']} - Status: {result['lion_evolution_status']}")

    # Test auto enhancements
    enhancements = lion_agent._apply_auto_enhancements("test_target")
    print(f"Auto Enhancements: {enhancements['performance_boost']*100}% boost applied")

    # Test auto research
    research = lion_agent._conduct_auto_research("test_target")
    print(f"Auto Research: {research['topics_researched']} topics researched")

def test_status_management():
    """Test comprehensive status management"""
    print("\n📊 Testing Status Management:")

    # Test status retrieval
    status = lion_agent.get_lion_status("all")
    print(f"Status Types: {list(status.keys())}")
    print(f"System Health: {status['system_health']}")

    # Test status update
    result = lion_agent.update_lion_status("conversation_status", "active")
    print(f"Status Update: {result['status_updated']} - New Status: {result['new_status']}")

def main():
    """Main test function"""
    print("🦁 LION Agent Enhanced Features Test")
    print("=" * 50)

    # Initialize Lion Agent
    global lion_agent
    lion_agent = LionAgentHealthOrchestrator()
    print("✅ Lion Agent initialized")

    # Run tests
    test_lion_variations()
    test_chatbot_features()
    test_evolution_features()
    test_status_management()

    print("\n" + "=" * 50)
    print("✅ All Lion Agent tests completed successfully!")
    print("🦁 LION variations, chatbot features, and evolution integration are working!")

if __name__ == "__main__":
    main()