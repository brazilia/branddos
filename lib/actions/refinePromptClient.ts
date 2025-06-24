// /lib/actions/refinePromptClient.ts

export async function getRefinedPrompt(userInput: string, businessType: string): Promise<string> {
    const res = await fetch("/api/refine-image-prompt", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userInput, businessType }),
    });
  
    if (!res.ok) {
      throw new Error("Failed to refine image prompt");
    }
  
    const data = await res.json();
    return data.refinedPrompt; // expects: { refinedPrompt: string }
  }
  