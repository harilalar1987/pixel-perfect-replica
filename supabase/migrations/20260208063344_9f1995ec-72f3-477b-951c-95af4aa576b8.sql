-- Enable RLS on gst_returns table
ALTER TABLE public.gst_returns ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to select gst_returns through the ownership chain
CREATE POLICY "gst_returns_select_owner"
ON public.gst_returns
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM gst_entities ge
    JOIN documents d ON d.id = ge.document_id
    WHERE ge.id = gst_returns.gst_entity_id
    AND d.uploaded_by = auth.uid()
  )
);