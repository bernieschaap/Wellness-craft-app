# WellnessCraft - Your Personal AI Health Planner

Welcome to WellnessCraft! This is the complete source code for your personalized, AI-powered health and wellness application.

This application is designed to be run as a live website, which you can then install on your phone or laptop just like a regular app.

---

## How to Launch Your App on Netlify

Follow these steps to deploy your own live version of the WellnessCraft app.

### Step 1: Get Your Secret API Key
Your app needs a secret key to use the Google AI.

1.  Go to the [**Google AI Studio**](https://aistudio.google.com/app/apikey).
2.  Click the **"Create API key"** button and copy the key. You'll need it in Step 3.

### Step 2: Push Your Code to GitHub
Ensure all the code for your app is in a public or private GitHub repository that you have access to.

### Step 3: Deploy on Netlify

1.  Log in to your [Netlify account](https://app.netlify.com).
2.  Click on **"Add new site"** and then choose **"Import an existing project"**.
3.  Connect to your Git provider (e.g., GitHub) and select the repository for this application.
4.  Netlify should automatically detect the settings from the `netlify.toml` file. In the configuration section for environment variables, add the following:
    *   **Key**: `API_KEY`
    *   **Value**: Paste the secret key you copied from Google AI Studio in Step 1.
5.  Click the **"Deploy site"** button.

That's it! Netlify will build and launch your app. Once it's done, you'll get a public website address (like `your-app-name.netlify.app`). You can now visit it on any device to use and install your application.
