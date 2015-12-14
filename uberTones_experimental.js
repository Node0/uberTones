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

var supportMgrDynamicSpanContent,
    singleTicketCheck,
    str;
str =  window.location.href;
while (Boolean(str.match(/%/))) {
    str = decodeURIComponent(str);
}
if ( Boolean(str.match(/supportmgr/)) ) {
    supportMgrDynamicSpanContent = window.document.querySelector('span#dynamic_crumb').innerHTML.toString();
    singleTicketCheck = supportMgrDynamicSpanContent.match(/(ticket)(=)(\d{2,8})/);
    if (singleTicketCheck === null) {
        scanTickets();
    }

}
// Actually begin our uberTones specific work

function scanTickets() {
    "use strict";
    var initialTone = new Audio("https://raw.githubusercontent.com/Node0/uberTones/master/tones/ubt_1_nice_01.mp3");

    var wlRegex = "(user one|user two|user three|user four)",
        whiteList = new RegExp(wlRegex, "i");

    var tktListIframe = document.getElementsByTagName('iframe')[1],
        tktListContainer = tktListIframe.contentDocument.querySelector(
            'form#t_list[action*="?"] div#list_container.container'),
        tktListTable = tktListContainer.getElementsByTagName('table')[1],
        tktList = tktListTable.getElementsByTagName('tr');

    for (var tktRow = 0; tktRow < tktList.length; tktRow++) {

        //Check to make sure this is actually a ticket row
        if (tktList[tktRow].id.match(/(ticket)(\d{2,12})/)) {
            var thisTktColList = tktList[tktRow].getElementsByTagName('td');

            //TODO: Check ticket ownership against a list of users and don't notify for their tickets
            if (thisTktColList[9].textContent.match(whiteList) === null) {

                if (thisTktColList[5].getElementsByTagName("img").length !== 0) {

                    var ticketTypeText = thisTktColList[5].getElementsByTagName("img")[0].title.toLowerCase();
                    if (ticketTypeText === "staff followup") {
                        var tktTimeContext = thisTktColList[5].getElementsByTagName("label")[0].textContent,
                            secs,
                            mins,
                            hrs;
                        if (tktTimeContext.match(/(\d{1,2})(\s)(hours)/i)) {
                            if (tktTimeContext.match(/(\d{1,2})(\s)(hours)/i)[1] > 1) {
                                console.log("Staff followup is older than an hour for TT-" + tktList[tktRow].id);
                            }
                        }
                    }
                    if (ticketTypeText === "client followup") {
                        tktTimeContext = thisTktColList[5].getElementsByTagName("label").textContent;
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
                } else if (thisTktColList[5].getElementsByTagName("em").length !== 0) {

                    if (thisTktColList[5].getElementsByTagName("em").textContent.match(/none/i)) {
                        tktTimeContext = thisTktColList[4].getElementsByTagName("label").textContent;
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
}