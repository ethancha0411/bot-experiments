FROM node:22-alpine
RUN corepack enable
WORKDIR /app
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml tsconfig.json ./
COPY packages ./packages
COPY apps/governance-server ./apps/governance-server
RUN pnpm install --frozen-lockfile
EXPOSE 8787
CMD ["pnpm", "--filter", "governance-server", "start"]
