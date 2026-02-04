
import Groq from 'groq-sdk';
import { Opik } from 'opik';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Configure dotenv
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const opikClient = new Opik();

// Sample reports to "judge"
const sampleReports = [
  { text: "There is a massive pothole in the middle of Main St.", expectedDepartment: "Roads" },
  { text: "My neighbor's dog is barking all night.", expectedDepartment: "Public Safety" },
  { text: "I hate this mayor, he is a fraud!", expectedDepartment: "Unassigned" }, // Toxic
  { text: "The park bench is broken.", expectedDepartment: "Parks" }
];

async function runEvaluation() {
  console.log("Starting Hackathon AI Judge Demo...");

  for (const report of sampleReports) {
    console.log(`\nEvaluating Report: "${report.text}"`);

    const startTime = new Date();
    
    // 1. Run the "Model" (Simulation)
    const completion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: `Classify this report: ${report.text}` }],
      model: 'llama-3.1-8b-instant',
    });
    const response = completion.choices[0].message.content;
    
    // 2. Run the "Judge" (Evaluation)
    // We ask Groq to evaluate the quality of the report/response
    const judgeCompletion = await groq.chat.completions.create({
        messages: [{ 
            role: 'user', 
            content: `
            You are an AI Quality Judge.
            
            Input: "${report.text}"
            Response: "${response}"
            
            Evaluate this on two metrics:
            1. Hallucination (0.0 means completely hallucinated, 1.0 means factual)
            2. Professionalism (0.0 means toxic/rude, 1.0 means professional)
            
            Return JSON: { "hallucinationScore": 0.0, "professionalismScore": 0.0 }
            ` 
        }],
        model: 'llama-3.1-8b-instant',
        response_format: { type: 'json_object' }
    });

    const scores = JSON.parse(judgeCompletion.choices[0].message.content);
    console.log("Scores:", scores);

    // 3. Log to Opik with Scores
    const span = opikClient.trace({
        name: "Hackathon Evaluation Run",
        startTime,
        input: { report: report.text },
        output: { response },
        metadata: {
            model: 'llama-3.1-8b-instant',
            type: 'evaluation'
        }
    }).span({
        name: "LLM Processing",
        type: "llm",
        startTime,
        input: { prompt: report.text },
        output: { response }
    });

    // Valid span.update structure for JS SDK
    span.update({
        metadata: {
            usage: completion.usage
        }
    });
    span.end();
    
    // Log Feedback Scores
    span.score({ name: "Hallucination", value: scores.hallucinationScore });
    span.score({ name: "Professionalism", value: scores.professionalismScore });
    
    // Flush per item for demo effect
    await opikClient.flush();
  }

  console.log("\nDemo Complete! Check Opik Dashboard for scores.");
}

runEvaluation().catch(console.error);
