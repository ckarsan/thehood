# AI Evaluation Strategy (LLM-as-a-Judge)

In this project, we utilize **Opik** for tracing and observability. While the Opik Python SDK includes built-in classes for metrics like `Hallucination` and `Moderation`, the JavaScript/TypeScript SDK is currently focused on tracing and logging.

To achieve the same level of evaluation in our Node.js environment, we implement the **LLM-as-a-Judge** pattern.

## How it Works

The evaluation logic is centralized in [`server/services/aiService.js`](../server/services/aiService.js). Every report submission follows a two-stage process:

1.  **Primary Inference**: The report is classified and analyzed by the primary LLM (via Groq).
2.  **Online Evaluation (Judge)**: Immediately after, a secondary call is made to a "Judge" model (also via Groq).

### Evaluation Metrics

The "Judge" evaluates the primary response on two key metrics:

*   **Hallucination (0.0 - 1.0)**: Measures how factual the AI's classification and thought process are based on the user's original input.
    *   `1.0`: Completely factual.
    *   `0.0`: Contains made-up details not present in the input.
*   **Professionalism (0.0 - 1.0)**: Acts as a moderation check.
    *   `1.0`: Professional and helpful.
    *   `0.0`: Toxic, rude, or inappropriate.

## Recording Scores in Opik

Scores are attached directly to the Opik trace using the `.score()` method:

```javascript
trace.score({ name: "Hallucination", value: scores.hallucinationScore });
trace.score({ name: "Professionalism", value: scores.professionalismScore });
```

These scores appear in the **Opik Dashboard** under the "Feedback Scores" tab for each trace, allowing you to monitor the quality of your AI results in real-time.

## Local Evaluation Scripts

You can also run bulk evaluations on sample data using the local script:
`node server/scripts/run_evals.js`

This script demonstrates how to evaluate a dataset against expected outputs and log the resulting scores to Opik.
