const path = require("path");
const fs = require("fs");

function dirsizeSync(dirname) {
  let size = 0;
  try {
    fs.readdirSync(dirname)
      .map((e) => path.join(dirname, e))
      .map((e) => {
        try {
          return {
            dirname: e,
            stat: fs.statSync(e),
          };
        } catch (ex) {
          return null;
        }
      })
      .forEach((e) => {
        if (e) {
          if (e.stat.isDirectory()) {
            size += dirsizeSync(e.dirname);
          } else if (e.stat.isFile()) {
            size += e.stat.size;
          }
        }
      });
  } catch (ex) {
    console.log(ex);
  }
  return size;
}

export { dirsizeSync };
