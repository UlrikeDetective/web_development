# Streamlit Dashboard Development Guide

A comprehensive guide to building interactive data dashboards using Streamlit, Pandas, and Plotly.

## 🚀 Setup

Install the necessary dependencies:

```bash
pip install streamlit pandas plotly
```

### Running the App
Run your application using the following command:

```bash
streamlit run app.py
```

Your browser will open automatically at `http://localhost:8501`. Every time you save `app.py`, the page refreshes—this is your primary development loop.

---

## 🏗️ Mental Model: How Streamlit Works

One important mental model before writing code:
**Every time a user interacts with a widget (slider, button, dropdown), Streamlit reruns your entire script from top to bottom with the new values.**

Unlike traditional web frameworks, there is no manual event handling. You simply write logic that utilizes widget values, and Streamlit manages the rest.

---

## 📱 Your First App

Save the following code as `app.py` and run it:

```python
import streamlit as st
import pandas as pd
import plotly.express as px

# set_page_config should always be the first Streamlit command.
# layout="wide" uses the full browser width.
st.set_page_config(page_title="Sales Dashboard", layout="wide")

st.title("📊 Sales Dashboard")
st.markdown("Explore regional sales performance across product categories.")
```

---

## 💾 Loading Data with Caching

Without caching, your data reloads every time a user interacts with a widget. Use `@st.cache_data` to load data once and keep it in memory.

```python
@st.cache_data
def load_data():
    df = pd.read_csv("sales.csv", parse_dates=["order_date"])
    return df

df = load_data()
```

- **`@st.cache_data`**: Use for data and DataFrames.
- **`@st.cache_resource`**: Use for heavier objects like database connections or ML models.

Both persist across reruns until the underlying function changes.

---

## 🔍 Sidebar Filters

The sidebar keeps your main canvas clean by hosting filters and controls.

```python
st.sidebar.header("🔍 Filters")

regions = st.sidebar.multiselect(
    "Select Region",
    options=df["region"].unique(),
    default=df["region"].unique()
)

date_range = st.sidebar.date_input(
    "Date Range",
    value=[df["order_date"].min(), df["order_date"].max()]
)

# Apply filters
filtered_df = df[
    (df["region"].isin(regions)) &
    (df["order_date"] >= pd.Timestamp(date_range[0])) &
    (df["order_date"] <= pd.Timestamp(date_range[1]))
]
```

### Common Sidebar Widgets:
- `st.sidebar.selectbox`: Single choice dropdown.
- `st.sidebar.multiselect`: Multiple choices.
- `st.sidebar.slider`: Numerical range.
- `st.sidebar.date_input`: Date or date range picker.
- `st.sidebar.checkbox`: Boolean toggle.

---

## 🍱 Layout with Columns

Columns allow you to place content side-by-side instead of stacked vertically.

### KPI Metrics
```python
col1, col2, col3 = st.columns(3)

col1.metric("Total Revenue", f"₹{filtered_df['revenue'].sum():,.0f}", delta="+12% vs last month")
col2.metric("Total Orders",  f"{len(filtered_df):,}")
col3.metric("Avg Order Value", f"₹{filtered_df['revenue'].mean():,.0f}")
```
`st.metric` is perfect for KPI cards, featuring optional delta indicators with color coding.

### Side-by-Side Charts
```python
left, right = st.columns(2)

with left:
    st.subheader("Revenue by Region")
    fig = px.bar(
        filtered_df.groupby("region")["revenue"].sum().reset_index(),
        x="region", y="revenue", color="region"
    )
    st.plotly_chart(fig, width="stretch")

with right:
    st.subheader("Orders Over Time")
    monthly = filtered_df.groupby(
        filtered_df["order_date"].dt.to_period("M")
    )["revenue"].sum().reset_index()
    monthly["order_date"] = monthly["order_date"].astype(str)
    fig2 = px.line(monthly, x="order_date", y="revenue")
    st.plotly_chart(fig2, width="stretch")
```
> **Tip:** Always pass `width="stretch"` to charts to ensure they scale properly.

---

## 🧩 Core UI Elements

### Displaying Data
- `st.dataframe(df)`: Interactive sortable table.
- `st.table(df)`: Static table.
- `st.json(data)`: Formatted JSON viewer.
- `st.code(snippet, language="python")`: Syntax-highlighted code block.

### Text and Structure
- `st.title`, `st.header`, `st.subheader`: Heading levels.
- `st.markdown("**bold**, _italic_")`: Full Markdown support.
- `st.divider()`: Horizontal rule between sections.
- `st.expander("Click to expand")`: Collapsible section.

### User Input
- `st.text_input("Search")`: Text field.
- `st.number_input("Threshold", min_value=0, max_value=100)`: Number field.
- `st.button("Run Analysis")`: Clickable button.
- `st.file_uploader("Upload CSV", type="csv")`: File upload.

### Feedback and Status
- `st.success("Loaded successfully")`: Green banner.
- `st.warning("No data for this filter")`: Yellow warning.
- `st.error("Something went wrong")`: Red error.
- `st.spinner("Loading...")`: Loading indicator.

---

## 🔄 Session State

Since Streamlit reruns on every interaction, regular Python variables reset. Session state allows values to persist across reruns.

```python
if "count" not in st.session_state:
    st.session_state.count = 0

if st.button("Click me"):
    st.session_state.count += 1

st.write(f"Button clicked {st.session_state.count} times")
```

**Use Session State for:**
- Tracking user actions across interactions.
- Storing expensive computation results after a button click.
- Building multi-step workflows (e.g., wizards).

---

## 📄 Multi-Page Apps

For larger dashboards, split your application into multiple pages using this folder structure:

```text
your_app/
├── app.py            ← Entry point, shared sidebar
└── pages/
    ├── 1_Overview.py
    ├── 2_Regional.py
    └── 3_Products.py
```

Any `.py` file inside the `pages/` directory automatically appears as a navigation item in the sidebar. The numeric prefix controls the order.

---

## ⚡ Forms: Batch Multiple Inputs

Without `st.form`, every widget interaction triggers a full rerun. Group widgets in a form so the app only reruns upon submission.

```python
with st.form("filter_form"):
    region    = st.selectbox("Region", df["region"].unique())
    min_value = st.number_input("Minimum Order Value", value=0)
    submitted = st.form_submit_button("Apply Filters")

if submitted:
    result = df[(df["region"] == region) & (df["revenue"] >= min_value)]
    st.dataframe(result)
```

---

## 🌐 Deploying Your Dashboard

### Streamlit Community Cloud (Free)
1. Push your code to a public GitHub repo.
2. Go to [share.streamlit.io](https://share.streamlit.io).
3. Connect the repo, select the file, and deploy.

**Required `requirements.txt`:**
```text
streamlit
pandas
plotly
```

### Docker (Production/Private)
```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
EXPOSE 8501
CMD ["streamlit", "run", app.py, "--server.port=8501", "--server.address=0.0.0.0"]
```

---

## 🎨 Theming

Customize colors without touching CSS by creating `.streamlit/config.toml`:

```toml
[theme]
primaryColor        = "#017369"
backgroundColor     = "#38A6A5"
secondaryBackgroundColor = "#BFB6AF"
textColor           = "#F2C9B3"
font                = "sans serif"
```

---

## 🎯 Conclusion

Streamlit collapses weeks of frontend work into an afternoon of Python. For data scientists who want to get their analysis in front of real users quickly, it is the ideal tool.

**Build something small today.** The feedback from live users is worth more than any amount of polishing in a notebook.
