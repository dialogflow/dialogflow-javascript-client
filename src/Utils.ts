export default class ApiAiUtils {
    /**
     * make it in more appropriate way
     * @param object
     * @returns object
     */
    public static cloneObject<T>(object: T): T {
        return JSON.parse(JSON.stringify(object));
    }
}
