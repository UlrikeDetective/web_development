import streamlit as st
import pandas as pd
import plotly.express as px

st.set_page_config(page_title="Product Insights", layout="wide")

@st.cache_data
def load_data():
    return pd.read_csv("sales.csv", parse_dates=["order_date"])

df = load_data()

st.title("📦 Product & Category Analysis")
st.markdown("Deep dive into product-level metrics and inventory movement.")

# Category Selector
categories = st.multiselect("Filter by Category", 
                           options=df["category"].unique(),
                           default=df["category"].unique())

filtered_df = df[df["category"].isin(categories)]

# Scatter Plot: Price vs Quantity (derived price)
filtered_df["unit_price"] = filtered_df["revenue"] / filtered_df["quantity"]

st.subheader("Price vs. Quantity Sold")
fig = px.scatter(filtered_df, x="unit_price", y="quantity", 
                 color="category", hover_name="product",
                 size="revenue", title="Product Performance Matrix",
                 template="plotly_white")
st.plotly_chart(fig, width="stretch")

# Data Explorer
st.subheader("Raw Product Data")
st.dataframe(filtered_df, width="stretch")
