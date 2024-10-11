class UpdateCoverImageProcess {
  constructor() {}

  async update() {

    const ckeElements = document.getElementsByClassName("cke_contents");

    for (let i = 0; i < ckeElements.length; i++) {

      if (i % 3 == 0) {
        const cke_content = new Cke(ckeElements[i].id);
        const cke_summary = new Cke(ckeElements[++i].id);
        let value_content = cke_content.getBody().innerHTML;
        let value_summary = cke_summary.getBody().innerHTML;

        const parser = new DOMParser();
        const doc_summary = parser.parseFromString(value_summary, "text/html");

        const spCoverElement = doc_summary.querySelector(".sp-cover");

        if (spCoverElement) {
            spCoverElement.style.textAlign = "center";
        }

        const spCoverHTML = spCoverElement ? spCoverElement.outerHTML : "";

        const doc_content = parser.parseFromString(value_content, "text/html");

        const directionSection = doc_content.querySelector(".direction_section");

        if (directionSection && spCoverHTML) {
          directionSection.insertAdjacentHTML("afterbegin", spCoverHTML);
        }

        const updatedContent = doc_content.body.innerHTML;

        cke_content.setHtml(updatedContent);
      }
    }
    alert("Update cover image successfully!");
  }
}
