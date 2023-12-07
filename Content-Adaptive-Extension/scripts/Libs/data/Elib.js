const images = {
	close: `data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+CjxzdmcgCiAgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgCiAgdmlld0JveD0iMCAwIDE1IDE1IiAKICB2ZXJzaW9uPSIxLjEiIAogIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgCiAgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiCiAgeG1sOnNwYWNlPSJwcmVzZXJ2ZSIgc3R5bGU9ImZpbGwtcnVsZTpldmVub2RkO2NsaXAtcnVsZTpldmVub2RkO3N0cm9rZS1saW5lY2FwOnJvdW5kO3N0cm9rZS1saW5lam9pbjpyb3VuZDtzdHJva2UtbWl0ZXJsaW1pdDoxLjU7Ij4KICA8ZyBpZD0iY3Jvc3MiPgogICAgPHBhdGggZD0iTSAyICAyICBsICAxMSAxMSIgc3R5bGU9ImZpbGw6bm9uZTtzdHJva2U6I2ZmZjtzdHJva2Utd2lkdGg6M3B4OyIvPgogICAgPHBhdGggZD0iTSAxMyAyICBsIC0xMSAxMSIgc3R5bGU9ImZpbGw6bm9uZTtzdHJva2U6I2ZmZjtzdHJva2Utd2lkdGg6M3B4OyIvPgogIDwvZz4KPC9zdmc+`
}
const ELib = {
	uiBase: `<div class="nixagh-container"></div>`,
	layout: `<div class="layout"></div>`,
	mainMenu: `<div class="mainMenu"></div>`,
	optionsButton: `<button class="btn blue optionsButton" value="%value%">Options</button>`,
	closeFeature: `<div class="closeFeature"></div>`,
	optionsModal: `<div class="optionsModal"></div>`,
	closeBtn: `<img src="${images.close}" class="btn black svg-icon %close%" alt="">`,
	windowPanel: `<div id="%id%" class="%cls% window panel-black c-window" data-cl="%n%" style="display:none;"><div class="title-frame title-frame-custom"><div class="text-primary title title_custom"><div>%text%</div></div><img src="${images.close}" class="btn black svg-icon %close%" data-feaureid="" alt=""></div><div class="slot" style=""><div class="wrapper">%html%</div></div></div>`,
	emptyWindow: `<div class="emptyWindow">%html%</div>`,
	button: `<button class="btn blue %cls%" value="%value%" %action%>%value%</button>`,
	fileInput: `<input id="%id%" class="%cls%" type="file" placeholder="%value%">`,
	sDropdown: '<select class="%cls%" %action%>%html%</select>',
	sDropdownOption: '<option value="%value%" %selected%>%text%</option>',
	description: '<br><small class="text-grey">%text%</small>',
	settingTitle: '<div class="div-ruin-div %cls%">%text%</div>',
};
