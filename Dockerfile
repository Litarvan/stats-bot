FROM node:14-buster-slim as BUILDER

ENV BUILD_ROOT /tmp/bot-build
WORKDIR $BUILD_ROOT

COPY bot/src src/
COPY bot/package.json bot/package-lock.json bot/main.js ./

RUN npm i

FROM gcr.io/distroless/nodejs

COPY --from=BUILDER /tmp/bot-build/node_modules node_modules/
COPY --from=BUILDER /tmp/bot-build/src src/
COPY --from=BUILDER /tmp/bot-build/main.js .

EXPOSE 5565
CMD ["node", "./main.js"]
