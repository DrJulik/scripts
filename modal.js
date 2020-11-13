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
			const { freePlan, style, content, settings, _id, createdAt } = campaign;
			const {
				borderColor,
				backgroundColor,
				primaryButtonColor,
				overlayColor,
			} = style;
			const { triggers, triggerMatch } = settings;
			// I GUESS THIS IS WHERE WE BUILD THE CAMPAIGNS
			if (style.campaignType === "modal") {
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
				const primaryBtnNewsletter = document.createElement("button");
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

				const borderRadius = style.borderRadius + "%";
				const borderWidth = style.borderWidth + "px";

				// CREATING CSS STYLESHEET

				let stylesheet = document.createElement("style");
				stylesheet.type = "text/css";
				stylesheet.innerHTML = `.modal-ep { z-index: 10000;
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

					.modal-ep.open {
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
						background: ${primaryButtonColor}; 
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

					.primaryBtn-newsletter {
						padding: 0.7rem; 
						background: ${primaryButtonColor}; 
						box-shadow: #0000002e 1px 1px 3px;
						border:none;  
						border-radius: 3%;  
						color: white; 
						font-family:inherit; 
						font-size: 0.75rem; 
						margin-right: 0.6rem;
						transition: opacity 0.3s ease;
					}

					.primaryBtn:hover {
						opacity:0.8;
						cursor:pointer;
					}
					.primaryBtn-newsletter:hover {
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
						width: 90%;
						margin:auto;
						overflow-x: auto;
					}

					.product {
						margin: 1rem;
					}

					.prodImg {
						width: 200px;
						height:  200px;
						object-fit: cover;
						box-shadow: 1px 1px 3px #00000033;
						border-radius: 5%;
					}

					.free-icon {
						position: absolute;
						bottom: 3%;
						color: ${primaryButtonColor};
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
					"box-shadow: 1px 3px 5px #0000002b; height: 150px; object-fit: cover; margin-bottom: 1rem;";
				// input
				input.style.cssText =
					"width: 300px; border: 1px solid #CDD9ED; line-height: 25px; font-size: 14px; font-weight: 500; height: 100%; font-family: inherit; border-radius: 6px 0 0 6px;";

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
						primaryBtnNewsletter.textContent = content.buttonText;
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
						btnLink.appendChild(primaryBtnNewsletter);
						// buttons.appendChild(secondaryBtn);
						body.appendChild(modal);

						primaryBtnNewsletter.classList.add("primaryBtn-newsletter");
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
							primaryBtnNewsletter.classList.add("primaryBtn-newsletter");

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

				// Frequency
				const handleFrequency = (id) => {
					// Check if they disabled frequency
					if (!settings.frequency) {
						localStorage.removeItem(`campaign_${id}`);
						localStorage.removeItem(`limit_${id}`);
					}

					let timesShown = 1;

					Date.prototype.addDays = function (days) {
						let date = new Date(this.valueOf());
						date.setDate(date.getDate() + days);
						return date;
					};

					let limitPeriod = parseInt(settings.frequencyPeriod);
					let creationDate = new Date(createdAt);
					let limitResetDate = creationDate.addDays(limitPeriod);
					let today = new Date();

					if (limitResetDate <= today) {
						localStorage.removeItem(`limit_${id}`);
					}

					if (settings.frequency) {
						if (!localStorage.getItem(`campaign_${id}`)) {
							localStorage.setItem(`campaign_${id}`, timesShown);
							let count = localStorage.getItem(`campaign_${id}`);
							if (
								settings.frequency &&
								parseInt(count) >= parseInt(settings.frequencyTime)
							) {
								console.log("Limit is reached");
								localStorage.setItem(`limit_${id}`, true);
							} else if (
								settings.frequency &&
								parseInt(count) < parseInt(settings.frequencyTime)
							) {
								console.log("Limit not reached yet");
							} else {
								console.log("Frequency is off");
							}
						} else {
							let count = localStorage.getItem(`campaign_${id}`);

							if (!localStorage.getItem(`limit_${id}`)) {
								count++;
								localStorage.setItem(`campaign_${id}`, count);
							} else {
								return;
							}

							if (
								settings.frequency &&
								parseInt(count) >= parseInt(settings.frequencyTime)
							) {
								console.log("Limit is reached");
								localStorage.setItem(`limit_${id}`, true);
							} else if (
								settings.frequency &&
								parseInt(count) < parseInt(settings.frequencyTime)
							) {
								console.log("Limit not reached yet");
							} else {
								console.log("Frequency is off");
							}
						}
					} else {
						return;
					}
				};

				function workOnClassAdd() {
					handleFrequency(_id);
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

				// MATCH CONDITIONS -------------------------------------------------------------------
				if (triggerMatch === "all") {
					console.log("all triggers are matched");

					// timer for time on page
					let timerElapsed = false;
					let exit = false;

					const checkCondition = (trigger) => {
						if (trigger.triggerType === "url") {
							if (trigger.matchingFormat === "contains") {
								urlTrigger = window.location.href.includes(
									trigger.matchingInput
								);
								if (urlTrigger) {
									return trigger.triggerType === "url";
								}
							} else if (trigger.matchingFormat === "matches") {
								urlTrigger = window.location.href === trigger.matchingInput;
								if (urlTrigger) {
									return trigger.triggerType === "url";
								}
							}
						} else if (trigger.triggerType === "cart-size") {
							if (trigger.matchingFormat === "greater") {
								if (trigger.matchingInput > cartData.item_count) {
									return trigger.triggerType === "cart-size";
								}
							} else if (trigger.matchingFormat === "less") {
								if (trigger.matchingInput < cartData.item_count) {
									return trigger.triggerType === "cart-size";
								}
							}
						} else if (trigger.triggerType === "cart-value") {
							if (trigger.matchingFormat === "greater") {
								if (trigger.matchingInput > cartData.total_price / 100) {
									return trigger.triggerType === "cart-value";
								}
							} else if (trigger.matchingFormat === "less") {
								if (trigger.matchingInput < cartData.total_price / 100) {
									return trigger.triggerType === "cart-value";
								}
							}
						} else if (trigger.triggerType === "scroll-depth") {
							scrollpos = window.scrollY;

							if (scrollpos >= trigger.matchingInput) {
								return trigger.triggerType === "scroll-depth";
							}
						} else if (trigger.triggerType === "time-on-page") {
							if (timerElapsed) {
								return trigger.triggerType === "time-on-page";
							}
						} else if (trigger.triggerType === "exit-intent") {
							if (exit) {
								return trigger.triggerType === "exit-intent";
							}
						}
					};

					const check = () => {
						const conditionsMatched = triggers.every(checkCondition);

						if (!timerElapsed) {
							setTimeout(() => {
								timerElapsed = true;
								check();
							}, 5000);
							// FIGURE OUT HOW TO GET THE TIME OF THE FIRST TIME ON PAGE TRIGGER
						}

						if (conditionsMatched) {
							console.log("conditions matched");

							modal.classList.add("modal-ep");
							if (settings.delay) {
								setTimeout(() => {
									modal.classList.add("open");
								}, settings.delayTime * 1000);
							} else {
								setTimeout(() => {
									modal.classList.add("open");
								}, 200);
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

							document.removeEventListener("mouseout", mouseEvent);
							window.removeEventListener("scroll", catchModal);
						}
					};
					check();

					// EXIT INTENT CHECK
					const mouseEvent = (e) => {
						const shouldShowExitIntent =
							!e.toElement && !e.relatedTarget && e.clientY < 10;

						if (shouldShowExitIntent) {
							// document.removeEventListener("mouseout", mouseEvent); not removing cuz we wanna check every time
							// Handling delay here
							// flip the exit switch
							exit = true;
							check();
						}
					};
					if (
						triggers.some((trigger) => {
							// exit intent
							return trigger.triggerType === "exit-intent";
						})
					) {
						setTimeout(() => {
							document.addEventListener("mouseout", mouseEvent);
						}, 1000);
					}

					// SCROLL DEPTH CHECK
					const catchModal = () => {
						check();
					};

					if (
						triggers.some((trigger) => {
							// exit intent
							return trigger.triggerType === "scroll-depth";
						})
					) {
						window.addEventListener("scroll", catchModal);
					}

					// TIME ON PAGE
					if (
						triggers.some((trigger) => {
							// exit intent
							return trigger.triggerType === "time-on-page";
						})
					) {
						check();
					}
				} else if (triggerMatch === "any") {
					console.log("any triggers are matched");
					// TRIGGERS START------------------------------------------------------------------------
					triggers.some((trigger) => {
						if (
							(trigger.triggerType === "cart-value" &&
								!localStorage.getItem(`limit_${_id}`)) ||
							(trigger.triggerType === "cart-value" &&
								localStorage.getItem(`limit_${_id}`) &&
								!settings.frequency)
						) {
							const createModal = () => {
								if (trigger.matchingFormat === "greater") {
									if (cartData.item_count > trigger.matchingInput / 100) {
										modal.classList.add("modal-ep");
										if (settings.delay) {
											setTimeout(() => {
												modal.classList.add("open");
											}, settings.delayTime);
										} else {
											setTimeout(() => {
												modal.classList.add("open");
											}, 1);
										}
									}
								} else if (trigger.matchingFormat === "less") {
									if (cartData.item_count < trigger.matchingInput / 100) {
										modal.classList.add("modal-ep");
										if (settings.delay) {
											setTimeout(() => {
												modal.classList.add("open");
											}, settings.delayTime);
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
							return trigger.triggerType === "cart-value";
						} else if (
							(trigger.triggerType === "cart-size" &&
								!localStorage.getItem(`limit_${_id}`)) ||
							(trigger.triggerType === "cart-size" &&
								localStorage.getItem(`limit_${_id}`) &&
								!settings.frequency)
						) {
							const createModal = () => {
								if (trigger.matchingFormat === "greater") {
									if (cartData.item_count > trigger.matchingInput) {
										modal.classList.add("modal-ep");
										if (settings.delay) {
											setTimeout(() => {
												modal.classList.add("open");
											}, settings.delayTime);
										} else {
											setTimeout(() => {
												modal.classList.add("open");
											}, 1);
										}
									}
								} else if (trigger.matchingFormat === "less") {
									if (cartData.item_count < trigger.matchingInput) {
										modal.classList.add("modal-ep");
										if (settings.delay) {
											setTimeout(() => {
												modal.classList.add("open");
											}, settings.delayTime);
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
							return trigger.triggerType === "cart-size";
						} else if (
							(trigger.triggerType === "url" &&
								!localStorage.getItem(`limit_${_id}`)) ||
							(trigger.triggerType === "url" &&
								localStorage.getItem(`limit_${_id}`) &&
								!settings.frequency)
						) {
							const createModal = () => {
								let urlTrigger;
								if (trigger.matchingFormat === "contains") {
									urlTrigger = window.location.href.includes(
										trigger.matchingInput
									);
								} else if (trigger.matchingFormat === "matches") {
									urlTrigger = window.location.href === trigger.matchingInput;
								}

								if (settings.delay) {
									modal.classList.add("modal-ep");
									setTimeout(() => {
										modal.classList.add("open");
									}, settings.delayTime * 1000);
								} else {
									if (urlTrigger) {
										modal.classList.add("modal-ep");
										setTimeout(() => {
											modal.classList.add("open");
										}, 1);
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
							// Break out of the loop
							return trigger.triggerType === "url";
						} else if (
							(trigger.triggerType === "scroll-depth" &&
								!localStorage.getItem(`limit_${_id}`)) ||
							(trigger.triggerType === "scroll-depth" &&
								localStorage.getItem(`limit_${_id}`) &&
								!settings.frequency)
						) {
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

									if (scrollpos >= trigger.matchingInput) {
										add_class_on_scroll();
										removeListener();
									}
								};

								window.addEventListener("scroll", catchModal);
								modal.classList.add("modal-ep");

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
							// Break out of the loop
							return trigger.triggerType === "scroll-depth";
						} else if (
							(triggers.some((trigger) => {
								return trigger.triggerType === "exit-intent";
							}) &&
								!localStorage.getItem(`limit_${_id}`)) ||
							(triggers.some((trigger) => {
								return trigger.triggerType === "exit-intent";
							}) &&
								localStorage.getItem(`limit_${_id}`) &&
								!settings.frequency)
						) {
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
								modal.classList.add("modal-ep");

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
							// Break out of the loop
							return trigger.triggerType === "exit-intent";
						} else if (
							(trigger.triggerType === "time-on-page" &&
								!localStorage.getItem(`limit_${_id}`)) ||
							(trigger.triggerType === "time-on-page" &&
								localStorage.getItem(`limit_${_id}`) &&
								!settings.frequency)
						) {
							const createModal = () => {
								if (settings.delay) {
									setTimeout(() => {
										modal.classList.add("open");
									}, trigger.matchingInput * 1000 + settings.delayTime * 1000);
									modal.classList.add("modal-ep");
								} else {
									setTimeout(() => {
										modal.classList.add("open");
									}, trigger.matchingInput * 1000);
									modal.classList.add("modal-ep");
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

							return trigger.triggerType === "time-on-page";
						} else {
							return;
						}
					});
				}
			}
		});
	} catch (err) {
		console.log(err);
	}
};
campaignInfo();
