import streamlit as st
import pandas as pd
import plotly.express as px

st.set_page_config(page_title="Regional Analysis", layout="wide")

@st.cache_data
def load_data():
    return pd.read_csv("sales.csv", parse_dates=["order_date"])

df = load_data()

st.title("🌍 Regional Performance")
st.markdown("Detailed breakdown of sales performance across different geographies.")

# Sidebar filter specific to this page
selected_region = st.sidebar.selectbox("Select Focus Region", df["region"].unique())

reg_df = df[df["region"] == selected_region]

# Regional Metrics
st.header(f"Insights for {selected_region}")
col1, col2 = st.columns(2)

with col1:
    st.metric("Region Revenue", f"₹{reg_df['revenue'].sum():,.0f}")
    
    # Regional Category Breakdown
    fig = px.bar(reg_df.groupby("category")["revenue"].sum().reset_index(),
                 x="category", y="revenue", title="Category Performance",
                 color="category", template="plotly_white")
    st.plotly_chart(fig, width="stretch")

with col2:
    st.metric("Region Quantity", f"{reg_df['quantity'].sum():,}")
    
    # Regional Product Table
    st.subheader("Top Products in Region")
    top_p = reg_df.groupby("product")["revenue"].sum().sort_values(ascending=False).head(5)
    st.table(top_p)
