// ==UserScript==
// @name         uberTones
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  To make Ubersmith tickets heard!
// @author       Joe Hacobian and Ryan Hamel
// @match        https://manage.quadranet.com/admin/supportmgr/*
// @grant        none
// ==/UserScript==
/* jshint -W097 */

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
 * Author: Joe J Hacobian and Ryan Hamel
 * Copyright (C) 2015  Joe J Hacobian and Ryan Hamel
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

// How many seconds to wait between each script iteration.
var seconds = 30;

// Audio Array - Seconds:Link to JavaScript playable audio file.
// The idea is that it will play the closest lowest time (in seconds) defined in the array with the tickets updated time.
var clientFiles = {"none":"https://raw.githubusercontent.com/Node0/uberTones/master/tones/ubt_1_nice_01.mp3",
                   1:"https://raw.githubusercontent.com/Node0/uberTones/master/tones/ubt_1_nice_02.mp3",
                   120:"https://raw.githubusercontent.com/Node0/uberTones/master/tones/ubt_1_nice_03.mp3",
                   240:"https://raw.githubusercontent.com/Node0/uberTones/master/tones/ubt_1_nice_04.mp3",
                   360:"https://raw.githubusercontent.com/Node0/uberTones/master/tones/ubt_1_nice_05.mp3",
                   480:"https://raw.githubusercontent.com/Node0/uberTones/master/tones/ubt_2_act_06.mp3",
                   600:"https://raw.githubusercontent.com/Node0/uberTones/master/tones/ubt_2_act_07.mp3",
                   720:"https://raw.githubusercontent.com/Node0/uberTones/master/tones/ubt_2_act_08.mp3",
                   840:"https://raw.githubusercontent.com/Node0/uberTones/master/tones/ubt_3_crt2_09.mp3",
                   960:"https://raw.githubusercontent.com/Node0/uberTones/master/tones/ubt_3_crt2_10.mp3",
                   1080:"https://raw.githubusercontent.com/Node0/uberTones/master/tones/ubt_3_crt2_11.mp3",
                   1200:"https://raw.githubusercontent.com/Node0/uberTones/master/tones/ubt_3_crt2_12.mp3",
                   1320:"https://raw.githubusercontent.com/Node0/uberTones/master/tones/ubt_3_crt2_13.mp3",
                   1440:"https://raw.githubusercontent.com/Node0/uberTones/master/tones/ubt_3_crt2_14.mp3",
                   1560:"https://raw.githubusercontent.com/Node0/uberTones/master/tones/ubt_3_crt2_15.mp3",
                   1680:"https://raw.githubusercontent.com/Node0/uberTones/master/tones/ubt_3_crt2_16.mp3"
                  },
    staffFiles  = {3600:"https://raw.githubusercontent.com/Node0/uberTones/master/tones/ubt_3_crt2_17.mp3"
                  },
    timerFiles  = {1:"https://raw.githubusercontent.com/Node0/uberTones/master/tones/ubt_2_act_08.mp3"
                  };

var audioFiles = {"Client":clientFiles, "Staff":staffFiles, "Timer":timerFiles};

function playTimeTone(person, time)
{
    //console.log("playTimeTone Called");
    //console.log("Person: " + person);
    //console.log("Time: " + time);

    var a = new Audio();

    if (time == "none")
    {
        a.src = audioFiles[person][time];
        a.load();
        //console.log("Playing: " + a.src);
        //console.log("---------------------------");
        a.play();
        return;
    }

    var timeInt = time[1],
        timeMetric = time[2],
        arrayTime = 0;

    switch (timeMetric)
    {
        case "seconds": arrayTime = timeInt; break;
        case "minutes": arrayTime = timeInt * 60; break;
        case "hours": arrayTime = timeInt * 3600; break;
    }

    for (var x = arrayTime; x > 0; x--)
    {
        //console.log("Play file at: " + x);
        //console.log("typeof Debug: " + typeof(audioFiles[person][x]));
        if (typeof(audioFiles[person][x]) === "string")
        {
            a.src = audioFiles[person][x];
            a.load();
            //console.log("Playing: " + a.src);
            //console.log("---------------------------");
            a.play();
            return;
        }
    }

    console.log("---------------------------");
    return;
}

window.setInterval( function() {

    var uberUser = document.getElementsByTagName('a')[2].textContent;

    //var generalSearchTermList = [""];

    var tktListIframe = document.getElementsByTagName('iframe')[1],
        tktListContainer = tktListIframe.contentDocument.querySelector('form#t_list[action*="?"] div#list_container.container'),
        tktListTable = tktListContainer.getElementsByTagName('table')[1],
        tktList = tktListTable.getElementsByTagName('tr');

    tktListIframe.onload = function() { console.log("Uber Ticket Window Refreshed"); }

    // Make sure we are actually in Uber's ticket list before proceeding.
    if (tktListIframe.src.indexOf("ticket_list.php") === -1) { console.log("Not at a Uber ticket list."); return; }

    for (var tktRow = 0; tktRow < tktList.length; tktRow++)
    {        
        //Check to make sure this is actually a ticket row
        if (tktList[tktRow].id.match(/(ticket)(\d{2,12})/)){

            var thisTktColList = tktList[tktRow].getElementsByTagName('td');
            //console.log(thisTktColList);

            //TODO: Check ticket ownership against a list of users and don't notify for their tickets
            if (thisTktColList[9].textContent == uberUser)
            {
                // Something will go here eventually.
            } else {
                if (thisTktColList[5].getElementsByTagName("em").length > 0 && thisTktColList[5].getElementsByTagName("em")[0].textContent == "none") { console.log(tktList[tktRow].id + " - none"); setTimeout(playTimeTone, (500 * tktRow), "Client", "none"); continue; }

                var ticketTypeText = thisTktColList[5].getElementsByTagName("img")[0].title,
                    tktTimeContext = thisTktColList[5].querySelector("label").textContent;

                var tktTime = tktTimeContext.match(/(\d{1,2}) (minute.|second.|hour.)/i);

                if (ticketTypeText === "Staff Followup") { console.log(tktList[tktRow].id + " - " + tktTime); setTimeout(playTimeTone, (500 * tktRow), "Staff", tktTime); continue; }
                if (ticketTypeText === "Client Followup" || ticketTypeText === "Merge") { console.log(tktList[tktRow].id + " - " + tktTime); setTimeout(playTimeTone, (500 * tktRow), "Client", tktTime); continue; }
                if (ticketTypeText === "Timer") { console.log(tktList[tktRow].id + " - " + tktTime); setTimeout(playTimeTone, (500 * tktRow), "Timer", tktTime); continue; }
            }
        }
    }
}, seconds * 1000);

console.log("uberTones v0.1 Initialized");
