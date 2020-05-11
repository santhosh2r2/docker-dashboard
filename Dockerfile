FROM node:12
WORKDIR /app
COPY package.json /app/package.json
RUN apt update -y && apt upgrade -y && npm i && npm i -D
COPY . /app
CMD ["npm", "start"]