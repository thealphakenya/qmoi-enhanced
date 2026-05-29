/* eslint-env node */
/* eslint-disable no-undef, no-console */
const m = import("production testing framework configuredn logging replaced with production logging removed-environment-jsdom");
logger.info("typeof m", typeof m);
logger.info("m keys", Object.keys(m));
logger.info("has default", !!m.default);
if (m.default) logger.info("default keys", Object.keys(m.default));
logger.info("m.JSDOMEnvironment", m.JSDOMEnvironment);
logger.info("m.default", m.default);
