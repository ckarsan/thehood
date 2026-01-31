# AI & Opik Integration Ideas for The Hood

## Current Use Case
**Post-submission cleaning** - sanitize/standardize civilian reports before forwarding to departments
- Already implemented in `AIAnalysis` schema (cleanedText, severity, duplicateConfidence)

## Additional Opik Integration Points

### 1. **Duplicate Detection & Grouping**
- Track similarity scores between new reports and existing ones
- Use Opik to evaluate clustering accuracy over time
- Store reasoning for why reports were/weren't grouped
- Helps prevent duplicate work across departments
- **Benefits**: Reduce redundant investigations, identify widespread issues

### 2. **Auto-routing Intelligence** ⭐ (Recommended Priority)
- AI suggests which department should handle each report
- Opik traces: report features → department prediction → actual assignment
- Evaluate routing accuracy as council members correct/confirm
- Learn city-specific patterns (e.g., "pothole on Main St" → Public Works)
- **Benefits**: Faster triage, reduced manual sorting, consistency

### 3. **Severity/Priority Scoring**
- Already have `severity` in `AIAnalysis` - expand this
- Track: input report → severity prediction → resolution time
- Use Opik to see if high-severity predictions correlate with faster council action
- Refine urgency classification based on outcomes
- **Benefits**: Critical issues get immediate attention

### 4. **Response Template Generation**
- When council marks resolved, AI suggests response text for civilian
- Opik evaluates: report type → suggested response → actual message sent
- Track acceptance rate of AI-generated responses
- **Benefits**: Faster citizen communication, consistent tone

### 5. **Trend Analysis & Insights**
- Weekly/monthly: AI analyzes report patterns per city
- Opik logs: data set → insights generated → council engagement
- Example: "5 drainage reports on Elm St this month" → infrastructure issue detection
- **Benefits**: Proactive infrastructure planning, budget allocation

### 6. **Quality Scoring for Reports** ⭐ (Recommended Priority)
- Score completeness: does report have location, clear description, images?
- Opik tracks correlation between quality score and resolution speed
- Prompt civilians for missing info before submission
- **Benefits**: Higher quality reports, faster resolutions

### 7. **Council Note Summarization**
- When multiple notes exist, AI creates executive summary
- Opik evaluates: notes → summary → usefulness ratings
- Helps new council members get up to speed quickly
- **Benefits**: Better handoffs, knowledge continuity

## Implementation Recommendations

**Phase 1 - High Impact**
1. Auto-routing Intelligence (#2)
2. Quality Scoring for Reports (#6)

These provide immediate value and create feedback loops for model improvement via Opik's eval tracking.

**Phase 2 - Enhanced Intelligence**
3. Duplicate Detection (#1)
4. Severity/Priority Scoring (#3)

**Phase 3 - User Experience**
5. Response Template Generation (#4)
6. Council Note Summarization (#7)

**Phase 4 - Analytics**
7. Trend Analysis & Insights (#5)

## Opik Value Proposition

For each use case, Opik provides:
- **Traceability**: Full prompt/response history for debugging
- **Evaluation**: Score prediction accuracy against real outcomes
- **Improvement**: Identify where the AI needs refinement
- **Audit Trail**: Understand why the AI made specific decisions
- **A/B Testing**: Compare different prompting strategies
