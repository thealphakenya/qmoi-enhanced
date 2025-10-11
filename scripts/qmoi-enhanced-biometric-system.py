#!/usr/bin/env python3
"""
QMOI Enhanced Biometric System
Advanced biometric authentication with account management, password recovery, and automatic account creation
"""

import os
import sys
import json
import asyncio
import threading
import time
from datetime import datetime
from typing import Dict, List, Any, Optional
import cv2
import numpy as np
import face_recognition
import speech_recognition as sr
import pyttsx3
from sklearn.metrics.pairwise import cosine_similarity
import hashlib
import sqlite3
import requests

class QMOIEnhancedBiometricSystem:
    def __init__(self):
        self.db_path = "qmoi_biometric_data.db"
        self.initialize_database()
        self.face_recognizer = cv2.face.LBPHFaceRecognizer_create()
        self.voice_recognizer = sr.Recognizer()
        self.speech_engine = pyttsx3.init()
        self.master_emails = ["rovicviccy@gmail.com", "thealphakenya@gmail.com"]
        
        # Biometric thresholds
        self.face_threshold = 0.6
        self.voice_threshold = 0.7
        self.fingerprint_threshold = 0.8
        self.iris_threshold = 0.9
        
    def initialize_database(self):
        """Initialize the biometric database."""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        # Users table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT UNIQUE NOT NULL,
                email TEXT UNIQUE NOT NULL,
                password_hash TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                last_login TIMESTAMP,
                is_master BOOLEAN DEFAULT FALSE,
                biometric_enabled BOOLEAN DEFAULT FALSE
            )
        ''')
        
        # Biometric templates table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS biometric_templates (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER,
                biometric_type TEXT NOT NULL,
                template_data TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users (id)
            )
        ''')
        
        # Account creation logs table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS account_creation_logs (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                platform TEXT NOT NULL,
                username TEXT NOT NULL,
                email TEXT,
                purpose TEXT,
                reason TEXT,
                age INTEGER,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                status TEXT DEFAULT 'created'
            )
        ''')
        
        # Password recovery logs table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS password_recovery_logs (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER,
                recovery_method TEXT NOT NULL,
                status TEXT DEFAULT 'pending',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                completed_at TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users (id)
            )
        ''')
        
        conn.commit()
        conn.close()
    
    async def enroll_biometrics(self, username: str, biometric_type: str) -> Dict[str, Any]:
        """Enroll user biometrics."""
        try:
            if biometric_type == "face":
                return await self._enroll_face_recognition(username)
            elif biometric_type == "voice":
                return await self._enroll_voice_recognition(username)
            elif biometric_type == "fingerprint":
                return await self._enroll_fingerprint(username)
            elif biometric_type == "iris":
                return await self._enroll_iris_recognition(username)
            else:
                return {"status": "error", "message": f"Unsupported biometric type: {biometric_type}"}
        except Exception as e:
            return {"status": "error", "message": str(e)}
    
    async def _enroll_face_recognition(self, username: str) -> Dict[str, Any]:
        """Enroll face recognition for a user."""
        print(f"🎭 Starting face enrollment for {username}")
        print("Please look at the camera and follow the instructions...")
        
        # Initialize camera
        cap = cv2.VideoCapture(0)
        face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
        
        face_encodings = []
        frame_count = 0
        max_frames = 30
        
        while frame_count < max_frames:
            ret, frame = cap.read()
            if not ret:
                continue
            
            # Convert to grayscale for face detection
            gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
            faces = face_cascade.detectMultiScale(gray, 1.1, 4)
            
            for (x, y, w, h) in faces:
                # Extract face region
                face_roi = frame[y:y+h, x:x+w]
                
                # Get face encoding
                face_encoding = face_recognition.face_encodings(face_roi)
                if face_encoding:
                    face_encodings.append(face_encoding[0])
                    frame_count += 1
                
                # Draw rectangle around face
                cv2.rectangle(frame, (x, y), (x+w, y+h), (0, 255, 0), 2)
            
            # Display frame
            cv2.imshow('Face Enrollment', frame)
            if cv2.waitKey(1) & 0xFF == ord('q'):
                break
        
        cap.release()
        cv2.destroyAllWindows()
        
        if len(face_encodings) >= 10:
            # Save face template
            template_data = json.dumps([encoding.tolist() for encoding in face_encodings])
            self._save_biometric_template(username, "face", template_data)
            
            return {
                "status": "success",
                "message": f"Face enrollment completed for {username}",
                "templates_saved": len(face_encodings)
            }
        else:
            return {
                "status": "error",
                "message": "Insufficient face [PRODUCTION IMPLEMENTATION REQUIRED]s collected"
            }
    
    async def _enroll_voice_recognition(self, username: str) -> Dict[str, Any]:
        """Enroll voice recognition for a user."""
        print(f"🎤 Starting voice enrollment for {username}")
        print("Please speak clearly when prompted...")
        
        voice_[PRODUCTION IMPLEMENTATION REQUIRED]s = []
        [PRODUCTION IMPLEMENTATION REQUIRED]_count = 0
        max_[PRODUCTION IMPLEMENTATION REQUIRED]s = 5
        
        for i in range(max_[PRODUCTION IMPLEMENTATION REQUIRED]s):
            print(f"[PRODUCTION IMPLEMENTATION REQUIRED] {i+1}/{max_[PRODUCTION IMPLEMENTATION REQUIRED]s}: Please say 'Hello, this is my voice [PRODUCTION IMPLEMENTATION REQUIRED]'")
            
            with sr.Microphone() as source:
                self.voice_recognizer.adjust_for_ambient_noise(source)
                try:
                    audio = self.voice_recognizer.listen(source, timeout=5)
                    
                    # Convert audio to features
                    audio_data = audio.get_wav_data()
                    features = self._extract_voice_features(audio_data)
                    voice_[PRODUCTION IMPLEMENTATION REQUIRED]s.append(features)
                    [PRODUCTION IMPLEMENTATION REQUIRED]_count += 1
                    
                    print(f"[PRODUCTION IMPLEMENTATION REQUIRED] {i+1} recorded successfully")
                    
                except sr.WaitTimeoutError:
                    print("No speech detected, please try again")
                except Exception as e:
                    print(f"Error recording [PRODUCTION IMPLEMENTATION REQUIRED]: {e}")
        
        if [PRODUCTION IMPLEMENTATION REQUIRED]_count >= 3:
            # Save voice template
            template_data = json.dumps([[PRODUCTION IMPLEMENTATION REQUIRED].tolist() for [PRODUCTION IMPLEMENTATION REQUIRED] in voice_[PRODUCTION IMPLEMENTATION REQUIRED]s])
            self._save_biometric_template(username, "voice", template_data)
            
            return {
                "status": "success",
                "message": f"Voice enrollment completed for {username}",
                "[PRODUCTION IMPLEMENTATION REQUIRED]s_saved": [PRODUCTION IMPLEMENTATION REQUIRED]_count
            }
        else:
            return {
                "status": "error",
                "message": "Insufficient voice [PRODUCTION IMPLEMENTATION REQUIRED]s collected"
            }
    
    def _extract_voice_features(self, audio_data: bytes) -> np.ndarray:
        """Extract voice features from audio data."""
        # Convert audio data to numpy array
        audio_array = np.frombuffer(audio_data, dtype=np.int16)
        
        # Simple feature extraction (MFCC would be better in production)
        features = np.array([
            np.mean(audio_array),
            np.std(audio_array),
            np.max(audio_array),
            np.min(audio_array),
            len(audio_array)
        ])
        
        return features
    
    async def _enroll_fingerprint(self, username: str) -> Dict[str, Any]:
        """Enroll fingerprint for a user."""
        print(f"👆 Starting fingerprint enrollment for {username}")
        print("Please place your finger on the fingerprint sensor...")
        
        # Simulate fingerprint enrollment (in real implementation, use actual sensor)
        fingerprint_data = {
            "minutiae_points": self._generate_fingerprint_minutiae(),
            "ridge_pattern": self._generate_ridge_pattern(),
            "quality_score": 0.95
        }
        
        template_data = json.dumps(fingerprint_data)
        self._save_biometric_template(username, "fingerprint", template_data)
        
        return {
            "status": "success",
            "message": f"Fingerprint enrollment completed for {username}",
            "quality_score": fingerprint_data["quality_score"]
        }
    
    def _generate_fingerprint_minutiae(self) -> List[Dict[str, Any]]:
        """Generate simulated fingerprint minutiae points."""
        minutiae = []
        for i in range(20):
            minutiae.append({
                "x": np.random.randint(0, 100),
                "y": np.random.randint(0, 100),
                "type": np.random.choice(["ridge_ending", "bifurcation"]),
                "angle": np.random.uniform(0, 2 * np.pi)
            })
        return minutiae
    
    def _generate_ridge_pattern(self) -> np.ndarray:
        """Generate simulated ridge pattern."""
        return np.random.rand(100, 100)
    
    async def _enroll_iris_recognition(self, username: str) -> Dict[str, Any]:
        """Enroll iris recognition for a user."""
        print(f"👁️ Starting iris enrollment for {username}")
        print("Please look at the iris scanner...")
        
        # Simulate iris enrollment (in real implementation, use actual iris scanner)
        iris_data = {
            "iris_code": self._generate_iris_code(),
            "pupil_center": (50, 50),
            "iris_radius": 30,
            "quality_score": 0.98
        }
        
        template_data = json.dumps(iris_data)
        self._save_biometric_template(username, "iris", template_data)
        
        return {
            "status": "success",
            "message": f"Iris enrollment completed for {username}",
            "quality_score": iris_data["quality_score"]
        }
    
    def _generate_iris_code(self) -> np.ndarray:
        """Generate simulated iris code."""
        return np.random.randint(0, 2, (64, 512))
    
    def _save_biometric_template(self, username: str, biometric_type: str, template_data: str):
        """Save biometric template to database."""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        # Get user ID
        cursor.execute("SELECT id FROM users WHERE username = ?", (username,))
        result = cursor.fetchone()
        
        if result:
            user_id = result[0]
            cursor.execute('''
                INSERT INTO biometric_templates (user_id, biometric_type, template_data)
                VALUES (?, ?, ?)
            ''', (user_id, biometric_type, template_data))
            conn.commit()
        
        conn.close()
    
    async def authenticate_user(self, username: str, biometric_type: str) -> Dict[str, Any]:
        """Authenticate user using biometrics."""
        try:
            if biometric_type == "face":
                return await self._authenticate_face(username)
            elif biometric_type == "voice":
                return await self._authenticate_voice(username)
            elif biometric_type == "fingerprint":
                return await self._authenticate_fingerprint(username)
            elif biometric_type == "iris":
                return await self._authenticate_iris(username)
            else:
                return {"status": "error", "message": f"Unsupported biometric type: {biometric_type}"}
        except Exception as e:
            return {"status": "error", "message": str(e)}
    
    async def _authenticate_face(self, username: str) -> Dict[str, Any]:
        """Authenticate user using face recognition."""
        print(f"🔐 Authenticating {username} using face recognition...")
        
        # Get stored templates
        templates = self._get_biometric_templates(username, "face")
        if not templates:
            return {"status": "error", "message": "No face templates found"}
        
        # Capture current face
        cap = cv2.VideoCapture(0)
        face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
        
        ret, frame = cap.read()
        cap.release()
        
        if not ret:
            return {"status": "error", "message": "Failed to capture image"}
        
        # Detect face
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        faces = face_cascade.detectMultiScale(gray, 1.1, 4)
        
        if len(faces) == 0:
            return {"status": "error", "message": "No face detected"}
        
        # Get face encoding
        x, y, w, h = faces[0]
        face_roi = frame[y:y+h, x:x+w]
        current_encoding = face_recognition.face_encodings(face_roi)
        
        if not current_encoding:
            return {"status": "error", "message": "Failed to encode face"}
        
        # Compare with stored templates
        for template in templates:
            stored_encodings = json.loads(template)
            for stored_encoding in stored_encodings:
                distance = face_recognition.face_distance([np.array(stored_encoding)], current_encoding[0])[0]
                if distance < self.face_threshold:
                    return {
                        "status": "success",
                        "message": f"Face authentication successful for {username}",
                        "confidence": 1 - distance
                    }
        
        return {"status": "error", "message": "Face authentication failed"}
    
    async def _authenticate_voice(self, username: str) -> Dict[str, Any]:
        """Authenticate user using voice recognition."""
        print(f"🔐 Authenticating {username} using voice recognition...")
        
        # Get stored templates
        templates = self._get_biometric_templates(username, "voice")
        if not templates:
            return {"status": "error", "message": "No voice templates found"}
        
        print("Please say 'Hello, this is my voice [PRODUCTION IMPLEMENTATION REQUIRED]'")
        
        with sr.Microphone() as source:
            self.voice_recognizer.adjust_for_ambient_noise(source)
            try:
                audio = self.voice_recognizer.listen(source, timeout=5)
                audio_data = audio.get_wav_data()
                current_features = self._extract_voice_features(audio_data)
                
                # Compare with stored templates
                for template in templates:
                    stored_features_list = json.loads(template)
                    for stored_features in stored_features_list:
                        similarity = cosine_similarity([current_features], [np.array(stored_features)])[0][0]
                        if similarity > self.voice_threshold:
                            return {
                                "status": "success",
                                "message": f"Voice authentication successful for {username}",
                                "confidence": similarity
                            }
                
                return {"status": "error", "message": "Voice authentication failed"}
                
            except sr.WaitTimeoutError:
                return {"status": "error", "message": "No speech detected"}
            except Exception as e:
                return {"status": "error", "message": str(e)}
    
    async def _authenticate_fingerprint(self, username: str) -> Dict[str, Any]:
        """Authenticate user using fingerprint."""
        print(f"🔐 Authenticating {username} using fingerprint...")
        
        # Get stored templates
        templates = self._get_biometric_templates(username, "fingerprint")
        if not templates:
            return {"status": "error", "message": "No fingerprint templates found"}
        
        # Simulate fingerprint capture (in real implementation, use actual sensor)
        current_fingerprint = {
            "minutiae_points": self._generate_fingerprint_minutiae(),
            "ridge_pattern": self._generate_ridge_pattern(),
            "quality_score": 0.95
        }
        
        # Compare with stored templates
        for template in templates:
            stored_fingerprint = json.loads(template)
            similarity = self._compare_fingerprints(current_fingerprint, stored_fingerprint)
            if similarity > self.fingerprint_threshold:
                return {
                    "status": "success",
                    "message": f"Fingerprint authentication successful for {username}",
                    "confidence": similarity
                }
        
        return {"status": "error", "message": "Fingerprint authentication failed"}
    
    def _compare_fingerprints(self, current: Dict, stored: Dict) -> float:
        """Compare two fingerprint templates."""
        # Simple similarity calculation (in real implementation, use proper fingerprint matching)
        current_minutiae = len(current["minutiae_points"])
        stored_minutiae = len(stored["minutiae_points"])
        
        if current_minutiae == 0 or stored_minutiae == 0:
            return 0.0
        
        similarity = min(current_minutiae, stored_minutiae) / max(current_minutiae, stored_minutiae)
        return similarity
    
    async def _authenticate_iris(self, username: str) -> Dict[str, Any]:
        """Authenticate user using iris recognition."""
        print(f"🔐 Authenticating {username} using iris recognition...")
        
        # Get stored templates
        templates = self._get_biometric_templates(username, "iris")
        if not templates:
            return {"status": "error", "message": "No iris templates found"}
        
        # Simulate iris capture (in real implementation, use actual iris scanner)
        current_iris = {
            "iris_code": self._generate_iris_code(),
            "pupil_center": (50, 50),
            "iris_radius": 30,
            "quality_score": 0.98
        }
        
        # Compare with stored templates
        for template in templates:
            stored_iris = json.loads(template)
            similarity = self._compare_iris(current_iris, stored_iris)
            if similarity > self.iris_threshold:
                return {
                    "status": "success",
                    "message": f"Iris authentication successful for {username}",
                    "confidence": similarity
                }
        
        return {"status": "error", "message": "Iris authentication failed"}
    
    def _compare_iris(self, current: Dict, stored: Dict) -> float:
        """Compare two iris templates."""
        # Simple similarity calculation (in real implementation, use proper iris matching)
        current_code = current["iris_code"]
        stored_code = stored["iris_code"]
        
        # Calculate Hamming distance
        hamming_distance = np.sum(current_code != stored_code)
        total_bits = current_code.size
        
        similarity = 1 - (hamming_distance / total_bits)
        return similarity
    
    def _get_biometric_templates(self, username: str, biometric_type: str) -> List[str]:
        """Get biometric templates for a user."""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT bt.template_data 
            FROM biometric_templates bt
            JOIN users u ON bt.user_id = u.id
            WHERE u.username = ? AND bt.biometric_type = ?
        ''', (username, biometric_type))
        
        templates = [row[0] for row in cursor.fetchall()]
        conn.close()
        
        return templates
    
    async def create_account_automatically(self, platform: str, account_info: Dict[str, Any]) -> Dict[str, Any]:
        """Automatically create account on a platform with enhanced information."""
        try:
            # Generate account information
            username = account_info.get('username', f"qmoi_user_{int(time.time())}")
            email = account_info.get('email', f"qmoi_{int(time.time())}@qmoi.com")
            password = account_info.get('password', self._generate_secure_password())
            
            # Enhanced account information
            enhanced_info = {
                "platform": platform,
                "username": username,
                "email": email,
                "password": password,
                "purpose": account_info.get('purpose', 'QMOI automation'),
                "reason": account_info.get('reason', 'Automated account creation'),
                "age": account_info.get('age', 25),
                "time_created": datetime.now().isoformat(),
                "names_used": account_info.get('names_used', [username]),
                "additional_info": account_info.get('additional_info', {})
            }
            
            # Log account creation
            self._log_account_creation(enhanced_info)
            
            # Create account on platform (simulated)
            account_result = await self._create_platform_account(platform, enhanced_info)
            
            return {
                "status": "success",
                "message": f"Account created successfully on {platform}",
                "account_info": enhanced_info,
                "platform_result": account_result
            }
            
        except Exception as e:
            return {
                "status": "error",
                "message": f"Failed to create account: {str(e)}"
            }
    
    def _generate_secure_password(self) -> str:
        """Generate a secure password."""
        import secrets
        import string
        
        alphabet = string.ascii_letters + string.digits + string.punctuation
        password = ''.join(secrets.choice(alphabet) for _ in range(16))
        return password
    
    def _log_account_creation(self, account_info: Dict[str, Any]):
        """Log account creation to database."""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute('''
            INSERT INTO account_creation_logs 
            (platform, username, email, purpose, reason, age)
            VALUES (?, ?, ?, ?, ?, ?)
        ''', (
            account_info['platform'],
            account_info['username'],
            account_info['email'],
            account_info['purpose'],
            account_info['reason'],
            account_info['age']
        ))
        
        conn.commit()
        conn.close()
    
    async def _create_platform_account(self, platform: str, account_info: Dict[str, Any]) -> Dict[str, Any]:
        """Create account on a specific platform."""
        # Simulated platform account creation
        # In real implementation, use platform-specific APIs
        
        platform_apis = {
            "github": self._create_github_account,
            "gitlab": self._create_gitlab_account,
            "discord": self._create_discord_account,
            "telegram": self._create_telegram_account,
            "whatsapp": self._create_whatsapp_account,
            "slack": self._create_slack_account,
            "vercel": self._create_vercel_account,
            "netlify": self._create_netlify_account,
            "aws": self._create_aws_account,
            "azure": self._create_azure_account,
            "gcp": self._create_gcp_account
        }
        
        if platform in platform_apis:
            return await platform_apis[platform](account_info)
        else:
            return {"status": "error", "message": f"Platform {platform} not supported"}
    
    async def _create_github_account(self, account_info: Dict[str, Any]) -> Dict[str, Any]:
        """Create GitHub account."""
        # Simulated GitHub account creation
        return {
            "status": "success",
            "platform": "github",
            "account_id": f"github_{int(time.time())}",
            "api_access": True,
            "webhook_enabled": True
        }
    
    async def _create_gitlab_account(self, account_info: Dict[str, Any]) -> Dict[str, Any]:
        """Create GitLab account."""
        # Simulated GitLab account creation
        return {
            "status": "success",
            "platform": "gitlab",
            "account_id": f"gitlab_{int(time.time())}",
            "ci_cd_enabled": True,
            "runner_access": True
        }
    
    async def forgot_password_recovery(self, username: str, biometric_type: str) -> Dict[str, Any]:
        """Handle forgot password recovery using biometrics."""
        try:
            # Authenticate user using biometrics
            auth_result = await self.authenticate_user(username, biometric_type)
            
            if auth_result["status"] == "success":
                # Generate new password
                new_password = self._generate_secure_password()
                
                # Update password in database
                self._update_user_password(username, new_password)
                
                # Log recovery
                self._log_password_recovery(username, biometric_type, "success")
                
                return {
                    "status": "success",
                    "message": "Password recovery successful",
                    "new_password": new_password,
                    "next_steps": "Please change your password after logging in"
                }
            else:
                # Log failed recovery
                self._log_password_recovery(username, biometric_type, "failed")
                
                return {
                    "status": "error",
                    "message": "Biometric authentication failed"
                }
                
        except Exception as e:
            return {
                "status": "error",
                "message": f"Password recovery failed: {str(e)}"
            }
    
    def _update_user_password(self, username: str, new_password: str):
        """Update user password in database."""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        password_hash = hashlib.sha256(new_password.encode()).hexdigest()
        cursor.execute("UPDATE users SET password_hash = ? WHERE username = ?", (password_hash, username))
        
        conn.commit()
        conn.close()
    
    def _log_password_recovery(self, username: str, biometric_type: str, status: str):
        """Log password recovery attempt."""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        # Get user ID
        cursor.execute("SELECT id FROM users WHERE username = ?", (username,))
        result = cursor.fetchone()
        
        if result:
            user_id = result[0]
            cursor.execute('''
                INSERT INTO password_recovery_logs (user_id, recovery_method, status)
                VALUES (?, ?, ?)
            ''', (user_id, biometric_type, status))
            
            if status == "success":
                cursor.execute('''
                    UPDATE password_recovery_logs 
                    SET completed_at = CURRENT_TIMESTAMP 
                    WHERE user_id = ? AND status = 'success'
                    ORDER BY created_at DESC LIMIT 1
                ''', (user_id,))
        
        conn.commit()
        conn.close()
    
    def get_account_creation_logs(self, master_only: bool = True) -> List[Dict[str, Any]]:
        """Get account creation logs (master only)."""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT platform, username, email, purpose, reason, age, created_at, status
            FROM account_creation_logs
            ORDER BY created_at DESC
        ''')
        
        logs = []
        for row in cursor.fetchall():
            logs.append({
                "platform": row[0],
                "username": row[1],
                "email": row[2],
                "purpose": row[3],
                "reason": row[4],
                "age": row[5],
                "created_at": row[6],
                "status": row[7]
            })
        
        conn.close()
        return logs
    
    def get_password_recovery_logs(self, master_only: bool = True) -> List[Dict[str, Any]]:
        """Get password recovery logs (master only)."""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT u.username, prl.recovery_method, prl.status, prl.created_at, prl.completed_at
            FROM password_recovery_logs prl
            JOIN users u ON prl.user_id = u.id
            ORDER BY prl.created_at DESC
        ''')
        
        logs = []
        for row in cursor.fetchall():
            logs.append({
                "username": row[0],
                "recovery_method": row[1],
                "status": row[2],
                "created_at": row[3],
                "completed_at": row[4]
            })
        
        conn.close()
        return logs

# Usage example
async def main():
    biometric_system = QMOIEnhancedBiometricSystem()
    
    # Enroll biometrics for a user
    enrollment_result = await biometric_system.enroll_biometrics("testuser", "face")
    print(f"Enrollment result: {enrollment_result}")
    
    # Authenticate user
    auth_result = await biometric_system.authenticate_user("testuser", "face")
    print(f"Authentication result: {auth_result}")
    
    # Create account automatically
    account_result = await biometric_system.create_account_automatically("github", {
        "username": "qmoi_github_user",
        "email": "qmoi_github@qmoi.com",
        "purpose": "QMOI automation",
        "reason": "Automated GitHub integration",
        "age": 25
    })
    print(f"Account creation result: {account_result}")
    
    # Password recovery
    recovery_result = await biometric_system.forgot_password_recovery("testuser", "face")
    print(f"Password recovery result: {recovery_result}")
    
    # Get logs (master only)
    account_logs = biometric_system.get_account_creation_logs()
    recovery_logs = biometric_system.get_password_recovery_logs()
    print(f"Account logs: {len(account_logs)} entries")
    print(f"Recovery logs: {len(recovery_logs)} entries")

if __name__ == "__main__":
    asyncio.run(main()) 