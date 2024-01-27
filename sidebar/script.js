"use strict"

const HTMLPinnedTabContainer = document.getElementById("PinnedTabContainer");
const HTMLRegularTabContainer = document.getElementById("RegularTabContainer");
const HTMLNewTabButton = document.getElementById("NewTabButton");

window.addEventListener("DOMContentLoaded", TabList);

async function TabList()
{
    let JsTabObjects = await browser.tabs.query({ currentWindow: true });

    HTMLPinnedTabContainer.textContent = "";
    HTMLRegularTabContainer.textContent = "";

    for (let JsTabObject of JsTabObjects)
    {
        let HTMLTabObject = document.createElement("div");
            HTMLTabObject.classList.add("tabbrowser-tab");
            HTMLTabObject.id = JsTabObject.id;
            HTMLTabObject.setAttribute("index", JsTabObject.index);

            let HTMLTabBackground = document.createElement("div");
                HTMLTabBackground.classList.add("tab-background");
                HTMLTabObject.appendChild(HTMLTabBackground);

                let HTMLTabContent = document.createElement("div");
                    HTMLTabContent.classList.add("tab-content");
                    HTMLTabBackground.appendChild(HTMLTabContent);

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

                        let HTMLTabIconOverlay = document.createElement("div");
                            HTMLTabIconOverlay.classList.add("tab-icon-overlay");
                            HTMLTabIconStack.appendChild(HTMLTabIconOverlay);

                    let HTMLTabLabelContainer = document.createElement("span");
                        HTMLTabLabelContainer.classList.add("tab-label-container");
                        HTMLTabLabelContainer.textContent = JsTabObject.title;
                        HTMLTabContent.appendChild(HTMLTabLabelContainer);

                    let HTMLTabCloseButton = document.createElement("div");
                        HTMLTabCloseButton.classList.add("tab-close-button");
                        HTMLTabContent.appendChild(HTMLTabCloseButton);















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






















    /* ---------- Tab Events ---------- */

    HTMLTabObject.addEventListener("click", (e) =>
    {
        let HTMLTabObjectId = parseInt(e.currentTarget.getAttribute("id"));

        /* ---------- Selected Tab (Internal Event) ---------- */

        if (JsTabObject.active === false && e.target.classList.contains("tabbrowser-tab"))
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
        e.currentTarget.draggable = true;

        HTMLTabObject.addEventListener("dragstart", (e) =>
        {
            let HTMLTabObjectId = e.currentTarget.getAttribute("id");
            e.dataTransfer.setData("HTMLTabObjectId", HTMLTabObjectId);
        });

        TabContainer.addEventListener("dragenter", (e) =>
        {
            let HTMLTabObjectIndex = parseInt(e.target.getAttribute("index"));
            let HTMLTabObjectId = parseInt(e.dataTransfer.getData("HTMLTabObjectId"));
            browser.tabs.move([HTMLTabObjectId], { index: HTMLTabObjectIndex });
        });

        TabContainer.addEventListener("dragover", (e) =>
        {
            e.preventDefault();
        });
    });

    }
}

/* ---------- New Tab Button ---------- */

HTMLNewTabButton.addEventListener("click", (e) =>
{
    browser.tabs.create({});
});

/* ---------- Menu Events ---------- */

browser.menus.onShown.addListener((info, tab) =>
{
    browser.menus.create(
    {
        id: "New",
        title: "New tab"
    });

    browser.menus.create(
    {
        id: "Refresh",
        title: "Refresh tab"
    });

    browser.menus.create(
    {
        id: "Mute",
        title: "Mute sound"
    });

    browser.menus.create(
    {
        id: "Unmute",
        title: "Unmute sound"
    });

    browser.menus.create(
    {
        id: "Pin",
        title: "Pin tab"
    });

    browser.menus.create(
    {
        id: "Unpin",
        title: "Unpin tab"
    });

    browser.menus.create(
    {
        id: "Duplicate",
        title: "Duplicate tab"
    });

    browser.menus.create(
    {
        id: "Close",
        title: "Close tab"
    });

    browser.menus.create(
    {
        id: "Discard",
        title: "Discard tab"
    });
});

browser.menus.onClicked.addListener((info, tab) =>
{
    let HTMLTabObject = browser.menus.getTargetElement(info.targetElementId);
    let HTMLTabObjectId = parseInt(HTMLTabObject.id);

    switch (info.menuItemId)
    {
        case "New":
            browser.tabs.create({});
            break;

        case "Refresh":
            browser.tabs.reload(HTMLTabObjectId);
            break;

        case "Mute":
            browser.tabs.update(HTMLTabObjectId, { muted: true });
            break;

        case "Unmute":
            browser.tabs.update(HTMLTabObjectId, { muted: false });
            break;

        case "Pin":
            browser.tabs.update(HTMLTabObjectId, { pinned: true });
            break;

        case "Unpin":
            browser.tabs.update(HTMLTabObjectId, { pinned: false });
            break;

        case "Duplicate":
            browser.tabs.duplicate(HTMLTabObjectId);
            break;

        case "Close":
            browser.tabs.remove(HTMLTabObjectId);
            break;

        case "Discard":
            browser.tabs.discard(HTMLTabObjectId);
            break;
    }
});

browser.menus.onHidden.addListener(() =>
{
    //browser.menus.overrideContext({ showDefaults: false });
});

/* ---------- External Events ---------- */

browser.tabs.onActivated.addListener((activeInfo) =>
{
    TabList();
});

browser.tabs.onAttached.addListener((tabId, attachInfo) =>
{
    TabList();
});

browser.tabs.onCreated.addListener((tab) =>
{
    TabList();
});

browser.tabs.onDetached.addListener((tabId, detachInfo) =>
{
    TabList();
});

browser.tabs.onHighlighted.addListener((highlightInfo) =>
{
    TabList();
});

browser.tabs.onMoved.addListener((tabId, moveInfo) =>
{
    TabList();
});

browser.tabs.onRemoved.addListener((tabId, removeInfo) =>
{
    setTimeout(TabList, 250); // Some sort of bug
});

browser.tabs.onReplaced.addListener((addedTabId, removedTabId) =>
{
    TabList();
});

browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) =>
{
    TabList();
});

browser.tabs.onZoomChange.addListener((ZoomChangeInfo) =>
{
    TabList();
});