import streamlit as st
import pandas as pd
import plotly.express as px

st.set_page_config(page_title="Executive Overview", layout="wide")

@st.cache_data
def load_data():
    return pd.read_csv("sales.csv", parse_dates=["order_date"])

df = load_data()

st.title("📈 Executive Overview")
st.markdown("High-level performance indicators and growth trends.")

# Top Level Metrics
t_rev = df["revenue"].sum()
t_qty = df["quantity"].sum()
avg_v = df["revenue"].mean()

c1, c2, c3 = st.columns(3)
c1.metric("Total Revenue", f"₹{t_rev:,.0f}")
c2.metric("Total Items Sold", f"{t_qty:,}")
c3.metric("Avg Order Value", f"₹{avg_v:,.2f}")

st.divider()

# Revenue Trend
st.subheader("Revenue Growth Trend")
df_trend = df.groupby(df["order_date"].dt.to_period("M"))["revenue"].sum().reset_index()
df_trend["order_date"] = df_trend["order_date"].astype(str)

fig = px.line(df_trend, x="order_date", y="revenue", 
              title="Monthly Revenue", markers=True,
              template="plotly_white", color_discrete_sequence=["#00B2EE"])
st.plotly_chart(fig, width="stretch")

# Category Split
st.subheader("Revenue by Category")
fig2 = px.pie(df, values="revenue", names="category", 
             hole=0.4, template="plotly_white",
             color_discrete_sequence=px.colors.sequential.Teal)
st.plotly_chart(fig2, width="stretch")
