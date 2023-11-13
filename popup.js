import { getCurrentTab } from "./utils.js";

document.addEventListener("DOMContentLoaded", async () => {
	const activeTab = await getCurrentTab();
	const videoUrlObject = new URL(activeTab.url);
	const videoId = videoUrlObject?.searchParams.get("v");

	if (activeTab.url.includes("youtube.com/watch") && !!videoId) {
		chrome.storage.sync.get([videoId], resultObj => {
			const currentVideoBookmarks = resultObj[videoId]
				? JSON.parse(resultObj[videoId])
				: [];
		});
	} else {
		// not a youtube video url
		const title = document.getElementsByClassName("title")[0];
		title.innerHTML = "Not a youtube video.";
	}
});
