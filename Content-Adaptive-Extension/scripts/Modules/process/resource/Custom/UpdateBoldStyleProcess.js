class UpdateBoldStyleProcess {
  constructor() {}

  async update() {
    const ckeElements = document.getElementsByClassName("cke_contents");

    for (let i = 0; i < ckeElements.length; i++) {
      if (i % 3 == 0) {
        const cke_content = new Cke(ckeElements[i].id);

        let value_content = cke_content.getBody().innerHTML;

        console.log(value_content);

        const parser = new DOMParser();

        const doc_content = parser.parseFromString(value_content, "text/html");

        const boldElements = doc_content.querySelectorAll(
          "div.passage-copy b, div.passage b"
        );

        // Lọc các thẻ <b> mà có thẻ <br> ngay sau nó
        const boldWithBrElements = Array.from(boldElements).filter(
          (boldElement) => {
            return (
              boldElement.nextElementSibling &&
              boldElement.nextElementSibling.tagName === "BR"
            );
          }
        );

        // Hiển thị nội dung của tất cả các thẻ <b>
        boldWithBrElements.forEach((boldElement) => {
          boldElement.classList.add("para-title");
        });

        const updatedContent = doc_content.body.innerHTML;

        cke_content.setHtml(updatedContent);
      }
    }
    alert("Update Bold Style successfully!");
  }
}
