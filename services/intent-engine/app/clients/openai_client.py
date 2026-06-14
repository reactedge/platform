from openai import OpenAI
from app.config import settings

client = OpenAI(api_key=settings.openai_api_key)

def call_model(prompt: dict, intent: str) -> dict:
    instructions = "\n".join(prompt["instructions"])

    response = client.chat.completions.create(
        model=settings.openai_model,
        temperature=settings.openai_performance,
        response_format={"type": "json_object"},
        messages=[
            {
                "role": "system",
                "content": instructions
            },
            {
                "role": "user",
                "content": intent
            }
        ]
    )

    content = response.choices[0].message.content

    try:
        import json
        return json.loads(content)
    except Exception:
        print("[WARN] Failed to parse model response:", content)
        return {}