(() => {
	let youtubeRightControls, videoBox;
	let currentVideo = "";
	let currentVideoBookmarks = [];

	chrome.runtime.onMessage.addListener((obj, sender, response) => {
		const { type, value, videoId } = obj;
		if (type === "NEW") {
			// currentVideo holds the current video id
			currentVideo = videoId;
			onInit();
		}
	});

	const fetchBookmarks = () => {
		return new Promise(resolve => {
			return chrome.storage.sync.get([currentVideo], resultObj => {
				console.log("📢[contentScript.js:18]: obj: ", resultObj);
				console.log("📢[contentScript.js:22]: currentVideo: ", currentVideo);
				console.log(
					"📢[contentScript.js:18]: obj[currentVideo]: ",
					resultObj[currentVideo]
				);

				resolve(
					resultObj[currentVideo] ? JSON.parse(resultObj[currentVideo]) : []
				);
			});
		});
	};

	const onInit = async () => {
		currentVideoBookmarks = await fetchBookmarks();

		const bookmarkButtonExists = document.getElementsByClassName(
			"bookmark-btn"
		)[0]
			? true
			: false;

		if (!bookmarkButtonExists) {
			const buttonBox = document.createElement("div");
			buttonBox.style.display = "flex";
			buttonBox.style.justifyContent = "center";
			buttonBox.style.alignItems = "center";
			buttonBox.style.height = "100%";

			const bookmarkButton = document.createElement("img");
			bookmarkButton.src = chrome.runtime.getURL("assets/bookmark.png");
			bookmarkButton.title = "Click to bookmark";
			bookmarkButton.style.width = "70%";
			bookmarkButton.style.aspectRatio = "1/1";

			buttonBox.appendChild(bookmarkButton);
			const wrapperBox = document.createElement("div");
			wrapperBox.className = "ytp-button bookmark-btn";
			wrapperBox.appendChild(buttonBox);

			youtubeRightControls =
				document.getElementsByClassName("ytp-right-controls")[0];
			youtubeRightControls.prepend(wrapperBox);

			videoBox = document.getElementsByClassName("video-stream")[0];
			bookmarkButton.addEventListener("click", async () => {
				currentVideoBookmarks = await fetchBookmarks();
				const currentTime = videoBox.currentTime;
				const newBookmark = {
					time: currentTime,
					description: `Bookmark at ${getTime(currentTime)}`,
				};
				chrome.storage.sync.set({
					[currentVideo]: JSON.stringify(
						[...currentVideoBookmarks, newBookmark].sort(
							(a, b) => a.time - b.time
						)
					),
				});
			});
		}
	};

	onInit();
})();

const getTime = t => {
	const date = new Date(0); // Thu Jan 01 1970 06:00:00 GMT+0600 (Bangladesh Standard Time)
	date.setSeconds(t);

	const isoFormat = date.toISOString(); // example: if t=5, then '1970-01-01T00:00:05.000Z'
	return isoFormat.substring(11, 19); // 00:00:05
};
