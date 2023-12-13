export function padAsTwoDigit(input) {
    const val = "" + input;

    return val.length === 2 ? val : ("0" + val)
}

export function isDateGreaterThanToday(input) {
    const now = new Date().getTime();
    const receivedDate = new Date(input).getTime();
    return receivedDate > now;
}

export function isDateLesserThanToday(input) {
    const now = new Date().getTime();
    const receivedDate = new Date(input).getTime();
    return receivedDate < now;
}

export function getFormattedTime(input) {
    const receivedDate = new Date(input);
    const hours = receivedDate.getHours();
    const minutes = receivedDate.getMinutes();

    return `${getChangedHours(hours)}:${padAsTwoDigit(minutes)} ${getAMOrPM(hours)}`
}

export function getAMOrPM(hours) {
    return hours > 11 ? "PM" : "AM"
}

export function getChangedHours(hours) {
    return hours > 12
        ? padAsTwoDigit(hours - 12)
        : padAsTwoDigit(hours)
}

export function getMonth(monthIndex) {
    return padAsTwoDigit(monthIndex + 1);
}
export function getTomorrow() {
    const now = new Date();

    return now.getFullYear() + "-" + getMonth(now.getMonth()) + "-" + padAsTwoDigit(now.getDate() + 1)
}
