# Ascora

Ascora is a mobile workout tracking and training companion built with Expo/React Native, a Better Auth authentication service, and a Spring Boot/PostgreSQL backend. The mobile application is local-first: active workouts are saved to SQLite first and synchronized with the server when connectivity is available.

This document explains how to install the project and run it locally for development or demonstration.

## 1. Project structure

The repository is organized as a monorepo with separate runtimes:

```text
ascora/
├─ apps/
│  ├─ mobile/                      # Expo React Native application
│  ├─ auth/                        # Better Auth service
│  └─ api/                         # Spring Boot API
├─ docker-compose.yaml/            # Docker/local infrastructure
└─ docs/                           # Project documentation
└─ README.md/                      # You're here!
```

`apps/mobile` and `apps/auth` have their own Node dependency trees and `package-lock.json` files, so install Node dependencies from each directory separately.

## 2. Technology summary

| Area                 | Technology                                  |
| -------------------- | ------------------------------------------- |
| Mobile               | Expo, React Native, TypeScript, Expo Router |
| Forms / validation   | React Hook Form, Zod                        |
| Client query state   | TanStack Query                              |
| Local database       | SQLite + Drizzle                            |
| Styling              | Uniwind / reusable RN UI components         |
| Authentication       | Better Auth, JWT, JWKS, RS256               |
| API                  | Java 21, Spring Boot                        |
| Server database      | PostgreSQL                                  |
| Schema migrations    | Flyway                                      |
| Async processing     | JMS / Apache ActiveMQ Artemis               |
| Local infrastructure | Docker Compose                              |

## 3. Prerequisites

Install the following before running Ascora:

- **Node.js 22**. Development was performed with Node **22.20.0**.
- **npm**. Development used npm **10.8.1**.
- **Java 21 JDK**.
- **Maven**. Development used version **3.9.9**.
- **Docker Desktop / Docker Compose** for PostgreSQL and local infrastructure.
- **Expo Go** on a physical device, can be downloaded for free from the app store or playstore.
- **Git**.

Verify the main tools:

```bash
node --version
npm --version
java --version
docker --version
docker compose version
```

## 4. Clone the repository

```bash
git clone https://github.com/Harpy-101/ascora.git
cd ascora
```

## 5. Start the database / infrastructure

From the repository root, start the Docker services defined by the project:

```bash
docker compose up -d
```

During development, PostgreSQL was exposed on host port **5433** while containers connect to PostgreSQL internally on port **5432**.

The Spring Boot application uses Flyway. When the API starts, Flyway applies the SQL migrations located under:

```text
apps/api/src/main/resources/db/migration/
```

The Flyway history is stored in `flyway_schema_history`.

## 6. Configure the authentication service

Open the authentication project:

```bash
cd apps/auth
npm ci
```

The authentication service uses the following important variables:

| Variable              | Purpose                                                                                            |
| --------------------- | -------------------------------------------------------------------------------------------------- |
| `BETTER_AUTH_SECRET`  | Secret used by Better Auth. Use a long random development value.                                   |
| `BETTER_AUTH_URL`     | Public/local URL of the authentication service. This becomes part of the JWT issuer configuration. |
| `AUTH_DATABASE_URL`   | PostgreSQL connection string used by the authentication service.                                   |
| `ASCORA_API_AUDIENCE` | Audience included in tokens intended for the Ascora API. Must match the API configuration.         |
| `NODE_ENV`            | Should be set as 'development'.                                                                    |

Example shape only - use the credentials and port configured by the repository:

```env
BETTER_AUTH_SECRET=<generate_a_real_32_plus_character_secret>
BETTER_AUTH_URL=http://10.0.0.7:3005
AUTH_DATABASE_URL=postgresql://ascora:ascora@localhost:5433/ascora_auth
ASCORA_API_AUDIENCE=http://10.0.0.7:8080
NODE_ENV=development
```

You can get the your local wifi by runing this command in powershell:

```powershell
ipconfig
```

and grabbing the IPv4 Address from the Wireless LAN adapter Wi-Fi section.

Start the auth service using its development script:

```bash
npm run dev
```

Keep this process running and note the URL/port printed by the service.

## 7. Start the Spring Boot API

Open a second terminal:

```bash
cd apps/api
```

Navigate into the application.yaml file: api -> src -> resources -> application.yaml.

Under the security -> oauth2 -> resourceserver -> jwt. There are 3 variables that are used for counicating with the auth server youv'e just setup. all you need to do is to change urls so they will lineup with the urls picked prior.

- It should also be noted that due to the app utilizing an external api (AscendDb) for exercises data, there is also a need to pass the API key in this fashion in the same terminal you intend to tun the server in

```powershell
$env:ASCEND_DB_API_KEY="<your key>"
```

Then run Maven

```bash
mvn spring-boot:run
```

The API is expected to run on port **8080**.

The API must be able to connect to PostgreSQL and must use security settings compatible with Better Auth:

- the JWT **issuer** must match the Better Auth issuer;
- the API must use the Better Auth **JWKS** endpoint for public-key verification;
- the expected JWT **audience** must match `ASCORA_API_AUDIENCE`;
- authenticated API requests are sent using `Authorization: Bearer <token>`.

## 8. Configure and start the mobile application

Open a third terminal:

```bash
cd apps/mobile
npm ci
```

Create the mobile environment file expected by the project. The important public Expo variables are:

| Variable               | Purpose                              |
| ---------------------- | ------------------------------------ |
| `EXPO_PUBLIC_API_URL`  | Base URL of the Spring Boot API.     |
| `EXPO_PUBLIC_AUTH_URL` | Base URL of the Better Auth service. |

Example when using an emulator on the same development machine:

```env
EXPO_PUBLIC_API_URL=http://10.0.0.7:8080
EXPO_PUBLIC_AUTH_URL=http://10.0.0.7:3005
```

### Running on a physical phone

A physical phone cannot normally reach services on your development computer through the phone's own `localhost`. Use the computer's LAN IP address instead. The above example wil work assuming you passed your real wifi address (can be found via running the ipconfig command in powershell as shown earlier).

Make sure:

1. the phone and computer are on the same network;
2. the auth service and API listen on an interface reachable from the LAN when required;
3. the operating-system firewall allows the development ports;
4. `BETTER_AUTH_URL`, the Spring issuer configuration, and the URL used by the mobile app remain compatible. JWT validation will fail if the issuer values do not match.

Start Expo:

```bash
npx expo start
```

Then either:

- scan the QR code with Expo Go;
- press the appropriate key to launch an emulator;
- use the development workflow already configured for the project.

If Metro appears to be serving stale code, restart with a cleared cache:

```bash
npx expo start -c
```

## 9. Recommended startup order

For the most reliable local startup, use this order:

1. **Docker / PostgreSQL**
2. **Better Auth service**
3. **Spring Boot API**
4. **Expo mobile application**

This ensures that authentication and API dependencies are available before the mobile application sends requests.

## 10. Local SQLite and Drizzle

The mobile application uses SQLite through Drizzle for local-first data. Generated Drizzle migrations are applied by the application during startup.

For normal installation, do **not** generate a new migration.

To completely reset local mobile data during development, clear the app's data or uninstall/reinstall the development application/Expo Go project as appropriate for the device. This removes the local SQLite database.

## 11. Synchronization behavior

Ascora saves workout changes locally before synchronizing them with the server.

The high-level flow is:

```text
Mobile form
   ↓
SQLite transaction
   ↓
Local sync outbox
   ↓
Sync request
   ↓
Spring Boot API / PostgreSQL
   ↓
Server acknowledgements + change stream
   ↓
Apply changes to local SQLite
```

Synchronization can be requested after relevant local changes and by the application lifecycle when the app becomes active or network connectivity returns. Multiple sync requests are coordinated so that only one sync process runs for a user at a time.

For more inforamtion, please refer to the Ascora System Design PDF
