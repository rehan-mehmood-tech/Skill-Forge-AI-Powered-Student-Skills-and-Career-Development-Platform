class SkillGapCalculator:
    BENCHMARKS = {
        'Backend Engineer': {"python": 0.85, "databases": 0.80, "git": 0.75, "devops": 0.65, "web": 0.50, "ai": 0.30},
        'AI / ML Specialist': {"ai": 0.90, "python": 0.85, "databases": 0.70, "git": 0.70, "devops": 0.50, "web": 0.30},
        'Full-Stack Developer': {"web": 0.85, "databases": 0.75, "git": 0.75, "python": 0.70, "devops": 0.60, "ai": 0.40},
        'Cloud / DevOps Engineer': {"devops": 0.90, "git": 0.85, "databases": 0.70, "python": 0.65, "web": 0.40, "ai": 0.30}
    }
    
    # Default fallback for unrecognized or custom roles
    FALLBACK_BENCHMARK = {"python": 0.60, "databases": 0.60, "git": 0.60, "devops": 0.60, "web": 0.60, "ai": 0.60}

    @classmethod
    def identify_gaps(cls, current_vector: dict, target_role: str) -> dict:
        benchmark = cls.BENCHMARKS.get(target_role, cls.FALLBACK_BENCHMARK)
        
        domain_gaps = {}
        total_gap = 0.0
        total_bench = 0.0
        
        for domain, target_score in benchmark.items():
            curr_score = current_vector.get(domain, 0.0)
            gap = max(0.0, target_score - curr_score)
            
            domain_gaps[domain] = {
                'current': curr_score,
                'target': target_score,
                'gap': round(gap, 2)
            }
            
            total_gap += gap
            total_bench += target_score
            
        overall_readiness = 1.0 - (total_gap / total_bench) if total_bench > 0 else 1.0
        
        return {
            'target_role': target_role,
            'domain_gaps': domain_gaps,
            'overall_readiness': round(overall_readiness, 2)
        }

    @classmethod
    def get_priority_order(cls, gap_report: dict) -> list:
        gaps = gap_report.get('domain_gaps', {})
        
        # Sort domains descending by deficit size
        sorted_gaps = sorted(
            gaps.items(),
            key=lambda item: item[1]['gap'],
            reverse=True
        )
        
        priority_list = []
        for domain, data in sorted_gaps:
            gap_val = data['gap']
            if gap_val >= 0.30:
                category = 'CRITICAL_GAP'
            elif gap_val >= 0.15:
                category = 'MODERATE_GAP'
            else:
                category = 'ON_TRACK'
                
            priority_list.append({
                'domain': domain,
                'gap': gap_val,
                'category': category
            })
            
        return priority_list
