import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ParsedTransaction {
  occurred_at: string;
  amount: number;
  direction: "credit" | "debit";
  counterparty?: string;
  narration?: string;
}

interface ParsedStatement {
  account_mask?: string;
  account_number?: string;
  statement_from?: string | null;
  statement_to?: string | null;
  opening_balance?: number | null;
  closing_balance?: number | null;
  currency?: string;
  transactions: ParsedTransaction[];
  meta?: Record<string, unknown>;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Supabase configuration is missing");
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    const { storagePath, documentId, loanId } = await req.json();

    if (!storagePath || !loanId) {
      return new Response(
        JSON.stringify({ error: "storagePath and loanId are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Download the file from storage
    const { data: fileData, error: downloadError } = await supabase.storage
      .from("documents")
      .download(storagePath);

    if (downloadError || !fileData) {
      console.error("Failed to download file:", downloadError);
      return new Response(
        JSON.stringify({ error: `Failed to download file from storage: ${downloadError?.message || 'Unknown error'}` }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("File downloaded successfully, size:", fileData.size);

    // Convert file to base64 using standard encoding
    const arrayBuffer = await fileData.arrayBuffer();
    const bytes = new Uint8Array(arrayBuffer);
    
    // Use Deno's standard base64 encoding
    const { encode } = await import("https://deno.land/std@0.168.0/encoding/base64.ts");
    const base64Content = encode(bytes);
    
    console.log("Base64 content length:", base64Content.length);

    // For digital PDFs, we'll extract text and send to AI for parsing
    // Use Lovable AI to extract transactions from the PDF content
    const systemPrompt = `You are a bank statement parser. Extract transaction data from the provided bank statement content.
    
Return a JSON object with this exact structure:
{
  "account_number": "string or null",
  "statement_from": "YYYY-MM-DD or null",
  "statement_to": "YYYY-MM-DD or null",
  "opening_balance": number or null,
  "closing_balance": number or null,
  "currency": "INR" or appropriate currency code,
  "transactions": [
    {
      "occurred_at": "YYYY-MM-DD",
      "amount": number (positive),
      "direction": "credit" or "debit",
      "counterparty": "string or null",
      "narration": "string describing the transaction"
    }
  ]
}

Important rules:
- All amounts should be positive numbers
- Use "credit" for money coming in, "debit" for money going out
- Parse dates to YYYY-MM-DD format
- Extract as many transactions as you can find
- If you cannot determine a field, use null
- Return ONLY the JSON object, no other text`;

    const userPrompt = `Parse this bank statement PDF content (base64 encoded). Extract all transactions and account details.

PDF Base64 Content (first 50000 chars):
${base64Content.substring(0, 50000)}

Please extract all transaction data and return the structured JSON.`;

    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.1,
      }),
    });

    if (!aiResponse.ok) {
      if (aiResponse.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (aiResponse.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add funds to your workspace." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await aiResponse.text();
      console.error("AI gateway error:", aiResponse.status, errorText);
      throw new Error(`AI gateway error: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    const content = aiData.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("No content in AI response");
    }

    // Parse the JSON from AI response
    let parsed: ParsedStatement;
    try {
      // Try to extract JSON from the response (it might be wrapped in markdown code blocks)
      const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/) || [null, content];
      const jsonStr = jsonMatch[1] || content;
      parsed = JSON.parse(jsonStr.trim());
    } catch (parseError) {
      console.error("Failed to parse AI response:", content);
      throw new Error("Failed to parse AI response as JSON");
    }

    // Validate and normalize the parsed data
    const normalizedTransactions: ParsedTransaction[] = (parsed.transactions || []).map((tx: any) => ({
      occurred_at: tx.occurred_at || new Date().toISOString().slice(0, 10),
      amount: Math.abs(Number(tx.amount) || 0),
      direction: tx.direction === "credit" ? "credit" : "debit",
      counterparty: tx.counterparty || undefined,
      narration: tx.narration || undefined,
    }));

    // Create account mask from account number
    const accountMask = parsed.account_number
      ? String(parsed.account_number).slice(-4).padStart(4, "X")
      : undefined;

    // Insert bank statement record
    const { data: stmt, error: stmtError } = await supabase
      .from("bank_statements")
      .insert({
        loan_id: loanId,
        document_id: documentId || null,
        account_mask: accountMask,
        account_number: parsed.account_number,
        statement_from: parsed.statement_from,
        statement_to: parsed.statement_to,
        opening_balance: parsed.opening_balance,
        closing_balance: parsed.closing_balance,
        currency: parsed.currency || "INR",
        meta: { ai_parsed: true, model: "gemini-2.5-flash" },
      })
      .select()
      .single();

    if (stmtError) {
      console.error("Failed to insert bank statement:", stmtError);
      throw new Error("Failed to save bank statement");
    }

    // Insert transactions in chunks
    if (normalizedTransactions.length > 0) {
      const chunkSize = 500;
      for (let i = 0; i < normalizedTransactions.length; i += chunkSize) {
        const chunk = normalizedTransactions.slice(i, i + chunkSize).map((tx) => ({
          bank_statement_id: stmt.id,
          occurred_at: tx.occurred_at,
          amount: tx.amount,
          direction: tx.direction,
          counterparty: tx.counterparty,
          narration: tx.narration,
          raw: {},
        }));

        const { error: txError } = await supabase.from("bank_transactions").insert(chunk);
        if (txError) {
          console.error("Failed to insert transactions:", txError);
          // Continue anyway - partial data is better than none
        }
      }
    }

    // Update ingestion job if documentId was provided
    if (documentId) {
      await supabase
        .from("ingestion_jobs")
        .update({
          status: "done",
          progress: 100,
          finished_at: new Date().toISOString(),
          meta: { ai_parsed: true, transaction_count: normalizedTransactions.length },
        })
        .eq("document_id", documentId);
    }

    return new Response(
      JSON.stringify({
        success: true,
        bankStatementId: stmt.id,
        transactionCount: normalizedTransactions.length,
        parsed: {
          account_mask: accountMask,
          statement_from: parsed.statement_from,
          statement_to: parsed.statement_to,
          opening_balance: parsed.opening_balance,
          closing_balance: parsed.closing_balance,
        },
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("parse-bank-statement error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
