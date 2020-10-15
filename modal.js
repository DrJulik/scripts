const fetchCampaignInfo = async () => {
	const res = await fetch(
		`https://easypop.herokuapp.com/api/campaigns/easypop-development.myshopify.com`,
		{
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		}
	);
	const responseJson = await res.json();
	return responseJson.data;
};

// HELPER
function hsv_to_hsl(h, s, v) {
	// both hsv and hsl values are in [0, 1]
	var l = ((2 - s) * v) / 2;

	if (l != 0) {
		if (l == 1) {
			s = 0;
		} else if (l < 0.5) {
			s = (s * v) / (l * 2);
		} else {
			s = (s * v) / (2 - l * 2);
		}
	}

	return [h, s, l];
}

const campaignInfo = async () => {
	try {
		const campData = await fetchCampaignInfo();

		campData.forEach((campaign) => {
			console.log(campaign);
			const { freePlan, style, content, settings } = campaign;
			// I GUESS THIS IS WHERE WE BUILD THE CAMPAIGNS
			if (style.campaignType === "modal") {
				// TRIGGERS

				// URL
				let urlTrigger;
				if (
					settings.trigger === "url" &&
					settings.matchingFormat === "contains"
				) {
					urlTrigger = window.location.href.includes(settings.matchInput);
				} else if (
					settings.trigger === "url" &&
					settings.matchingFormat === "matches"
				) {
					urlTrigger = window.location.href === settings.matchInput;
				}

				const cartSize = "";
				const cartValue = "";
				const tagInCart = "";
				const collectionInCart = "";
				const timeOnPage = "";
				const exitIntent = "";
				// const scrollDepth = "";

				// DOM hooks
				const toggleBtn = document.querySelector(".toggle");
				const body = document.body;
				const modal = document.createElement("div");
				const popup_content = document.createElement("div");
				const heading = document.createElement("h3");
				const bodyText = document.createElement("p");
				const closeBtn = document.createElement("i");
				const buttons = document.createElement("div");
				const primaryBtn = document.createElement("button");
				const secondaryBtn = document.createElement("button");
				const btnLink = document.createElement("a");
				const freeIcon = document.createElement("i");

				if (urlTrigger) {
					const createModal = () => {
						// STYLING VARS
						// STYLE
						// Converted color values
						const oCValues = hsv_to_hsl(
							style.overlayColor.hue,
							style.overlayColor.saturation,
							style.overlayColor.brightness
						);
						const bCValues = hsv_to_hsl(
							style.backgroundColor.hue,
							style.backgroundColor.saturation,
							style.backgroundColor.brightness
						);
						const borCValues = hsv_to_hsl(
							style.borderColor.hue,
							style.borderColor.saturation,
							style.borderColor.brightness
						);
						const primColor = hsv_to_hsl(
							style.primaryButtonColor.hue,
							style.primaryButtonColor.saturation,
							style.primaryButtonColor.brightness
						);

						const overlayColor = `hsla(${
							Math.round(oCValues[0] * 100) / 100
						}, ${Math.round(oCValues[1] * 100) + "%"}, ${
							Math.round(oCValues[2] * 100) + "%"
						}, ${style.overlayColor.alpha})`;

						const backgroundColor = `hsla(${
							Math.round(bCValues[0] * 100) / 100
						}, ${Math.round(bCValues[1] * 100) + "%"}, ${
							Math.round(bCValues[2] * 100) + "%"
						}, ${style.backgroundColor.alpha})`;
						const borderColor = `hsla(${
							Math.round(borCValues[0] * 100) / 100
						}, ${Math.round(borCValues[1] * 100) + "%"}, ${
							Math.round(borCValues[2] * 100) + "%"
						}, ${style.borderColor.alpha})`;
						const primButtonColor = `hsla(${
							Math.round(primColor[0] * 100) / 100
						}, ${Math.round(primColor[1] * 100) + "%"}, ${
							Math.round(primColor[2] * 100) + "%"
						}, ${style.primaryButtonColor.alpha})`;

						const borderRadius = style.borderRadius + "%";
						const borderWidth = style.borderWidth + "px";

						// Loading fontAwesome
						let link = document.createElement("link");
						link.rel = "stylesheet";
						link.href =
							"https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.1/css/all.min.css";
						// link.integrity =
						// 	"sha512-+4zCK9k+qNFUR5X+cKL9EIR+ZOhtIloNl9GIKS57V1MyNsYpYcUrUeQc9vNfzsWfV28IaLL3i96P9sdNyeRssA==";
						// link.crossorigin = "anonymous";
						document.head.appendChild(link);
						// CREATING CSS STYLESHEET

						let stylesheet = document.createElement("style");
						stylesheet.type = "text/css";
						stylesheet.innerHTML = `.modal { z-index: 10000;
						pointer-events: none;
						opacity: 0;
						display: flex;
						position: absolute;
						top: 0;
						left: 0;
						height: 100%;
						width: 100%;
						background-color: ${overlayColor};
						flex-direction: column;
						justify-content: center;
						align-items: center;
						transition: 0.4s opacity ease; }
	
						.modal.open {
							pointer-events: all;
						opacity: 1;
						}
						
						.free-icon {
							position: absolute;
								bottom: 5%;
							left: 5%;
							font-size: 0.9em;
						}
	
						.free-icon::after {
							opacity: 0;
							content: "Popup powered by Easypop";
							font-weight: 300;
							padding: 0 0 3px 3px;
							transition: 0.25s opacity ease;
						}
	
						.free-icon:hover:after {
							opacity: 1;
						}
						`;
						document.getElementsByTagName("head")[0].appendChild(stylesheet);
						if (settings.delay) {
							modal.classList.add("modal");
						} else {
							modal.classList.add("modal", "open");
						}

						// CONTENT
						heading.textContent = content.headline;
						bodyText.textContent = content.body;
						primaryBtn.textContent = content.buttonText;
						btnLink.href = content.buttonUrl;
						secondaryBtn.textContent = "Cancel";

						// AUTO CLOSE
						const handleAutoClose = () => {
							if (settings.autoClose) {
								setTimeout(() => {
									modal.classList.remove("open");
									isOpen = false;
								}, settings.autoCloseTime * 1000);
							} else {
								return;
							}
						};

						// DELAY
						if (settings.delay) {
							setTimeout(() => {
								modal.classList.add("open");
								isOpen = true;
								handleAutoClose();
							}, settings.delayTime * 1000);
						}

						const handleFrequency = () => {
							if (settings.frequency) {
								// wait for delay if there is one
								if (settings.delay) {
									setTimeout(() => {
										return;
									}, settings.delayTime * 1000);
								}
								// run the open close every X amount of time
								setInterval(() => {
									modal.classList.add("open");
									isOpen = true;
									handleAutoClose();
								}, settings.frequencyTime * 1000);
							}
						};
						handleFrequency();

						// Modal content
						popup_content.style.cssText = `position: relative; background: ${backgroundColor}; border-radius: ${borderRadius}; border: ${borderWidth} solid ${borderColor}; box-shadow:#00000038 5px 5px 10px 0px; padding: 1.5rem; display: flex; flex-direction: column; justify-content: center; align-items: center; transition: 1s all ease;`;
						// Primary button
						primaryBtn.style.cssText = `padding: 0.4rem 0.7rem; background: ${primButtonColor}; box-shadow: 0px 0px 0px transparent;  border-radius: 7%; text-shadow: 0px 0px 0px transparent; color: white; font-size: 0.6rem; margin-right: 0.6rem;`;
						// Secondary button
						secondaryBtn.style.cssText =
							"padding: 0.4rem 0.7rem; background: #ffffff; box-shadow: 0px 0px 0px transparent; border: 1px solid #422dffcc; border-radius: 5%; text-shadow: 0px 0px 0px transparent; color: #422dff; font-size: 0.6rem; margin-right: 0.6rem;";
						// Heading
						heading.style.cssText = "margin-bottom: 0.6rem";
						// Body text
						bodyText.style.cssText =
							"text-align: center; margin-bottom: 0.7rem;";

						modal.appendChild(popup_content);
						popup_content.appendChild(heading);
						popup_content.appendChild(bodyText);
						popup_content.appendChild(closeBtn);
						popup_content.appendChild(buttons);
						buttons.appendChild(btnLink);
						btnLink.appendChild(primaryBtn);
						buttons.appendChild(secondaryBtn);
						body.appendChild(modal);
						if (freePlan) {
							freeIcon.classList.add("fas", "fa-info-circle", "free-icon");
							popup_content.appendChild(freeIcon);
						}

						// Open and close bar
						toggleBtn.addEventListener("click", (e) => {
							modal.classList.add("open");
							isOpen = true;
							handleAutoClose();
						});
						secondaryBtn.addEventListener("click", (e) => {
							modal.classList.remove("open");
							isOpen = false;
						});
					};
					createModal();
				} else if (settings.trigger === "scroll-depth") {
					const createModal = () => {
						// STYLING VARS
						// STYLE
						// Converted color values
						const oCValues = hsv_to_hsl(
							style.overlayColor.hue,
							style.overlayColor.saturation,
							style.overlayColor.brightness
						);
						const bCValues = hsv_to_hsl(
							style.backgroundColor.hue,
							style.backgroundColor.saturation,
							style.backgroundColor.brightness
						);
						const borCValues = hsv_to_hsl(
							style.borderColor.hue,
							style.borderColor.saturation,
							style.borderColor.brightness
						);
						const primColor = hsv_to_hsl(
							style.primaryButtonColor.hue,
							style.primaryButtonColor.saturation,
							style.primaryButtonColor.brightness
						);

						const overlayColor = `hsla(${
							Math.round(oCValues[0] * 100) / 100
						}, ${Math.round(oCValues[1] * 100) + "%"}, ${
							Math.round(oCValues[2] * 100) + "%"
						}, ${style.overlayColor.alpha})`;

						const backgroundColor = `hsla(${
							Math.round(bCValues[0] * 100) / 100
						}, ${Math.round(bCValues[1] * 100) + "%"}, ${
							Math.round(bCValues[2] * 100) + "%"
						}, ${style.backgroundColor.alpha})`;
						const borderColor = `hsla(${
							Math.round(borCValues[0] * 100) / 100
						}, ${Math.round(borCValues[1] * 100) + "%"}, ${
							Math.round(borCValues[2] * 100) + "%"
						}, ${style.borderColor.alpha})`;
						const primButtonColor = `hsla(${
							Math.round(primColor[0] * 100) / 100
						}, ${Math.round(primColor[1] * 100) + "%"}, ${
							Math.round(primColor[2] * 100) + "%"
						}, ${style.primaryButtonColor.alpha})`;

						const borderRadius = style.borderRadius + "%";
						const borderWidth = style.borderWidth + "px";

						// Loading fontAwesome
						let link = document.createElement("link");
						link.rel = "stylesheet";
						link.href =
							"https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.1/css/all.min.css";
						// link.integrity =
						// 	"sha512-+4zCK9k+qNFUR5X+cKL9EIR+ZOhtIloNl9GIKS57V1MyNsYpYcUrUeQc9vNfzsWfV28IaLL3i96P9sdNyeRssA==";
						// link.crossorigin = "anonymous";
						document.head.appendChild(link);
						// CREATING CSS STYLESHEET

						let stylesheet = document.createElement("style");
						stylesheet.type = "text/css";
						stylesheet.innerHTML = `.modal { z-index: 10000;
						pointer-events: none;
						opacity: 0;
						display: flex;
						position: absolute;
						top: 0;
						left: 0;
						height: 100%;
						width: 100%;
						background-color: ${overlayColor};
						flex-direction: column;
						justify-content: center;
						align-items: center;
						transition: 0.4s opacity ease; }
	
						.modal.open {
							pointer-events: all;
						opacity: 1;
						}
						
						.free-icon {
							position: absolute;
								bottom: 5%;
							left: 5%;
							font-size: 0.9em;
						}
	
						.free-icon::after {
							opacity: 0;
							content: "Popup powered by Easypop";
							font-weight: 300;
							padding: 0 0 3px 3px;
							transition: 0.25s opacity ease;
						}
	
						.free-icon:hover:after {
							opacity: 1;
						}
						`;
						document.getElementsByTagName("head")[0].appendChild(stylesheet);

						let scrollpos = window.scrollY;

						const add_class_on_scroll = () =>
							modal.classList.add("modal", "open");

						const removeListener = () => {
							window.removeEventListener("scroll", catchModal);
						};
						const catchModal = () => {
							scrollpos = window.scrollY;

							if (scrollpos >= settings.matchInput) {
								add_class_on_scroll();
								removeListener();
							}
						};

						window.addEventListener("scroll", catchModal);
						modal.classList.add("modal");

						// CONTENT
						heading.textContent = content.headline;
						bodyText.textContent = content.body;
						primaryBtn.textContent = content.buttonText;
						btnLink.href = content.buttonUrl;
						secondaryBtn.textContent = "Cancel";

						// AUTO CLOSE
						const handleAutoClose = () => {
							if (settings.autoClose) {
								setTimeout(() => {
									modal.classList.remove("open");
									isOpen = false;
								}, settings.autoCloseTime * 1000);
							} else {
								return;
							}
						};

						// DELAY
						if (settings.delay) {
							setTimeout(() => {
								modal.classList.add("open");
								isOpen = true;
								handleAutoClose();
							}, settings.delayTime * 1000);
						}

						const handleFrequency = () => {
							if (settings.frequency) {
								// wait for delay if there is one
								if (settings.delay) {
									setTimeout(() => {
										return;
									}, settings.delayTime * 1000);
								}
								// run the open close every X amount of time
								setInterval(() => {
									modal.classList.add("open");
									isOpen = true;
									handleAutoClose();
								}, settings.frequencyTime * 1000);
							}
						};
						handleFrequency();

						// Modal content
						popup_content.style.cssText = `position: relative; background: ${backgroundColor}; border-radius: ${borderRadius}; border: ${borderWidth} solid ${borderColor}; box-shadow:#00000038 5px 5px 10px 0px; padding: 1.5rem; display: flex; flex-direction: column; justify-content: center; align-items: center; transition: 1s all ease;`;
						// Primary button
						primaryBtn.style.cssText = `padding: 0.4rem 0.7rem; background: ${primButtonColor}; box-shadow: 0px 0px 0px transparent; border: none; border-radius: 7%; text-shadow: 0px 0px 0px transparent; color: white; font-size: 0.6rem; margin-right: 0.6rem;`;
						// Secondary button
						secondaryBtn.style.cssText =
							"padding: 0.4rem 0.7rem; background: #ffffff; box-shadow: 0px 0px 0px transparent; border: none; border-radius: 5%; text-shadow: 0px 0px 0px transparent; color: #422dff; font-size: 0.6rem; margin-right: 0.6rem;";
						// Heading
						heading.style.cssText = "margin-bottom: 0.6rem";
						// Body text
						bodyText.style.cssText =
							"text-align: center; margin-bottom: 0.7rem;";

						modal.appendChild(popup_content);
						popup_content.appendChild(heading);
						popup_content.appendChild(bodyText);
						popup_content.appendChild(closeBtn);
						popup_content.appendChild(buttons);
						buttons.appendChild(btnLink);
						btnLink.appendChild(primaryBtn);
						buttons.appendChild(secondaryBtn);
						body.appendChild(modal);
						if (freePlan) {
							freeIcon.classList.add("fas", "fa-info-circle", "free-icon");
							popup_content.appendChild(freeIcon);
						}

						// Open and close bar
						toggleBtn.addEventListener("click", (e) => {
							modal.classList.add("open");
							isOpen = true;
							handleAutoClose();
						});
						secondaryBtn.addEventListener("click", (e) => {
							modal.classList.remove("open");
							isOpen = false;
						});
					};
					createModal();
				} else if (settings.trigger === "exit-intent") {
					const createModal = () => {
						// STYLING VARS
						// STYLE
						// Converted color values
						const oCValues = hsv_to_hsl(
							style.overlayColor.hue,
							style.overlayColor.saturation,
							style.overlayColor.brightness
						);
						const bCValues = hsv_to_hsl(
							style.backgroundColor.hue,
							style.backgroundColor.saturation,
							style.backgroundColor.brightness
						);
						const borCValues = hsv_to_hsl(
							style.borderColor.hue,
							style.borderColor.saturation,
							style.borderColor.brightness
						);
						const primColor = hsv_to_hsl(
							style.primaryButtonColor.hue,
							style.primaryButtonColor.saturation,
							style.primaryButtonColor.brightness
						);

						const overlayColor = `hsla(${
							Math.round(oCValues[0] * 100) / 100
						}, ${Math.round(oCValues[1] * 100) + "%"}, ${
							Math.round(oCValues[2] * 100) + "%"
						}, ${style.overlayColor.alpha})`;

						const backgroundColor = `hsla(${
							Math.round(bCValues[0] * 100) / 100
						}, ${Math.round(bCValues[1] * 100) + "%"}, ${
							Math.round(bCValues[2] * 100) + "%"
						}, ${style.backgroundColor.alpha})`;
						const borderColor = `hsla(${
							Math.round(borCValues[0] * 100) / 100
						}, ${Math.round(borCValues[1] * 100) + "%"}, ${
							Math.round(borCValues[2] * 100) + "%"
						}, ${style.borderColor.alpha})`;
						const primButtonColor = `hsla(${
							Math.round(primColor[0] * 100) / 100
						}, ${Math.round(primColor[1] * 100) + "%"}, ${
							Math.round(primColor[2] * 100) + "%"
						}, ${style.primaryButtonColor.alpha})`;

						const borderRadius = style.borderRadius + "%";
						const borderWidth = style.borderWidth + "px";

						// Loading fontAwesome
						let link = document.createElement("link");
						link.rel = "stylesheet";
						link.href =
							"https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.1/css/all.min.css";
						// link.integrity =
						// 	"sha512-+4zCK9k+qNFUR5X+cKL9EIR+ZOhtIloNl9GIKS57V1MyNsYpYcUrUeQc9vNfzsWfV28IaLL3i96P9sdNyeRssA==";
						// link.crossorigin = "anonymous";
						document.head.appendChild(link);
						// CREATING CSS STYLESHEET

						let stylesheet = document.createElement("style");
						stylesheet.type = "text/css";
						stylesheet.innerHTML = `.modal { z-index: 10000;
						pointer-events: none;
						opacity: 0;
						display: flex;
						position: absolute;
						top: 0;
						left: 0;
						height: 100%;
						width: 100%;
						background-color: ${overlayColor};
						flex-direction: column;
						justify-content: center;
						align-items: center;
						transition: 0.4s opacity ease; }
	
						.modal.open {
							pointer-events: all;
						opacity: 1;
						}
						
						.free-icon {
							position: absolute;
								bottom: 5%;
							left: 5%;
							font-size: 0.9em;
						}
	
						.free-icon::after {
							opacity: 0;
							content: "Popup powered by Easypop";
							font-weight: 300;
							padding: 0 0 3px 3px;
							transition: 0.25s opacity ease;
						}
	
						.free-icon:hover:after {
							opacity: 1;
						}
						`;
						document.getElementsByTagName("head")[0].appendChild(stylesheet);

						const mouseEvent = (e) => {
							const shouldShowExitIntent =
								!e.toElement && !e.relatedTarget && e.clientY < 10;

							if (shouldShowExitIntent) {
								document.removeEventListener("mouseout", mouseEvent);

								modal.classList.add("open");
							}
						};
						document.addEventListener("mouseout", mouseEvent);
						modal.classList.add("modal");

						// CONTENT
						heading.textContent = content.headline;
						bodyText.textContent = content.body;
						primaryBtn.textContent = content.buttonText;
						btnLink.href = content.buttonUrl;
						secondaryBtn.textContent = "Cancel";

						// AUTO CLOSE
						const handleAutoClose = () => {
							if (settings.autoClose) {
								setTimeout(() => {
									modal.classList.remove("open");
									isOpen = false;
								}, settings.autoCloseTime * 1000);
							} else {
								return;
							}
						};

						// DELAY
						if (settings.delay) {
							setTimeout(() => {
								modal.classList.add("open");
								isOpen = true;
								handleAutoClose();
							}, settings.delayTime * 1000);
						}

						const handleFrequency = () => {
							if (settings.frequency) {
								// wait for delay if there is one
								if (settings.delay) {
									setTimeout(() => {
										return;
									}, settings.delayTime * 1000);
								}
								// run the open close every X amount of time
								setInterval(() => {
									modal.classList.add("open");
									isOpen = true;
									handleAutoClose();
								}, settings.frequencyTime * 1000);
							}
						};
						handleFrequency();

						// Modal content
						popup_content.style.cssText = `position: relative; background: ${backgroundColor}; border-radius: ${borderRadius}; border: ${borderWidth} solid ${borderColor}; box-shadow:#00000038 5px 5px 10px 0px; padding: 1.5rem; display: flex; flex-direction: column; justify-content: center; align-items: center; transition: 1s all ease;`;
						// Primary button
						primaryBtn.style.cssText = `padding: 0.4rem 0.7rem; background: ${primButtonColor}; box-shadow: 0px 0px 0px transparent; border: none; border-radius: 7%; text-shadow: 0px 0px 0px transparent; color: white; font-size: 0.6rem; margin-right: 0.6rem;`;
						// Secondary button
						secondaryBtn.style.cssText =
							"padding: 0.4rem 0.7rem; background: #ffffff; box-shadow: 0px 0px 0px transparent; border: none; border-radius: 5%; text-shadow: 0px 0px 0px transparent; color: #422dff; font-size: 0.6rem; margin-right: 0.6rem;";
						// Heading
						heading.style.cssText = "margin-bottom: 0.6rem";
						// Body text
						bodyText.style.cssText =
							"text-align: center; margin-bottom: 0.7rem;";

						modal.appendChild(popup_content);
						popup_content.appendChild(heading);
						popup_content.appendChild(bodyText);
						popup_content.appendChild(closeBtn);
						popup_content.appendChild(buttons);
						buttons.appendChild(btnLink);
						btnLink.appendChild(primaryBtn);
						buttons.appendChild(secondaryBtn);
						body.appendChild(modal);
						if (freePlan) {
							freeIcon.classList.add("fas", "fa-info-circle", "free-icon");
							popup_content.appendChild(freeIcon);
						}

						// Open and close bar
						toggleBtn.addEventListener("click", (e) => {
							modal.classList.add("open");
							isOpen = true;
							handleAutoClose();
						});
						secondaryBtn.addEventListener("click", (e) => {
							modal.classList.remove("open");
							isOpen = false;
						});
					};
					createModal();
				} else if (settings.trigger === "time-on-page") {
					const createModal = () => {
						// STYLING VARS
						// STYLE
						// Converted color values
						const oCValues = hsv_to_hsl(
							style.overlayColor.hue,
							style.overlayColor.saturation,
							style.overlayColor.brightness
						);
						const bCValues = hsv_to_hsl(
							style.backgroundColor.hue,
							style.backgroundColor.saturation,
							style.backgroundColor.brightness
						);
						const borCValues = hsv_to_hsl(
							style.borderColor.hue,
							style.borderColor.saturation,
							style.borderColor.brightness
						);
						const primColor = hsv_to_hsl(
							style.primaryButtonColor.hue,
							style.primaryButtonColor.saturation,
							style.primaryButtonColor.brightness
						);

						const overlayColor = `hsla(${
							Math.round(oCValues[0] * 100) / 100
						}, ${Math.round(oCValues[1] * 100) + "%"}, ${
							Math.round(oCValues[2] * 100) + "%"
						}, ${style.overlayColor.alpha})`;

						const backgroundColor = `hsla(${
							Math.round(bCValues[0] * 100) / 100
						}, ${Math.round(bCValues[1] * 100) + "%"}, ${
							Math.round(bCValues[2] * 100) + "%"
						}, ${style.backgroundColor.alpha})`;
						const borderColor = `hsla(${
							Math.round(borCValues[0] * 100) / 100
						}, ${Math.round(borCValues[1] * 100) + "%"}, ${
							Math.round(borCValues[2] * 100) + "%"
						}, ${style.borderColor.alpha})`;
						const primButtonColor = `hsla(${
							Math.round(primColor[0] * 100) / 100
						}, ${Math.round(primColor[1] * 100) + "%"}, ${
							Math.round(primColor[2] * 100) + "%"
						}, ${style.primaryButtonColor.alpha})`;

						const borderRadius = style.borderRadius + "%";
						const borderWidth = style.borderWidth + "px";

						// Loading fontAwesome
						let link = document.createElement("link");
						link.rel = "stylesheet";
						link.href =
							"https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.1/css/all.min.css";
						// link.integrity =
						// 	"sha512-+4zCK9k+qNFUR5X+cKL9EIR+ZOhtIloNl9GIKS57V1MyNsYpYcUrUeQc9vNfzsWfV28IaLL3i96P9sdNyeRssA==";
						// link.crossorigin = "anonymous";
						document.head.appendChild(link);
						// CREATING CSS STYLESHEET

						let stylesheet = document.createElement("style");
						stylesheet.type = "text/css";
						stylesheet.innerHTML = `.modal { z-index: 10000;
						pointer-events: none;
						opacity: 0;
						display: flex;
						position: absolute;
						top: 0;
						left: 0;
						height: 100%;
						width: 100%;
						background-color: ${overlayColor};
						flex-direction: column;
						justify-content: center;
						align-items: center;
						transition: 0.4s opacity ease; }
	
						.modal.open {
							pointer-events: all;
						opacity: 1;
						}
						
						.free-icon {
							position: absolute;
								bottom: 5%;
							left: 5%;
							font-size: 0.9em;
						}
	
						.free-icon::after {
							opacity: 0;
							content: "Popup powered by Easypop";
							font-weight: 300;
							padding: 0 0 3px 3px;
							transition: 0.25s opacity ease;
						}
	
						.free-icon:hover:after {
							opacity: 1;
						}
						`;
						document.getElementsByTagName("head")[0].appendChild(stylesheet);

						setTimeout(() => {
							modal.classList.add("open");
						}, settings.matchInput * 1000);
						modal.classList.add("modal");

						// CONTENT
						heading.textContent = content.headline;
						bodyText.textContent = content.body;
						primaryBtn.textContent = content.buttonText;
						btnLink.href = content.buttonUrl;
						secondaryBtn.textContent = "Cancel";

						// AUTO CLOSE
						const handleAutoClose = () => {
							if (settings.autoClose) {
								setTimeout(() => {
									modal.classList.remove("open");
									isOpen = false;
								}, settings.autoCloseTime * 1000);
							} else {
								return;
							}
						};

						// DELAY
						if (settings.delay) {
							setTimeout(() => {
								modal.classList.add("open");
								isOpen = true;
								handleAutoClose();
							}, settings.delayTime * 1000);
						}

						const handleFrequency = () => {
							if (settings.frequency) {
								// wait for delay if there is one
								if (settings.delay) {
									setTimeout(() => {
										return;
									}, settings.delayTime * 1000);
								}
								// run the open close every X amount of time
								setInterval(() => {
									modal.classList.add("open");
									isOpen = true;
									handleAutoClose();
								}, settings.frequencyTime * 1000);
							}
						};
						handleFrequency();

						// Modal content
						popup_content.style.cssText = `position: relative; background: ${backgroundColor}; border-radius: ${borderRadius}; border: ${borderWidth} solid ${borderColor}; box-shadow:#00000038 5px 5px 10px 0px; padding: 1.5rem; display: flex; flex-direction: column; justify-content: center; align-items: center; transition: 1s all ease;`;
						// Primary button
						primaryBtn.style.cssText = `padding: 0.4rem 0.7rem; background: ${primButtonColor}; box-shadow: 0px 0px 0px transparent; border: none; border-radius: 7%; text-shadow: 0px 0px 0px transparent; color: white; font-size: 0.6rem; margin-right: 0.6rem;`;
						// Secondary button
						secondaryBtn.style.cssText =
							"padding: 0.4rem 0.7rem; background: #ffffff; box-shadow: 0px 0px 0px transparent; border: none; border-radius: 5%; text-shadow: 0px 0px 0px transparent; color: #422dff; font-size: 0.6rem; margin-right: 0.6rem;";
						// Heading
						heading.style.cssText = "margin-bottom: 0.6rem";
						// Body text
						bodyText.style.cssText =
							"text-align: center; margin-bottom: 0.7rem;";

						modal.appendChild(popup_content);
						popup_content.appendChild(heading);
						popup_content.appendChild(bodyText);
						popup_content.appendChild(closeBtn);
						popup_content.appendChild(buttons);
						buttons.appendChild(btnLink);
						btnLink.appendChild(primaryBtn);
						buttons.appendChild(secondaryBtn);
						body.appendChild(modal);
						if (freePlan) {
							freeIcon.classList.add("fas", "fa-info-circle", "free-icon");
							popup_content.appendChild(freeIcon);
						}

						// Open and close bar
						toggleBtn.addEventListener("click", (e) => {
							modal.classList.add("open");
							isOpen = true;
							handleAutoClose();
						});
						secondaryBtn.addEventListener("click", (e) => {
							modal.classList.remove("open");
							isOpen = false;
						});
					};
					createModal();
				} else {
					return;
				}
			}
		});
	} catch (err) {
		console.log(err);
	}
};
campaignInfo();
