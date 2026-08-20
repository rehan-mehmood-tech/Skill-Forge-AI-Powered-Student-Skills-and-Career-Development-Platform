import pytest
from app.core.skill_gap_calculator import SkillGapCalculator

def test_identify_gaps_perfect_match():
    current = {"python": 0.85, "databases": 0.80, "git": 0.75, "devops": 0.65, "web": 0.50, "ai": 0.30}
    report = SkillGapCalculator.identify_gaps(current, 'Backend Engineer')
    
    assert report['overall_readiness'] == 1.0
    for data in report['domain_gaps'].values():
        assert data['gap'] == 0.0

def test_identify_gaps_partial_match():
    current = {"python": 0.50, "databases": 0.50}
    # target: python 0.85 (gap 0.35), db 0.80 (gap 0.30), git 0.75 (gap 0.75), devops 0.65 (gap 0.65), web 0.50 (gap 0.50), ai 0.30 (gap 0.30)
    # total benchmark = 3.85, total gap = 2.85
    # readiness = 1.0 - (2.85 / 3.85) = 1.0 - 0.7402... = 0.26
    
    report = SkillGapCalculator.identify_gaps(current, 'Backend Engineer')
    assert report['domain_gaps']['python']['gap'] == 0.35
    assert report['domain_gaps']['git']['gap'] == 0.75
    assert report['overall_readiness'] == 0.26

def test_fallback_benchmark():
    current = {"python": 0.60, "databases": 0.60, "git": 0.60, "devops": 0.60, "web": 0.60, "ai": 0.60}
    report = SkillGapCalculator.identify_gaps(current, 'Unknown Custom Role')
    
    assert report['overall_readiness'] == 1.0

def test_get_priority_order():
    current = {"python": 0.35, "databases": 0.65}
    # gaps -> git 0.75, devops 0.65, python 0.50, web 0.50, ai 0.30, databases 0.15
    report = SkillGapCalculator.identify_gaps(current, 'Backend Engineer')
    priorities = SkillGapCalculator.get_priority_order(report)
    
    assert len(priorities) == 6
    assert priorities[0]['domain'] == 'git'
    assert priorities[0]['gap'] == 0.75
    assert priorities[0]['category'] == 'CRITICAL_GAP'

    # Check for MODERATE_GAP
    db_node = next(p for p in priorities if p['domain'] == 'databases')
    assert db_node['category'] == 'MODERATE_GAP'

    # Force an ON_TRACK mapping
    current_high = {"git": 0.70} 
    # target git 0.75 -> gap 0.05
    report2 = SkillGapCalculator.identify_gaps(current_high, 'Backend Engineer')
    priorities2 = SkillGapCalculator.get_priority_order(report2)
    
    git_node2 = next(p for p in priorities2 if p['domain'] == 'git')
    assert git_node2['category'] == 'ON_TRACK'
