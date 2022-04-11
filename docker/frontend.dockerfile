FROM node:lts-alpine
USER node
COPY --chown=node:node frontend/package.json /home/node/frontend/package.json
WORKDIR /home/node/frontend
RUN npm install

COPY --chown=node:node frontend /home/node/frontend
RUN npm run build

ENTRYPOINT [ "npm", "run", "start" ]
