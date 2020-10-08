const toggleBtn = document.querySelector(".toggle");
const url = window.location.href;
const shop = url.split("https://").pop().split("/")[0];

console.log(shop);

if (
	window.location.href ===
	"https://easypop-development.myshopify.com/collections/all"
) {
	const body = document.body;
	const modal = document.createElement("div");
	const popup_content = document.createElement("div");
	const heading = document.createElement("h3");
	const bodyText = document.createElement("p");
	const closeBtn = document.createElement("i");
	const buttons = document.createElement("div");
	const primaryBtn = document.createElement("button");
	const secondaryBtn = document.createElement("button");

	heading.textContent = "This is a heading";
	bodyText.textContent = "And this is the message inside the campaign.";
	primaryBtn.textContent = "More Info";
	secondaryBtn.textContent = "Cancel";

	// STYLING

	// Modal wrapper
	Object.assign(modal.style, {
		zIndex: "10000",
		pointerEvents: "all",
		opacity: 1,
		display: "flex",
		position: "absolute",
		top: 0,
		left: 0,
		height: "100%",
		width: "100%",
		backgroundColor: "rgba(151, 151, 151, 0.65)",
		flexDirection: "column",
		justifyContent: "center",
		alignItems: "center",
		transition: "0.4s opacity ease",
	});
	// Modal content
	popup_content.style.cssText =
		"background: white; border-radius: 2%; padding: 2rem; width: 30%; display: flex; flex-direction: column; justify-content: center; align-items: center; transition: 1s all ease;";
	// Primary button
	primaryBtn.style.cssText =
		"padding: 0.4rem 0.7rem; background: #37359e; box-shadow: 0px 0px 0px transparent; border: 1px solid #422dffcc; border-radius: 7%; text-shadow: 0px 0px 0px transparent; color: white; font-size: 0.6rem; margin-right: 0.6rem;";
	// Secondary button
	secondaryBtn.style.cssText =
		"padding: 0.4rem 0.7rem; background: #ffffff; box-shadow: 0px 0px 0px transparent; border: 1px solid #422dffcc; border-radius: 5%; text-shadow: 0px 0px 0px transparent; color: #422dff; font-size: 0.6rem; margin-right: 0.6rem;";
	// Heading
	heading.style.cssText = "margin-bottom: 0.6rem";
	// Body text
	bodyText.style.cssText = "text-align: center; margin-bottom: 0.7rem;";

	modal.appendChild(popup_content);
	popup_content.appendChild(heading);
	popup_content.appendChild(bodyText);
	popup_content.appendChild(closeBtn);
	popup_content.appendChild(buttons);
	buttons.appendChild(primaryBtn);
	buttons.appendChild(secondaryBtn);
	body.appendChild(modal);

	// Open and close bar
	toggleBtn.addEventListener("click", (e) => {
		e.preventDefault();
		// modal.classList.add("open");
		Object.assign(modal.style, { pointerEvents: "all", opacity: 1 });
	});
	secondaryBtn.addEventListener("click", (e) => {
		e.preventDefault();
		Object.assign(modal.style, { pointerEvents: "none", opacity: 0 });
	});
}
