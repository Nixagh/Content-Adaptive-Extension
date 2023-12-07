const questionModal = `<div id="${ModalIds.InsertQuestion.modalId}">
                <div class="${Classes.optionsModalInnerHtml}">
                    <div class="file-content">
                        <h1>Load file</h1>
                        <input type="file" id="${Ids.fileInput}" />
                    </div>
                    
                    <div class="choose-load">
                        <h1>Program</h1>
                        <select id="${Ids.program}" style="color: #181d24">
                            ${OptionContent.getPrograms()}
                        </select>
                    </div>
                    
                    <div class="choose-unit">
                        <h1>Description</h1>
                        <select id="${Ids.description}" style="color: #181d24">
                            ${OptionContent.getDescriptions(WordListResource)}
                        </select>
                    </div>
                   ${OptionContent.getPreviews()}
                    <div class="insert-data">
                        <h1>Insert data</h1>
                        <div style="margin-top: 10px">
                            <input id="${Ids.globalResourceId}" placeholder="insert product Code" style="color: #181d24" value="${OptionContent.initCurrentCode()}">
                            <input id="${Ids.questionNumber}" placeholder="insert question number" style="color: #181d24" value="${OptionContent.initNextCurrentQuestionNumber()}">
                        </div>
                        <button id="${Ids.insertButton}">Insert</button>
                        <button id="${Ids.insertAndSave}" style="color: #181d24">Insert And Save</button>
                        <button id="${Ids.insertWordList}" style="color: #181d24">Insert Word List</button>
                        <button id="${Ids.insertWordContinuum}" style="color: #181d24">Insert Word Continnuum</button>
                    </div>
                </div>
            </div>`;

const typeModal = `<div id="${ModalIds.InsertType.modalId}">
                <div class="description">
                    <h1>Insert Type</h1>
                    <select id="${Ids.type}" style="color: #181d24">
                        ${OptionContent.getDescriptions(VWAResourceSetting)}
                    </select>
                    <button id="${Ids.insertSettings}" style="color: black">Insert</button>
                </div>
            </div>`;

// const wwiaModal = `<div id="${ModalIds.InsertWWiA.modalId}">
//                 <div class="description">
//                     <div class="file-content">
//                         <h1>Load file</h1>
//                         <h3>WWIA file </h3>
//                         <input type="file" id="${Ids.fileInputForWWiA}" />
//                     </div>
//                     <h1>Insert Type</h1>
//                     <select id="${Ids.type}" style="color: #181d24">
//                         ${OptionContent.getDescriptions(WWiAResource)}
//                     </select>
//                     ${OptionContent.getPreviews()}
//                     <button id="${Ids.insertSettings}" style="color: black">Insert</button>
//                 </div>
//             </div>`;

const modals = () => {
    return {
        questionModal,
        typeModal,
        // wwiaModal
    }
}

const jsonInfo = `{"x":3100,"y":130,"iconUnlock":"/content/adaptive/icon/G9_U15_unlock.png","iconLock":"/content/adaptive/icon/vwa_icon_g9_u15_lock.png","background":"#020134","borderUnit":"#9193C0","uriBanner":"/content/adaptive/banner/uri_banner_grade9_unit15.png","uriContent":"/content/adaptive/banner/uri_content_grade9_unit15.png","annotationBanner":"test"}`;

const unit_1 = getFormData("Unit 15", 827, 17, jsonInfo, 16882);

const url = "http://192.168.200.26:8090/cms/ajax/programtoc/update.html";
fetch(url, { method: "POST", body: unit_1 })
    .then(data => data.json())
    .then(data => console.log(data))
    .catch(err => console.log(err));