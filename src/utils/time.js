export function getCurrentTime() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
}
export function daysPerMonth(month, year) {
    // Restamos 1 al mes porque en JavaScript los meses son 0-indexados
    return new Date(year, month + 1, 0).getDate();
}
export function daysBetween(date1, date2) {
    // Crear dos objetos de fecha a partir de los argumentos
    date1 = new Date(date1.year, date1.month - 1, date1.day); // Restar 1 al mes porque los meses son 0-indexados
    date2 = new Date(date2.year, date2.month - 1, date2.day);

    // Calcular la diferencia en milisegundos
    const differenceInTime = Math.abs(date2 - date1);

    // Convertir la diferencia de milisegundos a días
    const differenceInDays = Math.ceil(differenceInTime / (1000 * 60 * 60 * 24));

    return differenceInDays;
}