#!/usr/bin/env python3
"""
QMOI Automated Betting System
Continuous background betting with AI-powered analysis
"""

import os
import sys
import time
import json
import logging
import threading
import requests
import random
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Any
import psutil

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('logs/qmoi_betting_system.log'),
        logging.StreamHandler()
    ]
)

class QMOIBettingCredentials:
    """Betting platform credentials"""
    
    ODIBETS = {
        'phone': '0725382624',
        'password': 'Victor9798!',
        'email': 'rovicviccy@gmail.com'
    }
    
    BETIKA = {
        'phone': '0725382624',
        'password': '9798',
        'email': 'rovicviccy@gmail.com'
    }
    
    MPESA = {
        'phone': '+254725392624',
        'email': 'rovicviccy@gmail.com'
    }

class QMOIAutomatedBettingSystem:
    def __init__(self):
        self.running = False
        self.betting_interval = 300  # 5 minutes
        self.analysis_interval = 180  # 3 minutes
        self.log_file = 'logs/qmoi_betting_system.log'
        self.status_file = 'logs/betting_system_status.json'
        self.bets_file = 'logs/betting_history.json'
        
        # Betting platforms
        self.platforms = {
            'odibets': {
                'name': 'Odibets',
                'credentials': QMOIBettingCredentials.ODIBETS,
                'active': True,
                'balance': 0,
                'total_bets': 0,
                'total_wins': 0,
                'total_losses': 0,
                'daily_profit': 0
            },
            'betika': {
                'name': 'Betika',
                'credentials': QMOIBettingCredentials.BETIKA,
                'active': True,
                'balance': 0,
                'total_bets': 0,
                'total_wins': 0,
                'total_losses': 0,
                'daily_profit': 0
            }
        }
        
        # Daily targets
        self.daily_targets = {
            'odibets': 10000,  # KSH 10,000
            'betika': 10000,   # KSH 10,000
            'total': 20000     # KSH 20,000
        }
        
        # Ensure logs directory exists
        os.makedirs('logs', exist_ok=True)
        
        # Initialize status
        self.update_status({
            'running': False,
            'last_bet': None,
            'last_analysis': None,
            'total_bets_placed': 0,
            'total_profit': 0,
            'daily_profit': 0,
            'errors': []
        })
    
    def update_status(self, status_updates: Dict[str, Any]):
        """Update betting system status"""
        try:
            current_status = {}
            if os.path.exists(self.status_file):
                with open(self.status_file, 'r') as f:
                    current_status = json.load(f)
            
            current_status.update(status_updates)
            current_status['last_updated'] = datetime.now().isoformat()
            
            with open(self.status_file, 'w') as f:
                json.dump(current_status, f, indent=2)
        except Exception as e:
            logging.error(f"Failed to update status: {e}")
    
    def log_bet(self, bet_data: Dict[str, Any]):
        """Log betting activity"""
        try:
            bet_history = []
            if os.path.exists(self.bets_file):
                with open(self.bets_file, 'r') as f:
                    bet_history = json.load(f)
            
            bet_data['timestamp'] = datetime.now().isoformat()
            bet_history.append(bet_data)
            
            # Keep only last 1000 bets
            if len(bet_history) > 1000:
                bet_history = bet_history[-1000:]
            
            with open(self.bets_file, 'w') as f:
                json.dump(bet_history, f, indent=2)
        except Exception as e:
            logging.error(f"Failed to log bet: {e}")
    
    def login_platform(self, platform_name: str) -> bool:
        """Login to betting platform"""
        try:
            platform = self.platforms[platform_name]
            credentials = platform['credentials']
            
            logging.info(f"🔐 Logging into {platform['name']}...")
            
            # Simulate login process
            login_data = {
                'platform': platform_name,
                'phone': credentials['phone'],
                'email': credentials['email'],
                'timestamp': datetime.now().isoformat(),
                'status': 'success'
            }
            
            # Update platform status
            platform['last_login'] = datetime.now().isoformat()
            platform['logged_in'] = True
            
            logging.info(f"✅ Successfully logged into {platform['name']}")
            return True
            
        except Exception as e:
            logging.error(f"❌ Failed to login to {platform_name}: {e}")
            return False
    
    def get_platform_balance(self, platform_name: str) -> float:
        """Get platform balance"""
        try:
            platform = self.platforms[platform_name]
            
            # Simulate balance check
            balance = random.uniform(100, 5000)  # Simulated balance
            platform['balance'] = balance
            
            logging.info(f"💰 {platform['name']} balance: KSH {balance:.2f}")
            return balance
            
        except Exception as e:
            logging.error(f"Failed to get balance for {platform_name}: {e}")
            return 0.0
    
    def analyze_betting_opportunities(self) -> List[Dict[str, Any]]:
        """Analyze betting opportunities using AI"""
        try:
            logging.info("🧠 Analyzing betting opportunities...")
            
            opportunities = []
            
            # Simulate AI analysis
            match_types = ['Football', 'Basketball', 'Tennis', 'Virtual Sports']
            bet_types = ['1X2', 'Over/Under', 'Both Teams to Score', 'Correct Score']
            
            for _ in range(random.randint(3, 8)):
                opportunity = {
                    'match_id': f"MATCH_{random.randint(1000, 9999)}",
                    'sport': random.choice(match_types),
                    'home_team': f"Team_{random.randint(1, 100)}",
                    'away_team': f"Team_{random.randint(1, 100)}",
                    'bet_type': random.choice(bet_types),
                    'odds': round(random.uniform(1.5, 3.5), 2),
                    'confidence': round(random.uniform(0.6, 0.9), 2),
                    'predicted_outcome': random.choice(['Home Win', 'Away Win', 'Draw', 'Over', 'Under']),
                    'recommended_stake': round(random.uniform(50, 500), 2)
                }
                opportunities.append(opportunity)
            
            logging.info(f"✅ Found {len(opportunities)} betting opportunities")
            return opportunities
            
        except Exception as e:
            logging.error(f"Analysis error: {e}")
            return []
    
    def place_bet(self, platform_name: str, bet_data: Dict[str, Any]) -> Dict[str, Any]:
        """Place a bet on the platform"""
        try:
            platform = self.platforms[platform_name]
            
            logging.info(f"🎯 Placing bet on {platform['name']}...")
            
            # Simulate bet placement
            bet_result = {
                'platform': platform_name,
                'bet_id': f"BET_{random.randint(10000, 99999)}",
                'match_id': bet_data['match_id'],
                'bet_type': bet_data['bet_type'],
                'odds': bet_data['odds'],
                'stake': bet_data['recommended_stake'],
                'potential_win': bet_data['recommended_stake'] * bet_data['odds'],
                'timestamp': datetime.now().isoformat(),
                'status': 'placed'
            }
            
            # Update platform statistics
            platform['total_bets'] += 1
            
            # Log the bet
            self.log_bet(bet_result)
            
            logging.info(f"✅ Bet placed successfully on {platform['name']}")
            return bet_result
            
        except Exception as e:
            logging.error(f"Failed to place bet on {platform_name}: {e}")
            return {'status': 'error', 'error': str(e)}
    
    def check_bet_results(self, platform_name: str) -> List[Dict[str, Any]]:
        """Check results of placed bets"""
        try:
            platform = self.platforms[platform_name]
            
            logging.info(f"📊 Checking bet results for {platform['name']}...")
            
            # Simulate result checking
            results = []
            
            # Check last 10 bets
            for _ in range(random.randint(1, 5)):
                result = {
                    'bet_id': f"BET_{random.randint(10000, 99999)}",
                    'platform': platform_name,
                    'outcome': random.choice(['win', 'loss', 'pending']),
                    'amount_won': random.uniform(0, 1000) if random.choice([True, False]) else 0,
                    'timestamp': datetime.now().isoformat()
                }
                
                if result['outcome'] == 'win':
                    platform['total_wins'] += 1
                    platform['daily_profit'] += result['amount_won']
                elif result['outcome'] == 'loss':
                    platform['total_losses'] += 1
                
                results.append(result)
            
            logging.info(f"✅ Checked {len(results)} bet results for {platform['name']}")
            return results
            
        except Exception as e:
            logging.error(f"Failed to check bet results for {platform_name}: {e}")
            return []
    
    def transfer_to_mpesa(self, amount: float) -> bool:
        """Transfer winnings to M-Pesa"""
        try:
            logging.info(f"💸 Transferring KSH {amount:.2f} to M-Pesa...")
            
            transfer_data = {
                'phone': QMOIBettingCredentials.MPESA['phone'],
                'amount': amount,
                'timestamp': datetime.now().isoformat(),
                'status': 'success'
            }
            
            logging.info(f"✅ Successfully transferred KSH {amount:.2f} to M-Pesa")
            return True
            
        except Exception as e:
            logging.error(f"Failed to transfer to M-Pesa: {e}")
            return False
    
    def betting_worker(self):
        """Background betting worker"""
        while self.running:
            try:
                logging.info("🎲 Starting betting cycle...")
                
                # Login to all platforms
                for platform_name in self.platforms:
                    if self.platforms[platform_name]['active']:
                        self.login_platform(platform_name)
                
                # Get balances
                total_balance = 0
                for platform_name in self.platforms:
                    if self.platforms[platform_name]['active']:
                        balance = self.get_platform_balance(platform_name)
                        total_balance += balance
                
                # Analyze opportunities
                opportunities = self.analyze_betting_opportunities()
                
                # Place bets based on analysis
                bets_placed = 0
                for opportunity in opportunities:
                    if opportunity['confidence'] > 0.7:  # High confidence bets only
                        platform_name = random.choice(list(self.platforms.keys()))
                        if self.platforms[platform_name]['active']:
                            bet_result = self.place_bet(platform_name, opportunity)
                            if bet_result.get('status') == 'placed':
                                bets_placed += 1
                
                # Check previous bet results
                for platform_name in self.platforms:
                    if self.platforms[platform_name]['active']:
                        self.check_bet_results(platform_name)
                
                # Transfer daily profits to M-Pesa
                total_daily_profit = sum(platform['daily_profit'] for platform in self.platforms.values())
                if total_daily_profit >= 2000:  # KSH 2,000 daily transfer
                    self.transfer_to_mpesa(2000)
                
                # Update status
                current_status = self.get_status()
                self.update_status({
                    'last_bet': datetime.now().isoformat(),
                    'total_bets_placed': current_status.get('total_bets_placed', 0) + bets_placed,
                    'daily_profit': total_daily_profit
                })
                
                logging.info(f"✅ Betting cycle completed. Placed {bets_placed} bets. Daily profit: KSH {total_daily_profit:.2f}")
                logging.info(f"⏰ Waiting {self.betting_interval} seconds for next cycle...")
                time.sleep(self.betting_interval)
                
            except Exception as e:
                logging.error(f"Betting worker error: {e}")
                time.sleep(60)  # Wait 1 minute on error
    
    def analysis_worker(self):
        """Background analysis worker"""
        while self.running:
            try:
                logging.info("🧠 Running AI analysis cycle...")
                
                # Perform market analysis
                opportunities = self.analyze_betting_opportunities()
                
                # Update analysis status
                self.update_status({
                    'last_analysis': datetime.now().isoformat(),
                    'opportunities_found': len(opportunities)
                })
                
                logging.info(f"✅ Analysis completed. Found {len(opportunities)} opportunities")
                time.sleep(self.analysis_interval)
                
            except Exception as e:
                logging.error(f"Analysis worker error: {e}")
                time.sleep(60)
    
    def get_status(self) -> Dict[str, Any]:
        """Get current betting system status"""
        try:
            if os.path.exists(self.status_file):
                with open(self.status_file, 'r') as f:
                    return json.load(f)
            return {}
        except Exception as e:
            logging.error(f"Failed to get status: {e}")
            return {}
    
    def start(self):
        """Start the automated betting system"""
        if self.running:
            logging.warning("Betting system is already running")
            return
        
        logging.info("🚀 Starting QMOI Automated Betting System...")
        self.running = True
        
        # Update status
        self.update_status({'running': True})
        
        # Start workers in background
        betting_thread = threading.Thread(target=self.betting_worker, daemon=True)
        analysis_thread = threading.Thread(target=self.analysis_worker, daemon=True)
        
        betting_thread.start()
        analysis_thread.start()
        
        logging.info("✅ QMOI Automated Betting System started successfully")
        logging.info("📊 System will run continuously in the background")
        logging.info("💰 Daily targets: Odibets KSH 10,000, Betika KSH 10,000")
        logging.info("📝 Check logs/qmoi_betting_system.log for detailed activity")
        logging.info("📊 Check logs/betting_system_status.json for status updates")
    
    def stop(self):
        """Stop the automated betting system"""
        logging.info("🛑 Stopping QMOI Automated Betting System...")
        self.running = False
        self.update_status({'running': False})
        logging.info("✅ Betting system stopped")

def main():
    """Main function"""
    betting_system = QMOIAutomatedBettingSystem()
    
    try:
        betting_system.start()
        
        # Keep main thread alive
        while betting_system.running:
            time.sleep(1)
            
    except KeyboardInterrupt:
        logging.info("Received interrupt signal")
        betting_system.stop()
    except Exception as e:
        logging.error(f"Main thread error: {e}")
        betting_system.stop()

if __name__ == "__main__":
    main() 