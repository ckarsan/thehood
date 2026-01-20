const axios = require('axios')
const { Opik } = require('opik')

// Initialize Opik Client
// Ensure OPIK_API_KEY is set in .env for real logging
const opikClient = new Opik()

// Default to a local Ollama instance or similar
const LLM_API_URL = process.env.LLM_API_URL || 'http://localhost:11434/api/generate'

async function processReport(description, location, city) {
  const prompt = `
    You are an AI assistant for the ${city} City Council. 
    Your task is to process a citizen's report about a community issue.
    
    Report: "${description}"
    Location: "${location}"
    City: "${city}"

    1. Clean the text: Remove any profanity or personally identifiable information (PII) if present, but keep the core issue description clear.
    2. Classify the Department: Choose from 'Roads', 'Sanitation', 'Parks', 'Public Safety', 'Housing', or 'Other'.
    3. Determine Severity: 'Low', 'Medium', 'High', 'Critical'.
    4. Provide a thought process (OPIK) explaining your reasoning.

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
    name: 'Process Citizen Report',
    input: { description, location, city },
  })

  try {
    const span = trace.span({
      name: 'LLM Call',
      input: { prompt },
      type: 'llm',
    })

    // Attempt to call Local LLM
    const response = await axios.post(LLM_API_URL, {
      model: 'llama3', 
      prompt: prompt,
      stream: false,
      format: 'json',
    })

    let result
    try {
      if (typeof response.data.response === 'string') {
          result = JSON.parse(response.data.response)
      } else {
        result = response.data
      }
    } catch (e) {
      console.error('Failed to parse LLM JSON:', e)
      throw new Error('Invalid LLM response')
    }

    span.end({ output: result })
    trace.end({ output: result })

    return result
  } catch (error) {
    console.warn(
      'Local LLM unavailable or error. Using mock AI response.',
      error.message
    )
    
    const mockResult = {
      cleanedText: description, 
      department: 'Unassigned',
      severity: 'Medium',
      thoughts: `System: Local LLM unavailable. Defaulting to raw input. Error: ${error.message}`,
    }

    // Still end the trace even if error/mock
    trace.end({ output: mockResult, tags: ['mocked'] })

    return mockResult
  }
}

module.exports = { processReport }
