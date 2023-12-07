"use strict"

var HTMLPinnedTabContainer = document.getElementById("PinnedTabContainer");
var HTMLRegularTabContainer = document.getElementById("RegularTabContainer");

document.addEventListener("DOMContentLoaded", TabList);

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

            /* ---------- Active Tab Attribute ---------- */

            if (JsTabObject.active)
            {
                HTMLTabObject.setAttribute("visuallyselected", JsTabObject.active);
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

                        let HTMLTabThrobber = document.createElement("img");
                            HTMLTabThrobber.classList.add("tab-throbber");
                            HTMLTabIconStack.appendChild(HTMLTabThrobber);

                        let HTMLTabIconPending = document.createElement("img");
                            HTMLTabIconPending.classList.add("tab-icon-pending");
                            HTMLTabIconStack.appendChild(HTMLTabIconPending);

                        let HTMLTabIconImage = document.createElement("img");
                            HTMLTabIconImage.classList.add("tab-icon-image");
                            HTMLTabIconImage.src = JsTabObject.favIconUrl;
                            HTMLTabIconStack.appendChild(HTMLTabIconImage);

                        let HTMLTabSharingIconOverlay = document.createElement("img");
                            HTMLTabSharingIconOverlay.classList.add("tab-sharing-icon-overlay");
                            HTMLTabIconStack.appendChild(HTMLTabSharingIconOverlay);

                        let HTMLTabIconOverlay = document.createElement("img");
                            HTMLTabIconOverlay.classList.add("tab-icon-overlay");
                            HTMLTabIconOverlay.setAttribute("id", JsTabObject.id);
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
    });





    }
}






document.addEventListener("click", (e) =>
{




    /* ---------- Disable Tab Sound (Internal Event) ---------- */
/*
    if (e.target.classList.contains("tab-icon-overlay"))
    {
        let TabObjectId = parseInt(e.target.getAttribute("id"));

        e.target.setAttribute("muted", true);

        browser.tabs.update(TabObjectId, { muted: true });
    }
*/

});










/* ---------- Close Tab (External Event) ---------- */

browser.tabs.onRemoved.addListener(TabList);

/* ---------- Selected Tab (External Event) ---------- */

browser.tabs.onActivated.addListener(TabList);

/* ---------- Update Tab ---------- */

browser.tabs.onUpdated.addListener(TabList);