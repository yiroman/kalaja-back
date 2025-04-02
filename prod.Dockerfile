FROM node:22-alpine3.19

ENV NODE_ENV production

COPY ["app/package.json", "app/package-lock.json", "/usr/src/"]

WORKDIR /usr/src/

RUN npm install -g npm@10.8.2
RUN npm install --production --omit=dev

COPY ["app", "/usr/src/"]

RUN mkdir -p /usr/src/logs
RUN chmod 775 -R /usr/src/logs/

CMD ["npm", "start"]
