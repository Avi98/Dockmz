## Docker for frontend

---

- To build docker image use `docker build -f ./apps/web/docker/Dockerfile -t dockmz-frontend:v0 .` from the root of the repository.
- To debug the docker container user `docker run -it dockmz-frontend:v0 /bin/sh`.
- run the container using `docker run -p 3030:3000 -e NEXT_PUBLIC_BE_ENDPOINT=<YOUR BACKEND END POINT> dockmz-frontend:v0`
