import pandas as pd
import numpy as np
from datetime import datetime, timedelta

def generate_sales_data(years, rows_per_year):
    regions = ['North', 'South', 'East', 'West']
    categories = {
        'Electronics': [('Laptop', 1200), ('Smartphone', 800), ('Tablet', 300), ('Monitor', 250), ('Headphones', 100)],
        'Furniture': [('Desk', 450), ('Chair', 150), ('Sofa', 900), ('Table', 500), ('Bookshelf', 200)],
        'Clothing': [('Jacket', 120), ('Jeans', 60), ('Shoes', 80), ('T-Shirt', 25), ('Hat', 15)]
    }
    
    data = []
    
    for year in years:
        for _ in range(rows_per_year):
            month = np.random.randint(1, 13)
            day = np.random.randint(1, 29)
            date = datetime(year, month, day).strftime('%Y-%m-%d')
            
            region = np.random.choice(regions)
            category = np.random.choice(list(categories.keys()))
            product_info = categories[category][np.random.randint(len(categories[category]))]
            product = product_info[0]
            base_price = product_info[1]
            
            quantity = np.random.randint(1, 6)
            # Add some slight variation to price
            revenue = int(base_price * quantity * np.random.uniform(0.9, 1.1))
            
            data.append([date, region, category, product, revenue, quantity])
            
    df = pd.DataFrame(data, columns=['order_date', 'region', 'category', 'product', 'revenue', 'quantity'])
    # Sort by date
    df['order_date'] = pd.to_datetime(df['order_date'])
    df = df.sort_values('order_date')
    return df

# Existing data for 2023 (manual)
existing_2023 = [
    ['2023-01-01','North','Electronics','Laptop',1200,1],
    ['2023-01-05','South','Furniture','Chair',150,4],
    ['2023-01-10','East','Electronics','Smartphone',800,2],
    ['2023-01-15','West','Clothing','T-Shirt',25,10],
    ['2023-02-01','North','Furniture','Desk',450,1],
    ['2023-02-10','South','Clothing','Jeans',60,3],
    ['2023-02-20','East','Electronics','Tablet',300,1],
    ['2023-03-05','West','Furniture','Lamp',45,2],
    ['2023-03-15','North','Clothing','Jacket',120,1],
    ['2023-03-25','South','Electronics','Headphones',100,2],
    ['2023-04-01','East','Furniture','Sofa',900,1],
    ['2023-04-10','West','Electronics','Monitor',250,1],
    ['2023-05-01','North','Clothing','Shoes',80,1],
    ['2023-05-15','South','Furniture','Table',500,1],
    ['2023-06-01','East','Electronics','Mouse',25,5],
    ['2023-06-15','West','Clothing','Hat',15,3],
    ['2023-07-01','North','Furniture','Bookshelf',200,1],
    ['2023-07-15','South','Electronics','Keyboard',50,2],
    ['2023-08-01','East','Clothing','Socks',10,10],
    ['2023-08-15','West','Furniture','Stool',30,4]
]
df_2023 = pd.DataFrame(existing_2023, columns=['order_date', 'region', 'category', 'product', 'revenue', 'quantity'])
df_2023['order_date'] = pd.to_datetime(df_2023['order_date'])

# Generate new data
df_new = generate_sales_data([2022, 2023, 2024, 2025, 2026], 25)

# Combine and save
final_df = pd.concat([df_2023, df_new]).sort_values('order_date')
final_df.to_csv('sales.csv', index=False)
print("Updated sales.csv with data for 2022, 2023, 2024, 2025, and 2026.")
