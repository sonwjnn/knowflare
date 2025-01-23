<h1 align="center">Knowflare</h1>
<div align="center">
  <strong>Knowflare is an online learning and teaching marketplace</strong><br>
  Build a Course & LMS (Learning Management System) Platform<br>
</div>

<br>

# About The Project

In the era of rapid digital transformation, e-learning has emerged as an inevitable trend in education and training. Online learning platforms not only expand access to knowledge but also provide learners with the flexibility to study anytime, anywhere.

However, in Vietnam, many online course management systems still face limitations in terms of features, user interface, and personalization capabilities. Recognizing the pressing needs of individuals and educational organizations for enhancing the efficiency of online course businesses, our team has undertaken the project: "Building an Online Course Business Management Website."

This project aims to deliver a comprehensive technological solution while optimizing the learning experience and fostering effective connections between educators and learners.

## Features

- 🔒 **Authentication:** Login, logout, change password, reset password, 2FA.  
- 👥 **User Administration:** Manage user accounts and permissions.  
- 📚 **Course Management:** Create, update, delete, and view detailed course information.  
- 🧑‍🏫 **Instructor and Learner Management:** Register, update information, and manage accounts.  
- 🔍 **Search and Filters:** Search and filter courses based on multiple criteria.  
- 📝 **Course Enrollment:** Register, cancel registration, and view registered courses.  
- 🎟️ **Discounts and Promotions:** Apply discount codes for course purchases.  
- ⭐ **Feedback and Ratings:** Add ratings, comments, and suggestions for courses.  
- 📊 **Reports and Analytics:** Generate reports on students, courses, and revenue metrics.  
- 💳 **Online Payment Integration:** Enable online payments using Stripe.  
- 📖 **Documentation and User Guide:** Provide detailed guides for system usage.  
- 🌐 **Deployment:** Deploy the website on Vercel. 

## Tech Stack

- **IDE:** Visual Studio Code for front-end and back-end development.  
- **Database Management:** PostgreSQL managed using NeonDB and Drizzle.  
- **Browsers:** Google Chrome and Microsoft Edge Dev.  
- **Back-end:** HonoJS, Drizzle ORM, TypeScript.  
- **Front-end:** ReactJS, TypeScript, TailwindCSS, ShadcnUI, AuthJS.  

## Cloning the repository

```sh
git clone https://github.com/sonwjnn/knowflare.git
```

## Install

```sh
bun install
# or
npm install
```

## Setup .env.local file

```sh
AUTH_SECRET= # Added by `npx auth`. Read more: https://cli.authjs.dev

DATABASE_HOST=
DATABASE_NAME=
DATABASE_USER=
DATABASE_PASSWORD=
DATABASE_URL=


GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

NEXT_PUBLIC_APP_URL=
NEXT_PUBLIC_SERVER_URL=

STRIPE_API_KEY=
STRIPE_WEBHOOK_SECRET=

UPLOADTHING_SECRET=
UPLOADTHING_APP_ID=

RESEND_API_KEY=
```

## Usage

```sh
# Run project
bun dev

# Also run this command in new terminal to listen stripe event
stripe listen --forward-to localhost:3000/api/subscriptions/webhook

# Alias commands for drizzle-kit
bun db:generate
bun db:push
bun db:studio

```
