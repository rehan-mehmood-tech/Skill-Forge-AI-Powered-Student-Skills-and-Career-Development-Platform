import pytest
from app.core.skill_analyzer import SkillAnalyzer

def test_normalize():
    assert SkillAnalyzer.normalize(50.0) == 0.50
    assert SkillAnalyzer.normalize(150.0) == 1.00
    assert SkillAnalyzer.normalize(-10.0) == 0.00
    assert SkillAnalyzer.normalize(100.0) == 1.00
    assert SkillAnalyzer.normalize(0.0) == 0.00

def test_calculate_score():
    questions = [
        {'id': 'q1', 'difficulty': 'beginner', 'weight': 1.0, 'correct_option_id': 'a'},
        {'id': 'q2', 'difficulty': 'expert', 'weight': 2.0, 'correct_option_id': 'c'}
    ]
    # beginner weight: 0.75 * 1.0 = 0.75
    # expert weight: 2.0 * 2.0 = 4.0
    # total possible: 4.75
    
    # All correct
    responses_all = {'q1': 'a', 'q2': 'c'}
    assert SkillAnalyzer.calculate_score(responses_all, questions) == 100.0
    
    # One correct (beginner)
    responses_partial = {'q1': 'a', 'q2': 'b'}
    score_partial = SkillAnalyzer.calculate_score(responses_partial, questions)
    assert round(score_partial, 2) == round((0.75 / 4.75) * 100, 2)

    # All wrong
    responses_wrong = {'q1': 'b', 'q2': 'a'}
    assert SkillAnalyzer.calculate_score(responses_wrong, questions) == 0.0

def test_update_skill_vector():
    current = {'python': 0.50, 'web': 0.80}
    
    # 0.6 * 0.80 + 0.4 * 0.50 = 0.48 + 0.20 = 0.68
    updated = SkillAnalyzer.update_skill_vector(current, 'python', 0.80)
    assert updated['python'] == 0.68
    assert updated['web'] == 0.80
    
    # New domain (old score assumed 0.0)
    # 0.6 * 0.90 + 0.4 * 0.0 = 0.54
    updated2 = SkillAnalyzer.update_skill_vector(current, 'devops', 0.90)
    assert updated2['devops'] == 0.54

def test_evaluate_assessment():
    questions = [
        {'id': 'q1', 'difficulty': 'intermediate', 'weight': 1.0, 'correct_option_id': 'opt1'},
    ]
    responses = {'q1': 'opt1'}
    current_vector = {'python': 0.50}
    
    result = SkillAnalyzer.evaluate_assessment(responses, questions, current_vector, 'python')
    
    assert result['raw_score'] == 100.0
    assert result['normalized_score'] == 1.00
    assert result['proficiency_level'] == 'expert'
    # EMA = 0.6 * 1.0 + 0.4 * 0.50 = 0.60 + 0.20 = 0.80
    assert result['skill_vector']['python'] == 0.80
