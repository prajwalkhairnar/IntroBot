/**
 * Professional Context for IntroBot
 * This file contains the professional information used to personalize the chatbot responses
 */

export const PROFESSIONAL_CONTEXT = `
<professional_background>
  <current_roles>
    <role>
      <title>AI Research Engineer</title>
      <company>Arva AI</company>
      <duration>March 2025 - Present</duration>
      <description>
        YC-backed FinTech AI startup, building AI agents for financial crime compliance.
        
        - Building and maintaining LLM-based and agentic product features for AML/KYC compliance screening
        - Developing evaluation frameworks, benchmarking systems, and adversarial test cases for compliance AI
        - Implementing prompt optimization, fine-tuning pipelines, and model improvement systems
        - Working on cutting-edge research: learning dynamics, behavioral controls, interpretability, model risk governance
        - Contributing to Agent Lab platform - self-improving AI agents with human-in-the-loop feedback
        - Ensuring compliance-grade reliability through hybrid architecture: foundation models + proprietary agents + deterministic rules
      </description>
    </role>
    
    
    
    <role>
      <title>NHS Clinical Entrepreneur</title>
      <company>NHS England</company>
      <duration>January 2024 - Present</duration>
      <description>
        Cohort 8 NHS Clinical Entrepreneur Fellow, driving innovation in the NHS through the biggest entrepreneurial workforce development programme of its kind.
      </description>
    </role>
    
    
  </current_roles>

  <previous_roles>

    <role>
      <title>Founding AI Engineer</title>
      <company>Rumii (Mental Health Startup)</company>
      <duration>June 2024 - December 2025</duration>
      <description>
        Founding AI Engineer owning conversational AI components - compassionate co-pilot for mental health.
        
        - End-to-end agentic LLM development: research, fine-tuning, validation, deployment, monitoring (LLMOps)
        - Leading backend architecture and system design from ground up
        - Mentoring and overseeing junior team members in cross-functional team
        - Building production-grade conversational AI for sensitive mental health domain
      </description>
    </role>

    <role>
      <title>Senior Data Scientist</title>
      <company>Northern Care Alliance NHS Foundation Trust</company>
      <duration>January 2025 - February 2026</duration>
      <description>
        Led NLP and AI applications in healthcare with focus on production LLM systems.
        
        - Lead AI Developer for trust-wide self-serve chatbot serving 6,000+ users
        - Managed team of two data scientists, fostering agile environment with git version control
        - Senior stakeholder management including Board Executives on health inequalities research
        - Led cross-industry collaborative teams across public, private, and research sectors
        - Cloud hosting (Azure, AzureML) and distributed computing (Databricks, Spark)
      </description>
    </role>
    
    <role>
      <title>Data Scientist</title>
      <company>Northern Care Alliance NHS Foundation Trust</company>
      <duration>February 2022 - December 2024</duration>
      <description>
        Developed AI/ML solutions for clinical and operational needs, working with internal and external stakeholders on collaborative research projects using Python, R, and SQL.
        
        - Worked with Board Executives on health inequalities research
        - Extensive stakeholder management across clinical departments (Neurosurgery, Clinical Coding, A&E, Operations)
        - Production ML systems for healthcare improvement
      </description>
    </role>
    
    <role>
      <title>Management Committee Member</title>
      <company>NHS-R Community</company>
      <duration>November 2023 - February 2026</duration>
      <description>
        Shaping strategy and initiatives for R and data science adoption in UK health and care system. Committee plays pivotal role in collective decision-making to address community needs and drive positive change.
      </description>
    </role>

    <role>
      <title>Lead Positive Leadership Programme</title>
      <company>NHS North West Leadership Academy</company>
      <duration>July 2023 - December 2023</duration>
      <description>
        Bespoke leadership development programme focused on inclusive and compassionate leadership.
      </description>
    </role>
    
    <role>
      <title>EHR Development Intern</title>
      <company>Leeds Teaching Hospitals NHS Trust</company>
      <duration>August 2021 - February 2022</duration>
    </role>
    
    <role>
      <title>Data Analyst Intern</title>
      <company>The Shaadi Times</company>
      <duration>May 2020 - July 2020</duration>
    </role>
    
    <role>
      <title>Analytics Intern</title>
      <company>Megastar Engineering</company>
      <duration>December 2019 - June 2020</duration>
    </role>
  </previous_roles>

  <education>
    <degree>
      <level>Master of Science</level>
      <field>Data Science and Analytics</field>
      <institution>University of Leeds</institution>
      <duration>2021-2022</duration>
      <grade>Distinction</grade>
      <dissertation>Sample size re-estimation in randomised clinical trials - researched impact of mis-specified nuisance parameters on sample size calculations, demonstrated feasibility of adjusting allocation ratios while maintaining controlled error rates</dissertation>
    </degree>
    
    <degree>
      <level>Bachelor of Engineering</level>
      <field>Information Technology</field>
      <institution>Savitribai Phule Pune University</institution>
      <duration>2016-2020</duration>
      <grade>Distinction (GPA: 8.75)</grade>
    </degree>
  </education>

  <technical_expertise>
    <category name="AI and LLM Systems">
      <skills>
        <skill>Production LLM Development: End-to-end agentic systems, LLMOps, deployment, monitoring</skill>
        <skill>LLM Orchestration: LangGraph, LangChain, custom agent frameworks</skill>
        <skill>Model Fine-tuning: Hugging Face transformers, adapter methods, PEFT</skill>
        <skill>Evaluation and Testing: Custom eval frameworks, benchmarking, adversarial testing</skill>
        <skill>Prompt Engineering: Systematic optimization, few-shot learning, chain-of-thought</skill>
        <skill>NLP: spaCy, scispaCy, Named Entity Recognition, sentiment analysis, document classification</skill>
      </skills>
    </category>
    
    <category name="Machine Learning and Data Science">
      <skills>
        <skill>Languages: Python, R, SQL, C, C++</skill>
        <skill>ML Frameworks: PyTorch, Hugging Face transformers, scikit-learn, TensorFlow</skill>
        <skill>Data Visualization: Seaborn, matplotlib, ggplot2, Plotly</skill>
        <skill>Cloud and MLOps: Azure ML Studio, Databricks, Spark, data pipelines</skill>
        <skill>BI Tools: Power BI, Tableau</skill>
        <skill>Project Management: JIRA, Agile methodologies, git version control</skill>
      </skills>
    </category>
    
    <category name="Specialized Skills">
      <skills>
        <skill>Regulated AI: Healthcare and financial compliance, auditability, explainability</skill>
        <skill>Statistical Analysis: Hypothesis testing, multivariate analysis, clinical trial design</skill>
        <skill>Leadership: Team management, stakeholder engagement, cross-functional collaboration</skill>
        <skill>Applied AI: Deep Learning, MLOps, LLMOps</skill>
      </skills>
    </category>
  </technical_expertise>

  <major_projects>
    <project>
      <name>Adverse Media Screener for AML Compliance</name>
      <context>Technical assessment for Arva AI - production-ready compliance screening system</context>
      <highlights>
        - LangGraph orchestration with multi-step LLM workflow for KYC/AML screening
        - Compliance-first architecture with Pydantic schemas for complete auditability
        - Hybrid approach: deterministic rules + LLM reasoning + structured outputs
        - Multi-LLM support (OpenAI, Anthropic, Groq) with intelligent fallback mechanisms
        - Complete audit trails, cost tracking, and observability (LangSmith integration)
        - End-to-end evaluation framework with real-world and adversarial test cases
        - Demonstrates production-grade system design for regulated environments
      </highlights>
    </project>
    
    <project>
      <name>Trust-Wide AI Chatbot (6,000+ Users)</name>
      <context>NHS production system - self-serve knowledge assistant</context>
      <highlights>
        - Lead AI Developer for organization-wide chatbot serving entire NHS trust
        - Context-aware system for answering internal questions, directing to dashboards
        - Reliable source of truth and navigation for employees
        - Production deployment with enterprise-scale usage and high reliability requirements
      </highlights>
    </project>
    
    <project>
      <name>Clinical Coding NER-L System</name>
      <context>Lead Author and Presenter - Health and Care Analytics Conference 2023</context>
      <highlights>
        - Deep NLP research using spaCy, scispaCy, and LLMs (APIs and local SLMs)
        - Named Entity Recognition and Linking to medical ontologies (ICD-10, OPCS-4)
        - Hybrid recommendation system aiming to reduce time per patient by ~5 minutes
        - Combined traditional NLP techniques with modern LLM approaches
        - Presented research findings at national healthcare analytics conference
      </highlights>
    </project>
    
    <project>
      <name>Outpatient Did Not Attend (DNA) Risk Predictions</name>
      <context>Lead Data Scientist - To be presented at Health and Care Analytics Conference 2025</context>
      <highlights>
        - Custom internal web application to surface predictive analytics
        - Production ML system for operational healthcare improvement
        - Reduces appointment no-shows through intelligent risk prediction
      </highlights>
    </project>
    
    <project>
      <name>Clinical Document Intelligence</name>
      <context>LLM applications for healthcare efficiency</context>
      <highlights>
        - LLM-assisted discharge summary generation for clinician efficiency
        - Document summarization and classification using production LLMs
        - LLM evaluation framework specifically designed for healthcare use cases
        - Balancing automation with clinical safety and accuracy requirements
      </highlights>
    </project>
    
    <project>
      <name>Proprietary LLM Orchestration Framework</name>
      <context>Research and development for healthcare AI applications</context>
      <highlights>
        - Custom orchestration systems for complex healthcare workflows
        - Production-grade agentic frameworks with appropriate safety controls
        - Research into optimal patterns for LLM orchestration in regulated domains
      </highlights>
    </project>
  </major_projects>

  <publications_presentations>
    <publication>
      <title>NLP in Assisting Clinical Coding (NER-L)</title>
      <venue>Health and Care Analytics Conference 2023</venue>
      <role>Lead Author and Presenter</role>
      <description>Presented research on Named Entity Recognition and Linking for clinical coding automation using hybrid NLP and LLM approaches</description>
    </publication>
    
    <publication>
      <title>Outpatient DNA Risk Predictions</title>
      <venue>Health and Care Analytics Conference 2025</venue>
      <role>Lead Data Scientist</role>
      <description>Scheduled presentation on predictive analytics for reducing appointment no-shows</description>
    </publication>
  </publications_presentations>

  <professional_philosophy>
    <summary>
      I specialize in building production-grade AI systems for regulated environments where explainability, auditability, and trust are paramount. My work bridges cutting-edge AI research with practical deployment in high-stakes domains (healthcare, financial compliance).
    </summary>
    
    <core_competencies>
      <competency>Production LLM Systems: From research to deployment to monitoring</competency>
      <competency>Regulated AI: Understanding compliance requirements in healthcare and finance</competency>
      <competency>Agentic Systems: Building autonomous AI agents with appropriate guardrails</competency>
      <competency>Team Leadership: Managing data scientists, mentoring junior engineers</competency>
      <competency>Stakeholder Management: Translating between technical capabilities and business needs</competency>
      <competency>Research-to-Production: Moving quickly from experimentation to deployed systems</competency>
    </core_competencies>
    
    <current_focus>
      <area>Self-improving AI agents with human-in-the-loop feedback systems</area>
      <area>Evaluation frameworks and benchmarking for LLM systems in compliance</area>
      <area>Model risk governance and interpretability in regulated AI</area>
      <area>Hybrid architectures combining foundation models, fine-tuned models, and deterministic rules</area>
      <area>LLMOps and production ML monitoring for high-stakes applications</area>
      <area>Behavioral controls and safety mechanisms for autonomous agents</area>
    </current_focus>
    
    <beliefs>
      I believe in building AI systems that are not just technically impressive but actually trusted and adopted in domains that matter - making healthcare more efficient and financial compliance more effective while maintaining the highest standards of safety, privacy, and explainability. Production AI in regulated environments requires rigorous evaluation, comprehensive monitoring, and deep understanding of both technical capabilities and domain constraints.
    </beliefs>
  </professional_philosophy>
</professional_background>
`;

export function getProfessionalContext(): string {
  return PROFESSIONAL_CONTEXT;
}
