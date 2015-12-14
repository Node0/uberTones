/*
 * Title: uberTones 0.1
 *
 * Description:
 * uberTones brings audio notifications to ubersmith's
 * ticket queue. The current release relies on the
 * audio api of modern web browsers to play a scale
 * of custom composed notification tones which escalate
 * in urgency from the initial minute of an unresponded-to ticket's
 * arrival through to 1 hour post arrival of an unresponded-to ticket's.
 *
 *
 * Author: Joe J Hacobian
 * Copyright (C) 2014  Joe J Hacobian
 *
 * For uncompressed source, visit my uberTones repo on Github:
 * https://github.com/Node0/uberTones
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>
 *
 */

var initialTone = new Audio("https://raw.githubusercontent.com/Node0/uberTones/master/tones/ubt_1_nice_01.mp3");
window.setInterval( function() {

    var wlRegex = "(user one|user two|user three|user four)",
        whiteList = new RegExp(wlRegex, "i");

    //var generalSearchTermList = [""];

    var tktListIframe = document.getElementsByTagName('iframe')[1],
        tktListContainer = tktListIframe.contentDocument.querySelector(
            'form#t_list[action*="?"] div#list_container.container'),
        tktListTable = tktListContainer.getElementsByTagName('table')[1],
        tktList = tktListTable.getElementsByTagName('tr');

    for (var tktRow = 0; tktRow < tktList.length; tktRow++) {

        //Check to make sure this is actually a ticket row
        if (tktList[tktRow].id.match(/(ticket)(\d{2,12})/)){
            var thisTktColList = tktList[tktRow].getElementsByTagName('td');

            // Check ticket ownership against a list of users and don't notify for their tickets
            if (thisTktColList[9].textContent.match(whiteList) === null) {

                if (thisTktColList[5].getElementsByTagName("img").length !== 0) {
                    var ticketTypeText = thisTktColList[5].getElementsByTagName("img")[0].title,
                        ttType = ticketTypeText.toLowerCase();
                    if (ttType === "staff followup") {
                        var tktTimeContext = thisTktColList[5].querySelector("label").textContent;
                        var secs,
                            mins,
                            hrs;
                        if (tktTimeContext.match(/(\d{1,2})(\s)(hours)/i)) {
                            if("staff" + tktTimeContext.match(/(\d{1,2})(\s)(hours)/i)[1] > 1) {
                            }
                        }
                    }
                    if (ttType === "client followup"){
                        tktTimeContext = thisTktColList[5].querySelector("label").textContent;
                        if (tktTimeContext.match(/(\d{1,2})(\s)(seconds)/i)) {
                            secs = tktTimeContext.match(/(\d{1,2})(\s)(seconds)/i)[1];
                            initialTone.play();
                            console.log("client responded " + secs + " secs ago");
                        }
                        if (tktTimeContext.match(/(\d{1,2})(\s)(minutes)/i)) {
                            mins = tktTimeContext.match(/(\d{1,2})(\s)(minutes)/i)[1];
                            initialTone.play();
                            console.log("client responded " + mins + " mins ago");
                        }
                        if (tktTimeContext.match(/(\d{1,2})(\s)(hours)/i)) {
                            hrs = tktTimeContext.match(/(\d{1,2})(\s)(hours)/i)[1];
                            console.log("client responded " + hrs + " hours ago");
                        }
                    }
                } else {
                    var updatedCol = thisTktColList[5].getElementsByTagName("em")[0];
                    if (updatedCol.textContent.match(/none/i)) {
                        tktTimeContext = thisTktColList[4].querySelector("label").textContent;
                        if (tktTimeContext.match(/(\d{1,2})(\s)(seconds)/i)) {
                            secs = tktTimeContext.match(/(\d{1,2})(\s)(seconds)/i)[1];
                            initialTone.play();
                            console.log("client requested " + secs + " secs ago");
                        }
                        if (tktTimeContext.match(/(\d{1,2})(\s)(minutes)/i)) {
                            mins = tktTimeContext.match(/(\d{1,2})(\s)(minutes)/i)[1];
                            initialTone.play();
                            console.log("client requested " + mins + " mins ago");
                        }
                        if (tktTimeContext.match(/(\d{1,2})(\s)(hours)/i)) {
                            hrs = tktTimeContext.match(/(\d{1,2})(\s)(hours)/i)[1];
                            console.log("client requested " + hrs + " hours ago");
                        }
                    }
                }
            }
        }
    }

}, 60000);