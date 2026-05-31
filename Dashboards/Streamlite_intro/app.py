import streamlit as st
import pandas as pd
import plotly.express as px

st.set_page_config(page_title="Sales Dashboard", layout="wide")

st.title("📊 Sales Dashboard")
st.markdown("Explore regional sales performance across product categories.")

@st.cache_data
def load_data():
    df = pd.read_csv("sales.csv", parse_dates=["order_date"])
    return df

df = load_data()

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

col1, col2, col3 = st.columns(3)

col1.metric("Total Revenue", f"₹{filtered_df['revenue'].sum():,.0f}",
            delta="+12% vs last month")

col2.metric("Total Orders",  f"{len(filtered_df):,}")

col3.metric("Avg Order Value",
            f"₹{filtered_df['revenue'].mean():,.0f}")

            left, right = st.columns(2)


with left:
    st.subheader("Revenue by Region")
    fig = px.bar(
        filtered_df.groupby("region")["revenue"].sum().reset_index(),
        x="region", y="revenue", color="region"
    )
    st.plotly_chart(fig, use_container_width=True)

with right:
    st.subheader("Orders Over Time")
    monthly = filtered_df.groupby(
        filtered_df["order_date"].dt.to_period("M")
    )["revenue"].sum().reset_index()
    monthly["order_date"] = monthly["order_date"].astype(str)
    fig2 = px.line(monthly, x="order_date", y="revenue")
    st.plotly_chart(fig2, use_container_width=True)

    if "count" not in st.session_state:
    st.session_state.count = 0

if st.button("Click me"):
    st.session_state.count += 1

st.write(f"Button clicked {st.session_state.count} times")

with st.form("filter_form"):
    region    = st.selectbox("Region", df["region"].unique())
    min_value = st.number_input("Minimum Order Value", value=0)
    submitted = st.form_submit_button("Apply Filters")

if submitted:
    result = df[(df["region"] == region) & (df["revenue"] >= min_value)]
    st.dataframe(result)