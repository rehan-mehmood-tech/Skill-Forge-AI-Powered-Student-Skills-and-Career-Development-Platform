class SkillAnalyzer:
    DIFFICULTY_WEIGHTS = {
        'novice': 0.5,
        'beginner': 0.75,
        'intermediate': 1.0,
        'advanced': 1.5,
        'expert': 2.0
    }

    @staticmethod
    def normalize(raw_score: float) -> float:
        clamped = max(0.0, min(100.0, raw_score))
        return round(clamped / 100.0, 2)

    @staticmethod
    def get_proficiency_level(normalized_score: float) -> str:
        if normalized_score < 0.35:
            return 'novice'
        elif normalized_score < 0.55:
            return 'beginner'
        elif normalized_score < 0.75:
            return 'intermediate'
        elif normalized_score <= 0.90:
            return 'advanced'
        else:
            return 'expert'

    @classmethod
    def calculate_score(cls, responses: dict, questions: list) -> float:
        total_earned = 0.0
        total_possible = 0.0

        for question in questions:
            q_id = str(question.get('id', ''))
            difficulty = question.get('difficulty', 'intermediate')
            weight = question.get('weight', 1.0)
            
            diff_multiplier = cls.DIFFICULTY_WEIGHTS.get(difficulty, 1.0)
            q_possible = weight * diff_multiplier
            total_possible += q_possible

            if responses.get(q_id) == question.get('correct_option_id'):
                total_earned += q_possible

        if total_possible == 0:
            return 0.0
            
        return (total_earned / total_possible) * 100.0

    @staticmethod
    def update_skill_vector(current_vector: dict, domain: str, new_score: float) -> dict:
        updated_vector = dict(current_vector)
        old_score = updated_vector.get(domain, 0.0)
        
        # EMA smoothing: 0.6 * new_score + 0.4 * old_score
        ema_score = (0.6 * new_score) + (0.4 * old_score)
        updated_vector[domain] = round(ema_score, 2)
        return updated_vector

    @classmethod
    def evaluate_assessment(cls, responses: dict, questions: list, current_vector: dict, domain: str) -> dict:
        raw_score = cls.calculate_score(responses, questions)
        normalized_score = cls.normalize(raw_score)
        updated_vector = cls.update_skill_vector(current_vector, domain, normalized_score)
        proficiency = cls.get_proficiency_level(normalized_score)

        return {
            'raw_score': round(raw_score, 2),
            'normalized_score': normalized_score,
            'skill_vector': updated_vector,
            'proficiency_level': proficiency
        }
