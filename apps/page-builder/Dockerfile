FROM node:20 As development

WORKDIR /usr/src/app

COPY package*.json yarn.lock ./

RUN yarn

COPY prisma ./prisma/

COPY . .

# RUN  npm rebuild bcrypt --build-from-source

RUN npx prisma generate --schema=./prisma/schema-user.prisma

RUN yarn build


CMD ["node", "dist/apps/page-builder/main"]

FROM node:20 as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package*.json yarn.lock ./

RUN npm install --only=production --force


COPY . .

COPY --from=development /usr/src/app/dist ./dist

CMD ["node", "dist/apps/page-builder/main"]