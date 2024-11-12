<h1 align="center">Knowflare 📖</h1>
<div align="center">
  <strong>Knowflare is an online learning and teaching marketplace</strong><br>
  Build a Course & LMS (Learning Management System) Platform<br>
</div>

<br>

## Features

- 🛒 Payment
- ✉️ Login/Register with Credentials, OAuth

## Tech Stack

- 🛠️ Built in Next.js 14
- 💻 HonoJS to handle backend
- 🖥️ Drizzle for type ORM
- 🔑 Authentication using Auth.js
- Zod validate

## Cloning the repository

```sh
git clone https://github.com/sonwjnn/knowflare.git
```

## Install

```sh
bun install
```

## Setup .env.local file

```sh
AUTH_SECRET=

DATABASE_URL=
NEXT_PUBLIC_APP_URL=
NEXT_PUBLIC_VERCEL_URL=

GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

NEXT_PUBLIC_APP_URL=

STRIPE_WEBHOOK_SECRET=
STRIPE_API_KEY=
```

## Usage

```sh
# Run project
bun dev

# Alias commands for drizzle-kit
bun db:generate
bun db:push
bun db:studio
```

## Author

👤 **Hoang Son**

- Github: [@sonwjnn](https://github.com/sonwjnn)

## 🤝 Contributing

Contributions, issues and feature requests are welcome!<br />Feel free to check [issues page](https://github.com/sonwjnn/knowflare/issues). You can also take a look at the [contributing guide](https://github.com/sonwjnn/knowflare/blob/master/CONTRIBUTING.md).

## Show your support

Give a ⭐️ if this project helped you!

## 📝 License

Copyright © 2024 [Hoang Son](https://github.com/sonwjnn).<br />
This project is [MIT](https://github.com/sonwjnn/knowflare/blob/master/LICENSE) licensed.
