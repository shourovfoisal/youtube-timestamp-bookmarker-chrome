chrome.tabs.onUpdated.addListener((tabId, tab) => {
	if (tab.url && tab.url.includes("youtube.com/watch")) {
		let videoUrlObject = {};
		let videoId = "";
		console.log("Sending message");
		try {
			videoUrlObject = new URL(tab.url);
			videoId = videoUrlObject.searchParams.get("v");
			chrome.tabs.sendMessage(tabId, {
				type: "NEW",
				videoId,
			});
		} catch (error) {}
	}
});
