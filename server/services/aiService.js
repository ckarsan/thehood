import Groq from 'groq-sdk'
import { Opik } from 'opik'

// Initialize Opik Client
const opikClient = new Opik()

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || 'gsk_placeholder_for_local_dev',
})

export async function processReport(description, location, city) {
  const prompt = `
    You are an AI assistant for the ${city} City Council. 
    Your task is to process a citizen's report about a community issue.
    
    Report: "${description}"
    Location: "${location}"
    City: "${city}"

    1. Clean the text: Remove any profanity or personally identifiable information (PII) if present, but keep the core issue description clear.
    2. Classify the Department: Choose from 'Roads', 'Sanitation', 'Parks', 'Public Safety', 'Housing', 'Unassigned', or 'Other'.
    3. Determine Severity: 'Low', 'Medium', 'High', 'Critical'.
    4. Provide a thought process explaining your reasoning.

    Return the response in strictly valid JSON format:
    {
      "cleanedText": "...",
      "department": "...",
      "severity": "...",
      "thoughts": "..."
    }
  `

  // Start OPIK Trace
  const trace = opikClient.trace({
    name: 'Process Citizen Report (Groq)',
    input: { description, location, city },
  })

  try {
    const span = trace.span({
      name: 'LLM Call',
      input: { prompt },
      type: 'llm',
    })

    if (!process.env.GROQ_API_KEY) {
      throw new Error('GROQ_API_KEY is not set')
    }

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are a helpful city services AI. Output valid JSON only.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      model: 'llama3-70b-8192', // Fast and reliable
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

    span.end({ output: result })
    trace.end({ output: result })

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
