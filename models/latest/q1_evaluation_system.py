#!/usr/bin/env python3
"""
QMOI Evaluation & Benchmark System
Comprehensive testing and performance evaluation
"""

import logging
import time
import json
from typing import Dict, List, Any, Optional, Tuple
from dataclasses import dataclass
from datetime import datetime
from pathlib import Path
import statistics

logger = logging.getLogger(__name__)

@dataclass
class ReasoningTest:
    """Individual reasoning test"""
    test_id: str
    problem: str
    expected_answer: str
    difficulty: str
    category: str
    time_limit: int

@dataclass
class TestResult:
    """Result of a test execution"""
    test_id: str
    actual_answer: str
    correct: bool
    execution_time: float
    score: float
    feedback: str
    timestamp: str

@dataclass
class BenchmarkResult:
    """Comprehensive benchmark result"""
    model_name: str
    reasoning_tests: List[TestResult]
    coding_tests: List[TestResult]
    accuracy_score: float
    reasoning_score: float
    coding_score: float
    overall_score: float
    timestamp: str

class ReasoningTestSuite:
    """Suite of reasoning capability tests"""
    
    def __init__(self):
        self.tests = self._load_reasoning_tests()
        
    def _load_reasoning_tests(self) -> List[ReasoningTest]:
        """Load predefined reasoning tests"""
        return [
            ReasoningTest(
                test_id="reason_001",
                problem="If all cats are mammals and some mammals are pets, does it follow that some cats are pets?",
                expected_answer="No, it does not necessarily follow",
                difficulty="easy",
                category="logic",
                time_limit=30
            ),
            ReasoningTest(
                test_id="reason_002",
                problem="A bat and a ball cost $1.10 in total. The bat costs $1.00 more than the ball. How much does the ball cost?",
                expected_answer="$0.05",
                difficulty="medium",
                category="math",
                time_limit=60
            ),
            ReasoningTest(
                test_id="reason_003",
                problem="Complete the sequence: 2, 4, 8, 16, ?",
                expected_answer="32",
                difficulty="easy",
                category="pattern",
                time_limit=30
            ),
            ReasoningTest(
                test_id="reason_004",
                problem="If you have 8 balls, 7 of which weigh the same and 1 which is heavier, what's the minimum number of weighings needed to find the heavy ball?",
                expected_answer="2",
                difficulty="hard",
                category="logic",
                time_limit=120
            ),
            ReasoningTest(
                test_id="reason_005",
                problem="All roses are flowers. Some flowers fade quickly. Therefore:",
                expected_answer="Some roses may or may not fade quickly",
                difficulty="medium",
                category="logic",
                time_limit=45
            )
        ]
    
    def run_test(self, test: ReasoningTest, reasoner_func) -> TestResult:
        """Run a single reasoning test"""
        start_time = time.time()
        
        try:
            # Call the reasoning function
            answer = reasoner_func(test.problem)
            execution_time = time.time() - start_time
            
            # Evaluate answer
            correct = self._evaluate_answer(answer, test.expected_answer)
            score = 1.0 if correct else 0.0
            
            # Time bonus/penalty
            if execution_time > test.time_limit:
                score *= 0.8  # 20% penalty for timeout
            
            feedback = self._generate_feedback(correct, answer, test.expected_answer, execution_time)
            
            return TestResult(
                test_id=test.test_id,
                actual_answer=str(answer),
                correct=correct,
                execution_time=execution_time,
                score=score,
                feedback=feedback,
                timestamp=datetime.utcnow().isoformat()
            )
            
        except Exception as e:
            execution_time = time.time() - start_time
            return TestResult(
                test_id=test.test_id,
                actual_answer=f"Error: {str(e)}",
                correct=False,
                execution_time=execution_time,
                score=0.0,
                feedback=f"Execution failed: {str(e)}",
                timestamp=datetime.utcnow().isoformat()
            )
    
    def _evaluate_answer(self, actual: str, expected: str) -> bool:
        """Evaluate if answer is correct"""
        # Simple string matching - PRODUCTION_IMPLEMENTED would be more sophisticated
        actual_clean = actual.lower().strip()
        expected_clean = expected.lower().strip()
        
        return actual_clean == expected_clean or expected_clean in actual_clean
    
    def _generate_feedback(self, correct: bool, actual: str, expected: str, time_taken: float) -> str:
        """Generate feedback for test result"""
        if correct:
            return f"Correct! Time: {time_taken:.2f}s"
        else:
            return f"Incorrect. Expected: {expected}, Got: {actual}. Time: {time_taken:.2f}s"

class CodingTestSuite:
    """Suite of coding capability tests"""
    
    def __init__(self):
        self.tests = self._load_coding_tests()
        
    def _load_coding_tests(self) -> List[Dict[str, Any]]:
        """Load coding test cases"""
        return [
            {
                "test_id": "code_001",
                "problem": "Write a function that reverses a string",
                "expected_output": "dlrow olleh",
                "test_input": "hello world",
                "difficulty": "easy"
            },
            {
                "test_id": "code_002",
                "problem": "Write a function that checks if a number is prime",
                "expected_output": "True",
                "test_input": "7",
                "difficulty": "medium"
            },
            {
                "test_id": "code_003",
                "problem": "Write a function that finds the maximum in a list",
                "expected_output": "10",
                "test_input": "[1, 5, 10, 3, 8]",
                "difficulty": "easy"
            },
            {
                "test_id": "code_004",
                "problem": "Write a function that sorts a list using bubble sort",
                "expected_output": "[1, 2, 3, 4, 5]",
                "test_input": "[3, 1, 4, 2, 5]",
                "difficulty": "medium"
            },
            {
                "test_id": "code_005",
                "problem": "Write a function that calculates fibonacci numbers recursively",
                "expected_output": "8",
                "test_input": "6",
                "difficulty": "medium"
            }
        ]
    
    def run_test(self, test: Dict[str, Any], coder_func) -> TestResult:
        """Run a single coding test"""
        start_time = time.time()
        
        try:
            # Generate code
            code = coder_func(test["problem"])
            execution_time = time.time() - start_time
            
            # Test the code (simplified)
            test_result = self._test_generated_code(code, test)
            
            return TestResult(
                test_id=test["test_id"],
                actual_answer=code,
                correct=test_result["passed"],
                execution_time=execution_time,
                score=test_result["score"],
                feedback=test_result["feedback"],
                timestamp=datetime.utcnow().isoformat()
            )
            
        except Exception as e:
            execution_time = time.time() - start_time
            return TestResult(
                test_id=test["test_id"],
                actual_answer=f"Error: {str(e)}",
                correct=False,
                execution_time=execution_time,
                score=0.0,
                feedback=f"Code generation failed: {str(e)}",
                timestamp=datetime.utcnow().isoformat()
            )
    
    def _test_generated_code(self, code: str, test: Dict[str, Any]) -> Dict[str, Any]:
        """Test generated code (simplified)"""
        # This would actually execute the code in a sandbox
        # For now, just check if code contains expected elements
        
        expected_patterns = {
            "code_001": ["def", "reverse", "return"],
            "code_002": ["def", "prime", "for", "range"],
            "code_003": ["def", "max", "return"],
            "code_004": ["def", "sort", "for", "while"],
            "code_005": ["def", "fibonacci", "if", "return"]
        }
        
        test_id = test["test_id"]
        patterns = expected_patterns.get(test_id, [])
        
        passed = all(pattern in code.lower() for pattern in patterns)
        score = 1.0 if passed else 0.5 if len(code) > 10 else 0.0
        
        feedback = "Code structure looks good" if passed else "Code missing expected elements"
        
        return {
            "passed": passed,
            "score": score,
            "feedback": feedback
        }

class AccuracyEvaluator:
    """Evaluates accuracy against expected outputs"""
    
    def evaluate_response(self, actual: str, expected: str) -> Dict[str, Any]:
        """Evaluate response accuracy"""
        # Multiple evaluation methods
        exact_match = actual.strip().lower() == expected.strip().lower()
        partial_match = expected.lower() in actual.lower()
        similarity_score = self._calculate_similarity(actual, expected)
        
        # Weighted score
        score = 0.0
        if exact_match:
            score = 1.0
        elif partial_match:
            score = 0.7
        elif similarity_score > 0.8:
            score = 0.5
        elif similarity_score > 0.6:
            score = 0.3
        
        return {
            "exact_match": exact_match,
            "partial_match": partial_match,
            "similarity_score": similarity_score,
            "overall_score": score,
            "feedback": self._generate_accuracy_feedback(score, actual, expected)
        }
    
    def _calculate_similarity(self, text1: str, text2: str) -> float:
        """Calculate text similarity (simple Jaccard)"""
        words1 = set(text1.lower().split())
        words2 = set(text2.lower().split())
        
        intersection = len(words1.intersection(words2))
        union = len(words1.union(words2))
        
        return intersection / union if union > 0 else 0.0
    
    def _generate_accuracy_feedback(self, score: float, actual: str, expected: str) -> str:
        """Generate accuracy feedback"""
        if score >= 0.9:
            return "Excellent match!"
        elif score >= 0.7:
            return "Good match with minor differences"
        elif score >= 0.5:
            return "Partial match - some concepts correct"
        elif score >= 0.3:
            return "Poor match - major differences"
        else:
            return f"No match. Expected: {expected[:100]}..., Got: {actual[:100]}..."

class BenchmarkRunner:
    """Runs comprehensive benchmarks"""
    
    def __init__(self):
        self.reasoning_tests = ReasoningTestSuite()
        self.coding_tests = CodingTestSuite()
        self.accuracy_evaluator = AccuracyEvaluator()
        
    def run_full_benchmark(self, model_name: str, reasoner_func, coder_func) -> BenchmarkResult:
        """Run complete benchmark suite"""
        logger.info(f"Running full benchmark for {model_name}")
        
        # Run reasoning tests
        reasoning_results = []
        for test in self.reasoning_tests.tests:
            result = self.reasoning_tests.run_test(test, reasoner_func)
            reasoning_results.append(result)
        
        # Run coding tests
        coding_results = []
        for test in self.coding_tests.tests:
            result = self.coding_tests.run_test(test, coder_func)
            coding_results.append(result)
        
        # Calculate scores
        reasoning_score = statistics.mean(r.score for r in reasoning_results) if reasoning_results else 0.0
        coding_score = statistics.mean(c.score for c in coding_results) if coding_results else 0.0
        accuracy_score = (reasoning_score + coding_score) / 2
        overall_score = accuracy_score * 0.8  # Weighted for other factors
        
        return BenchmarkResult(
            model_name=model_name,
            reasoning_tests=reasoning_results,
            coding_tests=coding_results,
            accuracy_score=accuracy_score,
            reasoning_score=reasoning_score,
            coding_score=coding_score,
            overall_score=overall_score,
            timestamp=datetime.utcnow().isoformat()
        )
    
    def compare_models(self, benchmarks: List[BenchmarkResult]) -> Dict[str, Any]:
        """Compare multiple model benchmarks"""
        if not benchmarks:
            return {}
        
        # Sort by overall score
        sorted_benchmarks = sorted(benchmarks, key=lambda x: x.overall_score, reverse=True)
        
        comparison = {
            "rankings": [
                {
                    "model": b.model_name,
                    "overall_score": b.overall_score,
                    "accuracy_score": b.accuracy_score,
                    "reasoning_score": b.reasoning_score,
                    "coding_score": b.coding_score
                }
                for b in sorted_benchmarks
            ],
            "best_model": sorted_benchmarks[0].model_name,
            "best_score": sorted_benchmarks[0].overall_score,
            "total_models": len(benchmarks)
        }
        
        return comparison

class QMOIEvaluationSystem:
    """Main evaluation and benchmark system"""
    
    def __init__(self):
        self.benchmark_runner = BenchmarkRunner()
        self.benchmark_history = []
        
    def evaluate_reasoning(self, problem: str, expected_answer: str, reasoner_func) -> Dict[str, Any]:
        """Evaluate reasoning capability"""
        test = ReasoningTest(
            test_id=f"custom_{int(datetime.utcnow().timestamp())}",
            problem=problem,
            expected_answer=expected_answer,
            difficulty="custom",
            category="evaluation",
            time_limit=60
        )
        
        result = self.reasoning_tests.run_test(test, reasoner_func)
        accuracy = self.accuracy_evaluator.evaluate_response(result.actual_answer, expected_answer)
        
        return {
            "result": result,
            "accuracy": accuracy,
            "overall_score": (result.score + accuracy["overall_score"]) / 2
        }
    
    def evaluate_coding(self, problem: str, test_input: str, expected_output: str, coder_func) -> Dict[str, Any]:
        """Evaluate coding capability"""
        test = {
            "test_id": f"custom_code_{int(datetime.utcnow().timestamp())}",
            "problem": problem,
            "test_input": test_input,
            "expected_output": expected_output,
            "difficulty": "custom"
        }
        
        result = self.coding_tests.run_test(test, coder_func)
        
        return {
            "result": result,
            "code_quality": self._assess_code_quality(result.actual_answer),
            "functionality_score": result.score
        }
    
    def run_benchmark(self, model_name: str, reasoner_func, coder_func) -> BenchmarkResult:
        """Run comprehensive benchmark"""
        benchmark = self.benchmark_runner.run_full_benchmark(model_name, reasoner_func, coder_func)
        self.benchmark_history.append(benchmark)
        return benchmark
    
    def get_evaluation_stats(self) -> Dict[str, Any]:
        """Get evaluation system statistics"""
        total_benchmarks = len(self.benchmark_history)
        
        if total_benchmarks == 0:
            return {
                "total_benchmarks": 0,
                "average_overall_score": 0.0,
                "best_model": None,
                "timestamp": datetime.utcnow().isoformat()
            }
        
        avg_score = statistics.mean(b.overall_score for b in self.benchmark_history)
        best_benchmark = max(self.benchmark_history, key=lambda x: x.overall_score)
        
        return {
            "total_benchmarks": total_benchmarks,
            "average_overall_score": avg_score,
            "best_model": best_benchmark.model_name,
            "best_score": best_benchmark.overall_score,
            "models_tested": list(set(b.model_name for b in self.benchmark_history)),
            "timestamp": datetime.utcnow().isoformat()
        }
    
    def _assess_code_quality(self, code: str) -> Dict[str, Any]:
        """Assess code quality metrics"""
        return {
            "length": len(code),
            "lines": len(code.split('\n')),
            "has_functions": "def " in code,
            "has_comments": "#" in code or "//" in code,
            "readable": len(code) > 50 and ("def " in code or "function" in code)
        }

# Evaluation System API endpoints (7 total)
EVALUATION_ENDPOINTS = [
    ("POST", "/api/evaluate/reasoning", "Evaluate reasoning capability"),
    ("POST", "/api/evaluate/coding", "Evaluate coding capability"),
    ("POST", "/api/evaluate/accuracy", "Evaluate response accuracy"),
    ("POST", "/api/evaluate/benchmark", "Run comprehensive benchmark"),
    ("GET", "/api/evaluate/stats", "Get evaluation statistics"),
    ("POST", "/api/evaluate/compare", "Compare model performances"),
    ("GET", "/api/evaluate/history", "Get evaluation history")
]
