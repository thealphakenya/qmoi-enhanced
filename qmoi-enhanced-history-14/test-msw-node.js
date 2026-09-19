(async () => {
  try {
    const nodeMsw = await import("msw/node");
    console.log("nodeMsw keys:", Object.keys(nodeMsw));
    console.log("nodeMsw.rest?", !!(nodeMsw && nodeMsw.rest));
    const core = await import("msw");
    console.log("core keys:", Object.keys(core));
    console.log("core.rest?", !!(core && core.rest));
  } catch (e) {
    console.error("err", e);
  }
})();
