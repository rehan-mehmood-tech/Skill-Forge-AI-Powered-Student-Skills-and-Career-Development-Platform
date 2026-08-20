import pytest
from app.core.skill_analyzer import SkillAnalyzer
from app.core.skill_gap_calculator import SkillGapCalculator
from app.core.roadmap_generator import RoadmapGenerator

def test_phase6_skill_analyzer():
    # Test EMA Math
    current_vector = {'python': 0.50}
    # new score 1.0 (100%), EMA: 0.6 * 1.0 + 0.4 * 0.5 = 0.8
    updated = SkillAnalyzer.update_skill_vector(current_vector, 'python', 1.0)
    assert updated['python'] == 0.80
    
    # Test Calculate Score (weighted)
    questions = [{'id': 'q1', 'difficulty': 'expert', 'weight': 1.0, 'correct_option_id': 'a'}]
    # expert = 2.0 multiplier -> total possible = 2.0
    responses = {'q1': 'a'}
    assert SkillAnalyzer.calculate_score(responses, questions) == 100.0

def test_phase6_gap_calculator():
    # Test Gap Math and Role Benchmarks
    current_vector = {"python": 0.40, "devops": 0.50, "databases": 0.60, "git": 0.60, "web": 0.60, "ai": 0.60}
    # Fallback Benchmark assumes 0.60 everywhere
    report = SkillGapCalculator.identify_gaps(current_vector, 'Unknown Role')
    
    gaps = report['domain_gaps']
    assert gaps['python']['gap'] == 0.20  # 0.60 - 0.40
    assert gaps['devops']['gap'] == 0.10  # 0.60 - 0.50
    
    # Test priority order
    priority = SkillGapCalculator.get_priority_order(report)
    assert priority[0]['domain'] == 'python'
    assert priority[0]['category'] == 'MODERATE_GAP'

def test_phase6_roadmap_generator():
    gap_report = {'overall_readiness': 0.7}
    resources = [{'id': 1, 'domain': 'python', 'title': 'Python 101'}]
    phases = RoadmapGenerator.build_phases(gap_report, resources)
    
    # Verify 4 phases
    assert len(phases) == 4
    
    # Verify Schema payload
    payload = RoadmapGenerator.generate_roadmap_payload(
        student_id='uuid-test',
        target_role='Backend Engineer',
        gap_report=gap_report,
        phases=phases
    )
    
    assert payload['student_id'] == 'uuid-test'
    assert payload['status'] == 'active'
    assert payload['version'] == 1
    assert 'gap_summary' in payload
    assert len(payload['phases']) == 4
