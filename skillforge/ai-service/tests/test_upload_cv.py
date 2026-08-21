import requests

# Test endpoint assuming gateway running on 5000 or AI service on 8000
# For simplicity, testing AI service on 8000 directly.
url = "http://127.0.0.1:8000/api/upload-cv"

# Let's create a dummy pdf first for testing
from reportlab.pdfgen import canvas
pdf_path = "dummy.pdf"
c = canvas.Canvas(pdf_path)
c.drawString(100, 750, "Resume of John Doe")
c.drawString(100, 730, "Skills: Python, React, Supabase, TypeScript")
c.drawString(100, 710, "Experience: 5 years in software engineering")
c.save()

with open(pdf_path, 'rb') as f:
    files = {'file': (pdf_path, f, 'application/pdf')}
    data = {'student_id': '00000000-0000-0000-0000-000000000000'}
    try:
        response = requests.post(url, files=files, data=data)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
    except Exception as e:
        print(f"Connection failed: {e}")
