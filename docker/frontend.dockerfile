FROM node:lts-alpine
USER node
COPY --chown=node:node next /home/node/next
WORKDIR /home/node/next
RUN npm install
RUN npm run build
ENTRYPOINT [ "npm", "run", "start" ]
