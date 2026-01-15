# Your First Tutorial: Making Beautiful Gradients

In this tutorial, you will learn how to create three stunning types of CSS gradients. By the end, you'll be able to add depth and vibrancy to any web page.

## Goal
Create a "Sunset Horizon" linear gradient, a "Vibrant Orb" radial gradient, and a "Rainbow Wheel" conic gradient.

## Step 1: Create a Linear Gradient (The Sunset)
Linear gradients flow in a straight line. We will create a warm sunset effect.

1.  **Create the HTML Container:**
    Add a `div` with the class `gradient-sunset` to your HTML file.
    ```html
    <div class="gradient-sunset"></div>
    ```

2.  **Add the CSS:**
    In your CSS file, add the following code. It defines a width, height, and the linear gradient.
    ```css
    .gradient-sunset {
      width: 400px;
      height: 200px;
      background: linear-gradient(to right, #ff7e5f, #feb47b 25%, #fd1d1d 50%, #fdb321 75%, #ff7e5f);
      border-radius: 10px;
      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    }
    ```
    
    **Live Preview:**
    <div style="width: 100%; max-width: 400px; height: 200px; background: linear-gradient(to right, #ff7e5f, #feb47b 25%, #fd1d1d 50%, #fdb321 75%, #ff7e5f); border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); margin-bottom: 20px;"></div>

## Step 2: Create a Radial Gradient (The Orb)
Radial gradients start from a center point. Let's make a glowing orb.

1.  **Create the HTML Container:**
    Add a `div` with text inside.
    ```html
    <div class="gradient-orb">Radiate!</div>
    ```

2.  **Add the CSS:**
    ```css
    .gradient-orb {
      width: 300px;
      height: 300px;
      background: radial-gradient(ellipse at center, #56ab2f, #a8e6cf 40%, #88d8a3 70%, #f0f8ff);
      border-radius: 50%; /* Makes it a perfect circle */
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 24px;
      font-weight: bold;
    }
    ```

    **Live Preview:**
    <div style="width: 300px; height: 300px; background: radial-gradient(ellipse at center, #56ab2f, #a8e6cf 40%, #88d8a3 70%, #f0f8ff); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 24px; font-weight: bold; margin-bottom: 20px;">Radiate!</div>

## Step 3: Create a Conic Gradient (The Rainbow)
Conic gradients rotate around a center, perfect for color wheels.

1.  **Create the HTML Container:**
    ```html
    <div class="gradient-rainbow"></div>
    ```

2.  **Add the CSS:**
    ```css
    .gradient-rainbow {
      width: 300px;
      height: 300px;
      background: conic-gradient(from 0deg, red, orange, yellow, green, blue, indigo, violet, red);
      border-radius: 50%;
    }
    ```

    **Live Preview:**
    <div style="width: 300px; height: 300px; background: conic-gradient(from 0deg, red, orange, yellow, green, blue, indigo, violet, red); border-radius: 50%; margin-bottom: 20px;"></div>

## Next Steps
Try combining these techniques! You can layer gradients (separating them with commas) or animate them using `@keyframes` to create moving backgrounds.