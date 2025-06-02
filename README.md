> A real-time backend system for simulating and streaming IoT sensor data using Node.js, Express, Redis Pub/Sub, and Socket.IO. 
> It includes RESTful APIs to fetch the latest data and WebSocket support for live updates. 
> NGINX acts as a reverse proxy to route frontend, API, and WebSocket traffic.  

### Run project ###

```bash
docker compose up --build
```

### System Architect ###

The project architecture is optimized to ensure low-latency by using WebSocket combined with Redis Pub/Sub, allowing sensor data to be transmitted almost instantly to the subscribed client. The system ensures robustness by separating the REST API and realtime server, supporting independent scaling and flexible recovery. At the same time, sending only the necessary data to each client makes the architecture lightweight, saving bandwidth and resources when there are hundreds of concurrent users. 

![alt text](image.png)

- **Frontend**: React + Chart.js + Socket.IO client  
- **Backend REST (server.js)**: Express.js, providing static data (latest sensor data via REST API)  
- **Backend Realtime (realtime-server.js)**: Express + Socket.IO server + Redis Pub/Sub  
- **Redis**: used as intermediate storage (Pub/Sub + cache)  
- **Nginx**: Reverse proxy and load balancing  
- **Docker Compose**: Orchestrating containers 