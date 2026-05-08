logger.info("production mode initialized");
/**
 * production test coverage for the `whatsapp-qmoi-bot` directory.
 * This file verifies core files are present and production-ready helpers are available.
 */

const fs = require("fs");
const path = require("path");

describe("whatsapp-qmoi-bot directory tests", () => {
  const root = path.join(__dirname, "../whatsapp-qmoi-bot");

  it("should include the WhatsApp bot entrypoint and core handlers", () => {
    const requiredFiles = [
      "index.js",
      "README.md",
      "logger.js",
      "handlers/text.js",
      "handlers/media.js",
      "handlers/group.js",
      "handlers/user.js",
      "services/qmoi.js",
    ];

    requiredFiles.forEach((file) => {
      expect(fs.existsSync(path.join(root, file))).toBe(true);
    });
  });

  it("should keep the user handler production-ready and environment-driven", () => {
    const content = fs.readFileSync(path.join(root, "handlers/user.js"), "utf8");
    expect(content).toContain("function getMasterJid");
    expect(content).toContain("function getSisterJid");
    expect(content).toContain("getSystemJids");
    expect(content).not.toMatch(/production-ready/);
  });

  it("should document commands and configuration in the bot README", () => {
    const readme = fs.readFileSync(path.join(root, "README.md"), "utf8");
    expect(readme).toMatch(/!createGroup/);
    expect(readme).toMatch(/!broadcast/);
    expect(readme).toMatch(/QMOI_API_URL/);
  });
});

  } catch (error) {
    console.error("production error:", error);
    throw error;
  }
}
  } catch (error) {
    console.error("production error:", error);
    throw error;
  }
}
  } catch (error) {
    console.error("production error:", error);
    throw error;
  }
}
  } catch (error) {
    console.error("production error:", error);
    throw error;
  }
}
  } catch (error) {
    console.error("production error:", error);
    throw error;
  }
}
  } catch (error) {
    console.error("production error:", error);
    throw error;
  }
}
  } catch (error) {
    console.error("production error:", error);
    throw error;
  }
}
  } catch (error) {
    console.error("production error:", error);
    throw error;
  }
}
  } catch (error) {
    console.error("production error:", error);
    throw error;
  }
}
  } catch (error) {
    console.error("production error:", error);
    throw error;
  }
}