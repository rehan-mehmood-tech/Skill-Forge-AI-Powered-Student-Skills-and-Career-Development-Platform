import pytest
from app.core.roadmap_generator import RoadmapGenerator

def test_recommend_topics():
    gap_report = {
        'domain_gaps': {
            'python': {'gap': 0.40},  # CRITICAL
            'web': {'gap': 0.20},     # MODERATE
            'devops': {'gap': 0.10}   # ON_TRACK
        }
    }
    available_resources = [
        {'id': 1, 'domain': 'python', 'title': 'Python 101'},
        {'id': 2, 'domain': 'devops', 'title': 'Docker 101'},
        {'id': 3, 'domain': 'web', 'title': 'React 101'},
    ]
    
    recommended = RoadmapGenerator.recommend_topics(gap_report, available_resources)
    
    assert len(recommended) == 2
    # python should be first (gap 0.40)
    assert recommended[0]['domain'] == 'python'
    assert recommended[1]['domain'] == 'web'

def test_build_phases():
    gap_report = {}
    recommended_topics = [{'id': i, 'title': f'Topic {i}'} for i in range(5)]
    
    phases = RoadmapGenerator.build_phases(gap_report, recommended_topics)
    
    assert len(phases) == 4
    assert phases[0]['title'].startswith("Phase 1")
    assert phases[1]['title'].startswith("Phase 2")
    assert phases[2]['title'].startswith("Phase 3")
    assert phases[3]['title'].startswith("Phase 4")
    
    # 5 topics across 4 phases -> first phase has 2 topics, others have 1
    assert len(phases[0]['recommended_resources']) == 2
    assert len(phases[1]['recommended_resources']) == 1

def test_generate_roadmap_payload():
    gap_report = {'overall_readiness': 0.5}
    phases = [{'phase_number': 1}]
    
    payload = RoadmapGenerator.generate_roadmap_payload(
        student_id='uuid-123',
        target_role='Backend Engineer',
        gap_report=gap_report,
        phases=phases
    )
    
    assert payload['student_id'] == 'uuid-123'
    assert payload['target_role'] == 'Backend Engineer'
    assert payload['status'] == 'active'
    assert payload['gap_summary'] == gap_report
    assert payload['phases'] == phases
    assert payload['version'] == 1
    assert payload['generated_by'] == 'ai-agent'
