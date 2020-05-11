FROM node:12
WORKDIR /app
COPY package.json /app/package.json
RUN apt update -y && apt upgrade -y && npm i && npm i -D
COPY . /app
EXPOSE 3000
CMD ["npm", "start"]