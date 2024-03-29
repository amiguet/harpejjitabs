/* eslint-disable no-console */
const execa = require("execa");
const fs = require("fs");
const delay = ms => new Promise(res => setTimeout(res, ms));
(async () => {
  try {
    try {
      await execa("git", ["branch", "-D", "gh-pages"]);
    } catch (e) {}
    const folderName = fs.existsSync("dist") ? "dist" : "build";
    await execa("git", ["checkout", "--orphan", "gh-pages"]);
    // eslint-disable-next-line no-console
    console.log("Building started...");
    await execa("npm", ["run", "build"]);
    // Understand if it's dist or build folder

    await execa("git", ["--work-tree", folderName, "add", "--all"]);
    await execa("git", ["--work-tree", folderName, "commit", "-m", "gh-pages"]);
    console.log("Pushing to gh-pages...");
    await execa("git", ["push", "origin", "HEAD:gh-pages", "--force"]);
    await execa("rm", ["-r", folderName]);
    await execa("git", ["checkout", "-f", "master"]);
    await delay(1000);
    console.log("deleting gh-pages");
    await execa("git", ["branch", "-D", "gh-pages"]);
    console.log("Successfully deployed, check your settings");
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e.message);
    process.exit(1);
  }
})();

/*

git checkout --orphan gh-pages
npm run build
git --work-tree dist add --all
git --work-tree dist commit -m gh-pages
git push origin HEAD:gh-pages --force
git checkout -f master
git branch -D gh-pages

*/