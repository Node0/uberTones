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

/*var conf = {
 initializeTones:0,
 defPlaybackOffset:500
 }; */

/* var assets = {
 files : [
 [0,'https://raw.githubusercontent.com/Node0/uberTones/master/tones/ubt_1_nice_01.mp3'],
 [0,'https://raw.githubusercontent.com/Node0/uberTones/master/tones/ubt_1_nice_02.mp3'],
 [0,'https://raw.githubusercontent.com/Node0/uberTones/master/tones/ubt_1_nice_03.mp3'],
 [0,'https://raw.githubusercontent.com/Node0/uberTones/master/tones/ubt_1_nice_04.mp3'],
 [0,'https://raw.githubusercontent.com/Node0/uberTones/master/tones/ubt_1_nice_05.mp3'],
 [0,'https://raw.githubusercontent.com/Node0/uberTones/master/tones/ubt_2_act_06.mp3'],
 [0,'https://raw.githubusercontent.com/Node0/uberTones/master/tones/ubt_2_act_07.mp3'],
 [0,'https://raw.githubusercontent.com/Node0/uberTones/master/tones/ubt_2_act_08.mp3'],
 [0,'https://raw.githubusercontent.com/Node0/uberTones/master/tones/ubt_3_crt2_09.mp3'],
 [0,'https://raw.githubusercontent.com/Node0/uberTones/master/tones/ubt_3_crt2_10.mp3'],
 [0,'https://raw.githubusercontent.com/Node0/uberTones/master/tones/ubt_3_crt2_11.mp3'],
 [0,'https://raw.githubusercontent.com/Node0/uberTones/master/tones/ubt_3_crt2_12.mp3'],
 [0,'https://raw.githubusercontent.com/Node0/uberTones/master/tones/ubt_3_crt2_13.mp3'],
 [0,'https://raw.githubusercontent.com/Node0/uberTones/master/tones/ubt_3_crt2_14.mp3'],
 [0,'https://raw.githubusercontent.com/Node0/uberTones/master/tones/ubt_3_crt2_15.mp3'],
 [0,'https://raw.githubusercontent.com/Node0/uberTones/master/tones/ubt_3_crt2_16.mp3'],
 [0,'https://raw.githubusercontent.com/Node0/uberTones/master/tones/ubt_3_crt2_17.mp3']
 ]
 }; */

/* var plTally = {
 // Structure is: [<playCount>,<audio_asset_URL>] the playList is always started off at zero playCount
 // until ticket detection increments that count.
 playList : [
 [0,'https://raw.githubusercontent.com/Node0/uberTones/master/tones/ubt_1_nice_01.mp3'],
 [0,'https://raw.githubusercontent.com/Node0/uberTones/master/tones/ubt_1_nice_02.mp3'],
 [0,'https://raw.githubusercontent.com/Node0/uberTones/master/tones/ubt_1_nice_03.mp3'],
 [0,'https://raw.githubusercontent.com/Node0/uberTones/master/tones/ubt_1_nice_04.mp3'],
 [0,'https://raw.githubusercontent.com/Node0/uberTones/master/tones/ubt_1_nice_05.mp3'],
 [0,'https://raw.githubusercontent.com/Node0/uberTones/master/tones/ubt_2_act_06.mp3'],
 [0,'https://raw.githubusercontent.com/Node0/uberTones/master/tones/ubt_2_act_07.mp3'],
 [0,'https://raw.githubusercontent.com/Node0/uberTones/master/tones/ubt_2_act_08.mp3'],
 [0,'https://raw.githubusercontent.com/Node0/uberTones/master/tones/ubt_3_crt2_09.mp3'],
 [0,'https://raw.githubusercontent.com/Node0/uberTones/master/tones/ubt_3_crt2_10.mp3'],
 [0,'https://raw.githubusercontent.com/Node0/uberTones/master/tones/ubt_3_crt2_11.mp3'],
 [0,'https://raw.githubusercontent.com/Node0/uberTones/master/tones/ubt_3_crt2_12.mp3'],
 [0,'https://raw.githubusercontent.com/Node0/uberTones/master/tones/ubt_3_crt2_13.mp3'],
 [0,'https://raw.githubusercontent.com/Node0/uberTones/master/tones/ubt_3_crt2_14.mp3'],
 [0,'https://raw.githubusercontent.com/Node0/uberTones/master/tones/ubt_3_crt2_15.mp3'],
 [0,'https://raw.githubusercontent.com/Node0/uberTones/master/tones/ubt_3_crt2_16.mp3'],
 [0,'https://raw.githubusercontent.com/Node0/uberTones/master/tones/ubt_3_crt2_17.mp3']
 ]

 }; */



function playTones() {
    'use strict';
    var initialTone = new Audio('https://raw.githubusercontent.com/Node0/uberTones/master/tones/ubt_1_nice_01.mp3'),
        playCount,
        now = new Date();
    initialTone.load();

    if (typeof playCount === 'undefined') {
        playCount = 0;
    }
    initialTone.play();
    playCount++;
    console.log(now.getTime());
    console.log('playCount is: ' + playCount);
}


function scanTickets() {
    'use strict';
    window.document.getElementsByTagName('iframe')[1].contentDocument.location.reload(true);
    var wlRegex = '(user one|user two|user three|user four)',
        whiteList = new RegExp(wlRegex, 'i'),
        tktListIframe = document.getElementsByTagName('iframe')[1],
        tktListContainer = tktListIframe.contentDocument.querySelector(
            'form#t_list[action*="?"] div#list_container.container'),
        tktListTable = tktListContainer.getElementsByTagName('table')[1],
        tktList = Array.prototype.slice.call(tktListTable.getElementsByTagName('tr'), 0);
    tktList.shift();


    //var now = new Date();
    console.log(tktList);
    for (var tktRow = 0, plOffsetCtr = 1; tktRow < tktList.length; tktRow++, plOffsetCtr++) {
        var playbackOffset = plOffsetCtr * 500,
            thisTktColList,
            ticketTypeText,
            updatedCol,
            ttType;

        //console.log('tktRow value is: ' + tktRow);
        //console.log('Playback offset is: ' + playbackOffset);

        //Check to make sure this is actually a ticket row
        if (tktList[tktRow].id.match(/(ticket)(\d{2,12})/)) {
            thisTktColList = tktList[tktRow].getElementsByTagName('td');
            // Check ticket ownership against a list of users and don't notify for their tickets
            if (thisTktColList[9].textContent.match(whiteList) === null) {

                if (thisTktColList[5].getElementsByTagName('img').length !== 0) {
                    ticketTypeText = thisTktColList[5].getElementsByTagName('img')[0].title;
                    ttType = ticketTypeText.toLowerCase();


                    if (ttType === 'staff followup') {
                        var tktTimeContext = thisTktColList[5].querySelector('label').textContent,
                            secs,
                            mins,
                            hrs;
                        if (Boolean (tktTimeContext.match(/(\d{1,2})(\s)(hour)(s?)/i)) ) {
                            if ('staff' + tktTimeContext.match(/(\d{1,2})(\s)(hour)(s?)/i)[1] > 1) {
                                console.log(tktTimeContext);
                                console.log('Staff followup longer than an hour ago.');
                            }
                        }
                    }


                    if (ttType === 'client followup') {
                        tktTimeContext = thisTktColList[5].querySelector('label').textContent;
                        if (Boolean (tktTimeContext.match(/(\d{1,2})(\s)(second)(s?)/i)) ) {
                            secs = tktTimeContext.match(/(\d{1,2})(\s)(second)(s?)/i)[1];
                            //playCount++;
                            setTimeout(playTones, playbackOffset);
                            console.log('client responded ' + secs + ' secs ago');
                        }
                        if (Boolean (tktTimeContext.match(/(\d{1,2})(\s)(minute)(s?)/i)) ) {
                            mins = tktTimeContext.match(/(\d{1,2})(\s)(minute)(s?)/i)[1];
                            //playCount++;
                            setTimeout(playTones, playbackOffset);
                            console.log('client responded ' + mins + ' mins ago');
                        }
                        if (Boolean (tktTimeContext.match(/(\d{1,2})(\s)(hour)(s?)/i)) ) {
                            hrs = tktTimeContext.match(/(\d{1,2})(\s)(hour)(s?)/i)[1];
                            console.log('client responded ' + hrs + ' hours ago');
                        }
                    }


                } else if (thisTktColList[5].getElementsByTagName('em').length !== 0) {
                    updatedCol = thisTktColList[5].getElementsByTagName('em')[0];

                    // Check if the ticket has not been responded to ever (first arrival)
                    if (Boolean (updatedCol.textContent.match(/none/i)) ) {
                        tktTimeContext = thisTktColList[4].querySelector('label').textContent;
                        if (Boolean (tktTimeContext.match(/(\d{1,2})(\s)(second)(s?)/i)) ) {
                            secs = tktTimeContext.match(/(\d{1,2})(\s)(second)(s?)/i)[1];
                            //playCount++;
                            setTimeout(playTones, playbackOffset);
                            console.log('client initial request ' + secs + ' secs ago');
                        }
                        if (Boolean (tktTimeContext.match(/(\d{1,2})(\s)(minute)(s?)/i)) ) {
                            mins = tktTimeContext.match(/(\d{1,2})(\s)(minute)(s?)/i)[1];
                            //playCount++;
                            setTimeout(playTones, playbackOffset);
                            console.log('client initial request ' + mins + ' mins ago');
                        }
                        if (Boolean (tktTimeContext.match(/(\d{1,2})(\s)(hour)(s?)/i)) ) {
                            hrs = tktTimeContext.match(/(\d{1,2})(\s)(hour)(s?)/i)[1];
                            console.log('client initial request ' + hrs + ' hours ago');
                        }
                    }
                }
                // Exit user whitelist check
            }
            // Exit table row as ticket sanity check
        }
        // Exit ticketlist table loop
    }
// Exit scanTickets()
}

function runOnTktList() {
    'use strict';
    var supportMgrDynamicSpanContent,
        singleTicketCheck,
        str;
    console.log('performing ticketlist check.');
    str = window.location.href;

    while (Boolean(str.match(/%/))) {
        str = decodeURIComponent(str);
    }

    if ( Boolean(str.match(/supportmgr/)) ) {
        supportMgrDynamicSpanContent = window.document.querySelector('span#dynamic_crumb').innerHTML.toString();
        singleTicketCheck = supportMgrDynamicSpanContent.match(/(ticket)(=)(\d{2,8})/);
        if (singleTicketCheck === null) {
            scanTickets();
        } else {
            console.log('This is not a ticketlist, disregarding.');
        }
    }
}

window.setInterval(runOnTktList, 10000);