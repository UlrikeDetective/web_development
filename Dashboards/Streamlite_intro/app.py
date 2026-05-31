import streamlit as st
import pandas as pd
import plotly.express as px

# Configuration should be the first Streamlit command
st.set_page_config(page_title="Sales Dashboard", layout="wide")


@st.cache_data
def load_data():
    """Load and cache the sales data."""
    try:
        df = pd.read_csv("sales.csv", parse_dates=["order_date"])
        return df
    except FileNotFoundError:
        st.error("Error: sales.csv not found. Please ensure the file exists.")
        return pd.DataFrame()


# Load initial data
df = load_data()

# Header Section
st.title("📊 Sales Dashboard")
st.markdown("Explore regional sales performance across product categories.")

if not df.empty:
    # Sidebar Filters
    st.sidebar.header("🔍 Filters")

    regions = st.sidebar.multiselect(
        "Select Region",
        options=df["region"].unique(),
        default=df["region"].unique()
    )

    # Date Range selection
    min_date = df["order_date"].min()
    max_date = df["order_date"].max()

    date_range = st.sidebar.date_input(
        "Date Range",
        value=[min_date, max_date],
        min_value=min_date,
        max_value=max_date
    )

    # Validation for date range selection
    if isinstance(date_range, list) and len(date_range) == 2:
        start_date, end_date = date_range
    else:
        start_date, end_date = min_date, max_date

    # Apply filters to dataframe
    filtered_df = df[
        (df["region"].isin(regions)) &
        (df["order_date"] >= pd.Timestamp(start_date)) &
        (df["order_date"] <= pd.Timestamp(end_date))
    ]

    # Main Metrics
    col1, col2, col3 = st.columns(3)

    total_revenue = filtered_df['revenue'].sum()
    total_orders = len(filtered_df)
    avg_order_value = filtered_df['revenue'].mean() if total_orders > 0 else 0

    col1.metric("Total Revenue", f"₹{total_revenue:,.0f}", delta="+12% vs last month")
    col2.metric("Total Orders", f"{total_orders:,}")
    col3.metric("Avg Order Value", f"₹{avg_order_value:,.0f}")

    st.divider()

    # Visualizations
    left, right = st.columns(2)

    with left:
        st.subheader("Revenue by Region")
        region_revenue = filtered_df.groupby("region")["revenue"].sum().reset_index()
        fig = px.bar(
            region_revenue,
            x="region",
            y="revenue",
            color="region",
            template="plotly_white"
        )
        st.plotly_chart(fig, width="stretch")

    with right:
        st.subheader("Orders Over Time")
        monthly = filtered_df.groupby(
            filtered_df["order_date"].dt.to_period("M")
        )["revenue"].sum().reset_index()
        # Convert period to string for Plotly compatibility
        monthly["order_date"] = monthly["order_date"].astype(str)
        fig2 = px.line(monthly, x="order_date", y="revenue", template="plotly_white")
        st.plotly_chart(fig2, width="stretch")

    st.divider()

    # Interaction & Utility section
    st.subheader("Session State & Forms")
    
    col_state, col_form = st.columns(2)

    with col_state:
        # Example of Session State
        if "count" not in st.session_state:
            st.session_state.count = 0

        if st.button("Increment Counter"):
            st.session_state.count += 1

        st.write(f"Button clicked **{st.session_state.count}** times")

    with col_form:
        # Example of Form usage
        with st.form("filter_form"):
            st.write("Batch Filter")
            form_region = st.selectbox("Region", df["region"].unique())
            min_value = st.number_input("Minimum Order Value", value=0)
            submitted = st.form_submit_button("Apply Form Filters")

        if submitted:
            result = df[(df["region"] == form_region) & (df["revenue"] >= min_value)]
            st.dataframe(result, width="stretch")

else:
    st.warning("No data available to display.")
