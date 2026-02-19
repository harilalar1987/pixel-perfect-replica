import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Auth
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabaseAuth = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: claimsError } = await supabaseAuth.auth.getClaims(token);
    if (claimsError || !claimsData?.claims) {
      return new Response(JSON.stringify({ error: "Invalid token" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const aiGatewayApiKey = Deno.env.get("AI_GATEWAY_API_KEY");
    if (!aiGatewayApiKey) throw new Error("AI_GATEWAY_API_KEY not configured");

    const aiGatewayUrl = Deno.env.get("AI_GATEWAY_URL");
    if (!aiGatewayUrl) throw new Error("AI_GATEWAY_URL not configured");

    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { storagePath, documentId, loanId, documentType } = await req.json();

    if (!storagePath || !loanId || !documentType) {
      return new Response(JSON.stringify({ error: "storagePath, loanId, and documentType are required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Download file
    const { data: fileData, error: downloadError } = await supabase.storage.from("documents").download(storagePath);
    if (downloadError || !fileData) {
      throw new Error(`Download failed: ${downloadError?.message}`);
    }

    const arrayBuffer = await fileData.arrayBuffer();
    const bytes = new Uint8Array(arrayBuffer);
    const { encode } = await import("https://deno.land/std@0.168.0/encoding/base64.ts");
    const base64Content = encode(bytes);

    const maxLen = 200000;
    const contentToSend = base64Content.length > maxLen ? base64Content.substring(0, maxLen) : base64Content;

    let systemPrompt = "";
    let targetTable = "";
    let targetColumn = "";

    if (documentType === "bureau") {
      targetTable = "bureau_records";
      targetColumn = "raw";
      systemPrompt = `You are an expert Indian credit bureau report parser (CIBIL, Experian, CRIF, Equifax).
Extract ALL data from the bureau report into a structured JSON with this structure:
{
  "commercialSummary": { "cmrScore": number, "cmrInterpretation": "Strong"|"Moderate"|"High Risk", "totalAccounts": number, "activeAccounts": number, "totalSanctionedAmount": number, "totalOutstandingAmount": number, "aiSummary": "string" },
  "individualSummary": { "creditScore": number|null, "scoreRange": "300-900", "applicantName": "string", "dateOfBirth": "string", "totalAccounts": number, "totalSanctionedAmount": number, "totalOutstandingAmount": number, "activeAccounts": number, "overdueAccounts": number, "emailVariations": number, "telephoneVariations": number, "addressVariations": number, "hasDisputes": boolean, "hasWriteOffs": boolean, "hasSettlements": boolean },
  "aiInsights": { "creditProfileAnalysis": "string", "paymentBehaviourInsights": "string", "riskAssessment": "string", "financialObligationsOverview": "string", "strengths": ["string"], "redFlags": ["string"], "overallAssessment": "string", "riskCategory": "Low Risk"|"Moderate Risk"|"High Risk" },
  "commercialLoans": [{ "id": "string", "productType": "string", "loanAmount": number, "outstandingAmount": number, "status": "ACTIVE"|"CLOSED", "tags": ["string"], "sanctionedDate": "string", "lenderName": "string" }],
  "individualLoans": [same structure],
  "commercialLoanSummary": { "totalAccounts": number, "activeAccounts": number, "closedAccounts": number, "totalSanctionedAmount": number, "totalOutstandingAmount": number },
  "individualLoanSummary": { same },
  "enquiries": [{ "id": "string", "creditLender": "string", "enquiryDate": "string", "creditType": "string", "enquiryAmount": number, "applicantType": "Commercial"|"Individual", "bureauSource": "string" }],
  "enquiryMetrics": { "totalEnquiries": number, "last30Days": number, "last90Days": number, "last180Days": number, "last12Months": number },
  "relationships": [{ "id": "string", "fullName": "string", "status": "Active"|"Inactive", "type": "string", "dateOfBirth": "string", "relationship": "string", "bureauDataAvailable": boolean }],
  "paymentDelays": [{ "id": "string", "loanType": "string", "loanAmount": number, "sanctionedDate": "string", "delays": [{ "year": number, "months": { "JAN": number|null, ... } }] }],
  "bounceAnalysis": { "chequesPresented": number, "chequesBounced": number, "bounceRate": number, "timePeriod": "string" },
  "emiBounceAnalysis": { "totalEmiBounces": number, "recencyOfLastBounce": "string", "frequency": "Low"|"Medium"|"High", "riskClassification": "Low Risk"|"Medium Risk"|"High Risk" }
}
Return ONLY valid JSON.`;
    } else if (documentType === "gst") {
      targetTable = "gst_entities";
      targetColumn = "meta";
      systemPrompt = `You are an expert Indian GST returns parser.
Extract all data from GST returns/filings into structured JSON:
{
  "gstin": "string",
  "legalName": "string",
  "tradeName": "string",
  "pan": "string",
  "aiSummary": { "turnoverAnalysis": { "totalTurnover": number, "peakMonth": "string", "lowestMonth": "string", "yoyGrowth": number, "currentPeriod": "string", "previousPeriod": "string" }, "strengths": ["string"], "overallAssessment": "string" },
  "revenueComparison": { "gstr1Revenue": number, "gstr3bRevenue": number, "variancePercentage": number },
  "itcComparison": { "gstr3bITC": number, "gstr2aITC": number, "variancePercentage": number, "analysisPeriod": "string" },
  "grossAnalysis": { "currentPeriodRevenue": number, "previousPeriodRevenue": number, "yoyRevenueGrowth": number, "currentPeriodPurchases": number, "previousPeriodPurchases": number },
  "netAnalysis": { "netRevenue": number, "netPurchases": number, "yoyNetChange": number },
  "filingDelays": [{ "year": number, "months": { "JAN": number, "FEB": number, ... } }],
  "topSuppliers": [{ "name": "string", "pan": "string", "invoiceValue": number, "sharePercentage": number }],
  "topCustomers": [same],
  "commonParties": [{ "name": "string", "salesSharePercentage": number, "customerInvoiceValue": number, "supplierInvoiceValue": number, "totalInvoices": number }],
  "returns": [{ "period": "string", "gstr3b_revenue": number, "gstr3b_itc": number, "filing_status": "string" }]
}
Return ONLY valid JSON.`;
    } else {
      return new Response(JSON.stringify({ error: `Unsupported documentType: ${documentType}` }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const userPrompt = `Parse this ${documentType} document (base64 PDF). Extract ALL data.\n\nPDF Base64 Content:\n${contentToSend}\n\nReturn complete JSON.`;

    const aiResponse = await fetch(aiGatewayUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${aiGatewayApiKey}`,
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
        return new Response(JSON.stringify({ error: "Rate limited" }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
      if (aiResponse.status === 402) {
        return new Response(JSON.stringify({ error: "Credits exhausted" }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
      throw new Error(`AI error: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    const content = aiData.choices?.[0]?.message?.content;
    if (!content) throw new Error("No AI response content");

    let parsed: any;
    try {
      const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/) || [null, content];
      parsed = JSON.parse((jsonMatch[1] || content).trim());
    } catch {
      console.error("Failed to parse AI response:", content.substring(0, 500));
      throw new Error("Failed to parse AI response as JSON");
    }

    // Store in appropriate table
    if (documentType === "bureau") {
      const { error: insertErr } = await supabase.from("bureau_records").insert({
        loan_id: loanId,
        document_id: documentId || null,
        subject_type: "combined",
        subject_identifier: parsed.individualSummary?.applicantName || null,
        raw: parsed,
      });
      if (insertErr) throw insertErr;
    } else if (documentType === "gst") {
      // Insert gst_entity
      const { data: entity, error: entityErr } = await supabase.from("gst_entities").insert({
        loan_id: loanId,
        document_id: documentId || null,
        gstin: parsed.gstin || null,
        legal_name: parsed.legalName || null,
        meta: parsed,
      }).select().single();
      if (entityErr) throw entityErr;

      // Insert gst_returns if present
      if (parsed.returns && Array.isArray(parsed.returns) && entity) {
        const returnsData = parsed.returns.map((r: any) => ({
          gst_entity_id: entity.id,
          period: r.period,
          gstr3b_revenue: r.gstr3b_revenue || null,
          gstr3b_itc: r.gstr3b_itc || null,
          filing_status: r.filing_status || null,
          raw: r,
        }));
        await supabase.from("gst_returns").insert(returnsData);
      }
    }

    // Update ingestion job
    if (documentId) {
      await supabase.from("ingestion_jobs").update({
        status: "done",
        progress: 100,
        finished_at: new Date().toISOString(),
        meta: { ai_parsed: true, document_type: documentType },
      }).eq("document_id", documentId);
    }

    return new Response(JSON.stringify({ success: true, documentType, parsed: Object.keys(parsed) }), {
      status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("parse-document error:", error);
    return new Response(JSON.stringify({ success: false, error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
