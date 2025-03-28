FROM node:22-alpine3.19

COPY ["app/package.json", "app/package-lock.json", "/usr/src/"]

WORKDIR /usr/src/

RUN npm install -g npm@10.8.2

RUN npm install

COPY ["app", "/usr/src/"]

RUN mkdir -p /usr/src/logs

RUN chmod 775 -R /usr/src/logs/

ENV URL_FIRMA https://api.beta.ceropapel.dev/v1/core/documents/external-document

ENV URL_FIRMA_CONSULTA https://api.beta.ceropapel.dev/v1/core/documents/external-document

ENV API_KEY MUzpSnnCDi3XW3Ub.57aedf11-845d-4f9f-afeb-70c06c1bc090

ENV CLAVE_DOCUMENTO 'documentoContenido'

ENV CLAVE_TEMPLATE 'documento-tlaxcala'

ENV SECRET_COOKIE 0_jabcm582674nfadg05m_A1se81hsaTbMoaz

ENV GOOGLE_SECTRET_CAPTCHA 6Ldx5JkqAAAAAOXnC-JiX5INPJOP4FyAxEyV6oG5

CMD ["npm", "run", "dev"]