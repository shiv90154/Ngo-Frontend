import io, os, sys
import requests
import streamlit as st
from PIL import Image
import json

def normalize_condition_name(name: str) -> str:
    return name.strip()


sys.path.insert(0, os.path.dirname(__file__))

NON_DISEASE = ["Healthy", "Heathy", "Normal Skin", "No Disease"]



st.set_page_config(
    page_title="Skin Disease Screening",
    page_icon="🔬",
    layout="centered",
    initial_sidebar_state="expanded",
)

st.markdown("""
<style>
  .block-container { max-width: 100%; padding-top: 1.5rem 2rem 3rem; }
  .app-title { font-size: 1.65rem; font-weight: 700; color: #111827; margin-bottom: 0.15rem; }
  .app-sub   { font-size: 0.88rem; color: #6b7280; margin-bottom: 0.5rem; }

  .result-wrap {
    background:#f9fafb; border:1px solid #e5e7eb;
    border-radius:14px; padding:1.4rem 1.6rem; margin-top:1rem;
  }
  .cond-name { font-size:1.4rem; font-weight:700; color:#111827; margin-bottom:4px; }

  .subtype-box {
    background:#eff6ff; border:1px solid #bfdbfe;
    border-radius:10px; padding:0.75rem 1rem; margin:0.75rem 0;
  }
  .subtype-label {
    font-size:0.7rem; text-transform:uppercase; letter-spacing:0.07em;
    color:#1d4ed8; font-weight:700; margin-bottom:4px;
  }
  .subtype-text { font-size:0.88rem; color:#1e3a8a; font-weight:500; line-height:1.5; }

  .section-label {
    font-size:0.7rem; text-transform:uppercase; letter-spacing:0.07em;
    color:#9ca3af; font-weight:600; margin-bottom:3px;
  }
  .section-value { font-size:0.92rem; color:#374151; line-height:1.7; }

  .ai-badge {
    display:inline-block; padding:2px 10px; border-radius:12px;
    font-size:0.68rem; font-weight:600; margin-left:8px;
    background:#f3e8ff; color:#7c3aed;
  }
  .healthy-box {
    background:#f0fdf4; border:1px solid #86efac;
    border-radius:14px; padding:1.4rem 1.6rem; margin-top:1rem;
  }
  .healthy-title { font-size:1.3rem; font-weight:700; color:#166534; margin-bottom:0.5rem; }
  .healthy-text  { font-size:0.92rem; color:#15803d; line-height:1.7; }
  .uncertain-box {
    background:#fefce8; border:1px solid #fde047;
    border-radius:14px; padding:1.4rem 1.6rem; margin-top:1rem;
  }
  .uncertain-title { font-size:1.1rem; font-weight:700; color:#854d0e; margin-bottom:0.5rem; }
  .uncertain-text  { font-size:0.92rem; color:#92400e; line-height:1.7; }

  .badge { display:inline-block; padding:3px 12px; border-radius:20px; font-size:0.73rem; font-weight:700; margin-bottom:0.8rem; }
  .badge-ok       { background:#d1fae5; color:#065f46; }
  .badge-uncertain{ background:#fef3c7; color:#92400e; }
  .badge-urgent   { background:#fee2e2; color:#991b1b; }

  .disclaimer {
    background:#fff7ed; border:1px solid #fed7aa;
    border-radius:10px; padding:0.8rem 1rem;
    font-size:0.82rem; color:#92400e; margin-top:1.2rem;
  }

  .meta-line { font-size:0.75rem; color:#9ca3af; text-align:right; margin-top:8px; }
  .stButton > button { border-radius:8px; font-weight:600; width:100%; padding:0.6rem; }

.block-container {
  padding-top: 3rem !important;
}

.stTabs {
  margin-top: 10px !important;
}

section.main > div {
  overflow: visible !important;
}
""", unsafe_allow_html=True)

@st.cache_resource(show_spinner="Loading AI model...")
def get_classifier():
    from models.classifier import load_model
    load_model()
    from models import classifier
    return classifier



with st.sidebar:
    st.markdown("### Settings")
    hindi_enabled = st.toggle("Hindi Language", value=False)
    language = "Hindi" if hindi_enabled else "English"
    st.markdown("---")


with st.container():
    uploaded_file = st.file_uploader(
        "Upload a skin image",
        type=["jpg", "jpeg", "png", "webp", "bmp"],
        help="Max 10 MB — processed in memory only, never stored.",
    )


    if uploaded_file is None:
        st.markdown("""
        <div style="text-align:center;padding:3rem 1rem;background:#f9fafb;
             border:1.5px dashed #d1d5db;border-radius:14px;margin-top:1rem;">
          <div style="font-size:2.8rem;margin-bottom:0.5rem;"></div>
          <div style="font-size:1rem;font-weight:600;color:#6b7280;margin-bottom:4px;">
            Upload a skin image to analyze
          </div>
          <div style="font-size:0.82rem;color:#9ca3af;">
            JPG · PNG · WEBP · BMP — max 10 MB · Full color
          </div>
        </div>
        """, unsafe_allow_html=True)
    else:
        file_bytes = uploaded_file.read()
        if len(file_bytes) > 10 * 1024 * 1024:
            st.error("File exceeds 10 MB.")
        else:
            col_l, col_m, col_r = st.columns([1, 4, 1])
            with col_m:
                img = Image.open(io.BytesIO(file_bytes)).convert("RGB")
                st.image(img, caption="Uploaded image", use_container_width=True)

            st.markdown("---")
            if st.button("Analyze Image"):


                with st.status("Analyzing image...", expanded=True) as status_box:
                    st.write("Running AI model (ViT)...")
                    try:
                        st.write("Sending image to API...")
                        files = {"file": (uploaded_file.name, file_bytes, uploaded_file.type)}
                        data = {"language": language}

                        response = requests.post(
                            "http://localhost:8000/predict",
                            files=files,
                            data=data,
                            stream=True  # 🔥 IMPORTANT
                        )

                        if response.status_code != 200:
                            st.error("API error — try again")
                            st.stop()

                        full_text = ""
                        meta_parsed = False
                        result = {}

                        placeholder = st.empty()

                        for chunk in response.iter_content(chunk_size=1024):
                            if chunk:
                                text = chunk.decode("utf-8")
                                full_text += text

                                if "__META__" in full_text and "\n" in full_text and not meta_parsed:
                                    first_line = full_text.split("\n", 1)[0]

                                    parts = first_line.split("|")

                                    if len(parts) >= 4:
                                        result = {
                                            "condition": parts[1],
                                            "confidence": float(parts[2]),
                                            "status": parts[3],
                                            "advice": ""
                                        }
                                        meta_parsed = True

                                    result = {
                                        "condition": parts[1] if len(parts) > 1 else "Uncertain",
                                        "confidence": float(parts[2]) if len(parts) > 2 else 0,
                                        "status": parts[3] if len(parts) > 3 else "uncertain",
                                        "advice": ""
                                    }
                                    meta_parsed = True

                                # Show streaming text
                                if meta_parsed:
                                    advice_text = full_text.split("\n", 1)[-1]
                                    result["advice"] = advice_text

                                    placeholder.markdown(
                                        f"<div class='section-value'>{advice_text}</div>",
                                        unsafe_allow_html=True
                                    )

                        status = result.get("status", "")

                        if status == "uncertain":
                            st.warning("⚠️ Low confidence result — may be inaccurate")

                        advice = result.get("advice", "")


                        st.write(f"Confidence: {result.get('confidence', 0)}%")
                    except Exception as exc:
                        st.error(f"Classification failed: {exc}")
                        st.stop()

                    st.write("Generating AI response...")
                    info = result
                    status_box.update(label="Analysis complete", state="complete", expanded=False)

                condition_raw = result["condition"]
                condition     = normalize_condition_name(condition_raw)
                if hindi_enabled:
                    display_name = result.get("display_name", result.get("condition", "Uncertain"))
                else:
                    display_name = result.get("condition", "Uncertain")
                confidence = result.get("confidence", 0)
                if confidence < 70:
                    st.warning("Low confidence result — please upload a clearer image")
                status        = result.get("status", "")

                if status == "image_only":
                    st.success("Result based on image analysis")

                is_urgent  = result.get("is_urgent", False)
                condition_lower = condition.lower()

                generated = info.get("ai_generated", False)

                badge = (
                    '<span class="badge badge-urgent">Seek Medical Attention</span>'
                    if is_urgent else
                    '<span class="badge badge-ok">✓ Classified</span>'
                )
                ai_tag = '<span class="ai-badge">AI Generated</span>' if generated else ''

                st.markdown(
                    f'<div class="result-wrap">{badge}<div class="cond-name">{display_name}{ai_tag}</div></div>',
                    unsafe_allow_html=True
                )

                st.progress(min(confidence / 100, 1.0))

                subtypes = info.get("subtypes", "")
                if subtypes:
                    label = "आपको विशेष रूप से यह हो सकता है" if hindi_enabled else "You may specifically have"
                    st.markdown(
                        f'<div class="subtype-box"><div class="subtype-label">{label}</div><div class="subtype-text">{subtypes}</div></div>',
                        unsafe_allow_html=True
                    )

                advice = info.get("advice", "")

                definition = info.get("definition", "")

                if generated and advice:
                    label = "AI-powered assessment"
                    st.markdown(
                        f'<div class="result-wrap"><div class="section-label">{label}</div><div class="section-value">{advice}</div></div>',
                        unsafe_allow_html=True
                    )
                else:
                    if definition and not hindi_enabled:
                        st.markdown(
                            f'<div class="result-wrap"><div class="section-label">What is this condition?</div><div class="section-value">{definition}</div></div>',
                            unsafe_allow_html=True
                        )
                    if advice:
                        label = "सामान्य देखभाल सलाह" if hindi_enabled else "General care advice"
                        st.markdown(
                            f'<div class="result-wrap"><div class="section-label">{label}</div><div class="section-value">{advice}</div></div>',
                            unsafe_allow_html=True
                        )

                top_predictions = result.get("top_predictions", [])
                if top_predictions:
                    st.markdown("### Possible Conditions")
                    for item in top_predictions:
                        raw_name = normalize_condition_name(item["condition"])
                        display = raw_name if not hindi_enabled else raw_name
                        st.write(f"- {display} ({item['confidence']}%)")

                disclaimer = "<strong>Disclaimer:</strong> This is not medical advice. Always consult a qualified healthcare professional for proper diagnosis and treatment."

                st.markdown(f'<div class="disclaimer">{disclaimer}</div>', unsafe_allow_html=True)