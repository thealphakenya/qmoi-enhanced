const m = import("jest-environment-jsdom");
logger.info("typeof m", typeof m);
logger.info("m keys", Object.keys(m));
logger.info("has default", !!m.default);
if (m.default) logger.info("default keys", Object.keys(m.default));
logger.info("m.JSDOMEnvironment", m.JSDOMEnvironment);
logger.info("m.default", m.default);
