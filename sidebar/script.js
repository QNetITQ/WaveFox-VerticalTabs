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
            HTMLTabObject.setAttribute("index", JsTabObject.index);

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

                    let HTMLTabLabelContainer = document.createElement("div");
                        HTMLTabLabelContainer.classList.add("tab-label-container");
                        HTMLTabLabelContainer.innerHTML = JsTabObject.title;
                        HTMLTabContent.appendChild(HTMLTabLabelContainer);

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
            event.preventDefault();
        });
    });

    /* Menus */

    HTMLTabObject.addEventListener("contextmenu", () =>
    {
        browser.menus.overrideContext({ showDefaults: false });

        browser.menus.create(
        {
            id: "newTab",
            title: "New Tab"
        });

        browser.menus.create(
        {
            id: "pinTab",
            title: "Pin Tab"
        });

        browser.menus.create(
        {
            id: "unpinTab",
            title: "Unpin Tab"
        });

        browser.menus.create(
        {
            id: "soundOn",
            title: "Enable Tab Sound"
        });

        browser.menus.create(
        {
            id: "soundOff",
            title: "Disable Tab Sound"
        });

        browser.menus.create(
        {
            id: "closeTab",
            title: "Close Tab"
        });
    });

    }
}

browser.menus.onClicked.addListener((info, tab) =>
{
    let HTMLTabObject = browser.menus.getTargetElement(info.targetElementId);
    let HTMLTabObjectId = parseInt(HTMLTabObject.id);

    if (info.menuItemId === "newTab")
    {
        browser.tabs.create({});
    }

    else if (info.menuItemId === "pinTab")
    {
        browser.tabs.update(HTMLTabObjectId, { pinned: true });
    }

    else if (info.menuItemId === "unpinTab")
    {
        browser.tabs.update(HTMLTabObjectId, { pinned: false });
    }

    else if (info.menuItemId === "soundOn")
    {
        browser.tabs.update(HTMLTabObjectId, { muted: false });
    }

    else if (info.menuItemId === "soundOff")
    {
        browser.tabs.update(HTMLTabObjectId, { muted: true });
    }

    else if (info.menuItemId === "closeTab")
    {
        browser.tabs.remove(HTMLTabObjectId);
    }
});

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