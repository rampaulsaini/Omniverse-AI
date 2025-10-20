// -----------------------------
// earnings-dashboard.js
// -----------------------------

const GITHUB_USER = "rampaulsaini";  // आपका GitHub username
const REPO_NAME = "Omniverse-AI";    // Dashboard repo name

// Estimate income based on views/clones/stars
function estimateIncome(views, clones, stars, sponsors) {
    let base = views * 2 + clones * 5 + stars * 50 + sponsors * 1000;
    let projection = base * 1.4; // Next month projection multiplier
    return { base, projection };
}

// Fetch GitHub repository data
async function fetchGitHubData() {
    try {
        const repoRes = await fetch(`https://api.github.com/repos/${GITHUB_USER}/${REPO_NAME}`);
        const repoData = await repoRes.json();

        const viewsRes = await fetch(`https://api.github.com/repos/${GITHUB_USER}/${REPO_NAME}/traffic/views`);
        const viewsData = await viewsRes.json();

        const clonesRes = await fetch(`https://api.github.com/repos/${GITHUB_USER}/${REPO_NAME}/traffic/clones`);
        const clonesData = await clonesRes.json();

        const sponsorsRes = await fetch(`https://api.github.com/users/${GITHUB_USER}/sponsors`);
        const sponsorsData = await sponsorsRes.json();

        const stars = repoData.stargazers_count || 0;
        const forks = repoData.forks_count || 0;
        const views = viewsData.count || 0;
        const clones = clonesData.count || 0;
        const sponsors = Array.isArray(sponsorsData) ? sponsorsData.length : 0;

        const income = estimateIncome(views, clones, stars, sponsors);

        document.getElementById("views").innerText = views;
        document.getElementById("clones").innerText = clones;
        document.getElementById("stars").innerText = stars;
        document.getElementById("forks").innerText = forks;
        document.getElementById("sponsors").innerText = sponsors;
        document.getElementById("income").innerText = income.base;
        document.getElementById("projection").innerText = income.projection;

        const now = new Date();
        document.getElementById("last-deploy").innerText = now.toLocaleString();
        document.getElementById("next-sync").innerText = new Date(now.getTime() + 6*60*60*1000).toLocaleString(); // 6 hours later

    } catch (error) {
        console.error("Error fetching GitHub data:", error);
    }
}

// Run on page load
fetchGitHubData();

