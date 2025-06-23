import unittest
import sys
import os
import asyncio
import json
from datetime import datetime, timedelta
from unittest.mock import Mock, patch, MagicMock

sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(__file__))))

from src.services.MultiUserSessionManager import MultiUserSessionManager, User, Group, Session

class TestMultiUserSessionManager(unittest.TestCase):
    def setUp(self):
        self.session_manager = MultiUserSessionManager()
        self.test_session_id = "test_session_123"
        self.test_user_id = "user_123"
        self.test_group_id = "group_123"

    def test_create_session(self):
        """Test session creation"""
        session = self.session_manager.createSession(self.test_session_id)
        
        self.assertIsNotNone(session)
        self.assertEqual(session.id, self.test_session_id)
        self.assertIsInstance(session.users, dict)
        self.assertIsInstance(session.groups, dict)
        self.assertIsInstance(session.createdAt, datetime)

    def test_join_session(self):
        """Test user joining a session"""
        user_data = {
            "name": "Test User",
            "email": "test@example.com",
            "role": "user"
        }
        
        user = self.session_manager.joinSession(self.test_user_id, self.test_session_id, user_data)
        
        self.assertIsNotNone(user)
        self.assertEqual(user.id, self.test_user_id)
        self.assertEqual(user.name, "Test User")
        self.assertEqual(user.email, "test@example.com")
        self.assertEqual(user.role, "user")
        self.assertTrue(user.isOnline)

    def test_leave_session(self):
        """Test user leaving a session"""
        # First join the session
        user = self.session_manager.joinSession(self.test_user_id, self.test_session_id, {})
        
        # Then leave
        self.session_manager.leaveSession(self.test_user_id)
        
        # Check if user is marked as offline
        updated_user = self.session_manager.getUser(self.test_user_id)
        self.assertFalse(updated_user.isOnline)

    def test_create_group(self):
        """Test group creation"""
        group_data = {
            "name": "Test Group",
            "type": "team",
            "members": [self.test_user_id],
            "admins": [self.test_user_id]
        }
        
        group = self.session_manager.createGroup(self.test_session_id, group_data)
        
        self.assertIsNotNone(group)
        self.assertEqual(group.name, "Test Group")
        self.assertEqual(group.type, "team")
        self.assertIn(self.test_user_id, group.members)
        self.assertIn(self.test_user_id, group.admins)

    def test_add_user_to_group(self):
        """Test adding user to group"""
        # Create session and join user
        self.session_manager.joinSession(self.test_user_id, self.test_session_id, {})
        
        # Create group
        group = self.session_manager.createGroup(self.test_session_id, {"name": "Test Group"})
        
        # Add user to group
        success = self.session_manager.addUserToGroup(self.test_user_id, group.id)
        
        self.assertTrue(success)
        
        # Verify user is in group
        updated_group = self.session_manager.findGroup(group.id)
        self.assertIn(self.test_user_id, updated_group.members)

    def test_remove_user_from_group(self):
        """Test removing user from group"""
        # Setup: create session, user, and group
        self.session_manager.joinSession(self.test_user_id, self.test_session_id, {})
        group = self.session_manager.createGroup(self.test_session_id, {"name": "Test Group"})
        self.session_manager.addUserToGroup(self.test_user_id, group.id)
        
        # Remove user from group
        success = self.session_manager.removeUserFromGroup(self.test_user_id, group.id)
        
        self.assertTrue(success)
        
        # Verify user is not in group
        updated_group = self.session_manager.findGroup(group.id)
        self.assertNotIn(self.test_user_id, updated_group.members)

    def test_update_user_context(self):
        """Test updating user context"""
        # Join user to session
        user = self.session_manager.joinSession(self.test_user_id, self.test_session_id, {})
        
        # Update context
        new_context = {
            "currentProject": "Test Project",
            "aiMode": "collaborator",
            "relationshipType": "group"
        }
        
        self.session_manager.updateUserContext(self.test_user_id, new_context)
        
        # Verify context is updated
        updated_user = self.session_manager.getUser(self.test_user_id)
        self.assertEqual(updated_user.context.currentProject, "Test Project")
        self.assertEqual(updated_user.context.aiMode, "collaborator")
        self.assertEqual(updated_user.context.relationshipType, "group")

    def test_get_shared_context(self):
        """Test getting shared context for a group"""
        # Setup: create session, user, and group with shared context
        self.session_manager.joinSession(self.test_user_id, self.test_session_id, {})
        group = self.session_manager.createGroup(
            self.test_session_id, 
            {
                "name": "Test Group",
                "settings": {"sharedContext": True}
            }
        )
        
        # Set shared context
        shared_context = {"project": "Shared Project", "files": ["file1.py", "file2.py"]}
        self.session_manager.updateSharedContext(group.id, shared_context)
        
        # Get shared context
        retrieved_context = self.session_manager.getSharedContext(group.id)
        
        self.assertEqual(retrieved_context, shared_context)

    def test_ai_relationship_context_individual(self):
        """Test AI relationship context for individual users"""
        # Create two users
        user1 = self.session_manager.joinSession("user1", self.test_session_id, {"name": "User 1", "role": "user"})
        user2 = self.session_manager.joinSession("user2", self.test_session_id, {"name": "User 2", "role": "admin"})
        
        # Get AI relationship context
        relationship_context = self.session_manager.getAIRelationshipContext("user1", "user2")
        
        self.assertIsNotNone(relationship_context)
        self.assertEqual(relationship_context.type, "individual")
        self.assertEqual(len(relationship_context.users), 2)
        self.assertEqual(relationship_context.aiMode, "teacher")  # admin role should make it teacher

    def test_ai_relationship_context_group(self):
        """Test AI relationship context for groups"""
        # Create user and group
        user = self.session_manager.joinSession(self.test_user_id, self.test_session_id, {"name": "Test User", "role": "user"})
        group = self.session_manager.createGroup(self.test_session_id, {"name": "Test Group"})
        self.session_manager.addUserToGroup(self.test_user_id, group.id)
        
        # Get AI relationship context
        relationship_context = self.session_manager.getAIRelationshipContext(self.test_user_id)
        
        self.assertIsNotNone(relationship_context)
        self.assertEqual(relationship_context.type, "group")
        self.assertEqual(relationship_context.aiMode, "assistant")

    def test_master_user_ai_mode(self):
        """Test AI mode for master users"""
        # Create master user
        master_user = self.session_manager.joinSession("master1", self.test_session_id, {"name": "Master User", "role": "master"})
        regular_user = self.session_manager.joinSession("user1", self.test_session_id, {"name": "Regular User", "role": "user"})
        
        # Get AI relationship context
        relationship_context = self.session_manager.getAIRelationshipContext("user1", "master1")
        
        self.assertEqual(relationship_context.aiMode, "mentor")

    def test_group_size_limit(self):
        """Test group size limit enforcement"""
        # Create group with size limit
        group = self.session_manager.createGroup(
            self.test_session_id, 
            {
                "name": "Small Group",
                "settings": {"maxMembers": 2}
            }
        )
        
        # Add two users (should succeed)
        self.session_manager.joinSession("user1", self.test_session_id, {})
        self.session_manager.joinSession("user2", self.test_session_id, {})
        
        self.session_manager.addUserToGroup("user1", group.id)
        self.session_manager.addUserToGroup("user2", group.id)
        
        # Try to add third user (should fail)
        self.session_manager.joinSession("user3", self.test_session_id, {})
        
        with self.assertRaises(Exception):
            self.session_manager.addUserToGroup("user3", group.id)

    def test_cleanup_inactive_sessions(self):
        """Test cleanup of inactive sessions"""
        # Create session and make it inactive
        session = self.session_manager.createSession("inactive_session")
        session.lastActivity = datetime.now() - timedelta(hours=2)  # 2 hours ago
        
        # Cleanup sessions older than 1 hour
        self.session_manager.cleanupInactiveSessions(60)
        
        # Session should still exist because it has no users
        self.assertIsNotNone(self.session_manager.sessions.get("inactive_session"))

    def test_user_preferences(self):
        """Test user preferences management"""
        user_data = {
            "name": "Test User",
            "preferences": {
                "theme": "dark",
                "language": "es",
                "timezone": "America/New_York",
                "aiResponseStyle": "detailed"
            }
        }
        
        user = self.session_manager.joinSession(self.test_user_id, self.test_session_id, user_data)
        
        self.assertEqual(user.preferences.theme, "dark")
        self.assertEqual(user.preferences.language, "es")
        self.assertEqual(user.preferences.timezone, "America/New_York")
        self.assertEqual(user.preferences.aiResponseStyle, "detailed")

    def test_concurrent_user_operations(self):
        """Test concurrent user operations"""
        async def test_concurrent_joins():
            # Simulate multiple users joining simultaneously
            tasks = []
            for i in range(10):
                user_id = f"user_{i}"
                task = asyncio.create_task(
                    self.session_manager.joinSession(user_id, self.test_session_id, {"name": f"User {i}"})
                )
                tasks.append(task)
            
            users = await asyncio.gather(*tasks)
            
            # Verify all users joined successfully
            self.assertEqual(len(users), 10)
            for user in users:
                self.assertIsNotNone(user)
                self.assertTrue(user.isOnline)

        asyncio.run(test_concurrent_joins())

    def test_event_emission(self):
        """Test that events are properly emitted"""
        events_received = []
        
        def event_handler(data):
            events_received.append(data)
        
        # Subscribe to events
        self.session_manager.on('userJoined', event_handler)
        self.session_manager.on('groupCreated', event_handler)
        
        # Perform actions that should emit events
        self.session_manager.joinSession(self.test_user_id, self.test_session_id, {"name": "Test User"})
        self.session_manager.createGroup(self.test_session_id, {"name": "Test Group"})
        
        # Verify events were emitted
        self.assertEqual(len(events_received), 2)
        self.assertIn('userJoined', str(events_received[0]))
        self.assertIn('groupCreated', str(events_received[1]))

    def tearDown(self):
        """Clean up after each test"""
        # Clear all sessions
        self.session_manager.sessions.clear()
        self.session_manager.userSessions.clear()

if __name__ == '__main__':
    unittest.main(verbosity=2) 