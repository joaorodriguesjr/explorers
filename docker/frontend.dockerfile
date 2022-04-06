FROM node:lts-alpine
USER node
COPY --chown=node:node frontend /home/node/frontend
WORKDIR /home/node/frontend
RUN npm install
RUN npm run build
ENTRYPOINT [ "npm", "run", "start" ]
