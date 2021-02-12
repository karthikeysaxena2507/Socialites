/**
 * The function to get the current time
 */
const time = () => {
    var d = new Date();
    var date = d.getDate().toString();
    if(date.length === 1) date = "0" + date;

    var month = (d.getMonth() + 1).toString();
    if(month.length === 1) month = "0" + month;

    var year = d.getFullYear().toString();

    var hours = d.getHours().toString();
    if(hours.length === 1) hours = "0" + hours;

    var minutes = d.getMinutes().toString();
    if(minutes.length === 1) minutes = "0" + minutes;

    return (hours + ":" + minutes + " - " + date + "/" + month + "/" + year);
}

export { time };


