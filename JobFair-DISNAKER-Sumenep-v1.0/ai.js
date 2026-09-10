async function callJobFairAI(task, payload) {
  const { data, error } = await sb.functions.invoke("jobfair-ai", {
    body: { task, payload }
  });
  if (error) throw new Error("AI gagal dipanggil.");
  if (data?.error) throw new Error(data.error);
  return data.text;
}