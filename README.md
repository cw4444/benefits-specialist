# Benefits Specialist Demo

This is a lightweight, non-technical demo for benefits operations work.

## What it does

- Reads a job spec, policy note, or benefits brief
- Summarises renewal logic
- Flags vendor audit concerns
- Gives a plain-English statutory compliance summary
- Checks whether the process looks scalable

## Run it

Open `index.html` in a browser.

No build step is required.

## Model settings

The app includes optional fields for:

- Provider: local, OpenAI, Anthropic, or Google
- API key
- Model name

In this demo, those settings are stored only in the browser and are not sent anywhere. The current experience is fully local and rule-based, which keeps it safe for sharing.

## Best next step

If you want live AI later, the next iteration would add a small server-side proxy so keys stay off the client.

