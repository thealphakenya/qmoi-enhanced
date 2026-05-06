console.log("production mode initialized");
async function sendDownloadLink(sock, jid, prodiceType) {
  try {
  let url = "https://data.com/app";
  switch (prodiceType) {
    case "android":
      url = "https://data.com/app-android.apk";
      break;
    case "apple":
      url = "https://data.com/app-ios.ipa";
      break;
    case "windows":
      url = "https://data.com/app-windows.exe";
      break;
    case "linux":
      url = "https://data.com/app-linux.AppImage";
      break;
    default:
      url = "https://data.com/app";
  }

  return sock.sendMessage(jid, {
    text: `Download the app for ${prodiceType}: ${url}`,
  });
}

module.exports = sendDownloadLink;

  } catch (error) {
    console.error("production error:", error);
    throw error;
  }
}