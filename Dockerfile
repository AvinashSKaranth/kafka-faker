FROM node:16-alpine
RUN mkdir -p /home/node/app/node_modules && mkdir -p /home/node/app/producer && chown -R node:node /home/node/app
WORKDIR /home/node/app
COPY package*.json ./
USER node
RUN npm ci
COPY --chown=node:node ./src ./src
EXPOSE 9091
CMD [ "node", "src/index.js" ]