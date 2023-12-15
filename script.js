"use strict"

const HTMLPinnedTabContainer = document.getElementById("PinnedTabContainer");
const HTMLRegularTabContainer = document.getElementById("RegularTabContainer");
const HTMLNewTabButton = document.getElementById("NewTabButton");

window.addEventListener("load", TabList);

async function TabList()
{
    let JsTabObjects = await browser.tabs.query({ currentWindow: true });

    HTMLPinnedTabContainer.innerHTML = "";
    HTMLRegularTabContainer.innerHTML = "";

    for (let JsTabObject of JsTabObjects)
    {
        let HTMLTabObject = document.createElement("div");
            HTMLTabObject.classList.add("tabbrowser-tab");
            HTMLTabObject.setAttribute("id", JsTabObject.id);

            /* ---------- Pinned Tab Attribute ---------- */

            if (JsTabObject.pinned)
            {
                HTMLTabObject.setAttribute("pinned", JsTabObject.pinned);
                HTMLPinnedTabContainer.appendChild(HTMLTabObject);
            }

            else
            {
                HTMLRegularTabContainer.appendChild(HTMLTabObject);
            }

            /* ---------- Tab Discarded Attribute ---------- */

            if (JsTabObject.discarded)
            {
                HTMLTabObject.setAttribute("discarded", JsTabObject.discarded);
            }

            /* ---------- Tab Status Attribute ---------- */

            if (JsTabObject.status == "loading")
            {
                HTMLTabObject.setAttribute("loading", JsTabObject.status);
            }

            /* ---------- Tab Attention Attribute ---------- */

            if (JsTabObject.attention)
            {
                HTMLTabObject.setAttribute("attention", JsTabObject.attention);
            }

            /* ---------- Soundplaying Tab Attribute ---------- */

            if (JsTabObject.audible)
            {
                HTMLTabObject.setAttribute("soundplaying", JsTabObject.audible);
            }

            /* ---------- Muted Tab Attribute ---------- */

            if (JsTabObject.mutedInfo.muted)
            {
                HTMLTabObject.setAttribute("muted", JsTabObject.mutedInfo.muted);
            }

            /* ---------- Active Tab Attribute ---------- */

            if (JsTabObject.active)
            {
                HTMLTabObject.setAttribute("visuallyselected", JsTabObject.active);
            }

            let HTMLTabStack = document.createElement("div");
                HTMLTabStack.classList.add("tab-stack");
                HTMLTabObject.appendChild(HTMLTabStack);

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

                        let HTMLTabThrobber = document.createElement("div");
                            HTMLTabThrobber.classList.add("tab-throbber");
                            HTMLTabIconStack.appendChild(HTMLTabThrobber);

                        let HTMLTabIconImage = document.createElement("img");
                            HTMLTabIconImage.classList.add("tab-icon-image");
                            HTMLTabIconImage.src = JsTabObject.favIconUrl;
                            HTMLTabIconStack.appendChild(HTMLTabIconImage);

                        let HTMLTabSharingIconOverlay = document.createElement("img");
                            HTMLTabSharingIconOverlay.classList.add("tab-sharing-icon-overlay");
                            HTMLTabIconStack.appendChild(HTMLTabSharingIconOverlay);

                        let HTMLTabIconOverlay = document.createElement("img");
                            HTMLTabIconOverlay.classList.add("tab-icon-overlay");
                            HTMLTabIconStack.appendChild(HTMLTabIconOverlay);

                    let HTMLTabLabelContainer = document.createElement("div");
                        HTMLTabLabelContainer.classList.add("tab-label-container");
                        HTMLTabContent.appendChild(HTMLTabLabelContainer);

                        let HTMLTabLabel = document.createElement("div");
                            HTMLTabLabel.classList.add("tab-label");
                            HTMLTabLabel.innerHTML = JsTabObject.title;
                            HTMLTabLabelContainer.appendChild(HTMLTabLabel);

                    let HTMLTabCloseButton = document.createElement("div");
                        HTMLTabCloseButton.classList.add("tab-close-button");
                        HTMLTabContent.appendChild(HTMLTabCloseButton);

    /* ---------- Tab Events ---------- */

    HTMLTabObject.addEventListener("click", (e) =>
    {
        let HTMLTabObjectId = parseInt(e.currentTarget.getAttribute("id"));

        /* ---------- Selected Tab (Internal Event) ---------- */

        if (JsTabObject.active === false)
        {
            browser.tabs.update(HTMLTabObjectId, { active: true });
        }

        /* ---------- Close Tab (Internal Event) ---------- */

        if (e.target.classList.contains("tab-close-button"))
        {
            browser.tabs.remove(HTMLTabObjectId);
        }

        /* ---------- Tab Sound Icon (Internal Event) ---------- */

        if (e.target.classList.contains("tab-icon-overlay"))
        {
            browser.tabs.update(HTMLTabObjectId, { muted: true });
        }

        if (e.target.classList.contains("tab-icon-overlay") &&
            e.currentTarget.hasAttribute("muted"))
        {
            browser.tabs.update(HTMLTabObjectId, { muted: false });
        }
    });

    /* ---------- Drag & Drop ---------- */

    HTMLTabObject.addEventListener("mousedown", (e) =>
    {
        e.target.draggable = true;
        let HTMLTabObjectIndex = undefined;

        HTMLTabObject.addEventListener("dragstart", (e) =>
        {
            let HTMLTabObjectId = e.currentTarget.getAttribute("id");
            e.dataTransfer.setData("HTMLTabObjectId", HTMLTabObjectId);
        });

        TabContainer.addEventListener("dragenter", (e) =>
        {
            HTMLTabObjectIndex = parseInt(e.target.getAttribute("index"));
        });

        TabContainer.addEventListener("dragover", (e) =>
        {
            event.preventDefault();
        });

        TabContainer.addEventListener("drop", (e) =>
        {
            event.preventDefault();
            let HTMLTabObjectId = parseInt(e.dataTransfer.getData("HTMLTabObjectId"));
            browser.tabs.move([HTMLTabObjectId], { index: HTMLTabObjectIndex });
        });
    });

    }
}

/* ---------- New Tab Button ---------- */

HTMLNewTabButton.addEventListener("click", (e) =>
{
    browser.tabs.create({});
});

/* ---------- Selected Tab (External Event) ---------- */

browser.tabs.onActivated.addListener(TabList);

/* ---------- Update Tab ---------- */

browser.tabs.onUpdated.addListener(TabList);

/* ---------- Move Tab ---------- */

browser.tabs.onMoved.addListener(TabList);

/* ---------- Close Tab (External Event) ---------- */

browser.tabs.onRemoved.addListener(() =>
{
    setTimeout(TabList, 250); // Some sort of bug
});
