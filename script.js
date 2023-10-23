"use strict"

var HTMLPinnedTabContainer = document.getElementById("PinnedTabContainer");
var HTMLRegularTabContainer = document.getElementById("RegularTabContainer");











async function TabList()
{
    HTMLPinnedTabContainer.textContent = "";
    HTMLRegularTabContainer.textContent = "";

    let TabObjects = await browser.tabs.query({ currentWindow: true });

    for (let TabObject of TabObjects)
    {
        if (TabObject.pinned)
        {
            let HTMLTab = document.createElement("div");
                HTMLTab.classList.add("tabbrowser-tab");
                HTMLTab.setAttribute("pinned", TabObject.pinned);
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
                            HTMLTabContent.appendChild(HTMLTabCloseButton);
        }
    }
}







/*

document.addEventListener("click", (e) => {

  if (e.target.hasAttribute("active")) {
    
    let tabId = +e.target.getAttribute("href");

    browser.tabs.query({ currentWindow: true }).then((tabs) => 
    {
      for (let tab of tabs)
      {
        if (tab.id == tabId)
        {
          browser.tabs.update(tabId, { active: true });
          Start();
        }
      }
    });
  }

  //e.preventDefault();
});

*/




















TabList();
//document.addEventListener("DomContentLoaded", Start());
//browser.tabs.onUpdated.addListener(Start);
//browser.tabs.onCreated.addListener(Start);