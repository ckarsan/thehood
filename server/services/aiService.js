import Groq from 'groq-sdk'
import { Opik } from 'opik'

// Initialize Opik Client
const opikClient = new Opik()

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || 'gsk_placeholder_for_local_dev',
})

export async function processReport(description, location, city, recentReports = []) {
  const recentReportsContext = recentReports.map(r => 
    `- [Ref: ${r.referenceNumber}] [${new Date(r.createdAt).toLocaleDateString()}] ${r.originalDescription} at ${r.location} (${r.department})`
  ).join('\n')

  const prompt = `
    You are an AI assistant for the ${city} City Council. 
    Your task is to process a citizen's report about a community issue.
    
    Report: "${description}"
    Location: "${location}"
    City: "${city}"

    Context: Here are recent reports (last 14 days) in this city:
    ${recentReportsContext || "No recent reports."}

    1. Clean the text: Remove any profanity or personally identifiable information (PII).
    2. Classify the Department: Choose from 'Roads', 'Sanitation', 'Parks', 'Public Safety', 'Housing', 'Unassigned', or 'Other'.
    3. Determine Severity: 'Low', 'Medium', 'High', 'Critical'.
    4. Check for Duplicates: 
       - Check through the last 10 reports in the context list above.
       - If any report includes a similar subject (e.g., "fallen tree") and location (e.g., "gotham park"), cite its Reference Number.
       - Work out an approx duplication score (0 = no duplication, 1 = certain duplication).
    5. Provide a concise thought process.

    Return the response in strictly valid JSON format:
    {
      "cleanedText": "...",
      "department": "...",
      "severity": "...",
      "duplicateConfidence": 0.0,
      "possibleDuplicates": ["Ref-123"], 
      "thoughts": "..."
    }
  `

  // Start OPIK Trace
  const trace = opikClient.trace({
    name: 'Process Citizen Report (Groq)',
    input: { description, location, city },
  })

  try {
    const messages = [
      {
        role: 'system',
        content: 'You are a helpful city services AI. Output valid JSON only.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ]

    const startTime = new Date()

    if (!process.env.GROQ_API_KEY) {
      throw new Error('GROQ_API_KEY is not set')
    }

    const completion = await groq.chat.completions.create({
      messages,
      model: 'llama-3.1-8b-instant', // Fast and reliable
      temperature: 0.3,
      response_format: { type: 'json_object' },
    })

    const responseContent = completion.choices[0]?.message?.content
    let result

    try {
      result = JSON.parse(responseContent)
    } catch (e) {
      console.error('Failed to parse Groq JSON:', e)
      throw new Error('Invalid LLM response')
    }

    const span = trace.span({
      name: 'LLM Call',
      type: 'llm',
      startTime, // Manually set start time
      input: { messages },
      output: {
        response: result, // Use the parsed object, not stringified JSON
      },
      metadata: {
        model: 'llama-3.1-8b-instant',
        provider: 'groq',
        usage: {
          prompt_tokens: completion.usage?.prompt_tokens,
          completion_tokens: completion.usage?.completion_tokens,
          total_tokens: completion.usage?.total_tokens,
        },
      },
    })
    span.end() // Ends at current time

    // Log the duplicate confidence as a Feedback Score
    if (result.duplicateConfidence !== undefined) {
      span.score({
        name: 'Duplicate Probability',
        value: result.duplicateConfidence,
      })
    }

    // --- Hackathon Demo: Online Evaluation (Judge) ---
    // Awaiting this for demo reliability (adds ~1s latency)
    try {
        console.log('--- STARTING OPIK JUDGE ---')
        
        const judgeCompletion = await groq.chat.completions.create({
            messages: [{ 
                role: 'user', 
                content: `
                You are an AI Quality Judge.
                
                Input: "${description}"
                Response: "${JSON.stringify(result)}"
                
                Evaluate this on two metrics:
                1. Hallucination (0.0 means completely hallucinated details, 1.0 means factual based on input)
                2. Professionalism (0.0 means toxic/rude, 1.0 means professional)
                
                Return JSON: { "hallucinationScore": 0.0, "professionalismScore": 0.0 }
                ` 
            }],
            model: 'llama-3.1-8b-instant',
            response_format: { type: 'json_object' }
        });

        const scores = JSON.parse(judgeCompletion.choices[0].message.content);
        console.log('--- JUDGE SCORES ---', scores)
        
        // Log Evaluation Scores to the MAIN trace
        trace.score({ name: "Hallucination", value: scores.hallucinationScore });
        trace.score({ name: "Professionalism", value: scores.professionalismScore });
        
        // Create a separate span for the judge to see it in the trace view
        const judgeSpan = trace.span({
            name: 'Online Evaluation (Judge)',
            type: 'llm',
            input: { prompt: "Evaluate Quality..." },
            output: { response: scores },
            metadata: { type: 'evaluation' }
        });
        judgeSpan.end();

    } catch (err) {
        console.error("Evaluation Judge Failed:", err);
    }
    // --------------------------------------------------

    trace.end({ output: result })
    await opikClient.flush() // Single flush at the end

    return result
  } catch (error) {
    console.warn(
      'Groq AI unavailable or error. Using mock AI response.',
      error.message
    )

    const mockResult = {
      cleanedText: description,
      department: 'Unassigned',
      severity: 'Medium',
      thoughts: `System: AI Service Error. Defaulting to raw input. Error: ${error.message}`,
    }

    // Still end the trace even if error/mock
    trace.end({ output: mockResult, tags: ['mocked', 'error'] })

    return mockResult
  }
}
