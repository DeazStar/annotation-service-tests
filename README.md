# Annotation Service: Load Testing Guide

This repository contains the infrastructure configuration and load-testing suite for the Annotation Service. It uses **Docker Compose** for orchestration and **Artillery** with the **Socket.io engine** to simulate high-concurrency hybrid traffic.

## 🚀 Getting Started

### 1. Prerequisites
* **Docker & Docker Compose**
* **Node.js** (v16+) and **npm**
* A `.env` file in the root directory (refer to `docker-compose.yml` for required variables like `APP_PORT`, `MONGO_URI`, and `MORK_URL`).

### 2. Infrastructure Setup
The service requires MongoDB, Redis, and a Celery worker to function.

1.  **Configure the Service:**
    Ensure `config/config.yaml` is set to the **mork** database type to enable the specific logic required for this test version:
    ```yaml
    database:
      type: mork
    ```

2.  **Spin up the Stack:**
    ```bash
    docker-compose up -d
    ```
    This starts the `annotation_service`, `celery_worker`, `mongodb`, `redis`, and a `caddy` reverse proxy. Note that `ulimits` are set to **65536** to handle high-concurrency socket connections.

---

## 🧪 Running Load Tests

The suite simulates a **Hybrid POST + WebSocket** flow: 
1. **POST** to `/query`: Generates an annotation and captures the `annotation_id`.
2. **Socket.io Join**: Connects to a room using the captured ID.
3. **Wait**: Listens for completion events via the `processor.js` logic.

### 1. Install Dependencies
Navigate to the `load-tests` directory:
```bash
cd load-tests
npm install
```

### 2. Configure the Test Target
Open `load-tests/test.yml` and update:
* **target**: Your service URL (e.g., `http://localhost:8000`).
* **Authorization**: Update both the `extraHeaders` and the `variables` section with your Bearer token.

### 3. Execute the Test
Run the Artillery script to begin the ramp-up:
```bash
npx artillery run test.yml
```

---

## 📊 Test Phases

| Phase | Duration | Arrival Rate | Description |
| :--- | :--- | :--- | :--- |
| **Warm up** | 10s | 10 users/s | Initial baseline traffic. |
| **Ramp up** | 60s | 10 ➔ 25 users/s | Increasing load to test Mork version stability. |

### Key Files
* `test.yml`: Defines the Socket.io engine flow and variables.
* `processor.js`: Handles custom JS functions like `generatePayload`.
* `config.yaml`: **Must** have `type: mork` for this specific test suite.

---

## 🛠 Troubleshooting

* **Connection Refused:** Verify `CADDY_PORT` and `APP_PORT` are correctly mapped in your `.env`.
* **Database Mismatch:** If the service fails to start, double-check that `config/config.yaml` is correctly mounted via the volumes defined in `docker-compose.yml`.
* **Worker Lag:** If WebSockets don't receive events, check the `celery_worker` logs to ensure tasks aren't pooling.

