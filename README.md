### System Architect ###
A real-time backend system for simulating and streaming IoT sensor data using Node.js, Express, Redis Pub/Sub, and Socket.IO.
It includes RESTful APIs to fetch the latest data and WebSocket support for live updates.
NGINX acts as a reverse proxy to route frontend, API, and WebSocket traffic.

![alt text](image.png)

### How to run ###
```bash
docker compose up --build
```
