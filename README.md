# WellnessCraft - Your Personal AI Health Planner

Welcome to WellnessCraft! This is the complete source code for your personalized, AI-powered health and wellness application.

This application is designed to be run as a live website, which you can then install on your phone or laptop just like a regular app.

---

## How to Launch Your App (The Easy Way)

You are very close to having your own live version of the app! You just need to get the code online. I've made the last step super simple for you.

### Step 1: Get Your Secret API Key
Your app needs a secret key to use the AI.

1.  Go to the [**Google AI Studio**](https://aistudio.google.com/app/apikey).
2.  Click the **"Create API key"** button and copy the key. You'll need it in the next step.

### Step 2: Click the Deploy Button!

Once all the code files are in your public GitHub repository, the magic happens. Just come back to this `README.md` file on your GitHub page and click the button below.

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/bernieschaap/bernadette-wellness-app)

### Step 3: Configure and Deploy on Netlify

After clicking the button, you'll be taken to the Netlify website.

1.  Connect your GitHub account.
2.  Look for a section for **Environment variables**. You need to add one:
    *   **Key**: `API_KEY`
    *   **Value**: Paste the secret key you got from Google AI Studio.
3.  Click the final **"Deploy site"** button.
4.  Wait a minute while Netlify builds and launches your app.

That's it! Netlify will give you your public website address. You can now visit it on any device to use and install your application.