const baseURL = import.meta.env.VITE_API_BASE || "http://127.0.0.1:8000";
export async function api(path, { method = "GET", body, headers } = {}) {
  try {
    const res = await fetch(baseURL + path, {
      method,
      headers: { 
        "Content-Type": "application/json",
        "Accept": "application/json",
        ...(headers || {}) 
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    const contentType = res.headers.get("content-type") || "";
    const isJson = contentType.includes("application/json");
    const responseData = isJson ? await res.json() : await res.text();

    if (!res.ok) {
      throw new Error(
        isJson && responseData.message 
          ? responseData.message 
          : `API ${method} ${path} failed: ${res.status} ${JSON.stringify(responseData)}`
      );
    }

    return responseData;
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error(`Network error: Could not connect to the API server`);
    }
    throw error;
  }
}
export async function apiReachable() {
  try {
    const r = await fetch(
      (import.meta.env.VITE_API_BASE || "http://127.0.0.1:8000") + "/api/expenses",
      { cache: "no-store" }
    );
    return r.ok;
  } catch {
    return false;
  }
}
