if (
	window.location.href ===
	"https://easypop-development.myshopify.com/collections/all"
) {
	const body = document.querySelector("body");
	const modal = document.createElement("div").classList.add("fullscreen_popup");
	const popup_content = document
		.createElement("div")
		.classList.add("popup_content");

	modal.appendChild(popup_content);

	body.appendChild(modal);
}
