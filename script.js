"use strict"

var HTMLPinnedTabContainer = document.getElementById("PinnedTabContainer");
var HTMLRegularTabContainer = document.getElementById("RegularTabContainer");

async function TabList()
{
    HTMLPinnedTabContainer.textContent = "";
    HTMLRegularTabContainer.innerHTML = "";

    let TabObjects = await browser.tabs.query({ currentWindow: true });

    for (let TabObject of TabObjects)
    {
        if (TabObject.pinned)
        {
            let HTMLTab = document.createElement("div");
                HTMLTab.classList.add("tabbrowser-tab");
                HTMLTab.setAttribute("pinned", TabObject.pinned);
                HTMLTab.setAttribute("visuallyselected", TabObject.active);
                HTMLTab.setAttribute("id", TabObject.id);
                HTMLPinnedTabContainer.appendChild(HTMLTab);

                let HTMLTabBackground = document.createElement("div");
                    HTMLTabBackground.classList.add("tab-background");
                    HTMLTab.appendChild(HTMLTabBackground);

                    let HTMLTabContent = document.createElement("div");
                        HTMLTabContent.classList.add("tab-content");
                        HTMLTabBackground.appendChild(HTMLTabContent);

                        let HTMLTabIcon = document.createElement("img");
                            HTMLTabIcon.classList.add("tab-icon");
                            HTMLTabIcon.src = TabObject.favIconUrl;
                            HTMLTabContent.appendChild(HTMLTabIcon);
        }

        if (!TabObject.pinned)
        {
            let HTMLTab = document.createElement("div");
                HTMLTab.classList.add("tabbrowser-tab");
                HTMLTab.setAttribute("pinned", TabObject.pinned);
                HTMLTab.setAttribute("visuallyselected", TabObject.active);
                HTMLTab.setAttribute("id", TabObject.id);
                HTMLRegularTabContainer.appendChild(HTMLTab);

                let HTMLTabBackground = document.createElement("div");
                    HTMLTabBackground.classList.add("tab-background");
                    HTMLTab.appendChild(HTMLTabBackground);

                    let HTMLTabContent = document.createElement("div");
                        HTMLTabContent.classList.add("tab-content");
                        HTMLTabBackground.appendChild(HTMLTabContent);

                        let HTMLTabIcon = document.createElement("img");
                            HTMLTabIcon.classList.add("tab-icon");
                            HTMLTabIcon.src = TabObject.favIconUrl;
                            HTMLTabContent.appendChild(HTMLTabIcon);

                        let HTMLTabText = document.createElement("div");
                            HTMLTabText.classList.add("tab-text");
                            HTMLTabText.innerHTML = TabObject.title;
                            HTMLTabContent.appendChild(HTMLTabText);

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

    if (e.target.hasAttribute("visuallyselected"))
    {
        let TabObjectId = parseInt(e.target.getAttribute("id"));

        browser.tabs.query({ currentWindow: true }).then((TabObjects) =>
        {
            for (let TabObject of TabObjects)
            {
                if (TabObject.id === TabObjectId)
                {
                    browser.tabs.update(TabObjectId, { active: true });
                    break;
                }
            }
        });
    }

    /* ---------- Close Tab (Internal Event) ---------- */

    if (e.target.classList.contains("tab-close-button"))
    {
        let TabObjectId = parseInt(e.target.getAttribute("id"));

        browser.tabs.query({ currentWindow: true }).then((TabObjects) =>
        {
            for (let TabObject of TabObjects)
            {
                if (TabObject.id === TabObjectId)
                {
                    browser.tabs.remove(TabObjectId);
                    break;
                }
            }
        });
    }

















    TabList();

}
);

/* ---------- Selected Tab (External Event) ---------- */

browser.tabs.onActivated.addListener(TabList);

/* ---------- Close Tab (External Event) ---------- */

browser.tabs.onRemoved.addListener(TabList);