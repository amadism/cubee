FROM node:20 AS build
LABEL maintainer="Saman Hosseini <saman@modernice.ltd>"

ARG APP_NAME=app
ENV APP_NAME=${APP_NAME}
ARG FONTAWESOME_TOKEN
ARG NPMRC_FILE=.npmrc.docker
ENV NUXT_PUBLIC_SITE_URL=https://cubee.expert

# Install pnpm
RUN apt-get update && apt-get install -y curl
RUN curl -fsSL "https://github.com/pnpm/pnpm/releases/latest/download/pnpm-linuxstatic-x64" -o /bin/pnpm; chmod +x /bin/pnpm;

# RUN npm add -g pnpm

WORKDIR /build
COPY . /build

RUN if [ ! "${NPMRC_FILE}" = ".npmrc" ]; then mv "${NPMRC_FILE}" .npmrc; fi
RUN if [ -n "$FONTAWESOME_TOKEN" ]; then echo "//npm.fontawesome.com/:_authToken=${FONTAWESOME_TOKEN}" >> .npmrc; fi

RUN pnpm i --frozen-lockfile --ignore-scripts
RUN pnpm packages

RUN rm -rf ./node_modules
RUN pnpm i --frozen-lockfile

RUN cd ${APP_NAME} && pnpm nuxi prepare && pnpm build

FROM node:20

ARG APP_NAME=app

ENV NODE_ENV=production
ENV APP_NAME=${APP_NAME}

# Install Doppler CLI
RUN apt-get update && apt-get upgrade -y
RUN apt-get install -y wget gnupg apt-transport-https
RUN wget -q -t3 'https://packages.doppler.com/public/cli/gpg.DE2A7741A397C129.key' -O - | apt-key add - && \
    echo "deb https://packages.doppler.com/public/cli/deb/debian any-version main" > /etc/apt/sources.list.d/doppler-cli.list && \
    apt-get update && \
    apt-get install -y doppler libvips

RUN apt-get install -y libvips

WORKDIR /var/www/cubee
COPY --from=build /build/${APP_NAME}/.output /var/www/cubee/

ENTRYPOINT ["doppler", "run", "--"]
CMD ["node", "./server/index.mjs"]