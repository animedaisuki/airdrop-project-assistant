FROM node:18-alpine3.15
WORKDIR /root/dev/airdrop-project-assistant
COPY package.json ./
RUN npm install --silent --no-cache
COPY ./ ./
EXPOSE 8000
CMD [ "npm", "run", "dev" ]
