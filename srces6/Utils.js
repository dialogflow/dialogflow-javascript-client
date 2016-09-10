export default class ApiAiUtils {
    /**
     * make it in more appropriate way
     * @param object
     * @returns object
     */
    static cloneObject(object) {
        return JSON.parse(JSON.stringify(object));
    }
}
