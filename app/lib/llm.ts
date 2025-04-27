import OpenAI from 'openai'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { Groq } from 'groq-sdk'

interface ExtractRequest {
  content: string
  fields: Array<{
    name: string
    description: string
  }>
}

interface ExtractResponse {
  [key: string]: string
}

// Initialize clients
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

const genai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
})

// Helper function to create the prompt
function createPrompt(content: string, fields: Array<{ name: string, description: string }>): string {
  const fieldDescriptions = fields.map(field => 
    `${field.name}: ${field.description}`
  ).join('\n')

  return `Extract the following information from the provided content. 
If a field cannot be found, return "N/A". Format the response as JSON.

Fields to extract:
${fieldDescriptions}

Content:
${content}

Return only the JSON object with the extracted fields.`
}

// OpenAI (GPT) implementation
async function extractWithOpenAI(request: ExtractRequest): Promise<ExtractResponse> {
  const prompt = createPrompt(request.content, request.fields)

  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: "You are a helpful assistant that extracts information from text and returns it in JSON format."
      },
      {
        role: "user",
        content: prompt
      }
    ],
    temperature: 0,
    response_format: { type: "json_object" }
  })

  const response = completion.choices[0].message.content
  return JSON.parse(response || '{}')
}

// Gemini implementation
async function extractWithGemini(request: ExtractRequest): Promise<ExtractResponse> {
  const prompt = createPrompt(request.content, request.fields)
  const model = genai.getGenerativeModel({ model: "gemini-pro" })

  const result = await model.generateContent(prompt)
  const response = await result.response
  const text = response.text()

  try {
    return JSON.parse(text)
  } catch (error) {
    // If JSON parsing fails, try to extract JSON from the text
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0])
    }
    throw new Error('Failed to parse Gemini response as JSON')
  }
}

// Groq implementation
async function extractWithGroq(request: ExtractRequest): Promise<ExtractResponse> {
  const prompt = createPrompt(request.content, request.fields)

  const completion = await groq.chat.completions.create({
    messages: [
      {
        role: "system",
        content: "You are a helpful assistant that extracts information from text and returns it in JSON format."
      },
      {
        role: "user",
        content: prompt
      }
    ],
    model: "mixtral-8x7b-32768",
    temperature: 0,
    response_format: { type: "json_object" }
  })

  const response = completion.choices[0].message.content
  return JSON.parse(response || '{}')
}

// Main extraction function
export async function extractData(
  request: ExtractRequest,
  model: 'gpt-4' | 'gemini' | 'groq'
): Promise<ExtractResponse> {
  try {
    switch (model) {
      case 'gpt-4':
        return await extractWithOpenAI(request)
      case 'gemini':
        return await extractWithGemini(request)
      case 'groq':
        return await extractWithGroq(request)
      default:
        throw new Error(`Unsupported model: ${model}`)
    }
  } catch (error) {
    console.error(`Error extracting data with ${model}:`, error)
    throw error
  }
} 