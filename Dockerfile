FROM node:lts-alpine@sha256:dc92f36e7cd917816fa2df041d4e9081453366381a00f40398d99e9392e78664 as build-container

WORKDIR "/app"

COPY package*.json "/app/"
RUN npm ci

COPY . "/app/"
RUN npm run build && \
    rm -rf ./.github ./src ./test ./node_modules


FROM node:lts-alpine@sha256:dc92f36e7cd917816fa2df041d4e9081453366381a00f40398d99e9392e78664
ARG NODE_ENV=production
ENV NODE_ENV=$NODE_ENV
WORKDIR "/app"

RUN apk add --no-cache --update dumb-init && \
    ln -s /app/dist/bin/start.js /usr/local/bin/start && \
    ln -s /app/dist/bin/cli.js /usr/local/bin/cli

COPY --from=build-container /app/package*.json "/app/"
RUN npm ci --only-production

COPY --from=build-container "/app" "/app"
USER node

ENTRYPOINT ["/usr/bin/dumb-init", "--"]
CMD ["/usr/local/bin/start"]
