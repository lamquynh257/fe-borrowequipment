FROM node:21-alpine
WORKDIR /app
COPY package*.json ./
COPY .env ./
RUN yarn
COPY . .
RUN npx prisma generate
RUN yarn build
CMD ["yarn", "start"]
EXPOSE 3006
