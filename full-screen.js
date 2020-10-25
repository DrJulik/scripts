const shop = window.location.href.split("https://").pop().split("/")[0];

const fetchCampaignInfo = async () => {
	const res = await fetch(
		`https://easypop.herokuapp.com/api/campaigns/${shop}`,
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

const fetchCartInfo = async () => {
	const res = await fetch(`/cart.js`, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
		},
	});
	const responseJson = await res.json();
	return responseJson;
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

// MUTATION OBSERVER TO WATCH FOR CLASS CHANGES
class ClassWatcher {
	constructor(
		targetNode,
		classToWatch,
		classAddedCallback,
		classRemovedCallback
	) {
		this.targetNode = targetNode;
		this.classToWatch = classToWatch;
		this.classAddedCallback = classAddedCallback;
		this.classRemovedCallback = classRemovedCallback;
		this.observer = null;
		this.lastClassState = targetNode.classList.contains(this.classToWatch);

		this.init();
	}

	init() {
		this.observer = new MutationObserver(this.mutationCallback);
		this.observe();
	}

	observe() {
		this.observer.observe(this.targetNode, { attributes: true });
	}

	disconnect() {
		this.observer.disconnect();
	}

	mutationCallback = (mutationsList) => {
		for (let mutation of mutationsList) {
			if (
				mutation.type === "attributes" &&
				mutation.attributeName === "class"
			) {
				let currentClassState = mutation.target.classList.contains(
					this.classToWatch
				);
				if (this.lastClassState !== currentClassState) {
					this.lastClassState = currentClassState;
					if (currentClassState) {
						this.classAddedCallback();
					} else {
						this.classRemovedCallback();
					}
				}
			}
		}
	};
}

const campaignInfo = async () => {
	try {
		const campData = await fetchCampaignInfo();
		const cartData = await fetchCartInfo();
		console.log(cartData);
		campData.forEach((campaign) => {
			console.log(campaign);
			const { freePlan, style, content, settings } = campaign;
			// I GUESS THIS IS WHERE WE BUILD THE CAMPAIGNS
			if (style.campaignType === "full-screen") {
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

				// DOM hooks
				const toggleBtn = document.querySelector(".toggle");
				const body = document.body;
				const modal = document.createElement("div");
				const popup_content = document.createElement("div");
				const container = document.createElement("div");
				const img = document.createElement("img");
				const heading = document.createElement("h2");
				const bodyText = document.createElement("p");
				const closeBtn = document.createElement("i");
				const buttons = document.createElement("div");
				const primaryBtn = document.createElement("button");
				// const secondaryBtn = document.createElement("button");
				const btnLink = document.createElement("a");
				const freeIcon = document.createElement("i");
				// Input for newsletter
				const input = document.createElement("input");
				// Product feed elements (everything else is created in the forEach below)
				const productContainer = document.createElement("div");

				// Loading fontAwesome
				let link = document.createElement("link");
				link.rel = "stylesheet";
				link.href =
					"https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.1/css/all.min.css";
				document.head.appendChild(link);

				// STYLES
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

				const overlayColor = `hsla(${Math.round(oCValues[0] * 100) / 100}, ${
					Math.round(oCValues[1] * 100) + "%"
				}, ${Math.round(oCValues[2] * 100) + "%"}, ${
					style.overlayColor.alpha
				})`;

				const backgroundColor = `hsla(${Math.round(bCValues[0] * 100) / 100}, ${
					Math.round(bCValues[1] * 100) + "%"
				}, ${Math.round(bCValues[2] * 100) + "%"}, ${
					style.backgroundColor.alpha
				})`;
				const borderColor = `hsla(${Math.round(borCValues[0] * 100) / 100}, ${
					Math.round(borCValues[1] * 100) + "%"
				}, ${Math.round(borCValues[2] * 100) + "%"}, ${
					style.borderColor.alpha
				})`;
				const primButtonColor = `hsla(${
					Math.round(primColor[0] * 100) / 100
				}, ${Math.round(primColor[1] * 100) + "%"}, ${
					Math.round(primColor[2] * 100) + "%"
				}, ${style.primaryButtonColor.alpha})`;

				const borderRadius = style.borderRadius + "%";
				const borderWidth = style.borderWidth + "px";

				// CREATING CSS STYLESHEET

				let stylesheet = document.createElement("style");
				stylesheet.type = "text/css";
				stylesheet.innerHTML = `.modal { z-index: 10000;
					pointer-events: none;
					opacity: 0;
					display: flex;
					position: fixed;
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

					.container {
						display: flex;
						flex-direction: column;
						justify-content: center;
						align-items: flex-start;
					}
					
					.primaryBtn {
						padding: 0.7rem; 
						background: ${primButtonColor}; 
						box-shadow: #0000002e 1px 1px 3px;
						border:none;  
						border-radius: 3%;  
						color: white; 
						font-family:inherit; 
						font-size: 0.75rem; 
						margin-top: 0.5rem;
						margin-right: 0.6rem;
						transition: opacity 0.3s ease;
					}

					.primaryBtn:hover {
						opacity:0.8;
						cursor:pointer;
					}

					.closeBtn {
						position: absolute;
						right: 0;
						top: 0;
    					margin-top: -2.1rem;
						font-size: 1.6rem;
						transition: 0.25s opacity ease;
					}

					.closeBtn:hover {
						opacity: 0.85;
						cursor:pointer;
					}

					.productContainer {
						display: flex;
					}

					.product {
						margin: 1rem;
					}

					.prodImg {
						width: 200px;
						height:  200px;
						object-fit: cover;
						box-shadow: 1px 1px 3px #00000033;
					}

					.free-icon {
						position: absolute;
						bottom: 3%;
						color: ${primButtonColor};
						margin-top: 0.7rem;
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

				// Modal content
				popup_content.style.cssText = `position: relative; background: ${backgroundColor}; border-radius: ${borderRadius}; border: ${borderWidth} solid ${borderColor}; box-shadow:#00000038 5px 5px 10px 0px; padding: 2.5rem; display: flex; flex-direction: column; justify-content: center; align-items: flex-start; transition: 1s all ease;`;
				// Secondary button
				// secondaryBtn.style.cssText =
				// 	"padding: 0.4rem 0.7rem; background: #ffffff; box-shadow: 0px 0px 0px transparent; border: 1px solid #422dffcc; border-radius: 5%; text-shadow: 0px 0px 0px transparent; color: #422dff; font-size: 0.6rem; margin-right: 0.6rem;";
				// Heading
				heading.style.cssText = "margin-bottom: 0.6rem";
				// Body text
				bodyText.style.cssText = "margin-bottom: 0.7rem;";
				// Buttons div
				buttons.style.cssText = "margin-bottom: 0.7rem; display: flex;";
				// image
				img.style.cssText =
					" height: 150px; object-fit: cover; margin-bottom: 1rem;";
				// input
				input.style.cssText =
					"border: 1px solid #CDD9ED; line-height: 25px; font-size: 14px; font-weight: 500; height: 100%; font-family: inherit; border-radius: 6px 0 0 6px;";

				// SET CONTENT TYPES
				const setContentTypes = () => {
					if (content.contentType === "text-image") {
						// CONTENT
						img.src = content.imgUrl;
						heading.textContent = content.headline;
						bodyText.textContent = content.body;
						primaryBtn.textContent = content.buttonText;
						btnLink.href = content.buttonUrl;
						// secondaryBtn.textContent = "Cancel";

						modal.appendChild(popup_content);
						modal.appendChild(closeBtn);
						popup_content.appendChild(container);
						container.appendChild(img);
						container.appendChild(heading);
						container.appendChild(bodyText);
						container.appendChild(closeBtn);
						container.appendChild(buttons);
						buttons.appendChild(btnLink);
						btnLink.appendChild(primaryBtn);
						// buttons.appendChild(secondaryBtn);
						body.appendChild(modal);
					} else if (content.contentType === "newsletter") {
						heading.textContent = content.headline;
						bodyText.textContent = content.body;
						primaryBtn.textContent = content.buttonText;
						btnLink.href = content.buttonUrl;
						input.type = "text";

						modal.appendChild(popup_content);
						popup_content.appendChild(container);
						container.appendChild(heading);
						container.appendChild(bodyText);
						container.appendChild(closeBtn);
						container.appendChild(buttons);
						buttons.appendChild(input);
						buttons.appendChild(btnLink);
						btnLink.appendChild(primaryBtn);
						// buttons.appendChild(secondaryBtn);
						body.appendChild(modal);
					} else if (content.contentType === "product-feed") {
						heading.textContent = content.headline;
						bodyText.textContent = content.body;
						primaryBtn.textContent = content.buttonText;
						btnLink.href = content.buttonUrl;

						productContainer.classList.add("productContainer");

						modal.appendChild(popup_content);
						popup_content.appendChild(container);
						container.appendChild(heading);
						container.appendChild(bodyText);
						container.appendChild(closeBtn);
						popup_content.appendChild(productContainer);
						// Run a forEach loop for how many products we want here?
						const products = content.selectedProducts[0].selection;
						console.log(products);
						products.forEach((prod) => {
							const product = document.createElement("div");
							const prodImg = document.createElement("img");
							const prodTitle = document.createElement("h3");
							const prodPrice = document.createElement("p");
							const primaryBtn = document.createElement("p");

							product.classList.add("product");
							prodImg.classList.add("prodImg");
							prodTitle.classList.add("prodTitle");
							prodPrice.classList.add("prodPrice");
							primaryBtn.classList.add("primaryBtn");

							productContainer.appendChild(product);
							product.appendChild(prodImg);
							product.appendChild(prodTitle);
							product.appendChild(prodPrice);
							product.appendChild(primaryBtn);

							const image =
								prod.images.length === 0
									? "https://cdn.shopify.com/s/files/1/0533/2089/files/placeholder-images-image_large.png?format=jpg&quality=90&v=1530129081"
									: prod.images[0].originalSrc;

							prodTitle.textContent = prod.title;
							prodPrice.textContent = prod.variants[0].price;
							prodImg.src = image;
							primaryBtn.textContent = "Add to Cart";
						});

						body.appendChild(modal);
					} else if (content.contentType === "custom-html") {
						const customHtml = content.customHtml;

						popup_content.innerHTML = customHtml;

						modal.appendChild(popup_content);
						body.appendChild(modal);
						popup_content.appendChild(closeBtn);
					}
				};

				// SETTINGS
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

				function workOnClassAdd() {
					handleAutoClose();
				}

				function workOnClassRemoval() {}

				// watch for a specific class change
				let classWatcher = new ClassWatcher(
					modal,
					"open",
					workOnClassAdd,
					workOnClassRemoval
				);

				// TRIGGERS START
				if (settings.trigger === "cart-value") {
					const createModal = () => {
						if (settings.matchingFormat === "greater") {
							if (cartData.item_count > settings.matchInput / 100) {
								modal.classList.add("modal");
								if (settings.delay * 1000) {
									setTimeout(() => {
										modal.classList.add("open");
									}, settings.delayTime);
								} else {
									setTimeout(() => {
										modal.classList.add("open");
									}, 1);
								}
							}
						} else if (settings.matchingFormat === "less") {
							if (cartData.item_count < settings.matchInput / 100) {
								modal.classList.add("modal");
								if (settings.delay) {
									setTimeout(() => {
										modal.classList.add("open");
									}, settings.delayTime * 1000);
								} else {
									setTimeout(() => {
										modal.classList.add("open");
									}, 1);
								}
							}
						}

						// CONTENT TYPES
						setContentTypes();
						// classes
						primaryBtn.classList.add("primaryBtn");
						container.classList.add("container");
						closeBtn.classList.add("far", "fa-times-circle", "closeBtn");

						if (freePlan) {
							freeIcon.classList.add("fas", "fa-info-circle", "free-icon");
							popup_content.appendChild(freeIcon);
						}

						closeBtn.addEventListener("click", (e) => {
							modal.classList.remove("open");
							isOpen = false;
						});
					};
					createModal();
				} else if (settings.trigger === "cart-size") {
					const createModal = () => {
						if (settings.matchingFormat === "greater") {
							if (cartData.item_count > settings.matchInput) {
								modal.classList.add("modal");
								if (settings.delay) {
									setTimeout(() => {
										modal.classList.add("open");
									}, settings.delayTime * 1000);
								} else {
									setTimeout(() => {
										modal.classList.add("open");
									}, 1);
								}
							}
						} else if (settings.matchingFormat === "less") {
							if (cartData.item_count < settings.matchInput) {
								modal.classList.add("modal");
								if (settings.delay) {
									setTimeout(() => {
										modal.classList.add("open");
									}, settings.delayTime * 1000);
								} else {
									setTimeout(() => {
										modal.classList.add("open");
									}, 1);
								}
							}
						}

						// CONTENT TYPES
						setContentTypes();
						// classes
						primaryBtn.classList.add("primaryBtn");
						container.classList.add("container");
						closeBtn.classList.add("far", "fa-times-circle", "closeBtn");

						if (freePlan) {
							freeIcon.classList.add("fas", "fa-info-circle", "free-icon");
							popup_content.appendChild(freeIcon);
						}

						closeBtn.addEventListener("click", (e) => {
							modal.classList.remove("open");
							isOpen = false;
						});
					};
					createModal();
				} else if (urlTrigger) {
					const createModal = () => {
						if (settings.delay) {
							modal.classList.add("modal");
						} else {
							modal.classList.add("modal");
							setTimeout(() => {
								modal.classList.add("open");
							}, 1);
						}

						// CONTENT TYPES
						setContentTypes();
						// classes
						primaryBtn.classList.add("primaryBtn");
						container.classList.add("container");
						closeBtn.classList.add("far", "fa-times-circle", "closeBtn");

						if (freePlan) {
							freeIcon.classList.add("fas", "fa-info-circle", "free-icon");
							popup_content.appendChild(freeIcon);
						}

						closeBtn.addEventListener("click", (e) => {
							modal.classList.remove("open");
							isOpen = false;
						});
					};
					createModal();
				} else if (settings.trigger === "scroll-depth") {
					const createModal = () => {
						let scrollpos = window.scrollY;

						const add_class_on_scroll = () => {
							if (settings.delay) {
								setTimeout(() => {
									modal.classList.add("open");
								}, settings.delayTime * 1000);
							} else {
								modal.classList.add("open");
							}
						};

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

						// CONTENT TYPES
						setContentTypes();
						// classes
						primaryBtn.classList.add("primaryBtn");
						container.classList.add("container");
						closeBtn.classList.add("far", "fa-times-circle", "closeBtn");

						if (freePlan) {
							freeIcon.classList.add("fas", "fa-info-circle", "free-icon");
							popup_content.appendChild(freeIcon);
						}

						closeBtn.addEventListener("click", (e) => {
							modal.classList.remove("open");
							isOpen = false;
						});
					};
					createModal();
				} else if (settings.trigger === "exit-intent") {
					const createModal = () => {
						// STYLING VARS
						// STYLE

						const mouseEvent = (e) => {
							const shouldShowExitIntent =
								!e.toElement && !e.relatedTarget && e.clientY < 10;

							if (shouldShowExitIntent) {
								document.removeEventListener("mouseout", mouseEvent);
								// Handling delay here
								if (settings.delay) {
									setTimeout(() => {
										modal.classList.add("open");
									}, settings.delayTime * 1000);
								} else {
									modal.classList.add("open");
								}
							}
						};
						document.addEventListener("mouseout", mouseEvent);
						modal.classList.add("modal");

						// CONTENT TYPES
						setContentTypes();
						// classes
						primaryBtn.classList.add("primaryBtn");
						container.classList.add("container");
						closeBtn.classList.add("far", "fa-times-circle", "closeBtn");

						if (freePlan) {
							freeIcon.classList.add("fas", "fa-info-circle", "free-icon");
							popup_content.appendChild(freeIcon);
						}

						closeBtn.addEventListener("click", (e) => {
							modal.classList.remove("open");
							isOpen = false;
						});
					};
					createModal();
				} else if (settings.trigger === "time-on-page") {
					const createModal = () => {
						if (settings.delay) {
							setTimeout(() => {
								modal.classList.add("open");
							}, settings.matchInput * 1000 + settings.delayTime * 1000);
							modal.classList.add("modal");
						} else {
							setTimeout(() => {
								modal.classList.add("open");
							}, settings.matchInput * 1000);
							modal.classList.add("modal");
						}

						// CONTENT TYPES
						setContentTypes();
						// classes
						primaryBtn.classList.add("primaryBtn");
						container.classList.add("container");
						closeBtn.classList.add("far", "fa-times-circle", "closeBtn");

						if (freePlan) {
							freeIcon.classList.add("fas", "fa-info-circle", "free-icon");
							popup_content.appendChild(freeIcon);
						}

						closeBtn.addEventListener("click", (e) => {
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
