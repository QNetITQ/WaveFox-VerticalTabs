"use strict"

const HTMLPinnedTabContainer = document.getElementById("PinnedTabContainer");
const HTMLRegularTabContainer = document.getElementById("RegularTabContainer");
const HTMLNewTabButton = document.getElementById("NewTabButton");

document.addEventListener("DOMContentLoaded", TabList);

async function TabList()
{
    let JsTabObjects = await browser.tabs.query({ currentWindow: true });

    let AllContexts = await browser.contextualIdentities.query({});

    let PinnedTabsVirtualDOM = document.createDocumentFragment();
    let RegularTabsVirtualDOM = document.createDocumentFragment();

    HTMLPinnedTabContainer.textContent = "";
    HTMLRegularTabContainer.textContent = "";

    for (let JsTabObject of JsTabObjects)
    {
        let HTMLTabObject = document.createElement("div");
            HTMLTabObject.classList.add("tabbrowser-tab");
            HTMLTabObject.id = JsTabObject.id;
            HTMLTabObject.setAttribute("index", JsTabObject.index);

            if (JsTabObject.pinned)
            {
                PinnedTabsVirtualDOM.appendChild(HTMLTabObject);
            }

            else
            {
                RegularTabsVirtualDOM.appendChild(HTMLTabObject);
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

                        let HTMLTabIconPending = document.createElement("div");
                            HTMLTabIconPending.classList.add("tab-icon-pending");
                            HTMLTabIconStack.appendChild(HTMLTabIconPending);

                        let HTMLTabIconImage = document.createElement("img");
                            HTMLTabIconImage.classList.add("tab-icon-image");
                            HTMLTabIconImage.src = JsTabObject.favIconUrl;
                            HTMLTabIconStack.appendChild(HTMLTabIconImage);

                        let HTMLTabSharingIconOverlay = document.createElement("img");
                            HTMLTabSharingIconOverlay.classList.add("tab-sharing-icon-overlay");
                            HTMLTabIconStack.appendChild(HTMLTabSharingIconOverlay);

                        let HTMLTabOverlay = document.createElement("div");
                            HTMLTabOverlay.classList.add("tab-overlay");
                            HTMLTabIconStack.appendChild(HTMLTabOverlay);

                            let HTMLTabIconOverlay = document.createElement("div");
                                HTMLTabIconOverlay.classList.add("tab-icon-overlay");
                                HTMLTabOverlay.appendChild(HTMLTabIconOverlay);

                    let HTMLTabLabelContainer = document.createElement("div");
                        HTMLTabLabelContainer.classList.add("tab-label-container");
                        HTMLTabContent.appendChild(HTMLTabLabelContainer);

                        let HTMLTabLable = document.createElement("div");
                            HTMLTabLable.classList.add("tab-lable");
                            HTMLTabLable.textContent = JsTabObject.title;
                            HTMLTabLabelContainer.appendChild(HTMLTabLable);

                    let HTMLTabCloseButton = document.createElement("div");
                        HTMLTabCloseButton.classList.add("tab-close-button");
                        HTMLTabContent.appendChild(HTMLTabCloseButton);

                        let HTMLTabCloseButtonIcon = document.createElement("div");
                            HTMLTabCloseButtonIcon.classList.add("tab-close-button-icon");
                            HTMLTabCloseButton.appendChild(HTMLTabCloseButtonIcon);

        /* ---------- Attributes ---------- */

        if (JsTabObject.active)
        {
            HTMLTabObject.setAttribute("visuallyselected", JsTabObject.active);
        }

        if (JsTabObject.attention)
        {
            HTMLTabObject.setAttribute("attention", JsTabObject.attention);
        }

        if (JsTabObject.audible)
        {
            HTMLTabObject.setAttribute("soundplaying", JsTabObject.audible);
        }

        if (JsTabObject.discarded)
        {
            HTMLTabObject.setAttribute("discarded", JsTabObject.discarded);
        }

        if (JsTabObject.hidden)
        {
            HTMLTabObject.setAttribute("hidden", JsTabObject.hidden);
        }

        if (JsTabObject.mutedInfo.muted)
        {
            HTMLTabObject.setAttribute("muted", JsTabObject.mutedInfo.muted);
        }

        if (JsTabObject.pinned)
        {
            HTMLTabObject.setAttribute("pinned", JsTabObject.pinned);
        }

        if (JsTabObject.status == "loading")
        {
            HTMLTabObject.setAttribute("loading", JsTabObject.status);
        }

        if (JsTabObject.favIconUrl == undefined)
        {
            HTMLTabObject.setAttribute("no-icon", true);
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

            if (e.target.classList.contains("tab-close-button-icon"))
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

        /* ---------- Containers ---------- */

        for (let Context of AllContexts)
        {
            if (JsTabObject.cookieStoreId == Context.cookieStoreId)
            {
                HTMLTabContextLine.style.setProperty("--identity-icon-color", Context.colorCode);
            }
        }
    }

    HTMLPinnedTabContainer.appendChild(PinnedTabsVirtualDOM);
    HTMLRegularTabContainer.appendChild(RegularTabsVirtualDOM);
}

/* ---------- New Tab Button ---------- */

HTMLNewTabButton.addEventListener("click", (e) =>
{
    browser.tabs.create({});
});

/* ---------- Menu ---------- */

document.addEventListener("contextmenu", (e) =>
{
    browser.menus.overrideContext({ showDefaults: false });

    browser.menus.onShown.addListener((info, tab) =>
    {
        let HTMLTabObject = browser.menus.getTargetElement(info.targetElementId);

        if (e.target.classList.contains("tabbrowser-tab") == false)
        {
            browser.menus.create(
            {
                id: "New",
                title: "New tab",
                type: "normal"
            });
        }

        else
        {
            browser.menus.create(
            {
                id: "New",
                title: "New tab",
                type: "normal"
            });

            browser.menus.create(
            {
                id: "separator-1",
                type: "separator"
            });

            if (HTMLTabObject.hasAttribute("muted") == false)
            {
                browser.menus.create(
                {
                    id: "Mute",
                    title: "Mute sound",
                    type: "normal"
                });
            }

            if (HTMLTabObject.hasAttribute("muted"))
            {
                browser.menus.create(
                {
                    id: "Unmute",
                    title: "Unmute sound",
                    type: "normal"
                });
            }

            if (HTMLTabObject.hasAttribute("pinned") == false)
            {
                browser.menus.create(
                {
                    id: "Pin",
                    title: "Pin tab",
                    type: "normal"
                });
            }

            if (HTMLTabObject.hasAttribute("pinned"))
            {
                browser.menus.create(
                {
                    id: "Unpin",
                    title: "Unpin tab",
                    type: "normal"
                });
            }

            browser.menus.create(
            {
                id: "separator-2",
                type: "separator"
            });

            browser.menus.create(
            {
                id: "Refresh",
                title: "Refresh tab",
                type: "normal"
            });

            browser.menus.create(
            {
                id: "Duplicate",
                title: "Duplicate tab",
                type: "normal"
            });

            browser.menus.create(
            {
                id: "separator-3",
                type: "separator"
            });

            browser.menus.create(
            {
                id: "Discard",
                title: "Discard tab",
                type: "normal"
            });

            browser.menus.create(
            {
                id: "separator-4",
                type: "separator"
            });

            browser.menus.create(
            {
                id: "Close",
                title: "Close tab",
                type: "normal"
            });
        }

        browser.menus.refresh();
        browser.menus.removeAll();
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