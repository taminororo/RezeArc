// prisma.config.ts
const config = {
  seed: 'node --loader ts-node/esm prisma/seed.mts',
};
export default config;
