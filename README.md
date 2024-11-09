# HackTogether Project Template

Welcome to the HackTogether hackathon! This template project is designed to give you a quick start with ReactTogether, Vite, and TypeScript.

## Getting Started

Follow these steps to set up your project:

### 1. Fork this repository and clone it to your development environment

Stuck here? Check out this GitHub guide: https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/working-with-forks/fork-a-repo

### 2. Install dependencies:
In your terminal, make sure you have `npm` installed.
Then, go to your repo directory and run:

```bash
npm i
```

### 3. Get your Multisynq API Key:
- Go to [https://multisynq.io/account](https://multisynq.io/account)
- Register for a free account and obtain your API Key

### 4. Configure your Multisynq credentials:

- Create a `.env` file (you can copy from `example.env`)
```bash
cp .env.example .env
```

- Replace the placeholders with your actual credentials:
```
VITE_APP_ID=dev.reacttogether.your-app-name
VITE_API_KEY= # <-- Insert your Multisynq API key
VITE_SESSION_NAME="Any session name you want"
VITE_SESSION_NAME="Any password you want!"
```

### 5. Start the development server:

In your terminal, run
```bash
npm run dev
```

### 6. Deploy your project to Cloudflare Pages

Now you just need to deploy your website to be publicly available. It's possible to do that on Cloudflare Pages!! It's easy to configure and it's free!!
Cloudflare already has a guide on how to deploy a vite project on Cloudflare Pages.
The following steps are adapted from their official guide, which can be found at: https://developers.cloudflare.com/pages/framework-guides/deploy-a-vite3-project/

To deploy your site to Cloudflare Pages:

 * Log in to the [Cloudflare dashboard](https://dash.cloudflare.com/) and select your account.
 * In Account Home, select *Workers & Pages* > *Create application* > *Pages* > *Connect to Git*.
 * Select your GitHub repository.
 * In the Set up builds and deployments, set `npm run build` as the *Build command*, and `dist` as the *Build output directory*.
 * After completing configuration, select *Save and Deploy*.

You will see your first deploy pipeline in progress.
Pages installs all dependencies and builds the project as specified.
After you have deployed your project, it will be available at the `<YOUR_PROJECT_NAME>.pages.dev` subdomain.
Find your project’s subdomain in *Workers & Pages* > select your Pages project > *Deployments*.

Cloudflare Pages will automatically rebuild your project and deploy it on every new pushed commit.

Additionally, you will have access to preview deployments, which repeat the build-and-deploy process for pull requests.
With these, you can preview changes to your project with a real URL before deploying them to production.

### Have fun and HackTogether!

  - Check out the [ReactTogether documentation](https://reacttogether.com/) to learn about its features and uses.

---
### Need Help?
If you have any questions or run into issues, don't hesitate to reach out to the hackathon organizers or check the official documentation for the tools used in this template.
