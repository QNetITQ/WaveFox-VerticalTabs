"use strict"

var HTMLPinnedTabContainer = document.getElementById("PinnedTabContainer");
var HTMLRegularTabContainer = document.getElementById("RegularTabContainer");

async function TabList()
{
    HTMLPinnedTabContainer.innerHTML = "";
    HTMLRegularTabContainer.innerHTML = "";

    let TabObjects = await browser.tabs.query({ currentWindow: true });

    for (let TabObject of TabObjects)
    {
        if (TabObject.pinned)
        {
            let HTMLTab = document.createElement("div");
                HTMLTab.classList.add("tabbrowser-tab");
                HTMLTab.setAttribute("id", TabObject.id);
                HTMLTab.setAttribute("visuallyselected", TabObject.active);
                HTMLTab.setAttribute("pinned", TabObject.pinned);
                HTMLTab.setAttribute("soundplaying", TabObject.audible);
                HTMLTab.setAttribute("muted", TabObject.mutedInfo.muted);
                HTMLPinnedTabContainer.appendChild(HTMLTab);

                let HTMLTabStack = document.createElement("div");
                    HTMLTabStack.classList.add("tab-stack");
                    HTMLTab.appendChild(HTMLTabStack);

                    let HTMLTabBackground = document.createElement("div");
                        HTMLTabBackground.classList.add("tab-background");
                        HTMLTabStack.appendChild(HTMLTabBackground);

                        let HTMLTabContextLine = document.createElement("div");
                            HTMLTabContextLine.classList.add("tab-context-line");
                            HTMLTabBackground.appendChild(HTMLTabContextLine);

                        let HTMLTabLoadingBurst = document.createElement("div");
                            HTMLTabLoadingBurst.classList.add("tab-loading-burst");
                            HTMLTabBackground.appendChild(HTMLTabLoadingBurst);

                    let HTMLTabContent = document.createElement("div");
                        HTMLTabContent.classList.add("tab-content");
                        HTMLTabStack.appendChild(HTMLTabContent);

                        let HTMLTabIconStack = document.createElement("div");
                            HTMLTabIconStack.classList.add("tab-icon-stack");
                            HTMLTabContent.appendChild(HTMLTabIconStack);

                            let HTMLTabThrobber = document.createElement("img");
                                HTMLTabThrobber.classList.add("tab-throbber");
                                HTMLTabIconStack.appendChild(HTMLTabThrobber);

                            let HTMLTabIconPending = document.createElement("img");
                                HTMLTabIconPending.classList.add("tab-icon-pending");
                                HTMLTabIconStack.appendChild(HTMLTabIconPending);

                            let HTMLTabIconImage = document.createElement("img");
                                HTMLTabIconImage.classList.add("tab-icon-image");
                                HTMLTabIconImage.src = TabObject.favIconUrl;
                                HTMLTabIconStack.appendChild(HTMLTabIconImage);

                            let HTMLTabSharingIconOverlay = document.createElement("img");
                                HTMLTabSharingIconOverlay.classList.add("tab-sharing-icon-overlay");
                                HTMLTabIconStack.appendChild(HTMLTabSharingIconOverlay);

                            let HTMLTabIconOverlay = document.createElement("img");
                                HTMLTabIconOverlay.classList.add("tab-icon-overlay");
                                HTMLTabIconOverlay.setAttribute("id", TabObject.id);
                                HTMLTabIconStack.appendChild(HTMLTabIconOverlay);
        }

        else if (!TabObject.pinned)
        {
            let HTMLTab = document.createElement("div");
                HTMLTab.classList.add("tabbrowser-tab");
                HTMLTab.setAttribute("id", TabObject.id);
                HTMLTab.setAttribute("visuallyselected", TabObject.active);
                HTMLTab.setAttribute("pinned", TabObject.pinned);
                HTMLTab.setAttribute("soundplaying", TabObject.audible);
                HTMLTab.setAttribute("muted", TabObject.mutedInfo.muted);
                HTMLRegularTabContainer.appendChild(HTMLTab);

                let HTMLTabStack = document.createElement("div");
                    HTMLTabStack.classList.add("tab-stack");
                    HTMLTab.appendChild(HTMLTabStack);

                    let HTMLTabBackground = document.createElement("div");
                        HTMLTabBackground.classList.add("tab-background");
                        HTMLTabStack.appendChild(HTMLTabBackground);

                        let HTMLTabContextLine = document.createElement("div");
                            HTMLTabContextLine.classList.add("tab-context-line");
                            HTMLTabBackground.appendChild(HTMLTabContextLine);

                        let HTMLTabLoadingBurst = document.createElement("div");
                            HTMLTabLoadingBurst.classList.add("tab-loading-burst");
                            HTMLTabBackground.appendChild(HTMLTabLoadingBurst);

                    let HTMLTabContent = document.createElement("div");
                        HTMLTabContent.classList.add("tab-content");
                        HTMLTabStack.appendChild(HTMLTabContent);

                        let HTMLTabIconStack = document.createElement("div");
                            HTMLTabIconStack.classList.add("tab-icon-stack");
                            HTMLTabContent.appendChild(HTMLTabIconStack);

                            let HTMLTabThrobber = document.createElement("img");
                                HTMLTabThrobber.classList.add("tab-throbber");
                                HTMLTabIconStack.appendChild(HTMLTabThrobber);

                            let HTMLTabIconPending = document.createElement("img");
                                HTMLTabIconPending.classList.add("tab-icon-pending");
                                HTMLTabIconStack.appendChild(HTMLTabIconPending);

                            let HTMLTabIconImage = document.createElement("img");
                                HTMLTabIconImage.classList.add("tab-icon-image");
                                HTMLTabIconImage.src = TabObject.favIconUrl;
                                HTMLTabIconStack.appendChild(HTMLTabIconImage);

                            let HTMLTabSharingIconOverlay = document.createElement("img");
                                HTMLTabSharingIconOverlay.classList.add("tab-sharing-icon-overlay");
                                HTMLTabIconStack.appendChild(HTMLTabSharingIconOverlay);

                            let HTMLTabIconOverlay = document.createElement("img");
                                HTMLTabIconOverlay.classList.add("tab-icon-overlay");
                                HTMLTabIconOverlay.setAttribute("id", TabObject.id);
                                HTMLTabIconStack.appendChild(HTMLTabIconOverlay);

                        let HTMLTabLabelContainer = document.createElement("div");
                            HTMLTabLabelContainer.classList.add("tab-label-container");
                            HTMLTabContent.appendChild(HTMLTabLabelContainer);

                            let HTMLTabLabel = document.createElement("div");
                                HTMLTabLabel.classList.add("tab-label");
                                HTMLTabLabel.innerHTML = TabObject.title;
                                HTMLTabLabelContainer.appendChild(HTMLTabLabel);

                        let HTMLTabCloseButton = document.createElement("div");
                            HTMLTabCloseButton.classList.add("tab-close-button");
                            HTMLTabCloseButton.setAttribute("id", TabObject.id);
                            HTMLTabContent.appendChild(HTMLTabCloseButton);
        }
    }
}















document.addEventListener("click", (e) =>
{
    /* ---------- Selected Tab (Internal Event) ---------- */

    if (e.target.classList.contains("tabbrowser-tab"))
    {
        let TabObjectId = parseInt(e.target.getAttribute("id"));

        browser.tabs.update(TabObjectId, { active: true });
    }










    /* ---------- Disable Tab Sound (Internal Event) ---------- */

    if (e.target.classList.contains("tab-icon-overlay"))
    {
        let TabObjectId = parseInt(e.target.getAttribute("id"));

        e.target.setAttribute("muted", true);

        browser.tabs.update(TabObjectId, { muted: true });
    }




















    /* ---------- Close Tab (Internal Event) ---------- */

    if (e.target.classList.contains("tab-close-button"))
    {
        let TabObjectId = parseInt(e.target.getAttribute("id"));

        browser.tabs.remove(TabObjectId);
    }
});












/* ---------- Selected Tab (External Event) ---------- */

//browser.tabs.onActivated.addListener(TabList);

/* ---------- Close Tab (External Event) ---------- */

//browser.tabs.onRemoved.addListener(TabList);

/* ---------- Update Tab ---------- */

//browser.tabs.onUpdated.addListener(TabList);





document.addEventListener("DOMContentLoaded", TabList);