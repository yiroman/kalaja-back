FROM node:22-alpine3.19

ENV NODE_ENV dev

COPY ["app/package.json", "app/package-lock.json", "/usr/src/"]

WORKDIR /usr/src/

RUN npm install -g npm@9.6.4

RUN npm install --production --omit=dev

COPY ["app", "/usr/src/"]

RUN mkdir -p /usr/src/logs

RUN chmod 775 -R /usr/src/logs/

ENV URL_FIRMA https://next.api.ceropapel.mx/v1/core/documents/external-document

ENV URL_FIRMA_CONSULTA https://next.api.ceropapel.mx/v1/core/documents/external-document

ENV API_KEY VTGQ1f8iuY6Cy2u2.5b72061b-9782-4873-86a1-d0865a10f978

ENV CLAVE_DOCUMENTO 'documentoDeContenido'

ENV CLAVE_TEMPLATE 'documento-tlaxcala'

ENV SECRET_COOKIE 0_jaAlois873ndAnmdh7dasa_v90aasdfstg234

ENV GOOGLE_SECTRET_CAPTCHA 6Ldx5JkqAAAAAOXnC-JiX5INPJOP4FyAxEyV6oG5

CMD ["npm", "start"]