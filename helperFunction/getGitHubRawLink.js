module.exports = ({
    repoOwner = "Modraxiss",
    repoName = "Discord-AutoMod-Badge",
    branch = "main",
    folder = "assets",
    fileName,
    fileExtension = "",
    debug = false
} = {}) => {
    try {
        if (!fileName) throw new Error("File name is required!");
        if (typeof fileName !== "string") throw new Error("Asset name must be a string!");
        if (!repoOwner || !repoName || !branch) throw new Error("Repository details are missing!");

        if (fileExtension && !fileName.includes(".")) {
            fileName += `.${fileExtension}`;
        }

        const baseUrl = `https://raw.githubusercontent.com/${repoOwner}/${repoName}/${branch}`;
        const fullPath = folder ? `${folder}/${encodeURIComponent(fileName)}` : encodeURIComponent(fileName);
        const finalUrl = `${baseUrl}/${fullPath}`;

        if (debug) {
            console.log(`Debug Info: `);
            console.log(`> Repo Owner: ${repoOwner}`);
            console.log(`> Repo Name: ${repoName}`);
            console.log(`> Branch: ${branch}`);
            console.log(`> Folder: ${folder}`);
            console.log(`> File Name: ${fileName}`);
            console.log(`> Final URL: ${finalUrl}`);
        }

        return finalUrl;
    } catch (error) {
        console.error("Error:", error.message);
        return null;
    }
}
