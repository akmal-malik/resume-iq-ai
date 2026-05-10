import os

from dotenv import load_dotenv

from google import genai


# LOAD ENV

load_dotenv()


# CREATE CLIENT

client = genai.Client(

    api_key=os.getenv(
        "GEMINI_API_KEY"
    )
)


def improve_resume_bullet(
    bullet_point
):

    prompt = f"""

You are an expert ATS resume optimizer.

Improve this resume bullet point
to sound more professional,
impactful, ATS-friendly,
and recruiter-attractive.

Keep it concise and realistic.

Resume Bullet:
{bullet_point}

Improved Version:

"""

    response = client.models.generate_content(

        model="gemini-2.0-flash",

        contents=prompt
    )

    return response.text.strip()