FROM node:lts-alpine@sha256:3689ad4435a413342ccc352170ad0f77433b41173af7fe4c0076f0c9792642cb as build-container

WORKDIR "/app"

COPY package*.json "/app/"
RUN npm ci

COPY . "/app/"
RUN npm ci && \
    npm run build && \
    rm -rf ./.github ./node_modules ./src ./test


FROM node:lts-alpine@sha256:3689ad4435a413342ccc352170ad0f77433b41173af7fe4c0076f0c9792642cb
ARG NODE_ENV=production
ENV NODE_ENV=$NODE_ENV

RUN ln -s /app/dist/bin/cli.js /usr/local/bin/start && \
    ln -s /app/dist/bin/cli.js /usr/local/bin/cli

COPY --from=build-container "/app" "/app"

WORKDIR "/app"
USER node

ENTRYPOINT ["/usr/bin/dumb-init", "--"]
CMD ["/usr/local/bin/start"]
