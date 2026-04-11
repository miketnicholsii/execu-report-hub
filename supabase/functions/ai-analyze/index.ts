import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPTS: Record<string, string> = {
  "parse-meeting": `You are a CFS project meeting analyst. Parse the meeting notes and extract structured data.
You MUST respond with ONLY a valid JSON object (no markdown, no code fences, no extra text).
{
  "title": "meeting title",
  "date": "YYYY-MM-DD",
  "attendees": ["name1", "name2"],
  "summary": "concise summary",
  "decisions": ["decision 1"],
  "discussion_notes": ["topic 1"],
  "action_items": [{"description": "action", "owner": "person", "due_date": "YYYY-MM-DD or null", "status": "Open"}],
  "rm_references": ["RM-12345"],
  "key_highlights": ["highlight 1"],
  "open_questions": ["question 1"],
  "next_steps": ["step 1"]
}
Be thorough. Extract every action item, RM reference (RM-XXXXX or 5-digit numbers), decision, and open question.`,

  "analyze-document": `You are a CFS project intelligence system. Analyze the document and extract structured project data.
You MUST respond with ONLY a valid JSON object (no markdown, no code fences, no extra text).
{
  "document_type": "meeting notes | spec | email | tracker | report | issue list | other",
  "summary": "document summary",
  "customer_references": ["customer names"],
  "initiative_references": ["initiative names"],
  "rm_references": ["RM-12345"],
  "action_items": [{"title": "action title", "description": "detail", "owner": "person or null", "due_date": "YYYY-MM-DD or null", "status": "Open", "priority": "High|Medium|Low"}],
  "deliverables": [{"name": "deliverable", "status": "status", "owner": "person or null"}],
  "key_dates": [{"date": "YYYY-MM-DD", "description": "what happens"}],
  "decisions": ["decision 1"],
  "open_questions": ["question 1"],
  "risks": ["risk 1"],
  "blockers": ["blocker 1"],
  "wiki_entry": {"title": "wiki title", "content": "markdown content", "tags": ["tag1"]},
  "rm_tickets": [{"rm_number": "RM-12345", "title": "title", "status": "status", "owner": "owner", "summary": "summary"}]
}
Extract EVERYTHING relevant to CFS project tracking. Be exhaustive with action items and RM references.`,

  "generate-wiki": `You are a CFS project wiki generator. Generate a well-structured wiki entry.
You MUST respond with ONLY a valid JSON object.
{
  "title": "wiki entry title",
  "category": "Project | Technical | Process | Tool | Customer | Specification",
  "content": "full wiki content in markdown",
  "tags": ["tag1", "tag2"],
  "related_topics": ["topic1"],
  "summary": "one-line summary"
}`,

  "explain-code": `You are a CFS technical documentation assistant. Explain the code snippet in plain English.
You MUST respond with ONLY a valid JSON object.
{
  "language": "detected language",
  "purpose": "what this code does in business terms",
  "technical_explanation": "detailed technical explanation",
  "key_components": ["component 1 explanation"],
  "business_impact": "how this affects the business/project",
  "related_systems": ["system references"]
}`,

  "summarize-status": `You are a CFS executive reporting assistant. Summarize project data into a clear status update.
You MUST respond with ONLY a valid JSON object.
{
  "executive_summary": "2-3 sentence executive summary",
  "key_highlights": ["highlight 1"],
  "risks_and_blockers": ["risk 1"],
  "action_items_due": ["action 1"],
  "recommendations": ["recommendation 1"],
  "next_week_focus": ["focus area 1"]
}`,

  "process-spreadsheet": `You are a CFS project data extractor. Analyze the spreadsheet/CSV data and extract structured project information.
You MUST respond with ONLY a valid JSON object.
{
  "document_type": "tracker | issue list | schedule | report | data export",
  "summary": "what this spreadsheet contains",
  "customer_references": ["customer names found"],
  "rm_references": ["RM-12345"],
  "action_items": [{"title": "action", "description": "detail", "owner": "person or null", "due_date": "YYYY-MM-DD or null", "status": "Open", "priority": "High|Medium|Low"}],
  "rm_tickets": [{"rm_number": "RM-12345", "title": "title", "status": "status", "owner": "owner", "summary": "summary", "priority": "priority"}],
  "issues": [{"id": "issue id", "title": "title", "status": "status", "priority": "priority", "owner": "owner", "description": "description"}],
  "key_dates": [{"date": "YYYY-MM-DD", "description": "event"}],
  "risks": ["risk 1"],
  "blockers": ["blocker 1"]
}
Extract every row of actionable data. Be exhaustive.`,
};

async function callAI(apiKey: string, model: string, systemPrompt: string, userMessage: string, endpoint: string) {
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage },
      ],
      response_format: { type: "json_object" },
    }),
  });

  if (!response.ok) {
    const status = response.status;
    const text = await response.text();
    console.error(`AI error [${status}]:`, text.substring(0, 300));
    if (status === 429) throw { status: 429, message: "Rate limit exceeded. Please try again." };
    if (status === 402) throw { status: 402, message: "AI credits exhausted." };
    throw { status, message: `AI gateway returned ${status}` };
  }

  const result = await response.json();
  const content = result.choices?.[0]?.message?.content || "{}";
  const cleaned = content.replace(/^```(?:json)?\s*\n?/i, "").replace(/\n?```\s*$/i, "").trim();
  return JSON.parse(cleaned);
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { action, content, context, provider, openai_key, model: requestedModel } = await req.json();
    
    // Determine AI provider
    let apiKey: string;
    let endpoint: string;
    let model: string;

    if (provider === "openai" && openai_key) {
      apiKey = openai_key;
      endpoint = "https://api.openai.com/v1/chat/completions";
      model = requestedModel || "gpt-4o";
    } else {
      apiKey = Deno.env.get("LOVABLE_API_KEY") || "";
      if (!apiKey) throw { status: 500, message: "LOVABLE_API_KEY not configured" };
      endpoint = "https://ai.gateway.lovable.dev/v1/chat/completions";
      model = requestedModel || "google/gemini-2.5-flash";
    }

    const systemPrompt = SYSTEM_PROMPTS[action] || SYSTEM_PROMPTS["analyze-document"];
    const userMessage = context ? `Context: ${context}\n\nContent:\n${content}` : content;

    const extracted = await callAI(apiKey, model, systemPrompt, userMessage, endpoint);

    return new Response(JSON.stringify({ success: true, data: extracted }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e: any) {
    console.error("ai-analyze error:", e);
    const status = e?.status || 500;
    const message = e?.message || (e instanceof Error ? e.message : "Unknown error");
    return new Response(JSON.stringify({ error: message }), {
      status, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
