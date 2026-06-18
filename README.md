LinkedIn Ads Intelligence Platform 🔍📊

An end-to-end LinkedIn Ads intelligence system built in Python that crawls the LinkedIn Ad Library, extracts ad creatives and metadata, enriches ad images using Gemini Vision API, and generates ready-to-use datasets and dashboards for brand, competitor, and messaging analysis.

This project helps growth, marketing, and strategy teams understand how brands advertise on LinkedIn, what messaging works, and how competitors position themselves.

⸻

🚀 Key Capabilities
	•	🕵️ Crawl LinkedIn Ad Library by brand name, domain, and other parameters
	•	📝 Extract ad copy, metadata, and HTML snapshots
	•	🖼️ Download and store ad images locally
	•	🤖 Use Gemini API to generate AI-based image descriptions
	•	📄 Consolidate all ad data into structured sheets
	•	📊 Generate ready-to-use dashboards for insights & analysis

⸻

🧠 What This Project Solves

LinkedIn ads are rich in competitive intelligence, but:
	•	Ads are scattered and hard to track over time
	•	Creative analysis is manual and subjective
	•	Visual messaging is difficult to quantify
	•	Competitive comparisons take significant effort

This tool automates the entire workflow — from data collection → AI enrichment → insight-ready outputs.

⸻

🏗️ Architecture Overview
	1.	Crawl LinkedIn Ad Library for target brands
	2.	Scrape ad text, metadata, and creative assets
	3.	Save:
	•	Ad text (JSON / CSV)
	•	Ad images (local folders)
	•	Ad HTML snapshots
	4.	Send ad images to Gemini Vision API
	5.	Generate structured image descriptions & themes
	6.	Merge image insights with ad text data
	7.	Output a dashboard-ready file for analysis

⸻

📂 Output Structure

output/
├── ads_raw/
│   ├── ad_text.csv
│   ├── ad_metadata.json
│   └── ad_html/
├── creatives/
│   └── images/
├── ai_enriched/
│   └── image_descriptions.csv
└── dashboards/
    └── linkedin_ads_intelligence.xlsx


⸻

📊 Dashboards & Insights

The generated dashboard enables:
	•	Brand intelligence (messaging, positioning, themes)
	•	Competitor intelligence (creative patterns, tone, angles)
	•	Ad tone & branding analysis
	•	Visual vs textual messaging comparison
	•	Campaign-level and brand-level insights

Dashboards are designed to be:
	•	Plug-and-play
	•	Easy to customize
	•	Shareable with non-technical stakeholders

⸻

🛠️ Tech Stack
	•	Python (Jupyter Notebook)
	•	Requests / Playwright / Selenium (scraping)
	•	Pandas / NumPy
	•	Google Gemini Vision API
	•	Google Sheets / Excel outputs

⸻

⚙️ Setup & Usage

1️⃣ Clone the Repository

git clone https://github.com/yourusername/linkedin-ads-intelligence.git
cd linkedin-ads-intelligence

2️⃣ Install Dependencies

pip install -r requirements.txt

3️⃣ Configure API Keys
	•	Set up Gemini API credentials
	•	Add API keys to environment variables or config file

export GEMINI_API_KEY="your_api_key_here"


⸻

▶️ Running the Notebook

Open Jupyter Notebook and run:

linkedin_ads_scraper.ipynb

Configure:
	•	Brand name
	•	Domain name
	•	Search parameters

The pipeline will execute end-to-end and generate outputs automatically.

⸻

📌 Use Cases
	•	Competitive ad research
	•	Brand positioning analysis
	•	Creative & messaging audits
	•	Marketing intelligence reporting
	•	Growth & performance strategy

⸻

🔮 Future Enhancements
	•	🔄 Scheduled crawls
	•	📈 Trend analysis over time
	•	🧠 NLP-based copy clustering
	•	🟢 Hook / CTA classification
	•	🌐 Web-based dashboard
	•	🧩 Multi-platform support (Meta, Google Ads)

⸻

⚠️ Disclaimer

This project is for research and educational purposes only. Ensure compliance with LinkedIn’s terms of service and applicable laws before usage.

⸻

⭐ Contributing

Ideas, issues, and pull requests are welcome!

⸻

📄 License

MIT License

⸻

If you find this project useful, consider giving it a ⭐ on GitHub.
