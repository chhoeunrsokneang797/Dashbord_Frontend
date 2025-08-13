import dayjs from "dayjs";

export const dataClient = (date,format="DD/MM/YYYY") => {
    if(date){
        return dayjs(date).format(format)
    }
    return null;
};
export const dataServer = (date,format="DD-MM-YYYY") => {
    if(date){
        return dayjs(date).format(format)
    }
    return null;
}