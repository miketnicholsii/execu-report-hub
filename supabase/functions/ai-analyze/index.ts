import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { action, content, context } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const systemPrompts: Record<string, string> = {
      "parse-meeting": `You are a CFS project meeting analyst. Parse the meeting notes and extract structured data.
You MUST respond with ONLY a valid JSON object (no markdown, no code fences, no extra text).
The JSON object must have this structure:
{
  "title": "meeting title",
  "date": "YYYY-MM-DD",
  "attendees": ["name1", "name2"],
  "summary": "concise summary of what was discussed",
  "decisions": ["decision 1", "decision 2"],
  "discussion_notes": ["topic 1", "topic 2"],
  "action_items": [{"description": "action", "owner": "person", "due_date": "YYYY-MM-DD or null", "status": "Open"}],
  "rm_references": ["RM-12345"],
  "key_highlights": ["highlight 1"],
  "open_questions": ["question 1"],
  "next_steps": ["step 1"]
}
Be thorough. Extract every action item, RM reference (RM-XXXXX or just 5-digit numbers), decision, and open question.`,

      "analyze-document": `You are a CFS project intelligence system. Analyze the uploaded document content and extract structured project data.
You MUST respond with ONLY a valid JSON object (no markdown, no code fences, no extra text).
The JSON object must have this structure:
{
  "document_type": "meeting notes | spec | email | tracker | report | other",
  "summary": "document summary",
  "customer_references": ["customer names found"],
  "initiative_references": ["initiative/project names found"],
  "rm_references": ["RM-12345 references found"],
  "action_items": [{"description": "action", "owner": "person or null", "due_date": "date or null", "status": "Open"}],
  "deliverables": [{"name": "deliverable", "status": "status", "owner": "person or null"}],
  "key_dates": [{"date": "YYYY-MM-DD", "description": "what happens"}],
  "decisions": ["decision 1"],
  "open_questions": ["question 1"],
  "risks": ["risk 1"],
  "blockers": ["blocker 1"],
  "wiki_entry": {"title": "suggested wiki title", "content": "formatted wiki content in markdown", "tags": ["tag1"]},
  "code_snippets": [{"language": "language", "code": "code", "explanation": "plain english explanation"}]
}
Extract everything relevant to CFS project tracking.`,

      "generate-wiki": `You are a CFS project wiki generator. Based on the provided content, generate a well-structured wiki entry.
You MUST respond with ONLY a valid JSON object (no markdown, no code fences, no extra text).
The JSON object must have this structure:
{
  "title": "wiki entry title",
  "category": "Project | Technical | Process | Tool | Customer | Specification",
  "content": "full wiki content in markdown format",
  "tags": ["tag1", "tag2"],
  "related_topics": ["topic1"],
  "summary": "one-line summary"
}
Write clear, professional documentation suitable for a project team wiki.`,

      "explain-code": `You are a CFS technical documentation assistant. Explain the provided code snippet in plain English.
You MUST respond with ONLY a valid JSON object (no markdown, no code fences, no extra text).
The JSON object must have this structure:
{
  "language": "detected language",
  "purpose": "what this code does in business terms",
  "technical_explanation": "detailed technical explanation",
  "key_components": ["component 1 explanation", "component 2 explanation"],
  "business_impact": "how this affects the business/project",
  "related_systems": ["system references if identifiable"]
}`,

      "summarize-status": `You are a CFS executive reporting assistant. Summarize the provided project data into a clear status update.
You MUST respond with ONLY a valid JSON object (no markdown, no code fences, no extra text).
The JSON object must have this structure:
{
  "executive_summary": "2-3 sentence executive summary",
  "key_highlights": ["highlight 1"],
  "risks_and_blockers": ["risk 1"],
  "action_items_due": ["action 1"],
  "recommendations": ["recommendation 1"],
  "next_week_focus": ["focus area 1"]
}`,
    };

    const systemPrompt = systemPrompts[action] || systemPrompts["analyze-document"];
    const userMessage = context ? `Context: ${context}\n\nContent:\n${content}` : content;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userMessage },
        ],
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      const status = response.status;
      if (status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Add funds in Settings > Workspace > Usage." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const text = await response.text();
      console.error("AI gateway error:", status, text);
      throw new Error(`AI gateway returned ${status}`);
    }

    const result = await response.json();
    const content_text = result.choices?.[0]?.message?.content || "{}";
    
    let extracted: any = {};
    try {
      // Strip markdown code fences if present
      const cleaned = content_text.replace(/^```(?:json)?\s*\n?/i, "").replace(/\n?```\s*$/i, "").trim();
      extracted = JSON.parse(cleaned);
    } catch {
      console.error("Failed to parse AI response as JSON:", content_text.substring(0, 500));
      extracted = { raw: content_text };
    }

    return new Response(JSON.stringify({ success: true, data: extracted }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("ai-analyze error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
