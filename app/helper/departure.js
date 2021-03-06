const moment = require('moment')

exports.handleDeparture = function (bot, msg, station, departureResults) {
    if (departureResults.length) {
        departureResults.forEach(res => {
            const answer = createAnswerForDepartureResult(station, res);
            bot.sendMessage(msg.chat.id, answer)
        })
    } else {
        bot.sendMessage(msg.chat.id, 'Keine aktuellen Abfahrten gefunden für ' + station.name)
    }
}

function createAnswerForDepartureResult(station, res) {
    if (res.line) {
        var answer = `Abfahrt ab ${station.name} von ${res.line.name} in Richtung ${res.line.direction}\n`
        if (res.timetable) {
            res.timetable.forEach(time => {
                answer += handleDepartureTime(time)
            })
        } else {
            answer += '- Keine Abfahrtszeiten verfügbar'
        }
        return answer
    }
    return 'Keine Linieninformationen verfügbar'
}

function handleDepartureTime(time) {
    const depTime = new Date(Date.parse(time.departure))
    const departureStr = moment(depTime).format('HH:mm')
    var answer = `- um ${departureStr}`
    if (time.departureDelay !== 0) {
        answer += handleDelay(time);
    }
    answer += '\n'
    return answer
}

function handleDelay(time) {
    const delay = new Date(time.departureDelay);
    const delayMinutes = delay.getMinutes();
    if (delayMinutes > 0) {
        const ending = delayMinutes > 1
            ? 'n'
            : '';
        return ` mit einer Verspätung von ${delayMinutes} Minute${ending}`;
    }
    return '';
}